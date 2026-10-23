const path = require("node:path");
const { config } = require("dotenv");
const schema = require("./db/schema");
const { db } = require("./db");

config({ path: path.resolve(__dirname, ".env") });

const secret = process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUT_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!secret) {
  throw new Error(
    "BETTER_AUTH_SECRET is required (legacy BETTER_AUT_SECRET is also accepted).",
  );
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is required to configure Better Auth.");
}

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const authPromise = Promise.all([
  import("better-auth"),
  import("@better-auth/drizzle-adapter"),
]).then(([betterAuthModule, drizzleAdapterModule]) =>
  betterAuthModule.betterAuth({
    appName: "ExploreSouthA",
    baseURL,
    secret,
    trustedOrigins: allowedOrigins,
    database: drizzleAdapterModule.drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    emailAndPassword: {
      enabled: true,
    },
  }),
);

module.exports = authPromise;