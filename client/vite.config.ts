import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev: Vite serves the client, and proxies /api/* to ASP.NET Core on port 5000
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000"
    }
  }
});
