# AFREEN MALL ERP & POS

# Phase 3 – Enterprise Development Master Specification (EDMS)

## Part 1: Development Standards • Coding Rules • Architecture Principles

---

### 1. OBJECTIVE & CORE ENGINEERING VALUES

Every line of code in **Afreen Mall ERP & POS** must adhere to an uncompromised enterprise engineering standard.

| Core Engineering Value | Definition & Implementation Rule |
|:---|:---|
| **Maintainability** | Clean layer separation, loose coupling, self-documenting code, zero magic numbers. |
| **Scalability** | Modular monolith design allowing seamless decomposition into microservices. |
| **Security** | Defense-in-depth, zero-trust backend validation, WAF SQL injection shield, RBAC guards. |
| **Performance** | Sub-100ms API responses, indexed DB queries, optimized Vite bundles, virtualized UI lists. |
| **Consistency** | Unified API response envelopes, strict TypeScript typing, standardized error codes. |
| **Testability** | Decoupled domain logic enabling high-coverage unit, integration, and E2E testing. |
| **Readability** | Clear naming conventions, documented interfaces, explicit error trace handling. |

---

### 2. MODULAR MONOLITH ARCHITECTURE

The system is structured as a **Modular Monolith** organized into 14 core modules:

```text
                                  ┌─────────────────────────┐
                                  │      API GATEWAY        │
                                  └────────────┬────────────┘
                                               │
       ┌───────────────────┬───────────────────┼───────────────────┬───────────────────┐
       ▼                   ▼                   ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Auth & User │    │     POS      │    │  Inventory   │    │  Purchasing  │    │ Sales & Cash │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │                   │                   │
       ├───────────────────┼───────────────────┼───────────────────┼───────────────────┤
       ▼                   ▼                   ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  CRM & Loyalty│   │ Supplier VRM │    │ Finance & Acc│    │  HRMS Staff  │    │ System Admin │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │                   │                   │
       ├───────────────────┴───────────────────┴───────────────────┴───────────────────┤
       ▼                                                                               ▼
┌──────────────┐                                                        ┌──────────────┐
│ Business Intel│                                                       │ Audit & Logs │
└──────────────┘                                                        └──────────────┘
```

Each module operates with strict boundary encapsulation. Cross-module communication must occur via exported Service Facades or Domain Events.

---

### 3. CLEAN ARCHITECTURE LAYERING RULES

```text
Presentation Layer (React Web / POS UI / REST Controllers)
       │
       ▼
Application Layer (Use Cases, DTOs, Workflows, Validation)
       │
       ▼
Domain Layer (Entities, Value Objects, Business Rules)
       │
       ▼
Infrastructure Layer (Prisma ORM, Database, File Storage, External APIs)
```

**Strict Enforcement Rules:**
1. **UI Layer** must NEVER execute database queries directly.
2. **Domain Layer** must contain pure business logic with zero external framework dependencies.
3. **Dependencies** must point strictly INWARD toward the Domain.
4. **Data Transfer Objects (DTOs)** must validate boundaries before reaching the application services.

---

### 4. MODULE ISOLATION & INTERFACE FACADES

Modules communicate through explicitly declared Service Facades rather than direct database table joins across domains.

**Example Interface (Inventory Module Expose):**

```typescript
export interface IInventoryServiceFacade {
  checkStock(productId: string, quantity: number): Promise<boolean>;
  reserveStock(productId: string, quantity: number, referenceId: string): Promise<StockReservation>;
  releaseStock(reservationId: string): Promise<void>;
  deductStock(productId: string, quantity: number, saleInvoiceId: string): Promise<StockDeductionResult>;
}
```

*Sales Module calling Inventory Module:*
- ✅ `await inventoryFacade.reserveStock(item.productId, item.qty, saleId);`
- ❌ `await prisma.inventory.update({ where: { productId: item.productId }, data: ... });` (Bypasses Inventory domain logic!)

---

### 5. SINGLE RESPONSIBILITY & SOLID DESIGN

1. **Class / Function Responsibility**: A service handles exactly one business domain responsibility.
2. **Anti-Pattern Guard**: No "God Services" or "God Screens" exceeding 500 lines of un-decomposed code.
3. **Component Decomposition**: UI components must separate stateful business logic (custom hooks) from visual presentation.

---

### 6. DEPENDENCY FLOW DIRECTION

```text
[ POS Controller ] ──> [ POS Application Service ] ──> [ Inventory Facade ] ──> [ Inventory Domain ]
```

Direct horizontal links between module persistence models are prohibited.

---

### 7. DATABASE ACCESS & PERFORMANCE RULES

1. **ORM Abstraction**: Use Prisma ORM as the data access layer with strict schema typing.
2. **Transaction Isolation**: All multi-table mutations MUST use explicit Prisma transactions (`prisma.$transaction`).
3. **N+1 Query Prevention**: Always use relation inclusions (`include` or `select`) or batch loader patterns.
4. **Indexing**: Primary Keys (UUID/Int), Foreign Keys, Barcodes, Invoice Numbers, Staff IDs, and Search Fields MUST be indexed.
5. **No Scattered Raw SQL**: Raw SQL queries are prohibited unless optimized by Database Administrators for bulk reporting aggregations.

---

### 8. API DESIGN & UNIFIED RESPONSE ENVELOPE

All API endpoints MUST adhere to a consistent JSON response contract.

