# spenny.io-web

The web frontend for **spenny.io**, a personal finance tracker. Users organize
their finances into **trackers** containing recurring **transactions** (income
and expenses), grouped by **categories** and tied to **wallets**.

The app computes per-month totals, due-this-month projections, and next-payment
dates from each transaction's recurrence schedule, so users can see what bills
are still outstanding for the current period and what the month's net cash flow
looks like.

## Stack

- React 18 + TypeScript (Create React App)
- MobX for state management
- React Router 6 for routing
- RxJS for HTTP (via `rxjs/ajax`)
- Formik + `class-validator` for forms and validation
- Tailwind CSS for styling
- Headless UI, Heroicons, Framer Motion, React Table, React Datepicker

The backend is a separate service; this app talks to it via `REACT_APP_API_BASE_URL`.

## Prerequisites

- Node.js 20
- npm

## Setup

```sh
npm install
cp .env.example .env   # then edit REACT_APP_API_BASE_URL to point at your API
```

`.env.example`:

```
PORT=4000
REACT_APP_API_BASE_URL="http://localhost:5000/api/v1"
```

## Scripts

| Command         | What it does                                                  |
| --------------- | ------------------------------------------------------------- |
| `npm start`     | Runs the dev server (defaults to the `PORT` env var).         |
| `npm run build` | Production build into `build/`.                               |
| `npm test`      | Jest in watch mode (CRA defaults).                            |
| `npm run lint`  | `tsc --noEmit` then ESLint over `src/**/*.{ts,tsx}`.          |
| `npm run format`| Prettier-write `src/**/*.{ts,tsx}`.                           |

## Docker

A multi-stage `Dockerfile` builds the app and serves it via nginx.

```sh
# Build and run via docker compose
REACT_APP_API_BASE_URL="https://api.example.com/api/v1" docker compose up --build
```

The compose service exposes the app on `http://localhost:3335`. The API base
URL is baked in at build time (it's a `REACT_APP_*` var), so rebuild the image
when it changes.

## Project layout

```
src/
  app.tsx                # Root component (wires the Router)
  index.tsx              # Entry point
  pages/                 # Route-level pages (auth, dashboard, tracker, ...)
  components/            # Reusable UI: buttons, inputs, layout, modals, tables
  stores/                # MobX stores (auth, user, wallets, categories,
                         #   trackers, transactions)
  domain/                # Domain classes (e.g. DomainTransaction) — the
                         #   computation/filter logic lives here, not in stores
  models/
    request/             # Outgoing request models (class-validator decorated)
    response/            # Plain response shapes from the API
  util/
    constants/           # Enums + option lists (TransactionType, RouteLink, ...)
    request.ts           # The shared HTTP wrapper (RxJS ajax + auth token)
    stores.ts            # Store registry + useStores() hook
    time/                # Recurrence math (next payment date, floor/ceil, ...)
    validation/          # validateModel + custom class-validator decorators
    formatting/          # Currency and date formatters
    misc/                # Storage hydration, dimensions hook, etc.
```

## Conventions

- **Formatting**: Prettier, 4-space indent, single quotes, no semicolons, 120
  cols. Run `npm run format` before pushing.
- **Linting**: `npm run lint` (typecheck + ESLint, airbnb-typescript base).
- **State**: MobX stores in `src/stores/`. Use `useStores()` to access them.
  Mutations go through `@action` methods.
- **HTTP**: never call `fetch`/`ajax` directly — go through
  [src/util/request.ts](src/util/request.ts), which handles the auth header,
  base URL, and error shaping.
- **Forms**: build a request model in `src/models/request/` with
  `class-validator` decorators, then use Formik + `validateModel` to drive the
  form.
- **Domain logic**: anything more than trivial computation on a transaction
  (filtering, next-payment date, monthly totals) belongs on the
  `DomainTransaction` class, not in components or stores.
