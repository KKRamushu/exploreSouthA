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
STRIPE_WEBHOOK_SECRET=whsec_...
```

`ADMIN_EMAILS` is optional. Set it to a comma-separated list of email
addresses that should have administrator access.
Use a Stripe test-mode secret key for local development. Keep this key in
`server/.env` or your hosting provider's environment settings; never put it in
the client or commit it to source control.
For local webhook testing, run this with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Set the printed `whsec_...` signing secret as `STRIPE_WEBHOOK_SECRET`.

### Install and start

From the `explore-southa-react` directory, install the client and server
dependencies:

```bash
npm --prefix server ci
npm --prefix client ci
```

Apply the database schema (including the bookings table) with:

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
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the configured Stripe webhook endpoint |

Use the same public URL without a trailing slash for `BETTER_AUTH_URL` and
`CLIENT_URL`. Render supplies `PORT` automatically. Redeploy after changing
environment variables. Configure a Stripe webhook for
`https://<your-service-url>/api/stripe/webhook` and subscribe to
`checkout.session.completed`. Use the endpoint's signing secret for
`STRIPE_WEBHOOK_SECRET`.

## API overview

All application routes are prefixed with `/api`.

| Route | Access | Purpose |
| --- | --- | --- |
| `/api/health` | Public | Check API availability |
| `/api/auth/*` | Public, with session-based access where required | Sign up, sign in, sign out, and manage authentication |
| `/api/users/me` | Signed in | Read the current user's profile |
| `/api/users` | Administrator | List user profile information |
| `/api/checkout-sessions` | Public | Create a Stripe Checkout session for the tours in the cart |
| `/api/stripe/webhook` | Stripe signature required | Verify and acknowledge Stripe webhook events |
| `/api/tours` | Public read; administrator write | Browse and manage tours |
| `/api/testimonials` | Public read; administrator write | Browse and manage testimonials |
| `/api/trip-inquiries` | Public create; administrator read/write | Create and manage trip inquiries |

Authentication records are managed by Better Auth and are not exposed through
public CRUD routes.

Select a tour and traveler count to prefill the Plan Your Trip form, choose a
travel date, and add the dated trip to the cart. The client trip cart is
available at `/cart` and is saved in the browser so it survives page navigation
and refreshes. Checkout requests send tour IDs, traveler counts, and required
travel dates; the API reloads current prices from the database before creating
one Stripe Checkout Session for the full cart.

The webhook endpoint verifies Stripe signatures and acknowledges valid events.
Checkout creates a pending booking with a snapshot of the selected tours,
travel dates, traveler counts, and USD total. Verified webhook events update
that booking to paid, payment failed, or expired; repeated events do not
downgrade a paid booking.

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
