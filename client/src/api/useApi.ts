// src/api/useApi.ts
import { ApiClient } from "./ApiClient";

const apiSingleton = new ApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
});

export function useApi(): ApiClient {
  return apiSingleton;
}
