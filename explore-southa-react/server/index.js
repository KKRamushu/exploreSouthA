const path = require("node:path");
const { config } = require("dotenv");

config({ path: path.resolve(__dirname, ".env") });

const cors = require("cors");
const express = require("express");
const authPromise = require("./auth");
const { db } = require("./db");
const createCheckoutSessionsRouter = require("./routes/checkout-sessions");
const createToursRouter = require("./routes/tours");
const createTestimonialsRouter = require("./routes/testimonials");
const createTripInquiriesRouter = require("./routes/trip-inquiries");
const createUsersRouter = require("./routes/users");

async function createApp() {
  const [auth, betterAuthNode] = await Promise.all([
    authPromise,
    import("better-auth/node"),
  ]);
  const app = express();
  const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Origin not allowed"));
      },
      credentials: true,
    }),
  );

  const authHandler = betterAuthNode.toNodeHandler(auth);
  app.all("/api/auth", authHandler);
  app.all("/api/auth/*splat", authHandler);

  app.use(express.json({ limit: "100kb" }));
  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });
  app.use("/api/users", createUsersRouter({ auth, db, betterAuthNode }));
  app.use(
    "/api/checkout-sessions",
    createCheckoutSessionsRouter({ db }),
  );
  app.use("/api/tours", createToursRouter({ auth, db, betterAuthNode }));
  app.use(
    "/api/testimonials",
    createTestimonialsRouter({ auth, db, betterAuthNode }),
  );
  app.use(
    "/api/trip-inquiries",
    createTripInquiriesRouter({ auth, db, betterAuthNode }),
  );

  const clientDist = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("/{*splat}", (request, response, next) => {
    if (request.path.startsWith("/api")) {
      next();
      return;
    }

    response.sendFile(path.join(clientDist, "index.html"));
  });

  app.use((_request, response) => {
    response.status(404).json({ error: "Route not found." });
  });

  app.use((error, _request, response, _next) => {
    console.error("API request failed:", error);
    const status = error.message === "Origin not allowed" ? 403 : 500;
    response.status(status).json({
      error: status === 500 ? "Internal server error." : error.message,
    });
  });

  return app;
}

async function start() {
  const app = await createApp();
  const port = Number(process.env.PORT || 3000);
  app.listen(port, "0.0.0.0", () => {
    console.log(`ExploreSouthA API listening on port ${port}.`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Failed to start ExploreSouthA API:", error);
    process.exitCode = 1;
  });
}

module.exports = { createApp };