# Client (Business System)

React + Vite frontend for the Business System print-service app.

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## Backend Connection

API calls use:

`http://localhost:5000/api`

Configured in:

- `src/services/AxiosSetup.jsx`

## Key Routes

- `/` - home
- `/login` - login page
- `/register` - registration page
- `/cart` - customer cart
- `/my-orders` - customer order history
- `/admin/*` - admin dashboard, services, orders

## Main Frontend Areas

- `src/customer` - customer pages and sections
- `src/admin` - admin dashboard pages
- `src/context` - auth and cart context providers
- `src/services` - axios client setup

See root README for full-stack setup (frontend + backend + environment variables).
