import type { AppLink } from "../models/AppLink"

/**
 * Contract for the API client.
 * This allows easy replacement with a real implementation later.
 */
export interface AppApiClient {
  getAll(): Promise<AppLink[]>
}

/**
 * Dummy API client.
 * Later this can be replaced by a fetch/OpenAPI-based implementation.
 */
class DummyAppApiClient implements AppApiClient {
  async getAll(): Promise<AppLink[]> {
    // Simulate async behavior
    return Promise.resolve(DUMMY_APPS)
  }
}

/**
 * Export a singleton instance.
 * Swap this implementation later without touching consumers.
 */
export const appApiClient: AppApiClient = new DummyAppApiClient()
