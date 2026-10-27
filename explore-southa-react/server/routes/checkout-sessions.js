const { inArray } = require("drizzle-orm");
const { Router } = require("express");
const { tours } = require("../db/schema");
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

    response.status(201).json({ url: session.url });
  });

  return router;
}

module.exports = createCheckoutSessionsRouter;
