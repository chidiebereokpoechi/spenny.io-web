# CLAUDE.md

Guidance for Claude Code when working in this repo. See [README.md](README.md)
for the user-facing overview and setup instructions.

## What this app is

Frontend for **spenny.io**, a personal finance tracker. Domain model:

- **Wallet** — an account (e.g. "Chase Checking").
- **Category** — a tag for transactions (e.g. "Groceries", "Rent").
- **Tracker** — a named view that scopes a set of transactions.
- **Transaction** — a recurring income or expense entry. Each one has an
  `amount`, `type` (`income` | `expense`), a start `date`, a recurrence
  (`every` + `recurrenceUnit`), a `wallet`, and any number of `categories`.

The tracker page renders these transactions and aggregates them per selected
month: total income/expense/net, what's still due this month, next payment
dates, etc.

## Stack quick reference

- React 18 + TypeScript, bootstrapped with Create React App (`react-scripts`).
- **MobX** for state. Stores in [src/stores/](src/stores/), accessed via
  `useStores()` from [src/util/stores.ts](src/util/stores.ts).
- **RxJS** for HTTP via [src/util/request.ts](src/util/request.ts) — wraps
  `rxjs/ajax`, injects the auth token, and shapes the response.
- **Formik** + **class-validator** for forms. Request models live in
  [src/models/request/](src/models/request/) and use decorators like
  `@MinLength`, `@IsPositive`, `@IsEnum`.
- **Tailwind** for styling. Config in [tailwind.config.js](tailwind.config.js).
- **Headless UI** + **Heroicons** for primitives, **Framer Motion** for
  animation, **React Table** for the transactions grid, **React Datepicker**
  for date inputs.
- **Luxon** for date math, **date-fns** for a few helpers, **lodash** liberally.

## Project layout

```
src/
  app.tsx                # Root component
  index.tsx              # Entry point
  pages/
    routes.tsx           # Central route table — add new pages here
    auth/                # Log in, sign up
    dashboard/           # Dashboard, wallets, categories, tracker pages
      components/        # Page-scoped components (TransactionsTable, etc.)
      modals/            # Page-scoped modals (create/update transaction, ...)
  components/            # Cross-page reusable UI
    buttons/  input/  layout/  modals/  routing/  tables/
    input/base/          # The actual headless inputs
    input/form-*.tsx     # Formik-wired wrappers around the base inputs
  stores/                # MobX stores (auth, user, wallets, categories,
                         #   trackers, transactions)
  domain/                # Domain classes — DomainTransaction, DomainCategory.
                         #   Computation, filtering, and serialization belong
                         #   here (NOT in stores or components).
  models/
    request/             # Outgoing request models (class-validator decorated,
                         #   one folder per resource)
    response/            # Plain response shapes from the API
  util/
    constants/           # Enums + option lists (TransactionType,
                         #   RecurrenceUnit, RouteLink, HttpMethod, ...)
    request.ts           # Shared HTTP wrapper
    stores.ts            # Store registry + useStores() hook
    time/                # Recurrence math (calculateNextPaymentDate, floor,
                         #   ceil, describeRecurrence)
    validation/          # validateModel + custom class-validator decorators
    formatting/          # Currency + date formatters
    misc/                # Storage hydration, useDimensions, classNames, etc.
```

There is a `paths` mapping in [tsconfig.json](tsconfig.json) (`@components/*`,
`@models/*`, `@stores`, `@util/*`), but the codebase uses relative imports
everywhere — match that.

## Commands

```sh
npm start          # dev server (PORT from .env, default CRA = 3000)
npm run build      # production build
npm test           # Jest watch mode
npm run lint       # tsc --noEmit && eslint src/**/*.{ts,tsx}
npm run format     # prettier --write src/**/*.{ts,tsx}
```

There are essentially no tests in the repo (CRA's default `App.test.tsx` is
absent too), so `npm test` is rarely useful. Use `npm run lint` to verify
changes typecheck.

