# ---------- build (deps + build in one stage) ----------
    FROM node:22-bookworm-slim AS build
    WORKDIR /repo
    
    ENV NODE_ENV=development
    
    # Copy manifests first for cache
    COPY package.json package-lock.json ./
    COPY client/package*.json client/
    COPY server/package*.json server/
    COPY shared/package*.json shared/
    
    # Install all deps INCLUDING dev (needed for tsc/vite)
    RUN npm ci --include=dev
    
    # Copy full source
    COPY . .
    
    # Build server + client
    RUN npm -w server run build
    RUN npm -w client run build
    
    
    # ---------- runtime ----------
    FROM node:22-bookworm-slim AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=8080
    ENV CLIENT_DIST_DIR=/app/client_dist
    
    # Copy manifests needed to install server prod deps
    COPY package.json package-lock.json ./
    COPY server/package*.json server/
    COPY shared/package*.json shared/
    
    # Install only server production deps
    # (This assumes server workspace depends on shared via workspaces)
    RUN npm ci --omit=dev -w server
    
    # Copy build output
    COPY --from=build /repo/server/dist ./dist
    COPY --from=build /repo/client/dist ./client_dist
    
    EXPOSE 8080
    CMD ["node", "dist/server.js"]
    