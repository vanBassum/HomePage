# ---------- build client ----------
    FROM node:22-alpine AS build-client
    WORKDIR /client
    COPY client/package*.json ./
    RUN npm ci
    COPY client/ .
    RUN npm run build
    
    # ---------- build server ----------
    FROM node:22-alpine AS build-server
    WORKDIR /server
    COPY server/package*.json ./
    RUN npm ci
    COPY server/ .
    RUN npm run build
    
    # ---------- runtime ----------
    FROM node:22-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Server runtime deps
    COPY server/package*.json ./
    RUN npm ci --omit=dev
    
    # Copy built outputs
    COPY --from=build-server /server/dist ./dist
    COPY --from=build-client /client/dist ./client_dist
    
    # Runtime configuration (adjust as needed)
    ENV PORT=8080
    ENV CLIENT_DIST_DIR=/app/client_dist
    
    EXPOSE 8080
    CMD ["node", "dist/server.js"]
    