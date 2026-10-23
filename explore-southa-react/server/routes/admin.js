function requireAdmin(auth, fromNodeHeaders) {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return async (request, response, next) => {
    if (adminEmails.length === 0) {
      response
        .status(503)
        .json({ error: "Admin routes are disabled until ADMIN_EMAILS is set." });
      return;
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      response.status(401).json({ error: "Authentication is required." });
      return;
    }

    if (!adminEmails.includes(session.user.email.toLowerCase())) {
      response.status(403).json({ error: "Administrator access is required." });
      return;
    }

    next();
  };
}

module.exports = { requireAdmin };
