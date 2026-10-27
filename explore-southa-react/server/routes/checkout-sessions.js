const { eq } = require("drizzle-orm");
const { Router } = require("express");
const { tours } = require("../db/schema");
const { getStripeClient } = require("../stripe");
const { parseFields, stringField } = require("./validation");

const checkoutFields = {
  tourId: stringField(160),
  travelers: (value) =>
    Number.isSafeInteger(value) && value > 0 ? value : undefined,
};

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
    const parsed = parseFields(
      request.body,
      checkoutFields,
      ["tourId", "travelers"],
    );
    if (parsed.error) {
      response.status(400).json({ error: parsed.error });
      return;
    }

    const [tour] = await db
      .select()
      .from(tours)
      .where(eq(tours.id, parsed.values.tourId))
      .limit(1);
    if (!tour) {
      response.status(404).json({ error: "Tour not found." });
      return;
    }

    const unitAmount = priceToCents(tour.price);
    if (!unitAmount) {
      response.status(409).json({ error: "Tour does not have a payable price." });
      return;
    }
    if (!Number.isSafeInteger(unitAmount * parsed.values.travelers)) {
      response.status(400).json({ error: "Traveler count is too large." });
      return;
    }

    const baseUrl = clientUrl.split(",")[0].trim().replace(/\/+$/, "");
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: { name: tour.name },
          },
          quantity: parsed.values.travelers,
        },
      ],
      metadata: {
        tourId: tour.id,
        travelers: String(parsed.values.travelers),
      },
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
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
