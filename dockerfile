# ---------- build (install + compile) ----------
FROM node:22-bookworm-slim AS build
WORKDIR /repo

# Needed for native deps like better-sqlite3 (and some tooling)
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Copy manifests first for caching
COPY package.json package-lock.json ./
COPY shared/package*.json shared/
COPY client/package*.json client/
COPY server/package*.json server/

# Install all deps (including dev deps) for build.
# NOTE: `npm ci` installs devDependencies by default; `--include=dev` is not supported on some npm versions.
RUN npm ci

# Copy source
COPY . .

# Build in the same order as your root contract: shared -> client -> server
RUN npm run build

# Copy client build into where the server will serve static assets from
RUN mkdir -p server/dist/public \
  && cp -R client/dist/. server/dist/public/

# Prune to production deps for runtime (keeps native addon binaries built for this image)
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