**Standard Success Envelope (`HTTP 200/201`):**

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {
    "invoiceNo": "INV-2026-004128",
    "totalAmountPaise": 142000
  },
  "errors": []
}
```

**Standard Error Envelope (`HTTP 400/401/403/404/500`):**

```json
{
  "success": false,
  "message": "Validation failed on input data.",
  "data": null,
  "errors": [
    {
      "field": "mrp",
      "code": "INVALID_PAISE_AMOUNT",
      "message": "MRP must be an integer representing amount in paise."
    }
  ]
}
```

---

### 9. STANDARDIZED ERROR HANDLING

Every exception must be caught and mapped to a domain error category:

| Error Category | HTTP Code | Usage Scenario |
|:---|:---:|:---|
| **ValidationError** | 400 | Invalid payload format, negative amounts, invalid barcode. |
| **AuthenticationError** | 401 | Missing/expired JWT token, invalid credentials. |
| **AuthorizationError** | 403 | RBAC role insufficient for endpoint action. |
| **NotFoundError** | 404 | Record, SKU, customer, or invoice ID not found. |
| **BusinessRuleError** | 422 | Insufficient stock, shift closed, customer credit limit exceeded. |
| **DatabaseError** | 500 | Transaction deadlock, unique constraint failure. |
| **UnexpectedError** | 500 | Unhandled runtime exception (Sanitized log emitted). |

*Security Guard:* Stack traces MUST NEVER be returned to the client in production responses.

---

### 10. TWO-TIER VALIDATION

1. **Client-Side Validation (UX Level)**: Instant feedback for fields, format checking, barcode length verification.
2. **Server-Side Validation (Security Level - MANDATORY)**: Executed before business logic processing via Zod / middleware. Never trust client payloads.

---

### 11. TRANSACTION & ACID CONCURRENCY MANAGEMENT

Multi-table atomic operations (e.g., POS Billing: Sale Entry + Sale Items + Inventory Deduction + Cash Register Balance + Customer Loyalty Points) MUST execute inside an isolated transaction.

```typescript
await prisma.$transaction(async (tx) => {
  const sale = await tx.sale.create({ data: salePayload });
  await tx.inventory.update({ where: { id: invId }, data: { currentStock: { decrement: qty } } });
  await tx.customer.update({ where: { id: custId }, data: { loyaltyPoints: { increment: points } } });
});
```

---

### 12. IMMUTABLE AUDIT TRAIL

All state-changing operations (`CREATE`, `UPDATE`, `DELETE`, `APPROVE`, `REVERSE`) MUST write an audit record to the `AuditLog` table.

- Audit records are **INSERT-ONLY**.
- No `UPDATE` or `DELETE` endpoints exist for the `AuditLog` table.

---

### 13. CATEGORIZED ENTERPRISE LOGGING

Logs are partitioned into 5 explicit streams:

```text
1. /logs/app.log       ── System events, startup, module registration
2. /logs/security.log  ── Logins, lockouts, permission checks, failed attempts
3. /logs/audit.log     ── Data mutations, configuration changes
4. /logs/api.log       ── Endpoint request/response latencies
5. /logs/jobs.log      ── Scheduled crons, background backup tasks
```

*Sanitization Rule:* Passwords, JWT secrets, credit card numbers, and PINs MUST be redacted automatically by log formatters.

---

### 14. ZERO HARDCODING & CENTRALIZED CONFIGURATION

No hardcoded system values. All operational rules (GST rates, currency codes, financial year start, login lockout thresholds, number series prefixes) MUST be read from `SystemConfig` or Environment Variables (`.env`).

---

### 15. SECURITY PRINCIPLES & DEFENSE IN DEPTH

1. **Passwords**: Hashed with bcrypt (cost factor 12).
2. **Transport**: Mandatory HTTPS / TLS 1.3.
3. **Authentication**: JWT tokens (15-min expiry) with refresh tokens.
4. **SQL Injection Shield**: WAF Middleware validating all request parameters.
5. **CSRF & XSS Protection**: Security headers (`X-Frame-Options`, `X-XSS-Protection`, `Content-Security-Policy`).
6. **Rate Limiting**: IP & User rate limiting (300 req/min for general APIs, 5 req/min for Login).

---

### 16. PERFORMANCE BENCHMARKS & PAGINATION

1. **Pagination**: All list APIs MUST implement `page` and `limit` parameters (Default 30, Max 200).
2. **Caching**: Reference data (Categories, Tax Rates, System Settings) cached in memory.
3. **Async Jobs**: Report exports, bulk inventory recalculations, and daily backups execute asynchronously.

---

### 17. CONCURRENCY PROTECTION & LOCKING

1. **Optimistic Locking**: Version column (`version` field) on Inventory & Account balances to prevent simultaneous update overwrites.
2. **Duplicate Sale Protection**: Unique Idempotency Key check on POS checkout transactions.

---

### 18. SECURE FILE STORAGE & METADATA

Uploaded documents (Supplier Invoices, Customer Files, Employee Docs) MUST:
- Be assigned a random UUID filename upon receipt.
- Be checked for file size limits and MIME types.
- Store metadata (Original Name, MIME, Size, UploadedBy, RelModule) in database.

---

### 19. AUTOMATED TESTING STANDARDS

1. **Unit Tests**: Test pure domain logic, mathematical formulas (GST, Discounts, Payroll deductions).
2. **Integration Tests**: Test API routes with test database.
3. **E2E Tests**: Critical Cashier checkout & Day Close workflows.

---

### 20. ACCEPTANCE CRITERIA FOR EDMS COMPLIANCE

The development foundation is verified complete when:
- [x] All 12 departments follow unified layered architecture.
- [x] API responses match the standardized envelope contract.
- [x] Transactions enforce ACID guarantees across multi-table updates.
- [x] Security controls (WAF, RBAC, Password Hashing) pass validation.
- [x] Audit logs record all state mutations immutably.
- [x] Build pipeline outputs 0 TypeScript errors.
