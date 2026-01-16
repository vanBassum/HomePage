import type { AppApiClient } from "@/components/api/AppApiClient"
import { DummyAppApiClient } from "@/components/api/DummyAppApiClient"

export const appApiClient: AppApiClient = new DummyAppApiClient()
export type { AppApiClient, CreateAppLink, UpdateAppLink } from "@/components/api/AppApiClient"
