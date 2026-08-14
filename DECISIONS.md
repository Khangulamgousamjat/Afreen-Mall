# Decisions Log — Afreen Mall Internal Operations Platform

### 1. Monorepo Architecture & Package Management
- **Decision**: npm Workspaces monorepo layout containing `/apps/api`, `/apps/web`, and `/packages/shared-types`.
- **Rationale**: Keeps DTOs, interfaces, and enums synchronized across backend and frontend without duplicating code or risk of payload drift.

### 2. Database & Schema Strategy (Prisma + PostgreSQL)
- **Decision**: All financial figures are strictly represented as 64-bit integers in **paise** (1 INR = 100 Paise).
- **Rationale**: Eliminates floating-point rounding errors during multi-item tax computations, discount percentages, and cash denomination variance calculations.

### 3. Authentication & Account Lockout
- **Decision**: Staff IDs are auto-sequenced starting at **300000**. Accounts are locked for 15 minutes after 5 consecutive failed login attempts. Changing passwords revokes active JWT sessions.
- **Rationale**: Enforces high security standards in retail operations where staff credentials could be targeted.

### 4. IPC-Free Desktop Readiness (Electron / Tauri)
- **Decision**: Built clean abstractions for hardware layer (`BarcodeScannerService`, `EDCTerminalService`, `UPIPaymentService`, `ThermalPrinterService`) and API client layer.
- **Rationale**: Ensures the application can be packaged into Electron or Tauri without modifying core React UI code.

### 5. Design System & Typography
- **Decision**: Times New Roman (`"Times New Roman", Times, serif`) typography stack across all screens, `tabular-nums` formatting on numeric data, flat 1px border cards, and signature notched **shelf-tag gauge bars**. Exact palette tokens (`#171717`, `#E4FD97`, `#004741`, `#F0EDE4`).
- **Rationale**: Provides high contrast, fast legibility, and professional retail workstation aesthetics.
