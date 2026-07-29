# Tech Stack - Afreen Mall Internal Operations Platform

## Selected Technologies
- **Frontend Framework**: React + TypeScript + Vite. Selected for high performance, ease of wrapping in Electron/Tauri, and excellent developer experience.
- **Backend Framework**: Node.js with NestJS. Module-based architecture mirrors business modules cleanly.
- **Database**: PostgreSQL with Prisma ORM. Strong relational guarantees, transaction support, and developer-friendly migrations.
- **Cache / Store**: Redis. Fast token blacklisting and session state storage.
- **Styling**: Vanilla CSS (custom properties as defined in Section 4 of spec).
- **Containerization**: Docker Compose for orchestrating API, web, postgres, and redis services.
