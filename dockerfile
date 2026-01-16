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
    
    # Workaround: ensure Rollup native binary exists on Linux x64 (npm optional deps bug)
    RUN npm -w client i --no-save @rollup/rollup-linux-x64-gnu
    
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
    
    COPY package.json package-lock.json ./
    COPY server/package*.json server/
    COPY shared/package*.json shared/
    
    RUN npm ci --omit=dev -w server
    
    COPY --from=build /repo/server/dist ./dist
    COPY --from=build /repo/client/dist ./client_dist
    
    EXPOSE 8080
    CMD ["node", "dist/server.js"]
    