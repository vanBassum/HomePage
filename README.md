# HomePage (ASP.NET Core + React + Vite) — Minimal Template

## What you get
- ASP.NET Core (.NET 8) Minimal API: `GET /api/version`
- React + TypeScript client (Vite) that fetches and displays `/api/version`
- Vite dev server proxies `/api` to the .NET backend (no CORS hassle)
- Single Docker image build for Linux (client is built and copied into `wwwroot`)

---

## Run in development (Windows)

### 1) Start the server
From repo root:

```bat
dotnet run --project Server
```

Server runs at:
- http://localhost:5000
- Swagger (dev only): http://localhost:5000/swagger
- API: http://localhost:5000/api/version

### 2) Start the client (Vite)
In a second terminal:

```bat
cd Client
npm install
npm run dev
```

Client runs at:
- http://localhost:5173

It will call `GET /api/version` via the proxy configured in `Client/vite.config.ts`.

---

## Build and run a single Docker image (Linux)

From repo root:

```bash
docker build -t homepage .
docker run --rm -p 8080:8080 homepage
```

Open:
- http://localhost:8080/
- http://localhost:8080/api/version
