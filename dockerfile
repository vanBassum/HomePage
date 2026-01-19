# ---------- build (install + compile) ----------
FROM node:22-bookworm-slim AS build
WORKDIR /repo

# Toolchain for native addons (e.g., better-sqlite3) and build tooling
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Copy manifests first for layer caching
COPY package.json package-lock.json ./
COPY shared/package*.json shared/
COPY client/package*.json client/
COPY server/package*.json server/

# Use a newer npm
RUN npm install -g npm@11.7.0

# Ensure optional deps are not omitted (Rollup native packages are optional deps)
ENV NPM_CONFIG_INCLUDE=optional
ENV NPM_CONFIG_OMIT=

# IMPORTANT:
# Use `npm install` instead of `npm ci` to allow npm to resolve/install
# platform-specific optional deps correctly inside the Linux builder.
RUN npm install --workspaces --include-workspace-root --no-audit --no-fund

# Copy the rest of the repo and build
COPY . .
RUN npm run build

# Place the client build where the server serves static assets
RUN mkdir -p server/dist/public \
  && cp -R client/dist/. server/dist/public/

# Prune dev deps for runtime (keep native addon binaries built in this image)
RUN npm prune --omit=dev --workspaces


# ---------- runtime ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV DATA_DIR=/data

# Create data dir and run as non-root
RUN mkdir -p /data && chown -R node:node /data

# Copy runtime artifacts
COPY --from=build /repo/package.json /repo/package-lock.json ./
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/server/dist ./server/dist

USER node

VOLUME ["/data"]
EXPOSE 8080

CMD ["node", "server/dist/server.js"]
