# AFREEN MALL ERP & POS

# Phase 3 – Enterprise Development Master Specification (EDMS)

## Part 2: Folder Structure • Coding Standards • Git Workflow • CI/CD • Quality Gates

---

### 1. OBJECTIVE

This specification governs the daily engineering practices of all developers and AI coding agents working on **Afreen Mall ERP & POS**.

---

### 2. MONOREPO REPOSITORY STRUCTURE

The project is structured as an enterprise monorepo using npm workspaces / Turborepo:

```text
afreen-mall/
├── apps/
│   ├── api/                   # Express / Node.js Backend API Service
│   └── web/                   # React / Vite Single Page Application (POS & Management)
│
├── packages/
│   ├── shared-types/          # TypeScript interfaces, enums, DTO schemas shared between API & Web
│   └── ui-components/         # Reusable design tokens & primitive UI components
│
├── database/
│   ├── prisma/                # Prisma schema, migrations, and idempotent seed scripts
│   ├── seeds/                 # Reference data seeders (Tax Rates, Number Series, Roles)
│   └── backups/               # Automated backup verification scripts
│
├── docs/                      # Technical specifications, EDMS, and API documentation
├── infrastructure/            # Docker, NGINX, and CI/CD deployment manifests
└── scripts/                   # Workspace utility scripts
```

---

### 3. MODULE FOLDER BLUEPRINT

Every module inside `apps/api/src/modules/` or `packages/` MUST adhere to this internal folder layout:

```text
inventory/
├── controllers/               # Express request handlers & HTTP response wrappers
├── services/                  # Application use-case handlers & business orchestrations
├── repositories/               # Data access logic wrapping Prisma ORM
├── domain/                    # Pure domain entities, value objects, and domain rules
├── dto/                       # Data Transfer Objects & Zod validation schemas
├── facade/                    # Interface exports for cross-module consumption
├── jobs/                      # Background cron tasks (e.g., low stock alerts)
├── tests/                     # Unit & integration test suites
├── inventory.routes.ts        # Express router definitions
└── index.ts                   # Module entry point & facade export
```

---

### 4. NAMING CONVENTIONS

| Asset Type | Convention | Example |
|:---|:---|:---|
| **Files** | `kebab-case.role.ts` | `product-catalog.service.ts`, `create-product.dto.ts` |
| **Classes / Interfaces** | `PascalCase` | `ProductCatalogService`, `IInventoryFacade` |
| **Methods / Functions** | `camelCase` (Verb-first) | `calculateGSTAmount()`, `processSaleReturn()` |
| **Variables / Properties** | `camelCase` | `availableStockQty`, `invoiceTotalPaise` |
| **Constants** | `UPPER_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS`, `PAISE_PER_RUPEE` |
| **Database Tables** | `PascalCase` (Prisma) | `Product`, `Sale`, `InventoryMovement` |
| **Database Columns** | `camelCase` | `totalAmount`, `cashierStaffId`, `createdAt` |
| **API Endpoints** | `kebab-case` (Plural) | `/api/v1/purchase-orders`, `/api/v1/customer-loyalty` |

---

### 5. GIT BRANCHING & COMMIT STANDARDS

#### Branching Model (GitFlow / Modified Trunk-Based)

```text
main                ───────────────────●───────────────────● (Production / Protected)
                                       ▲                   ▲
develop     ───────●──────────●────────┼─────────●─────────┼ (Staging / Integration)
                   │          │        │         │         │
feature/*          └───●──●───┘        │         │         │ (Feature Development)
                                       │         │         │
hotfix/*    ───────────────────────────┴─────────┘─────────┘ (Critical Production Fixes)
```

- `main`: Protected branch. Direct pushes are blocked. Deploys to Production.
- `develop`: Integration branch for active sprint features. Deploys to Staging.
- `feature/<module>-<description>`: E.g., `feature/pos-split-payment`, `feature/hrms-payroll`.
- `hotfix/<issue>-<description>`: E.g., `hotfix/tax-rounding-fix`.

