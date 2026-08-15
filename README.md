# 🛍️ AFREEN MALL — Enterprise POS & Operations Platform

> **Military-Grade, Bank-Secured Point of Sale & Retail ERP System**  
> Engineered for High-Volume Retail Superstores, Hypermarkets, and Multi-Counter Enterprise Malls.

---

![Afreen Mall Security](https://img.shields.io/badge/Security-Military%20%26%20Bank--Grade-10b981?style=for-the-badge&logo=shield)
![Crafted by Gous Organisation](https://img.shields.io/badge/Made%20With-%E2%9D%A4%EF%B8%8F%20by%20Gous%20Organisation-FF1493?style=for-the-badge)
![Architect](https://img.shields.io/badge/Architect-Gous%20Khan-10b981?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/Language-TypeScript%20100%25-3178C6?style=for-the-badge&logo=typescript)
![Frontend](https://img.shields.io/badge/Frontend-Vite%20React%2018-61DAFB?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js%20Express-000000?style=for-the-badge&logo=express)
![ORM](https://img.shields.io/badge/ORM-Prisma%20v5-2D3748?style=for-the-badge&logo=prisma)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)

---

## 📑 Table of Contents
1. [Languages & Technology Stack Breakdown](#-languages--technology-stack-breakdown)
2. [Monorepo Architecture & Directory Structure](#-monorepo-architecture--directory-structure)
3. [Backend Ecosystem & Data Layer (`apps/api`)](#-backend-ecosystem--data-layer-appsapi)
4. [Frontend Ecosystem & Design Engine (`apps/web`)](#-frontend-ecosystem--design-engine-appsweb)
5. [Database Schema & Prisma ORM Architecture](#-database-schema--prisma-orm-architecture)
6. [Seeded Official Staff & Role Directory](#-seeded-official-staff--role-directory)
7. [Comprehensive Feature Catalog (All 14 Modules)](#-comprehensive-feature-catalog-all-14-modules)
   - [Module 1: High-Speed POS Billing & Instant Checkout](#1-high-speed-pos-billing--instant-checkout)
   - [Module 2: Sales History & Order Invoicing](#2-sales-history--order-invoicing)
   - [Module 3: Return & Exchange Management](#3-return--exchange-management)
   - [Module 4: Cash Management & BNA Vault Accounting](#4-cash-management--bna-vault-accounting)
   - [Module 5: Day Close & Shift Handover Reporting (Z-Report)](#5-day-close--shift-handover-reporting-z-report)
   - [Module 6: Inventory & Warehouse Master](#6-inventory--warehouse-master)
   - [Module 7: Procurement, Purchase Orders & GRN (3-Way Matching)](#7-procurement-purchase-orders--grn-3-way-matching)
   - [Module 8: Accounting & Financial Governance (General Ledger, P&L, GST)](#8-accounting--financial-governance-general-ledger-pl-gst)
   - [Module 9: HRMS & Staff Administration](#9-hrms--staff-administration)
   - [Module 10: Customer Relationship Management (CRM) & Loyalty](#10-customer-relationship-management-crm--loyalty)
   - [Module 11: Business Intelligence & Executive Analytics](#11-business-intelligence--executive-analytics)
   - [Module 12: Hardware Integration & Thermal Receipt Printing](#12-hardware-integration--thermal-receipt-printing)
   - [Module 13: Military & Bank-Grade Security Hardening](#13-military--bank-grade-security-hardening)
   - [Module 14: Zero-Mouse Keyboard Operability (WCAG Compliant)](#14-zero-mouse-keyboard-operability-wcag-compliant)
8. [Complete Backend REST API Endpoints Reference](#-complete-backend-rest-api-endpoints-reference)
9. [Keyboard Shortcut Command Matrix](#-keyboard-shortcut-command-matrix)
10. [Installation, Setup & Deployment Guide](#-installation-setup--deployment-guide)
11. [Author & Architecture Credits](#-author--architecture-credits)

---

## 💻 Languages & Technology Stack Breakdown

The Afreen Mall Enterprise Platform is built on a modern, robust, and strictly typed stack designed for high throughput, zero downtime, and bank-grade data integrity:

| Technology Layer | Tool / Framework | Primary Role & Implementation |
|---|---|---|
| **Core Languages** | **TypeScript 5.3+** | 100% end-to-end static typing across frontend, backend, and shared libraries. |
| | **JavaScript (ESM / Node.js)** | Tooling, migration runners, and automated security audit scripts. |
| | **SQL (PostgreSQL DDL/DML)** | Relational database modeling, transactions, ACID consistency, and indexing. |
| | **HTML5 & Vanilla CSS3** | High-performance semantic markup, CSS custom properties, and WCAG accessibility. |
| **Backend Framework** | **Node.js (v20 LTS) + Express.js** | High-throughput asynchronous REST API gateway and business logic micro-modules. |
| **ORM & Database** | **Prisma ORM v5 + PostgreSQL** | Strictly typed relational ORM, migrations, connection pooling, and seed scripts. |
| **Security & Auth** | **JWT + Bcrypt (12 Rounds)** | Ephemeral session tokens, salted password hashing, and brute-force lockouts. |
| **Security WAF** | **Custom SQL Injection Shield** | Deep recursive inspection middleware filtering all incoming HTTP request bodies and queries. |
| **Document Generation** | **PDFKit & ExcelJS** | In-memory generation of thermal receipts, Z-Reports, audit logs, and GST spreadsheets. |
| **Frontend Framework** | **React 18 + Vite 5** | High-speed SPA rendering with zero lag, instant HMR, and component-driven architecture. |
| **Icons & UI Assets** | **Lucide React** | Clean, lightweight vector iconography for all POS and ERP modules. |
| **Monorepo Management** | **NPM Workspaces** | Unified package management coordinating `apps/api`, `apps/web`, and `packages/shared-types`. |
| **Testing Suite** | **Vitest + Supertest** | Automated unit, integration, and security regression testing. |
| **Container & Cloud** | **Docker, Render & Vercel** | Multi-stage Dockerized containerization, Vercel frontend CDN, and Render API hosting. |

---

## 🏛️ Monorepo Architecture & Directory Structure

```mermaid
graph TD
    A[Frontend: Vite + React 18 + TypeScript] -->|REST API + Bearer JWT Auth| B[API Gateway & Express Server]
    B -->|WAF Layer| C[sqlInjectionGuard Middleware]
    C -->|RBAC Guard| D[Role & Session Authenticator]
    D -->|ORM Engine| E[Prisma Client v5]
    E -->|Database| F[(PostgreSQL Database on Render)]
    A -.->|Static Delivery| G[Vercel Global CDN]
```

### Complete Directory Layout:

```
afreen-mall/
├── apps/
│   ├── api/                           # Node.js + Express + TypeScript Backend
│   │   ├── prisma/                    # Prisma schema, migrations, and database seed scripts
│   │   │   ├── schema.prisma          # Relational PostgreSQL models and enums
│   │   │   └── seed.ts                # Database seed data (Super Admin, staff, catalog, store)
│   │   ├── src/
│   │   │   ├── middleware/            # WAF, Authentication, RBAC, and Error Handlers
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rbac.middleware.ts
│   │   │   │   └── sqlInjectionGuard.middleware.ts
│   │   │   ├── modules/               # 17+ Modular Departmental Route Controllers & Services
│   │   │   │   ├── accounting/        # Double-entry ledger, P&L, GST calculations
│   │   │   │   ├── admin/             # System settings, audit logs, backup tools
│   │   │   │   ├── auth/              # Login, token refresh, ephemeral sessions
│   │   │   │   ├── bi/                # Executive BI, forecasting, what-if simulations
│   │   │   │   ├── cash/              # Cash drawers, BNA machine deposits, petty cash
│   │   │   │   ├── catalog/           # Products, categories, brands, HSN codes
│   │   │   │   ├── customers/         # CRM, loyalty rewards, customer khata credit
│   │   │   │   ├── hardware/          # Direct thermal printer and barcode scanner integration
│   │   │   │   ├── hrms/              # Staff directory, attendance, role management
│   │   │   │   ├── inventory/         # Stock levels, adjustments, batch & expiry
│   │   │   │   ├── pos/               # Fast checkout, carts, barcode lookups, returns
│   │   │   │   ├── purchasing/        # Purchase orders, suppliers, GRN 3-way matching
│   │   │   │   ├── reports/           # Day close, Z-reports, PDF/Excel export engines
│   │   │   │   ├── sales/             # Invoice history, payment records, reprint engine
│   │   │   │   ├── suppliers/         # Vendor catalog and debit notes
│   │   │   │   ├── users/             # Staff management, password resets, access toggle
│   │   │   │   └── warehouse/         # Floor transfers and stock audit cycle counts
│   │   │   ├── app.ts                 # Express application configuration & security headers
│   │   │   ├── bootstrap.ts           # Dynamic schema sync & super admin bootstrapper
│   │   │   ├── index.ts               # Server entry point (Port 4000)
│   │   │   └── prisma.ts              # Global Prisma Client instance
│   │   └── package.json
│   │
│   └── web/                           # React 18 + Vite 5 + TypeScript Frontend
│       ├── src/
│       │   ├── components/            # Reusable UI components, modals, guards, tables
│       │   │   ├── SecurityGuard.tsx  # Anti-tamper, right-click, and DevTools blocker
│       │   │   └── ...
│       │   ├── context/               # Global state (Auth, Theme, POS, Cart, Shortcuts)
│       │   ├── hooks/                 # Custom React hooks (IdleTimer, FocusTrap, Hotkeys)
│       │   ├── screens/               # 18 Full-Page Enterprise Screens:
│       │   │   ├── POSScreen.tsx                  # High-speed POS checkout interface
│       │   │   ├── SalesScreen.tsx                # Sales invoice history and reprints
│       │   │   ├── CashReconciliationScreen.tsx  # Cash drawers & BNA vault accounting
│       │   │   ├── DayCloseScreen.tsx             # Z-Report and shift closure
│       │   │   ├── InventoryScreen.tsx            # Live inventory and stock master
│       │   │   ├── PurchasingScreen.tsx           # Purchase Orders & GRN inspection
│       │   │   ├── SupplierScreen.tsx             # Vendor directory & accounts payable
│       │   │   ├── AccountingScreen.tsx           # General ledger, P&L, GST filing
│       │   │   ├── HRMSScreen.tsx                 # Staff administration & roles
│       │   │   ├── CustomersScreen.tsx            # CRM, loyalty points, customer khata
│       │   │   ├── BusinessIntelligenceScreen.tsx # Executive dashboard & simulation
│       │   │   ├── WarehouseScreen.tsx            # Floor transfers & cycle audits
│       │   │   ├── ReportsScreen.tsx              # Analytics, audit logs, PDF/Excel
│       │   │   ├── SystemAdminScreen.tsx          # System settings & user credentials
│       │   │   ├── SettingsScreen.tsx             # Store profile & thermal printer config
│       │   │   ├── LoginScreen.tsx                # Bank-secured login terminal
│       │   │   └── WelcomeScreen.tsx              # Portal launchpad
│       │   ├── styles/                # Vanilla CSS design system & typography tokens
│       │   ├── App.tsx                # Main router, navigation guards, layout wrapper
│       │   └── main.tsx               # React DOM root entry
│       ├── index.html
│       └── package.json
│
├── packages/
│   └── shared-types/                  # Universal TypeScript Interfaces, Enums & DTOs
│       ├── src/
│       │   └── index.ts               # RoleName, SaleType, PaymentMode, POSCartItem, etc.
│       └── package.json
│
├── scripts/                           # Security auditing & testing utilities
│   ├── audit-auth-security.js         # Automated authentication penetration test
│   └── audit-fake-success.js          # Negative testing verification script
├── docker-compose.yml                 # Local containerized PostgreSQL & Redis orchestration
├── package.json                       # Root monorepo workspace coordinator
└── vercel.json                        # Vercel deployment and routing configuration
```

---

## ⚙️ Backend Ecosystem & Data Layer (`apps/api`)

The backend engine is engineered from the ground up to guarantee maximum data reliability, sub-millisecond query responses, and resilient transaction processing:

1. **Modular Route Hierarchy**: Every departmental operation (POS, Inventory, Accounting, HRMS, etc.) is isolated in its own self-contained module containing routes, validation schemas, controllers, and services.
2. **Dynamic Database Bootstrapper (`bootstrap.ts`)**: Automatically checks database connectivity on startup, synchronizes relational tables, verifies seed integrity, and ensures the Super Admin account is permanently available.
3. **OWASP ASVS Standard Security Headers**:
   - `X-Frame-Options: DENY` (Anti-Clickjacking)
   - `X-Content-Type-Options: nosniff` (MIME sniffing prevention)
   - `Content-Security-Policy` (XSS & injection mitigation)
   - `Strict-Transport-Security` (Enforced HTTPS encryption)
4. **WAF SQL Injection Firewall (`sqlInjectionGuard.middleware.ts`)**: Real-time payload sanitization that inspects all URI parameters, JSON bodies, and query strings. Any malicious SQL vectors (`UNION SELECT`, `' 1=1 --`, `DROP TABLE`, `SLEEP()`) are immediately blocked with **HTTP 403 Forbidden**.
5. **Report & Document Generation Engine**: Native server-side generation of invoices, Z-Reports, and financial sheets using `PDFKit` (for thermal and standard PDF receipts) and `ExcelJS` (for multi-tab accounting workbooks) without requiring third-party cloud SaaS dependencies.

---

## 🎨 Frontend Ecosystem & Design Engine (`apps/web`)

The frontend delivers a fast, desktop-grade user experience crafted specifically for high-speed retail checkout environments:

1. **Zero-Latency State Management**: Custom React contexts handle instant barcode input, cart additions, GST recalculations, and tender splits without frame drops or UI lag.
2. **Keyboard-First Focus Engine**: Complete zero-mouse operability. Every action from product lookup to tender confirmation is accessible through ergonomic `F1`-`F12` hotkeys.
3. **WCAG 2.1 Focus Indicator & Trap**: High-visibility emerald outlines (`outline: 2px solid var(--accent-lime)`) and modal focus traps prevent focus loss during fast cashier operations.
4. **Client-Side Anti-Tampering Shield (`SecurityGuard.tsx`)**:
   - Disables right-click context menus.
   - Intercepts DevTools hotkeys (`F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C`, `Ctrl+U`, `Ctrl+S`).
   - Suppresses client-side console logging in production environments.
5. **Ephemeral Security Model**: Session credentials are kept exclusively in `sessionStorage`. Closing the browser window or tab immediately clears all tokens and destroys the active session.

---

## 🗄️ Database Schema & Prisma ORM Architecture

The PostgreSQL schema is managed via **Prisma ORM v5** with full relational integrity, foreign key constraints, and automatic timestamps:

```mermaid
erDiagram
    STORE ||--o{ USER : employs
    USER ||--o{ SESSION : creates
    USER ||--o{ AUDIT_LOG : logs
    USER ||--o{ SALE : processes
    CATEGORY ||--o{ SUBCATEGORY : contains
    SUBCATEGORY ||--o{ PRODUCT : categorizes
    PRODUCT ||--o{ INVENTORY : tracks
    PRODUCT ||--o{ SALE_ITEM : includes
    SALE ||--o{ SALE_ITEM : contains
    SALE ||--o{ SALE_RETURN : generates
    SUPPLIER ||--o{ PURCHASE_ORDER : receives
    PURCHASE_ORDER ||--o{ PO_ITEM : contains
    PURCHASE_ORDER ||--o{ GRN : fulfills
    CUSTOMER ||--o{ SALE : purchases
    CUSTOMER ||--o{ LOYALTY_TRANSACTION : accrues
    ACCOUNT ||--o{ JOURNAL_ENTRY : records
```

### Key Relational Models in Schema:
- **`User` & `Session`**: 20 distinct enterprise roles, password hashes, brute-force counters, lockout timers, and session tokens.
- **`AuditLog`**: Immutable audit logs capturing Staff ID, username, role, entity modified, old/new JSON payloads, and reasons.
- **`Store` & `SystemSetting`**: Store profile, GSTIN, legal address, contact numbers, and platform configurations.
- **`Category`, `SubCategory`, `Brand`, `Product`**: Multi-tier catalog with EAN-13/UPC barcodes, HSN codes, tax slabs, and MRP rates.
- **`Inventory` & `StockMovement`**: Live multi-counter stock quantities, batch numbers, expiry dates, and movement logs.
- **`Sale`, `SaleItem`, `Payment`**: Invoice numbering, item rates, discounts, CGST/SGST/IGST breakdown, and tender splits.
- **`SaleReturn` & `ReturnItem`**: Return tracking with manager authorization guards and inventory auto-restock.
- **`CashRegister`, `Shift`, `CashFlow`, `BNADeposit`**: Cash drawer sessions, physical denomination breakdowns, and BNA vault deposits.
- **`Supplier`, `PurchaseOrder`, `POItem`, `GRN`, `GRNItem`**: 3-way procurement matching, landed costs, and debit notes.
- **`Account`, `JournalEntry`**: Double-entry general ledger, chart of accounts, and financial journal vouchers.
- **`Customer`, `LoyaltyTransaction`**: Phone lookup, customer tiers (VIP, Regular, Wholesale), and Khata store credit.

---

## 👥 Seeded Official Staff & Role Directory

The system provides 20 granular role-based access levels. Seeded accounts can be initialized and managed securely via environment variables:

> [!NOTE]
> Initial account passwords for seeded staff and Super Admin are configured securely via environment variables (`INITIAL_SUPER_ADMIN_PASSWORD` and `INITIAL_STAFF_PASSWORD`) in `apps/api/.env`.

### 🏢 Department Role Directory & Access Scope
| Staff ID | Username | Role Name | Department & Responsibility | Access Scope |
|---|---|---|---|---|
| `300000` | `Superkhan` | `SUPER_ADMIN` | Executive Leadership & System Administration | Full unrestricted access to all 14 modules, staff password reset, role assignment, audit logs, and system config. |
| `300001` | `manager1` | `STORE_MANAGER` | Store Management | Store operations, discounts, staff reactivation, supervisor overrides |
| `300002` | `cashofficer1` | `CASH_OFFICER` | Treasury & Vault Operations | BNA vault accounting, cash reconciliations, safe drops, bill recovery |
| `300003` | `accountant1` | `ACCOUNTANT` | Accounts & Finance | Double-entry ledger, P&L statements, GST R1/3B tax reports |
| `300004` | `inventory1` | `INVENTORY_STAFF` | Inventory Management | Stock catalog, batch tracking, expiry monitoring, low-stock reorders |
| `300005` | `warehouse1` | `WAREHOUSE_STAFF` | Warehouse & Logistics | Floor transfers, GRN receiving, physical stock audits |
| `300006` | `purchase1` | `PURCHASE_TEAM` | Procurement & Supply Chain | Vendor directory, Purchase Orders, 3-way GRN matching |
| `300007` | `auditor1` | `AUDITOR` | Internal Audit & Compliance | Read-only compliance auditing, immutable audit log verification |
| `300008` | `hr1` | `HR_MANAGER` | Human Resources & Personnel | Staff onboarding, attendance tracking, shift scheduling |
| `300009` | `sales1` | `SALES_MANAGER` | Sales Operations | Sales analytics, cashier performance metrics, customer relations |
| `300010` | `crm1` | `CRM_MANAGER` | Customer Loyalty & CRM | Loyalty programs, VIP tiers, customer Khata credit ledgers |
| `300011-300015` | `cashier1-5` | `CASHIER` | Front Counter POS | High-speed POS billing, barcode scanning, cash/card/UPI checkout |

---

## 🌟 Comprehensive Feature Catalog (All 14 Modules)

### 1. High-Speed POS Billing & Instant Checkout
- **Lightning-Fast Barcode Scanning**: Sub-millisecond item lookup by EAN-13, UPC, SKU, or Product Name.
- **Multi-Sale Type Support (`F2`)**: One-touch switching between **Retail Sale**, **Wholesale Billing**, and **Institutional Supply**.
- **Instant Item Repetition (`F3`)**: Quick increments of the last scanned item without re-scanning.
- **Dynamic GST Engine**: Automatic split and computation of CGST, SGST, IGST across 0%, 5%, 12%, 18%, and 28% slabs with HSN tracking.
- **Zero Price Prevention Guard**: Items with `₹0.00` price cannot be added to the cart; triggers an alert prompting price configuration in inventory master.
- **Unregistered Barcode Alert**: Uncataloged barcodes prompt an immediate red alert modal (*"Barcode not found in store catalog"*).
- **Cart Deletion Safeguard (1-Item Minimum)**: Individual items can be removed down to 1 item. The last item requires clicking **Cancel Bill** to confirm full cart reset.
- **Multi-Mode Payment Terminal**:
  - 💵 **Cash**: Interactive change calculator with instant tender return calculation.
  - 💳 **Card / EDC**: Bank transaction code capture and slip reconciliation.
  - 📱 **UPI QR (`F7`)**: Instant dynamic UPI QR code generator for direct mobile payments.
  - 🔀 **Split Tender**: Combine Cash + UPI + Card on a single transaction invoice.
- **Active Cart Session Lock Guard**: Prevents accidental tab close or page navigation while an active bill is in progress (`beforeunload` protection).
- **POS Terminal Auto-Feed**: Interactive `[ POS-01 ]` counter badge in top header allowing switching between counters (`POS-01`, `POS-02`, `POS-03`).
- **Automated Thermal Auto-Print**: Automatically sends print command (`window.print()`) 400ms after payment confirmation.

---

### 2. Sales History & Order Invoicing
- **Centralized Invoice Repository**: Real-time searchable history of all completed, held, and refunded sales transactions.
- **Multi-Parameter Search**: Instant filtering by Invoice Number, Date Range, Counter ID, Cashier Staff ID, Customer Mobile, or Payment Mode.
- **Detailed Invoice Inspection**: Full breakdown of line items, itemized GST amounts, applied discounts, customer loyalty points earned, and payment breakdown.
- **Thermal & Standard Reprint**: One-click thermal receipt reprint or standard A4 invoice generation.
- **Transaction Void & Cancellation**: Strict supervisor-governed bill cancellation with mandatory reason capture and inventory reversal.

---

### 3. Return & Exchange Management
- **Dedicated Sale Return Mode (`Alt + F11`)**: Switch POS terminal into item return and refund processing mode.
- **Cashier Return Access Guard (`canProcessSaleReturn`)**: By default, Cashiers are restricted to sales only. Attempting returns without authorization shows a permission error requiring Manager override.
- **Original Invoice Verification**: Validates invoice number, original purchase date, and return quantity against sold quantity.
- **Automated Inventory Restocking**: Returned products automatically restock into available floor inventory.
- **Credit Note & Cash Refund Management**: Supports credit notes, exchange against new cart items, or cash refund disbursement.

---

### 4. Cash Management & BNA Vault Accounting
- **Cash In / Cash Out Petty Cash Engine**: Log daily petty expenses (tea, cleaning, maintenance, transport) with approval reasons.
- **BNA (Bulk Note Acceptor) Machine Deposit Accounting**:
  - **Accounting Formula**: `Total Cash Sales = Counter Notes Cash + BNA Machine Cash`.
  - Cash deposited into in-store BNA machines is strictly categorized under **CASH** (never mixed into Card or UPI).
- **Physical Denomination Counter**: Full breakdown inputs for ₹2000, ₹500, ₹200, ₹100, ₹50, ₹20, ₹10, ₹5, ₹2, ₹1 notes & coins.
- **Cash Variance Detection**: Automatic calculation of **MATCHED**, **SHORT**, or **EXCESS** cash positions on every shift handover.
- **Safe Drop Records**: Transfer excess counter cash to the main vault during peak trading hours.

---

### 5. Day Close & Shift Handover Reporting (Z-Report)
- **End-of-Day Z-Report**: Complete shift breakdown including Gross Sales, Net Sales, Tax Collection, Returns, and Net Cash Position.
- **Tender-Wise Reconciliation**: Side-by-side reconciliation of Cash vs Card vs UPI vs BNA Machine deposits.
- **Supervisor Sign-Off**: Mandatory digital sign-off by Cash Officer or Store Manager before register closure.
- **Audit Export**: Instant PDF and Excel export for store accounting and tax filing.

---

### 6. Inventory & Warehouse Master
- **SKU & Barcode Management**: Create and track products with barcodes, HSN codes, category, brand, and unit metrics (PCS, KG, LTR).
- **Real-Time Stock Depletion**: Every POS sale instantly updates live stock quantities across counters.
- **Batch & Expiry Date Tracking**: Automated warnings for near-expiry products and FIFO stock management.
- **Low Stock & Reorder Triggers**: Automatic reorder level alerts when stock drops below threshold.
- **Warehouse Floor Transfers**: Multi-stage transfer workflow between Main Warehouse and Retail Floor counters.
- **Physical Stock Audit (Stock Taking)**: Cycle counting with discrepancy reporting and audit logging.

---

### 7. Procurement, Purchase Orders & GRN (3-Way Matching)
- **Supplier / Vendor Master**: Complete vendor directory with GSTIN, PAN, payment terms, and contact profiles.
- **Purchase Order (PO) Engine**: Multi-tier PO creation (`DRAFT` → `SUBMITTED` → `APPROVED` → `RECEIVED` → `COMPLETED`).
- **Goods Receipt Note (GRN) Inspection**: 3-way matching between PO, Delivery Challan, and Physical Stock count.
- **Landed Cost & Tax Calculation**: Auto-calculate landed cost per unit including freight, insurance, and GST input tax credit (ITC).
- **Purchase Return & Debit Notes**: Return damaged or defective goods directly to vendors with automated debit note generation.

---

### 8. Accounting & Financial Governance (General Ledger, P&L, GST)
- **Double-Entry General Ledger**: Auto-posted journal entries for sales, purchases, cash transfers, expenses, and returns.
- **Accounts Receivable (AR) & Accounts Payable (AP)**: Track credit sales to institutional clients and pending vendor bills.
- **GST R1 & 3B Tax Liability Engine**: Automated monthly and quarterly GST liability summaries.
- **Profit & Loss (P&L) Statement**: Real-time Gross Margin and Net Margin calculation.
- **Daily Cash Flow Tracker**: Inflow vs outflow monitoring across cash drawers, bank accounts, and BNA machines.

---

### 9. HRMS & Staff Administration
- **Staff Directory & 6-Digit ID System**: Centralized directory with auto-generated 6-digit staff IDs (`300000+`).
- **Super Admin Staff Password Management**:
  - Super Admin can reset or change the password of any staff member from the User Management panel.
  - Dedicated endpoint `POST /api/v1/admin/users/:id/reset-password`.
- **7-Day Inactivity Auto-Deactivation**: Staff accounts with no login activity for 7 consecutive days are automatically suspended.
- **Manager Reactivation Switch ("Turn ON")**: Store Managers and Super Admins can restore suspended accounts with one click.
- **Cashier Return Access Delegation**: Toggle `canProcessSaleReturn` per cashier individually.

---

### 10. Customer Relationship Management (CRM) & Loyalty
- **Customer Phone Lookup**: Sub-second customer profile retrieval at POS by 10-digit mobile number.
- **Loyalty Points Engine**: Automated point accrual per ₹100 spent with one-touch POS redemption.
- **Tiered Customer Classification**: Auto-tagging of **VIP**, **Regular**, **Wholesale**, and **Institutional** buyers.
- **Khata / Store Credit Ledger**: Digital credit ledger for regular customers with payment reminders.

---

### 11. Business Intelligence & Executive Analytics
- **Executive Real-Time KPI Dashboard**: Live sales, gross margin, net profit, transactions count, and average basket value.
- **Role Perspective Filters**: Switch dashboard view between **Executive / Owner**, **CFO / Finance**, **COO / Operations**, and **Store Manager**.
- **What-If Simulation Engine**: Interactive forecasting simulating the financial impact of price changes, discount variations, footfall shifts, and supplier cost fluctuations.
- **Departmental Scorecards**: Performance scorecards across Sales, Inventory, Cashier Efficiency, and Customer Retention.
- **AI-Powered Operational Insights**: Automated detection of dead stock, peak sales hours, fast-moving items, and cash anomalies.

---

### 12. Hardware Integration & Thermal Receipt Printing
- **Direct Thermal Receipt Printer (ESC/POS)**: Native support for 58mm and 80mm thermal receipt printers with zero print dialog delays.
- **Barcode Scanner Wedge Support**: Native listening mode for USB and Bluetooth 1D/2D barcode guns with auto-carriage return detection.
- **Electronic Cash Drawer Kick Pulse**: Sends standard 24V RJ12 cash drawer open command automatically upon cash bill confirmation.
- **Digital Weighing Scale Protocol**: Automatic reading of tare and gross weights for bulk loose commodities (fruits, vegetables, grains).

---

### 13. Military & Bank-Grade Security Hardening
- **WAF SQL Injection Firewall (`sqlInjectionGuard.middleware.ts`)**: Global Web Application Firewall inspecting all HTTP bodies, queries, and params. Malicious SQL payloads (`' 1=1 --`, `UNION SELECT`, `; DROP`) are intercepted with **HTTP 403 Forbidden**.
- **Frontend Anti-Tampering Shield (`SecurityGuard.tsx`)**:
  - Right-click context menus strictly disabled.
  - Developer Tools shortcuts (`F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C`, `Ctrl+U`, `Ctrl+S`) blocked.
  - Production console logging suppressed.
- **Strict Ephemeral Session Architecture**:
  - All JWT tokens are stored in `sessionStorage` (no persistent `localStorage`).
  - Closing the browser tab or window **instantly destroys the session**.
- **15-Minute Inactivity Auto-Logout Watchdog (`useIdleTimer.ts`)**: Automatically logs out idle sessions after 15 minutes without activity.
- **Brute-Force Account Lockout**: 5 failed login attempts trigger an automatic 15-minute account lockout and IP rate limiter block.
- **Manual Bill Recovery (`Shift + F8`)**: Allows Cash Officers to recover failed print bills using bank transaction IDs with live duplicate prevention.
- **Authorized Duplicate Copy Print (`Ctrl + F5`)**: Prints with prominent watermark `*** DUPLICATE COPY *** (NOT AN ORIGINAL RECEIPT)` and logs reprint count to immutable audit logs.
- **Immutable Audit Trail (`AuditLog`)**: Comprehensive logging of user, role, action, entity, before/after values, and justification reasons.

---

### 14. Zero-Mouse Keyboard Operability (WCAG Compliant)
- **100% Keyboard Operable**: Cashiers can perform complete billing, item search, quantity adjustments, tender selection, and printing without touching a mouse.
- **Centralized Shortcut Registry (`shortcutRegistry.ts`)**: Collision-free shortcut engine avoiding browser-reserved keys.
- **WCAG 2.4.7 Focus Indicator**: High-contrast 3:1 emerald outline (`outline: 2px solid var(--accent-lime)`) across all active inputs, buttons, and rows.
- **WCAG 2.1.2 Modal Focus Trap (`useFocusTrap.ts`)**: Traps `Tab` / `Shift + Tab` cycling within open modals and restores focus upon modal close.
- **Full Numeric Keypad Support**: Complete support for `NumpadEnter` and `NumpadDecimal`.

---

## 📡 Complete Backend REST API Endpoints Reference

| Module | Route Prefix | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|---|
| **Healthcheck** | `/health` | `GET` | `/health` | Server health & timestamp check | No |
| **Auth** | `/api/v1/auth` | `POST` | `/login` | Staff credential authentication & JWT issue | No |
| | | `POST` | `/refresh` | Ephemeral session token refresh | Bearer Token |
| | | `POST` | `/logout` | Session invalidation and revocation | Bearer Token |
| **Users & HRMS** | `/api/v1/users` | `GET` | `/` | List all staff members and role statuses | Bearer Token |
| | | `POST` | `/` | Create new staff profile (Auto 6-digit ID) | Super Admin / Store Manager |
| | | `PATCH` | `/:id/status` | Reactivate or suspend staff account | Super Admin / Store Manager |
| | | `PATCH` | `/:id/permissions` | Toggle `canProcessSaleReturn` access | Store Manager |
| **Admin** | `/api/v1/admin` | `POST` | `/users/:id/reset-password` | Super Admin staff password override | Super Admin |
| | | `GET` | `/audit-logs` | Fetch immutable audit trail with filters | Super Admin / Auditor |
| | | `GET` | `/settings` | Retrieve store configuration & GSTIN | Bearer Token |
| **POS** | `/api/v1/pos` | `GET` | `/products/search` | Fast product lookup by barcode/SKU | Cashier / Staff |
| | | `POST` | `/checkout` | Create sale invoice and deduct inventory | Cashier / Staff |
| | | `POST` | `/returns` | Process item return and generate credit | Manager Guarded |
| | | `GET` | `/recover-bill` | Manual bill recovery via Bank Txn ID | Cash Officer |
| **Cash Management** | `/api/v1/cash` | `POST` | `/shift/open` | Open register shift & starting float | Cashier / Cash Officer |
| | | `POST` | `/shift/close` | Submit shift handover & denominations | Cashier / Cash Officer |
| | | `POST` | `/bna/deposit` | Record BNA machine cash vault deposit | Cash Officer |
| | | `POST` | `/petty-cash` | Record Cash-In or Cash-Out expense | Cashier / Manager |
| **Inventory** | `/api/v1/inventory`| `GET` | `/` | List live stock levels across counters | Staff |
| | | `POST` | `/adjust` | Stock adjustment with audit justification | Inventory Manager |
| | | `GET` | `/low-stock` | Low stock threshold trigger alerts | Inventory Staff |
| **Purchasing** | `/api/v1/purchasing` | `GET` | `/orders` | List Purchase Orders (PO) | Purchase Team |
| | | `POST` | `/orders` | Create new draft Purchase Order | Purchase Team |
| | | `POST` | `/grn` | Submit Goods Receipt Note (3-way match) | Inventory / Warehouse |
| **Accounting** | `/api/v1/accounting`| `GET` | `/ledger` | View General Ledger accounts & journals | Accountant / Finance |
| | | `GET` | `/profit-loss` | Compute real-time P&L Statement | Finance Manager |
| | | `GET` | `/gst-report` | Generate GSTR-1 and GSTR-3B summaries | Accountant |
| **BI & Analytics** | `/api/v1/bi` | `GET` | `/executive-kpi` | Real-time KPI cards & margins | Executive / Management |
| | | `POST` | `/simulate` | What-If price/cost simulation engine | Executive / COO |
| **Reports** | `/api/v1/reports` | `GET` | `/day-close/export/pdf` | Export Z-Report to formatted PDF | Cash Officer / Manager |
| | | `GET` | `/sales/export/excel` | Export sales report to Excel workbook | Accountant / Auditor |

---

## ⌨️ Keyboard Shortcut Command Matrix

| Shortcut | Action | Scope | Description |
|---|---|---|---|
| **`F1`** | **Help Legend** | Global POS | Opens full keyboard shortcut guide modal. |
| **`F2`** | **Sale Type Switch** | POS Cart | Cycles between Retail, Wholesale, and Institutional. |
| **`F3`** | **Repeat Last Item** | POS Cart | Instantly increments quantity of the last scanned product. |
| **`F4`** | **Apply Line Discount** | POS Cart | Focuses discount percentage input for current row. |
| **`F7`** | **Instant UPI Payment** | Checkout | Launches dynamic UPI QR code generator modal. |
| **`F8`** | **Card / EDC Payment** | Checkout | Activates Card payment input and Bank Auth code capture. |
| **`F9`** | **Split Payment Tender** | Checkout | Launches multi-tender split window (Cash + Card + UPI). |
| **`F10`** | **Quick Cash Checkout** | Checkout | Confirms full cash payment and triggers thermal receipt print. |
| **`Shift + F8`** | **Manual Bill Recovery** | Supervisor | Recovers bill from successful bank EDC/UPI transaction ID. |
| **`Ctrl + F5`** | **Print Duplicate Bill** | Supervisor | Generates watermarked Duplicate Copy with audit logging. |
| **`Alt + F11`** | **Sale Return Mode** | POS Screen | Toggles between Sale Mode and Return Mode (Role Guarded). |
| **`Escape`** | **Close / Dismiss** | Modals | Closes active modals and returns focus to barcode input. |
| **`Ctrl + S`** | **Hold / Park Bill** | POS Cart | Temporarily parks the active bill for queue management. |

---

## 🚀 Installation, Setup & Deployment Guide

### Prerequisites
- **Node.js**: Version `20.x LTS` or higher
- **NPM**: Version `9.x` or higher
- **PostgreSQL**: Version `14.x` or higher (Local instance or Cloud PostgreSQL on Render / Neon)

---

### Step 1: Clone Repository & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Khangulamgousamjat/Afreen-Mall.git
cd "afreen mall software"

# Install all monorepo dependencies (Frontend + Backend + Shared Types)
npm install
```

---

### Step 2: Configure Environment Variables
Create `.env` in `apps/api/` and `.env.local` in `apps/web/`:

#### Backend Configuration (`apps/api/.env`):
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/afreen_mall?schema=public"
JWT_SECRET="afreen_mall_super_secure_jwt_secret_key_2026_x99"
JWT_REFRESH_SECRET="afreen_mall_super_secure_refresh_token_secret_key_2026_z88"
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000,https://afreen-mall.vercel.app"
INITIAL_SUPER_ADMIN_PASSWORD="Kingkhan@12"
INITIAL_STAFF_PASSWORD="Pass@123"
```

#### Frontend Configuration (`apps/web/.env.local`):
```env
VITE_API_URL="http://localhost:4000"
VITE_API_BASE_URL="http://localhost:4000/api/v1"
```

---

### Step 3: Initialize Database Schema & Seed Data
```bash
# Generate Prisma Client
npm run postinstall

# Run database migrations
npm run db:migrate

# Seed official staff accounts, store master, and product catalog
npm run db:seed
```

---

### Step 4: Run Development Environment
```bash
# Concurrently launch Backend (Port 4000) and Frontend (Port 5173)
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API Gateway**: `http://localhost:4000`
- **API Healthcheck**: `http://localhost:4000/health`

---

### Step 5: Production Deployment

#### Backend Deployment (Render):
- Build Command: `npm run build --workspace=packages/shared-types && npm run build --workspace=apps/api`
- Start Command: `npm run start:render`

#### Frontend Deployment (Vercel):
- Framework Preset: **Vite**
- Root Directory: `apps/web`
- Build Command: `npm run build`
- Output Directory: `dist`

---

## 👨‍💻 Author & Architecture Credits

<div align="center">

### 💎 Crafted with Passion by **Gous Organisation**

*Chief Software Architect & Full-Stack Lead: **Gous Khan***  
*Enterprise Platform Architecture · Afreen Mall Operations Systems*

📞 **Mobile**: `+91 8625076618`  
✉️ **Email**: `gousk2004@gmail.com`

![Made with Love](https://img.shields.io/badge/Crafted%20With-%E2%9D%A4%EF%B8%8F%20by%20Gous%20Organisation-FF1493?style=for-the-badge)

</div>
