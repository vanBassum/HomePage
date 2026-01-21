import { AppsApi, Configuration } from "./generated";

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
  apps: new AppsApi(config),
};

// --------------------
// TYPE RE-EXPORTS
// --------------------
export type {
  AppRecord,
} from "./generated/models";
