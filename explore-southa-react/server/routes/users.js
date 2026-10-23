const { asc } = require("drizzle-orm");
const { Router } = require("express");
const { users } = require("../db/schema");
const { requireAdmin } = require("./admin");

function createUsersRouter({ auth, db, betterAuthNode }) {
  const router = Router();
  const adminOnly = requireAdmin(auth, betterAuthNode.fromNodeHeaders);

  router.get("/me", async (request, response) => {
    const session = await auth.api.getSession({
      headers: betterAuthNode.fromNodeHeaders(request.headers),
    });
    if (!session) {
      response.status(401).json({ error: "Authentication is required." });
      return;
    }
    response.json({ user: session.user });
  });

  router.get("/", adminOnly, async (_request, response) => {
    const results = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(asc(users.email));
    response.json(results);
  });

  return router;
}

module.exports = createUsersRouter;
