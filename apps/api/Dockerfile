FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api

RUN npm install
RUN npm run build --workspace=packages/shared-types
RUN cd apps/api && npx prisma generate && npm run build

EXPOSE 4000
CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ]; then npx prisma migrate deploy; else echo 'WARNING: DATABASE_URL is not set in environment variables'; fi && npm run start --workspace=apps/api"]
