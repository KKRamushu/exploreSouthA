
const path = require("node:path");
const { config } = require("dotenv");
const postgres = require("postgres");
const { drizzle } = require("drizzle-orm/postgres-js");
const schema = require("./schema");

config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to connect to the database.");
}

const client = postgres(process.env.DATABASE_URL, {prepare:false});
const db = drizzle(client, { schema });

module.exports = { db, client };