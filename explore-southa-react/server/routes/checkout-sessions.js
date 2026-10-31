const { and, eq, inArray, ne } = require("drizzle-orm");
const { Router } = require("express");
const { bookings, tours } = require("../db/schema");
const { getStripeClient } = require("../stripe");
const { isObject, parseFields } = require("./validation");

const checkoutFields = {
  items: validateItems,
};

function validateItems(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) {
    return undefined;
  }

  const items = [];
  const tripKeys = new Set();
  for (const item of value) {
    if (
      !isObject(item) ||
      Object.keys(item).some(
        (key) => !["tourId", "travelers", "travelDate"].includes(key),
      ) ||
      typeof item.tourId !== "string" ||
      item.tourId.trim().length === 0 ||
      item.tourId.length > 160 ||
      !Number.isSafeInteger(item.travelers) ||
      item.travelers <= 0 ||
      !isValidTravelDate(item.travelDate)
    ) {
      return undefined;
    }

    const tourId = item.tourId.trim();
    const tripKey = `${tourId}\u0000${item.travelDate}`;
    if (tripKeys.has(tripKey)) {
      return undefined;
    }
    tripKeys.add(tripKey);
    items.push({
      tourId,
      travelers: item.travelers,
      travelDate: item.travelDate,
    });
  }

  return items;
}

function isValidTravelDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value >= new Date().toISOString().slice(0, 10)
  );
}

function priceToCents(price) {
  const match = /^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/.exec(String(price));
  if (!match) {
    return undefined;
  }

  const cents = Number(match[1]) * 100 + Number((match[2] || "").padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : undefined;
}

function createCheckoutSessionsRouter({
  db,
  getStripe = getStripeClient,
  clientUrl = process.env.CLIENT_URL || "http://localhost:5173",
}) {
  const router = Router();

  router.get("/:sessionId", async (request, response) => {
    const { sessionId } = request.params;
    if (
      typeof sessionId !== "string" ||
      sessionId.length > 255 ||
      !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)
    ) {
      response.status(400).json({ error: "Checkout session id is invalid." });
      return;
    }

    let [booking] = await db
      .select({
        status: bookings.status,
        amountTotal: bookings.amountTotal,
        currency: bookings.currency,
        items: bookings.items,
        paidAt: bookings.paidAt,
      })
      .from(bookings)
      .where(eq(bookings.stripeSessionId, sessionId))
      .limit(1);
    if (!booking) {
      response.status(404).json({ error: "Booking not found." });
      return;
    }

    if (booking.status === "pending") {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        if (
          session.amount_total !== booking.amountTotal ||
          session.currency !== booking.currency
        ) {
          response.status(409).json({
            error: "Stripe payment does not match the stored booking.",
          });
          return;
        }

        const [updatedBooking] = await db
          .update(bookings)
          .set({ status: "paid", paidAt: new Date(), updatedAt: new Date() })
          .where(
            and(
              eq(bookings.stripeSessionId, sessionId),
              ne(bookings.status, "cancellation_requested"),
            ),
          )
          .returning({
            status: bookings.status,
            amountTotal: bookings.amountTotal,
            currency: bookings.currency,
            items: bookings.items,
            paidAt: bookings.paidAt,
          });
        if (updatedBooking) {
          booking = updatedBooking;
        } else {
          const [currentBooking] = await db
            .select({
              status: bookings.status,
              amountTotal: bookings.amountTotal,
              currency: bookings.currency,
              items: bookings.items,
              paidAt: bookings.paidAt,
            })
            .from(bookings)
            .where(eq(bookings.stripeSessionId, sessionId))
            .limit(1);
          if (currentBooking) {
            booking = currentBooking;
          }
        }
      }
    }

    response.set("Cache-Control", "no-store");
    response.json(booking);
  });

  router.post("/:sessionId/cancellation-request", async (request, response) => {
    const { sessionId } = request.params;
    if (
      typeof sessionId !== "string" ||
      sessionId.length > 255 ||
      !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)
    ) {
      response.status(400).json({ error: "Checkout session id is invalid." });
      return;
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: "cancellation_requested",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(bookings.stripeSessionId, sessionId),
          eq(bookings.status, "paid"),
        ),
      )
      .returning({ status: bookings.status });
    if (updatedBooking) {
      response.json(updatedBooking);
      return;
    }

    const [booking] = await db
      .select({ status: bookings.status })
      .from(bookings)
      .where(eq(bookings.stripeSessionId, sessionId))
      .limit(1);
    if (!booking) {
      response.status(404).json({ error: "Booking not found." });
      return;
    }
    if (booking.status === "cancellation_requested") {
      response.json(booking);
      return;
    }

    response.status(409).json({
      error: "Only paid bookings can request cancellation.",
    });
  });

  router.post("/", async (request, response) => {
    const parsed = parseFields(request.body, checkoutFields, ["items"]);
    if (parsed.error) {
      response.status(400).json({ error: parsed.error });
      return;
    }

    const requestedItems = parsed.values.items;
    const tourIds = [...new Set(requestedItems.map((item) => item.tourId))];
    const foundTours = await db
      .select()
      .from(tours)
      .where(inArray(tours.id, tourIds));
    const toursById = new Map(foundTours.map((tour) => [tour.id, tour]));
    if (foundTours.length !== tourIds.length) {
      response.status(404).json({ error: "One or more tours were not found." });
      return;
    }

    const lineItems = [];
    const bookingItems = [];
    let totalInCents = 0;
    for (const item of requestedItems) {
      const tour = toursById.get(item.tourId);
      const unitAmount = priceToCents(tour.price);
      if (!unitAmount) {
        response.status(409).json({
          error: `Tour "${tour.name}" does not have a payable price.`,
        });
        return;
      }
      const itemTotal = unitAmount * item.travelers;
      if (!Number.isSafeInteger(itemTotal)) {
        response.status(400).json({
          error: `Traveler count for "${tour.name}" is too large.`,
        });
        return;
      }
      totalInCents += itemTotal;
      if (!Number.isSafeInteger(totalInCents)) {
        response.status(400).json({ error: "Cart total is too large." });
        return;
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: tour.name,
            metadata: {
              tourId: tour.id,
              travelDate: item.travelDate,
            },
          },
        },
        quantity: item.travelers,
      });
      bookingItems.push({
        tourId: tour.id,
        tourName: tour.name,
        travelDate: item.travelDate,
        travelers: item.travelers,
        unitAmount,
      });
    }

    const baseUrl = clientUrl.split(",")[0].trim().replace(/\/+$/, "");
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      metadata: {
        itemCount: String(lineItems.length),
      },
      success_url: `${baseUrl}/cart?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?checkout=cancelled`,
    });

    if (!session.url) {
      response.status(502).json({ error: "Stripe did not return a checkout URL." });
      return;
    }
    if (typeof session.id !== "string" || session.id.length > 255) {
      response.status(502).json({ error: "Stripe returned an invalid checkout session." });
      return;
    }

    await db.insert(bookings).values({
      stripeSessionId: session.id,
      amountTotal: totalInCents,
      currency: "usd",
      items: bookingItems,
    });

    response.status(201).json({ url: session.url });
  });

  return router;
}

module.exports = createCheckoutSessionsRouter;
