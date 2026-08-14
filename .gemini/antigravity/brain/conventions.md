# Coding and Naming Conventions

## General Rules
- Use TypeScript strictly. No `any` type allowed.
- Format files with Prettier/ESLint rules.
- Maintain documentation and JSDoc comments for all exported functions and classes.

## Backend (NestJS) Conventions
- One NestJS module per screen/business module (e.g., `AuthModule`, `POSModule`, `InventoryModule`, `ReconciliationModule`).
- Service classes hold business logic; Controllers handle request/response schema.
- DTO (Data Transfer Object) classes must validate input using `class-validator`.

## Frontend (React) Conventions
- Components stored in `apps/web/src/components`.
- Screens/pages in `apps/web/src/pages`.
- CSS custom properties must be used for layout colors and styling, as specified in the design tokens.
- Hook functions are used for logic extraction (e.g., `usePOS`, `useAuth`).

## Database Conventions
- Table names in `snake_case` (pluralized or as defined in Section 8).
- Column names in `snake_case`.
- Money fields are integers representing paise (e.g., 100 paise = 1 INR).
