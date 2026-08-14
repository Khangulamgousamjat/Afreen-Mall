FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY packages/shared-types ./packages/shared-types
COPY apps/web ./apps/web

RUN npm install
RUN npm run build --workspace=packages/shared-types
RUN cd apps/web && npm run build

FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
