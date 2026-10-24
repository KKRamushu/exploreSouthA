# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Deploying to Render

Create a **Web Service** for this repository with the following settings:

- **Root Directory:** `explore-southa-react`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

The build command installs the server and client dependencies and creates the
client production bundle. The server serves that bundle and the API from the
same Render service.

Set these environment variables in Render:

- `DATABASE_URL`: the connection string for the working PostgreSQL database
- `BETTER_AUTH_SECRET`: a long, random secret
- `BETTER_AUTH_URL`: the service's public HTTPS URL, such as
  `https://your-service.onrender.com`
- `CLIENT_URL`: the same public HTTPS origin as `BETTER_AUTH_URL`
- `ADMIN_EMAILS` (optional): comma-separated administrator email addresses

Use the service URL without a trailing slash for `BETTER_AUTH_URL` and
`CLIENT_URL`. After changing environment variables, redeploy the service.

## API server

Start the Express API from the repository root with `npm start`. The API uses
the server's `.env` file and listens on the configured `PORT` (default `3000`).
Set `ADMIN_EMAILS` there to a comma-separated list of account emails allowed
to create, update, and delete tours and testimonials, and to manage trip
inquiries. Restart the server after changing this setting.

Better Auth handles sign-up, sign-in, sign-out, sessions, accounts, and
verification through `/api/auth/*`. The API also provides:

| Route | Access | Operations |
| --- | --- | --- |
| `/api/users/me` | Signed in | Read the current user |
| `/api/users` | Administrator | List users (safe profile fields only) |
| `/api/tours` | Public read; administrator write | List, read, create, update, delete |
| `/api/testimonials` | Public read; administrator write | List, read, create, update, delete |
| `/api/trip-inquiries` | Public create; administrator read/write | Create, list, read, update, delete |

Sessions, accounts, and verification records do not have public CRUD routes;
they are managed by Better Auth.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
