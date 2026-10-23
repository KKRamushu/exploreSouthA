const {
  check,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  numeric,
} = require("drizzle-orm/pg-core");
const { sql } = require("drizzle-orm");

const tourCategory = pgEnum("tour_category", ["coastal", "wildlife"]);

const inquiryStatus = pgEnum("inquiry_status", [
  "new",
  "contacted",
  "quoted",
  "booked",
]);

const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)],
);

const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

const tours = pgTable(
  "tours",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    category: tourCategory("category").notNull(),
    durationDays: integer("duration_days").notNull(),
    durationNights: integer("duration_nights").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    image: text("image").notNull(),
    imageAlt: varchar("image_alt", { length: 255 }).notNull(),
    highlights: text("highlights").array().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("tours_category_idx").on(table.category),
    check("tours_duration_days_positive", sql`${table.durationDays} > 0`),
    check(
      "tours_duration_nights_non_negative",
      sql`${table.durationNights} >= 0`,
    ),
    check("tours_price_non_negative", sql`${table.price} >= 0`),
  ],
);

const tripInquiries = pgTable(
  "trip_inquiries",
  {
    id: serial("id").primaryKey(),
    destination: varchar("destination", { length: 160 }).notNull(),
    preferredMonth: varchar("preferred_month", { length: 7 }),
    travelers: integer("travelers").notNull().default(2),
    status: inquiryStatus("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("trip_inquiries_status_idx").on(table.status),
    index("trip_inquiries_created_at_idx").on(table.createdAt),
    check("trip_inquiries_travelers_positive", sql`${table.travelers} > 0`),
    check(
      "trip_inquiries_preferred_month_format",
      sql`${table.preferredMonth} IS NULL OR ${table.preferredMonth} ~ '^\\d{4}-(0[1-9]|1[0-2])$'`,
    ),
  ],
);

const testimonials = pgTable(
  "testimonials",
  {
    id: text("id").primaryKey(),
    quote: text("quote").notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    location: varchar("location", { length: 160 }).notNull(),
    rating: integer("rating").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "testimonials_rating_range",
      sql`${table.rating} BETWEEN 1 AND 5`,
    ),
  ],
);

module.exports = {
  tourCategory,
  inquiryStatus,
  users,
  sessions,
  accounts,
  verifications,
  tours,
  tripInquiries,
  testimonials,
};