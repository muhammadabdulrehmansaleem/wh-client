# WorkHive – Local Trade & Service Jobs

WorkHive is a UK-focused platform that connects **workers** (plumbers, security guards, labourers, electricians, cleaners, etc.) with **clients** who need reliable local help. It includes worker, client, and admin views with mock data for browsing jobs, posting work, and overseeing payments/complaints.

## Tech stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS + shadcn-ui
- TanStack Query
- Vitest + Testing Library

## Getting started (local development)

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

npm install
npm run dev
```

Then open `http://localhost:8080` in your browser.

## Available scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – production build
- `npm run preview` – preview the production build
- `npm run lint` – run ESLint
- `npm test` – run tests with Vitest

## High-level features

- **Landing page** with categories, feature highlights, and clear CTAs for workers and clients.
- **Worker area** to browse jobs, filter by city/category, and view notifications.
- **Client area** to post jobs, manage existing jobs, and simulate payments.
- **Admin area** to view jobs, payments, and complaints via dashboards.
- **Auth pages (demo)** for login, signup, and a simple profile view (no real backend auth yet).
