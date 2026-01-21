import { AppsApi, Configuration } from "./generated";
import { VersionApi } from "./generated";

// --------------------
// Configuration
// --------------------
const basePath = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

const config = new Configuration({
  basePath, // "" => same origin
});

// --------------------
// API singletons
// --------------------
export const api = {
  version: new VersionApi(config),
  apps: new AppsApi(config),
};

// --------------------
// TYPE RE-EXPORTS
// --------------------
export type {
  AppRecord,
  VersionInfo,
} from "./generated/models";
