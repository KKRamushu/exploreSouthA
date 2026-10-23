const { asc, eq } = require("drizzle-orm");
const { Router } = require("express");
const { testimonials } = require("../db/schema");
const { requireAdmin } = require("./admin");
const { isObject, parseFields, stringField } = require("./validation");

const testimonialFields = {
  quote: stringField(10000),
  name: stringField(160),
  location: stringField(160),
  rating: (value) =>
    Number.isInteger(value) && value >= 1 && value <= 5 ? value : undefined,
};

function createTestimonialsRouter({ auth, db, betterAuthNode }) {
  const router = Router();
  const adminOnly = requireAdmin(auth, betterAuthNode.fromNodeHeaders);

  router.get("/", async (_request, response) => {
    const results = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.name));
    response.json(results);
  });

  router.get("/:id", async (request, response) => {
    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, request.params.id))
      .limit(1);
    if (!testimonial) {
      response.status(404).json({ error: "Testimonial not found." });
      return;
    }
    response.json(testimonial);
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

    const parsed = parseFields(
      body,
      testimonialFields,
      Object.keys(testimonialFields),
    );
    if (parsed.error) {
      response.status(400).json({ error: parsed.error });
      return;
    }

    const [testimonial] = await db
      .insert(testimonials)
      .values({ id: id.trim(), ...parsed.values })
      .returning();
    response.status(201).json(testimonial);
  });

  router.patch("/:id", adminOnly, async (request, response) => {
    const parsed = parseFields(request.body, testimonialFields);
    if (parsed.error) {
      response.status(400).json({ error: parsed.error });
      return;
    }
    const [testimonial] = await db
      .update(testimonials)
      .set(parsed.values)
      .where(eq(testimonials.id, request.params.id))
      .returning();
    if (!testimonial) {
      response.status(404).json({ error: "Testimonial not found." });
      return;
    }
    response.json(testimonial);
  });

  router.delete("/:id", adminOnly, async (request, response) => {
    const [testimonial] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, request.params.id))
      .returning({ id: testimonials.id });
    if (!testimonial) {
      response.status(404).json({ error: "Testimonial not found." });
      return;
    }
    response.status(204).end();
  });

  return router;
}

module.exports = createTestimonialsRouter;
