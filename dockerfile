# ---------- build (install + compile) ----------
FROM node:22-bookworm-slim AS build
WORKDIR /repo

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Copy repo (including lockfile; we'll remove it inside the container)
COPY . .

# Use newer npm
RUN npm install -g npm@11.7.0

# Force optional deps to be considered
ENV NPM_CONFIG_INCLUDE=optional
ENV NPM_CONFIG_OMIT=

# Regenerate lock + install on Linux inside the container
RUN rm -rf node_modules package-lock.json \
  && rm -rf shared/node_modules client/node_modules server/node_modules \
  && npm install --workspaces --include-workspace-root --no-audit --no-fund

# Build (shared -> client -> server via root script)
RUN npm run build

# Place the client build where the server serves static assets
RUN mkdir -p server/dist/public \
  && cp -R client/dist/. server/dist/public/

# Prune dev deps for runtime
RUN npm prune --omit=dev --workspaces


# ---------- runtime ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV DATA_DIR=/data

RUN mkdir -p /data && chown -R node:node /data

COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/server/dist ./server/dist

USER node

VOLUME ["/data"]
EXPOSE 8080

CMD ["node", "server/dist/server.js"]
