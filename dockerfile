FROM node:22-alpine AS deps
WORKDIR /repo
COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/
COPY shared/package*.json shared/
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN npm run -w server build
RUN npm run -w client build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY server/package*.json server/
COPY shared/package*.json shared/
RUN npm ci --omit=dev -w server

COPY --from=build /repo/server/dist ./dist
COPY --from=build /repo/client/dist ./client_dist

ENV PORT=8080
ENV CLIENT_DIST_DIR=/app/client_dist
EXPOSE 8080
CMD ["node", "dist/server.js"]
