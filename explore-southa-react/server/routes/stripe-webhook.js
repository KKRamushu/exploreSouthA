const { and, eq, ne } = require("drizzle-orm");
const { Router } = require("express");
const { bookings } = require("../db/schema");
const { getStripeClient } = require("../stripe");

function createStripeWebhookRouter({
  db,
  getStripe = getStripeClient,
  webhookSecret = process.env.STRIPE_WEBHOOK_SECRET,
}) {
  const router = Router();

  router.post("/", async (request, response) => {
    if (!webhookSecret) {
      response.status(503).json({ error: "Stripe webhook is not configured." });
      return;
    }

    if (
      !Buffer.isBuffer(request.body) ||
      typeof request.headers["stripe-signature"] !== "string"
    ) {
      response.status(400).json({ error: "Invalid Stripe webhook request." });
      return;
    }

    let event;
    try {
      event = getStripe().webhooks.constructEvent(
        request.body,
        request.headers["stripe-signature"],
        webhookSecret,
      );
    } catch (_error) {
      response.status(400).json({ error: "Invalid Stripe webhook signature." });
      return;
    }

    const session = event.data.object;
    let update;
    if (
      (event.type === "checkout.session.completed" &&
        session.payment_status === "paid") ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      update = { status: "paid", paidAt: new Date() };
    } else if (event.type === "checkout.session.async_payment_failed") {
      update = { status: "payment_failed", updatedAt: new Date() };
    } else if (event.type === "checkout.session.expired") {
      update = { status: "expired", updatedAt: new Date() };
    }

    if (update) {
      if (typeof session.id !== "string") {
        response.status(400).json({ error: "Stripe event has no checkout session ID." });
        return;
      }

      const sessionCondition = eq(bookings.stripeSessionId, session.id);
      const statusCondition =
        update.status === "paid"
          ? sessionCondition
          : and(sessionCondition, ne(bookings.status, "paid"));
      const updated = await db
        .update(bookings)
        .set({ ...update, updatedAt: new Date() })
        .where(statusCondition)
        .returning({ id: bookings.id });

      if (updated.length === 0) {
        const [booking] = await db
          .select({ id: bookings.id, status: bookings.status })
          .from(bookings)
          .where(eq(bookings.stripeSessionId, session.id))
          .limit(1);
        if (!booking) {
          response.status(500).json({ error: "Checkout session booking not found." });
          return;
        }
      }
    }

    response.json({ received: true, type: event.type });
  });

  return router;
}

module.exports = createStripeWebhookRouter;
