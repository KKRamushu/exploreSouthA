const { asc, desc, eq } = require("drizzle-orm");
const { Router } = require("express");
const { tripInquiries } = require("../db/schema");
const { requireAdmin } = require("./admin");
const {
  isObject,
  parseFields,
  stringField,
} = require("./validation");

const publicInquiryFields = {
  destination: stringField(160),
  preferredMonth: (value) =>
    value === null ||
    (typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value))
      ? value
      : undefined,
  travelers: (value) =>
    Number.isInteger(value) && value > 0 ? value : undefined,
};

const adminInquiryFields = {
  ...publicInquiryFields,
  status: (value) =>
    ["new", "contacted", "quoted", "booked"].includes(value)
      ? value
      : undefined,
};

function createTripInquiriesRouter({ auth, db, betterAuthNode }) {
  const router = Router();
  const adminOnly = requireAdmin(auth, betterAuthNode.fromNodeHeaders);

  router.post("/", async (request, response) => {
    const parsed = parseFields(
      request.body,
      publicInquiryFields,
      ["destination", "travelers"],
    );
    if (parsed.error) {
      response.status(400).json({ error: parsed.error });
      return;
    }

    const [inquiry] = await db
      .insert(tripInquiries)
      .values(parsed.values)
      .returning();
    response.status(201).json(inquiry);
  });

  router.get("/", adminOnly, async (_request, response) => {
    const results = await db
      .select()
      .from(tripInquiries)
      .orderBy(desc(tripInquiries.createdAt), asc(tripInquiries.id));
    response.json(results);
  });

  router.get("/:id", adminOnly, async (request, response) => {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id < 1) {
      response.status(400).json({ error: "Inquiry id must be a positive integer." });
      return;
    }
    const [inquiry] = await db
      .select()
      .from(tripInquiries)
      .where(eq(tripInquiries.id, id))
      .limit(1);
    if (!inquiry) {
      response.status(404).json({ error: "Trip inquiry not found." });
      return;
    }
    response.json(inquiry);
  });

  router.patch("/:id", adminOnly, async (request, response) => {
    const parsed = parseFields(request.body, adminInquiryFields);
    if (parsed.error) {
      response.status(400).json({ error: parsed.error });
      return;
    }
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id < 1) {
      response.status(400).json({ error: "Inquiry id must be a positive integer." });
      return;
    }
    const [inquiry] = await db
      .update(tripInquiries)
      .set({ ...parsed.values, updatedAt: new Date() })
      .where(eq(tripInquiries.id, id))
      .returning();
    if (!inquiry) {
      response.status(404).json({ error: "Trip inquiry not found." });
      return;
    }
    response.json(inquiry);
  });

  router.delete("/:id", adminOnly, async (request, response) => {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id < 1) {
      response.status(400).json({ error: "Inquiry id must be a positive integer." });
      return;
    }
    const [inquiry] = await db
      .delete(tripInquiries)
      .where(eq(tripInquiries.id, id))
      .returning({ id: tripInquiries.id });
    if (!inquiry) {
      response.status(404).json({ error: "Trip inquiry not found." });
      return;
    }
    response.status(204).end();
  });

  return router;
}

module.exports = createTripInquiriesRouter;
