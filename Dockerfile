# syntax=docker/dockerfile:1
# Production image: Vite client (built) + Express API; SQLite data dir is a mounted volume in K8s.
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci

COPY client ./client
COPY server ./server
RUN npm run build -w client && npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001 -G nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/server ./server
COPY --from=builder --chown=nodejs:nodejs /app/client/dist ./client/dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

RUN mkdir -p /tmp /app/server/data \
  && chown -R nodejs:nodejs /tmp /app/server/data

USER nodejs
EXPOSE 3001
CMD ["node", "server/src/index.js"]
