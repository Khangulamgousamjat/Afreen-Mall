
## Deployment Notes & Backend Resiliency

### 1. Render Free-Tier Cold Starts & Keep-Warm Workflow
- **Backend Infrastructure**: The backend API (`apps/api`) is deployed on Render's free tier (`https://afreen-mall.onrender.com`), which automatically sleeps after 15 minutes of inactivity.
- **Cold Start Behavior**: When sleeping, a cold start takes 30–50 seconds to wake up the service and establish database connections.
- **Keep-Warm Automation**: A scheduled GitHub Actions workflow (`.github/workflows/keep-warm.yml`) runs every 12 minutes to ping `https://afreen-mall.onrender.com/health`, keeping the API instance active during operational hours.
- **Frontend Mitigation**:
  - The login screen (`LoginScreen.tsx`) fires a background `/health` ping as soon as it mounts to trigger server wake-up early.
  - The login request uses a **60-second abort timeout** with **exponential backoff retries (3 attempts)** so users never get stuck on cold starts.
  - Global API requests in `api.ts` use a 45-second timeout to handle DB connection pool warming.

### 2. Environment Variables & Security
- **Strict Git Exclusion**: `.env` and `.env.local` files across all workspaces are strictly ignored via `.gitignore` and must never be committed.
- **Credential Rotation Warning**: Database passwords and JWT secrets previously present in environment configuration should be rotated periodically via the hosting platform dashboards (Render / Vercel).

---

## Domain & modules (deep dive)
The backend organizes functionality into domain modules located at apps/api/src/modules. Each module typically contains routes, services and any module‑scoped middleware.

Notable modules:
- auth — authentication, JWT issuance and refresh, login attempt handling
- users — user management, roles and profile data
- pos — point‑of‑sale flows (create sale, line items, payments)
- cash — cash reconciliation, register closeouts, cash variance reporting
- catalog — product master: items, categories, pricing and tax metadata
- inventory — stock levels, stock movement, cost tracking, min/max levels
- purchasing — purchase orders, receipts, supplier references and GRN flows
- warehouse — warehouse transfers and stock allocation
- customers — loyalty or customer records for sales and analytics
- reports — summary and periodic reporting: daily/weekly/monthly summaries and GST/FS reporting
- hardware — low level integrations for peripherals (card payments, barcode scanners, printers)

Each module exposes REST endpoints under /api/v1/<module>, and the server entrypoint (apps/api/src/index.ts) mounts the routers for each domain.

---

## Data model (summary from Prisma schema)
Prisma schema models implement the core business objects. Representative entities:

- Store — store profile, contact info and operational metadata.
- User — authentication (username, passwordHash), role, staff identifiers, login history and sessions.
- Session/LoginHistory — keyed session records for audit, tokens and session metadata.
- Product / ProductCategory — catalog structure, category → product relationships, HSN/Tax information.
- Inventory / StockMovement — current stock, minStock, stock movements, adjustments and reasons.
- POSRegister / Sale / SaleItem — sale transactions, line items, payment modes (CASH, CARD, UPI), rounding and receipts.
- PurchaseOrder / PurchaseLine / Receiving — PO lifecycle (DRAFT, APPROVED, RECEIVED).
- CashReport / CashVariance — cash reconciliation and variance tracking with enumerated statuses.
- Warehouse / Transfer / Movement — movement of stock between locations.
- TaxRate / HSNCode — tax configuration used at sale time.

Refer to apps/api/prisma/schema.prisma for the full authoritative model (contains types, enums and relationships). The schema follows explicit domain‑driven naming and enumerations for statuses and roles.

---

## Seeded data & demo credentials
Seed data (apps/api/prisma/seed.ts) is used to bootstrap a demo dataset — stores, users, products, registers and sample stock.

Highlights:
- Default store: Afreen Mall (created by seed).
- Super Admin:
  - Staff ID: 3000000
- Default password for other seeded accounts: Pass@123
- Example staff accounts (examples seeded in the script):
  - manager1 (STORE_MANAGER)
  - accountant1 (ACCOUNTANT)
  - cashier1 (CASHIER)
- Sample product catalogue, tax rates and sample stock levels are seeded to facilitate functional testing of POS and inventory flows.

Note: seeded credentials exist to enable evaluation and development; in production, rotate or remove seed credentials and use secure onboarding.

---

## Security, privacy & audit considerations
- Passwords: bcrypt is used for password hashing in seed & auth code.
- Tokens: JWTs are used for session/auth flows; tokens and refresh strategy are implemented in auth module.
- Audit trails: Login history, session records and audit logs capture events for compliance and incident investigations.
- DB migrations: Prisma migrations and schema are the source of truth for table changes — treat schema.prisma as canonical and run migrations in CI/CD controlled flows.
- Secrets: Database URLs, JWT secrets and encryption keys must be provisioned via environment variables and never committed.

---

## Developer notes (conceptual — no run commands included)
- Monorepo uses npm workspaces — apps and packages are installed and linked by workspace resolution.
- Frontend ↔ Backend contract is enforced with packages/shared-types: keep DTOs and GraphQL/REST shape definitions in sync.
- Schema changes:
  - Update Prisma schema, then generate the client and create a migration.
  - Seed script applies deterministic demo data for quick validation.
- Containers and compose are used for repeatable local stacks and CI artifacts. Dockerfiles exist for api and web.
- Testing & quality:
  - Add unit tests per module (prefer simple service-level tests for business rules).
  - Add end‑to‑end test harness for critical flows (POS checkout, purchase receiving, cash reconciliation).

---

## Contributing
- Follow a feature‑branch workflow: small, focused PRs, one logical change per PR.
- Update DECISIONS.md when adding or changing architecture‑level decisions.
- Keep shared type definitions backward compatible or version them if a breaking change is required across apps.
- Add tests for new logic; include migrations and seed adjustments where schema changes occur.

---

## Governance & roadmap (suggested next steps)
- Harden authentication flows: multi‑factor, session revocation and role‑based access control enforcement.
- Reporting: extend reporting module for exportable GST/compliance statements and ledger integration.
- Offline / resiliency: POS offline caching and deferred sync for intermittent connectivity scenarios.
- Hardware integrations: abstract device drivers and provide test harnesses for printers/card readers.

---

## Where to look next (source pointers)
- apps/api/src — controllers, middleware and module implementations
- apps/api/prisma/schema.prisma — canonical data model
- apps/api/prisma/seed.ts — seeded demo data
- apps/web/src — UI routes, components and API clients
- packages/shared-types — shared DTOs / domain interfaces
- BUILD_SUMMARY.md & DECISIONS.md — project notes, decisions and quick references

---

If you'd like, I can:
- Commit this README.md to the repository for you.
- Produce a separate "RUNNING.md" that contains the step‑by‑step start/migration/compose commands (kept out of README per your request).
- Generate concise architecture diagrams (SVG/Markdown) or an API endpoints reference extracted from the routers.

Which of those would you like next?
