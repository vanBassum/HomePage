# ---------- build (install + compile) ----------
FROM node:22-bookworm-slim AS build
WORKDIR /repo

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY shared/package*.json shared/
COPY client/package*.json client/
COPY server/package*.json server/

RUN npm install -g npm@11.7.0
RUN npm ci --include=optional

COPY . .
RUN npm run build

RUN mkdir -p server/dist/public \
  && cp -R client/dist/. server/dist/public/

RUN npm prune --omit=dev --workspaces

# ---------- runtime ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV DATA_DIR=/data

# Create data dir and run as non-root
RUN mkdir -p /data && chown -R node:node /data

# Copy only what is needed at runtime
COPY --from=build /repo/package.json /repo/package-lock.json ./
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/server/dist ./server/dist
COPY --from=build /repo/server/package*.json ./server/
COPY --from=build /repo/shared/package*.json ./shared/

USER node

VOLUME ["/data"]
EXPOSE 8080

CMD ["node", "server/dist/server.js"]
