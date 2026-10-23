const { and, eq, isNull } = require("drizzle-orm");
const { db, client } = require("./index");
const { testimonials, tours, tripInquiries } = require("./schema");
const seedData = require("./seed-data");

async function seed() {
  for (const tour of seedData.tours) {
    const { id, ...values } = tour;
    await db
      .insert(tours)
      .values(tour)
      .onConflictDoUpdate({ target: tours.id, set: values });
  }

  for (const testimonial of seedData.testimonials) {
    const { id, ...values } = testimonial;
    await db
      .insert(testimonials)
      .values(testimonial)
      .onConflictDoUpdate({ target: testimonials.id, set: values });
  }

  let inquiriesAdded = 0;
  for (const inquiry of seedData.tripInquiries) {
    const preferredMonthFilter = inquiry.preferredMonth
      ? eq(tripInquiries.preferredMonth, inquiry.preferredMonth)
      : isNull(tripInquiries.preferredMonth);
    const [existing] = await db
      .select({ id: tripInquiries.id })
      .from(tripInquiries)
      .where(
        and(
          eq(tripInquiries.destination, inquiry.destination),
          preferredMonthFilter,
          eq(tripInquiries.travelers, inquiry.travelers),
        ),
      )
      .limit(1);

    if (!existing) {
      await db.insert(tripInquiries).values(inquiry);
      inquiriesAdded += 1;
    }
  }

  console.log(
    `Seed complete: ${seedData.tours.length} tours and ${seedData.testimonials.length} testimonials upserted; ${inquiriesAdded} sample inquiries added.`,
  );
}

seed()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
