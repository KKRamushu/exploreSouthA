const { asc, eq } = require("drizzle-orm");
const { Router } = require("express");
const { tours } = require("../db/schema");
const { requireAdmin } = require("./admin");
const { isObject, parseFields, stringField } = require("./validation");

const tourFields = {
  name: stringField(160),
  category: (value) =>
    value === "coastal" || value === "wildlife" ? value : undefined,
  durationDays: positiveInteger,
  durationNights: nonNegativeInteger,
  price: money,
  currency: (value) =>
    typeof value === "string" && /^[A-Za-z]{3}$/.test(value)
      ? value.toUpperCase()
      : undefined,
  image: stringField(2048),
  imageAlt: stringField(255),
  highlights: (value) =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 20 &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
      ? value.map((item) => item.trim())
      : undefined,
};

function positiveInteger(value) {
  return Number.isInteger(value) && value > 0 ? value : undefined;
}

function nonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0 ? value : undefined;
}

function money(value) {
  const amount = String(value);
  return /^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/.test(amount)
    ? amount
    : undefined;
}

function createToursRouter({ auth, db, betterAuthNode }) {
  const router = Router();
  const adminOnly = requireAdmin(auth, betterAuthNode.fromNodeHeaders);

  router.get("/", async (_request, response) => {
    const results = await db.select().from(tours).orderBy(asc(tours.name));
    response.json(results);
  });

  router.get("/:id", async (request, response) => {
    const [tour] = await db
      .select()
      .from(tours)
      .where(eq(tours.id, request.params.id))
      .limit(1);
    if (!tour) {
      response.status(404).json({ error: "Tour not found." });
      return;
    }
    response.json(tour);
  });

  router.post("/", adminOnly, async (request, response) => {
    if (!isObject(request.body) || typeof request.body.id !== "string") {
      response.status(400).json({ error: "A string id is required." });
      return;
    }
    const { id, ...body } = request.body;
    if (id.trim().length === 0 || id.length > 160) {
      response.status(400).json({ error: "id is invalid." });
      return;
    }

    const parsed = parseFields(body, tourFields, Object.keys(tourFields));
    if (parsed.error) {
      response.status(400).json({ error: parsed.error });
      return;
    }

    const [tour] = await db
      .insert(tours)
      .values({ id: id.trim(), ...parsed.values })
      .returning();
    response.status(201).json(tour);
  });

  router.patch("/:id", adminOnly, async (request, response) => {
    const parsed = parseFields(request.body, tourFields);
    if (parsed.error) {
      response.status(400).json({ error: parsed.error });
      return;
    }
    const [tour] = await db
      .update(tours)
      .set({ ...parsed.values, updatedAt: new Date() })
      .where(eq(tours.id, request.params.id))
      .returning();
    if (!tour) {
      response.status(404).json({ error: "Tour not found." });
      return;
    }
    response.json(tour);
  });

  router.delete("/:id", adminOnly, async (request, response) => {
    const [tour] = await db
      .delete(tours)
      .where(eq(tours.id, request.params.id))
      .returning({ id: tours.id });
    if (!tour) {
      response.status(404).json({ error: "Tour not found." });
      return;
    }
    response.status(204).end();
  });

  return router;
}

module.exports = createToursRouter;
