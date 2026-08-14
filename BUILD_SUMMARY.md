# Build Summary — Afreen Mall Internal Operations Platform

A complete, production-grade retail management system built for supermarket day-to-day internal operations.

---

## 1. Quick Start (Running Stack via Docker Compose)

```bash
# Bring up PostgreSQL, Redis, API, and Web frontend
docker-compose up --build
```

- **Frontend Application**: `http://localhost:3000` (or `http://localhost:80`)
- **Backend API**: `http://localhost:4000/api/v1`
- **Database Seed Credentials**:
  - **Super Admin Staff ID / Username**: `300000` / `Superkhan`
  - **Password**: `Kingkhan@12`
  - **Standard Staff Accounts**: `300001` (manager1), `300002` (accountant1), `300003` (cashier1)
  - **Default Password for New Accounts**: `Pass@123` (forces password change on first login)

---

## 2. Key Modules Implemented

1. **Welcome Screen**: Store branding, short tagline, "Staff Login" button, light/dark theme toggle.
2. **Login Screen**: 6-digit Staff ID + password, account lockout message on 5 failed attempts.
3. **Dashboard**: Live financial KPIs, 7-day sales trend, low-stock table with shelf-tag gauge bars, recent transactions log.
4. **POS / Billing**: Barcode auto-focus (resets on Enter press anywhere on invoice), last scanned item block, running totals, footer credit line (*"Software by Gous Khan · Mobile: 8625076618 · gousk2004@gmail.com"*), split payment capture (Cash, Card, UPI), full-screen UPI QR & Card overlays, F1-F10 shortcuts + F1 help overlay.
5. **Day Close**: Cashier end-of-shift screen supporting both **Manual Note-by-Note Count** (₹2000 down to ₹1) and **BNA Machine Auto-Count & Slip Deposit** (inserts cash into BNA machine, scans/reads printed deposit receipt slip, auto-populates total cash, and computes live variance against system cash sales). Supports Close Sale & Close Sale Return.
6. **Cash Reconciliation**:
   - Cash Officer view (matched/short/excess status per POS register).
   - Manager Cash Collection report form (POS #, Cash Officer, note breakdown, BNA deposit, final variance).
   - Accountant Approval Banner for daily consolidated close.
   - Manager/Accountant/Super Admin Override edit modal with mandatory reason & audit logging.
7. **Inventory**: Product catalogue, category filter, notched shelf-tag gauge bars (Red/Amber/Green), stock adjustment modal with audit logging.
8. **Purchasing**: Purchase Requests, Purchase Orders, Goods Receipt Notes (GRN) with DB transaction inventory increments.
9. **Warehouse**: Rack & Bin location tracking, stock transfer orders.
10. **Customers**: Shopper loyalty points lookup directory. (Strictly zero customer auth).
11. **Reports**: Daily/Monthly sales, GST summary (CGST/SGST/IGST), inventory valuation, audit logs.
12. **Settings**: Store profile, Users & Roles management (**Super Admin exclusive access**, auto 6-digit Staff IDs starting 300000, one-time temporary password reveal modal).