## Conventions to follow

### Formatting
Prettier-enforced: **4-space indent**, **single quotes**, **no semicolons**,
**trailing commas (es5)**, **120 col print width**, **arrow parens always**.
See [.prettierrc](.prettierrc). When editing files, match what's already there
— don't reformat surrounding code.

### MobX stores
- One store per resource in [src/stores/](src/stores/), all instantiated once
  in [src/util/stores.ts](src/util/stores.ts) and accessed via `useStores()`.
- Use `makeAutoObservable(this, {}, { autoBind: true })` in the constructor.
- Annotate mutating methods with `@action`. When mutating inside an RxJS
  `tap`, wrap the body in `runInAction(() => { ... })`.
- Stores expose plain observable fields; derived data goes through computed
  getters (e.g. `transactionsStore.getAggregate()` is recomputed and assigned
  to `aggregate` on every relevant setter).
- Stores that need to survive logout should implement `Resettable` so they're
  reset by `stores.reset()`.

### HTTP
- **Always** go through [src/util/request.ts](src/util/request.ts) — never
  call `fetch` or `ajax` directly. It handles `REACT_APP_API_BASE_URL`, the
  bearer token, and response shaping.
- Return the `Observable<Response<T>>` from the store method; callers
  `.subscribe()` (often inside a `useEffect`, with cleanup that calls
  `subscription.unsubscribe()`).

### Forms
- Build a class in [src/models/request/](src/models/request/) extending
  `BaseModel`, decorated with `class-validator` rules.
- Validate with `validateModel` from [src/util/validation](src/util/validation/).
- Use the `form-*` wrappers from [src/components/input/](src/components/input/)
  inside a Formik `<Formik>` form — they read errors from Formik's meta.
- If the API expects a transformed payload, override `getRequestBody()` on the
  model (e.g. converting `Date` → ISO string).

### Domain logic
The pattern in this codebase: response shape → `DomainX.fromPlain(...)` →
operate on the domain object → render via `domain.computeForDate(...)` /
`domain.toPlain()`. Anything beyond trivial field access on a transaction
(filtering, next-payment date, monthly totals, exclusion state) belongs on
[src/domain/transaction.ts](src/domain/transaction.ts), not in the store or
the component.

### Routing
- Add new routes to the array in [src/pages/routes.tsx](src/pages/routes.tsx).
  Each entry is `[paths, title, Component, authRequirements]`.
- Path constants live in
  [src/util/constants/route-link.ts](src/util/constants/route-link.ts) — add
  new ones there rather than hard-coding strings.

### Filters / select inputs
The tracker page's filters (name, wallets, type, date) are the canonical
pattern for adding more: observable on the store → setter that recomputes
`aggregate` → field threaded into `filterInput` → handled in
`DomainTransaction.filter()` → rendered as a `SelectInput` on the page.

## Environment

`REACT_APP_API_BASE_URL` is the only required env var. It's read at build time
(CRA inlines `process.env.REACT_APP_*` values), so changing it requires
rebuilding the dev server / Docker image.

## Docker

Multi-stage build (deps → build → nginx). `REACT_APP_API_BASE_URL` is passed
as a build arg in [docker-compose.yml](docker-compose.yml). The container
serves the built bundle on port 80; compose maps it to host `3335`.

## Things to avoid

- Don't introduce a different HTTP client, state manager, or form library —
  stick with `request.ts` + MobX + Formik.
- Don't put computation in components or stores when it belongs on a domain
  class. If `DomainTransaction` is missing a method you need, add it there.
- Don't reformat unrelated code — Prettier's settings are unusual (no semis,
  4-space) so churn shows up loudly in diffs.
- Don't add a `--no-verify` or skip the lint step to make a commit go through;
  fix the underlying type/lint error.
- The repo uses relative imports; don't switch to the `@components/*`-style
  path aliases just because tsconfig defines them.
