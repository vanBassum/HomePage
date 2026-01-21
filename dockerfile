# Copy the whole repo once to avoid path/context surprises
FROM node:20-bookworm-slim AS client-build
WORKDIR /app
COPY . .
WORKDIR /app/client
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS server-build
WORKDIR /src
COPY . .
RUN dotnet publish ./server/Server.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=server-build /out/ ./
COPY --from=client-build /app/client/dist/ ./wwwroot/

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Server.dll"]