#### Conventional Commit Messages

Format: `<type>(<scope>): <short summary>`

```text
feat(pos): add support for UPI split payments at checkout
fix(inventory): resolve negative stock calculation in batch transfers
refactor(finance): optimize general ledger trial balance query
docs(edms): update enterprise coding standards Part 2
test(purchasing): add integration tests for GRN receiving flow
```

---

### 6. DATABASE MIGRATION & SEEDING RULES

1. **Migration Immutability**: Applied migration scripts in `prisma/migrations/` MUST NEVER be edited or deleted.
2. **Backward Compatibility**: Schema migrations must be additive (no dropping active columns without a deprecation window).
3. **Seed Idempotency**: All seed scripts MUST check for existing data (`upsert` pattern) to allow repeat execution safely.

```typescript
await prisma.taxRate.upsert({
  where: { name: 'GST 18%' },
  update: { rate: 18.0 },
  create: { name: 'GST 18%', rate: 18.0 },
});
```

---

### 7. PULL REQUEST (PR) & CODE REVIEW CHECKLIST

Every Pull Request submitted to `develop` or `main` must complete the following checklist:

- [ ] **PR Template Filled**: Clear description of changes, issue reference, and testing evidence.
- [ ] **TypeScript Build**: `npm run build` passes with 0 type errors.
- [ ] **Unit & Integration Tests**: All automated tests pass cleanly.
- [ ] **Security Validation**: Payload inputs validated with Zod schemas; RBAC permissions verified.
- [ ] **Performance Review**: No N+1 queries introduced; database indexes verified for new foreign keys.
- [ ] **Audit Trail Verified**: All state modifications write to `AuditLog`.
- [ ] **Peer Approval**: Minimum 1 senior engineer / lead approval required.

---

### 8. DEFINITION OF DONE (DoD)

A feature or ticket is considered **Done** ONLY when:
1. Feature implementation passes functional acceptance criteria.
2. Business logic is wrapped in unit/integration tests with high coverage.
3. Code compiles with 0 warnings or errors in the production build.
4. Database migrations (if any) run without errors in staging.
5. Code review comments resolved and PR merged to target branch.
6. Deployed and verified on the Staging environment.

---

### 9. CI/CD QUALITY PIPELINE

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 1. Git Push / PR│ ──> │ 2. Lint & Types │ ──> │ 3. Unit Tests   │ ──> │ 4. Build App    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                                                                 │
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐              │
│ 7. Deploy Prod  │ <── │ 6. Security Scan│ <── │ 5. E2E & DB Check│ <─────────────┘
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Quality Gates (Automatic Pipeline Fail Rules):**
- TypeScript `tsc` exit code != 0
- Unit or Integration test failure
- ESLint syntax / import errors
- WAF / Security vulnerability detection in dependencies (`npm audit`)

---

### 10. RELEASE VERSIONING (SEMVER)

Releases follow Semantic Versioning (`MAJOR.MINOR.PATCH`):
- `MAJOR` (v2.0.0): Breaking API or architectural changes.
- `MINOR` (v1.4.0): New backward-compatible department / feature module added.
- `PATCH` (v1.4.2): Backward-compatible bug fixes or security patches.

Every release tag produces an automated **Release Manifest** detailing migrations, configuration changes, and rollback instructions.

---

### 11. ACCEPTANCE CRITERIA FOR EDMS PART 2 COMPLIANCE

- [x] Repository matches the standard monorepo folder layout.
- [x] Naming conventions applied uniformly across files, methods, variables, and routes.
- [x] Git branching model and conventional commits enforced.
- [x] Database migrations are timestamped, idempotent, and non-destructive.
- [x] CI/CD pipeline enforces automated quality gates before merge.
- [x] Definition of Done governs all feature deliverables.
