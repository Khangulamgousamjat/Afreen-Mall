# Architectural and Design Decisions (DECISIONS.md)

## Decisions Record

### 1. Monorepo vs Polyrepo
- **Decision**: Monorepo using npm workspaces.
- **Rationale**: Keeps frontend, backend, and shared typescript types in a single repository for easier development and deployment via Docker Compose.
- **Date**: 2026-07-24

### 2. Database Choice & ORM
- **Decision**: PostgreSQL + Prisma ORM.
- **Rationale**: Prisma offers great type-safety, automatic migrations, and maps easily to Postgres.
- **Date**: 2026-07-24

### 3. CSS Choice
- **Decision**: Vanilla CSS with custom properties (CSS variables).
- **Rationale**: Speeds up compilation, adheres exactly to the custom tokens specified in Section 4, and avoids adding third-party CSS build complexities.
- **Date**: 2026-07-24

### 4. Auth Storage on Client
- **Decision**: JWT tokens stored in-memory (Access token) and HttpOnly Cookies (Refresh token).
- **Rationale**: Maximizes security by preventing XSS access to tokens.
- **Date**: 2026-07-24
