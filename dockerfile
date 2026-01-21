# Copy the whole repo once to avoid path/context surprises
FROM node:20-bookworm-slim AS client-build
WORKDIR /app
COPY . .
WORKDIR /app/Client
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS server-build
WORKDIR /src
COPY . .
RUN dotnet publish ./Server/Server.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=server-build /out/ ./
COPY --from=client-build /app/Client/dist/ ./wwwroot/

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Server.dll"]
