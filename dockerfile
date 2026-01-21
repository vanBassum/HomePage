# Build client
FROM node:20-bookworm-slim AS client-build
WORKDIR /app/Client
COPY Client/package.json Client/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY Client/ ./
RUN npm run build

# Build server
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS server-build
WORKDIR /src
COPY Server/ ./Server/
RUN dotnet publish ./Server/Server.csproj -c Release -o /out

# Final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=server-build /out/ ./
COPY --from=client-build /app/Client/dist/ ./wwwroot/

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Server.dll"]
