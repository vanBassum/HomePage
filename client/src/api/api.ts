import { Configuration, VersionApi } from "./generated";

// ---- base path (env-driven, relative by default) ----
const basePath = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

const config = new Configuration({
  basePath, // "" => same origin
});

// ---- API singletons ----
export const api = {
  version: new VersionApi(config),
};

// ---- TYPE RE-EXPORTS ----
// Re-export everything you want consumers to use
export type {
  VersionInfo,        // example model
} from "./generated/models";
