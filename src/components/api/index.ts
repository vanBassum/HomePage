// src/components/api/index.ts
import type { AppApiClient } from "@/components/api/AppApiClient"
import { PocketBaseAppApiClient } from "@/components/api/pocketbase/PocketBaseAppApiClient"

export const appApiClient: AppApiClient = new PocketBaseAppApiClient()

export type { AppRecord } from "@/components/api/models/AppRecord"
export type { AppApiClient, CreateAppRecord, UpdateAppRecord } from "@/components/api/AppApiClient"
