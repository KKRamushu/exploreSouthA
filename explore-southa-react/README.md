# ExploreSouthA

**Discover South Africa. Travel your way.**

ExploreSouthA is a travel experience website for discovering curated South
African tours, reading traveler testimonials, and exploring trip-planning
options. Its responsive React frontend is served alongside an Express API,
with tour and testimonial content stored in PostgreSQL.

## Highlights

- Browse featured tours and filter by coastal or wildlife experiences.
- Explore traveler testimonials and trip-planning information.
- Sign up, sign in, and manage sessions with Better Auth.
- Manage tours, testimonials, users, and trip inquiries through protected API
  routes.
- Serve the production website and API from a single service.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS |
| API | Node.js, Express |
| Database | PostgreSQL, Drizzle ORM |
| Authentication | Better Auth |

## Run locally

### Prerequisites

- Node.js and npm
- A PostgreSQL database

### Configure the server

Create `server/.env` and set the following values:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
ADMIN_EMAILS=admin@example.com
STRIPE_SECRET_KEY=sk_test_...
```

`ADMIN_EMAILS` is optional. Set it to a comma-separated list of email
addresses that should have administrator access.
Use a Stripe test-mode secret key for local development. Keep this key in
`server/.env` or your hosting provider's environment settings; never put it in
the client or commit it to source control.

### Install and start

From the `explore-southa-react` directory, install the client and server
dependencies:

```bash
npm --prefix server ci
npm --prefix client ci
```

If the database schema has not been applied yet, run:

```bash
npm run db:push
```

Start the API and frontend in separate terminals:

```bash
npm start
```

```bash
npm --prefix client run dev
```

Open `http://localhost:5173`. The Vite development server forwards `/api`
requests to the API at `http://localhost:3000`.

## Deploy to Render

Create a **Web Service** connected to this repository and configure:

| Setting | Value |
| --- | --- |
| Root Directory | `explore-southa-react` |
| Build Command | `npm run build` |
| Start Command | `npm start` |

Set these environment variables in the Render service:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | A long, random secret |
| `BETTER_AUTH_URL` | The service's public HTTPS URL |
| `CLIENT_URL` | The same public HTTPS origin as `BETTER_AUTH_URL` |
| `ADMIN_EMAILS` | Optional comma-separated administrator email addresses |
| `STRIPE_SECRET_KEY` | Stripe secret key; use a live-mode key only for production payments |

Use the same public URL without a trailing slash for `BETTER_AUTH_URL` and
`CLIENT_URL`. Render supplies `PORT` automatically. Redeploy after changing
environment variables.

## API overview

All application routes are prefixed with `/api`.

| Route | Access | Purpose |
| --- | --- | --- |
| `/api/health` | Public | Check API availability |
| `/api/auth/*` | Public, with session-based access where required | Sign up, sign in, sign out, and manage authentication |
| `/api/users/me` | Signed in | Read the current user's profile |
| `/api/users` | Administrator | List user profile information |
| `/api/checkout-sessions` | Public | Create a Stripe Checkout session for a tour |
| `/api/tours` | Public read; administrator write | Browse and manage tours |
| `/api/testimonials` | Public read; administrator write | Browse and manage testimonials |
| `/api/trip-inquiries` | Public create; administrator read/write | Create and manage trip inquiries |

Authentication records are managed by Better Auth and are not exposed through
public CRUD routes.

## Project structure

```text
explore-southa-react/
├── client/                 # React application and Vite configuration
├── server/
│   ├── db/                 # Drizzle schema and database setup
│   ├── routes/             # API route handlers
│   ├── auth.js             # Better Auth configuration
│   └── index.js            # Express application and server entry point
├── package.json            # Root build, start, and database commands
└── README.md
```
