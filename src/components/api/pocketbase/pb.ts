import PocketBase from "pocketbase"

// Use env when available; fallback to your local URL.
export const PB_URL = import.meta.env.VITE_PB_URL ?? "http://basserver.local:8090"

export const pb = new PocketBase(PB_URL)

// Optional: keep auth in localStorage (PocketBase SDK does this by default)
pb.autoCancellation(false) // avoids request cancellation issues during fast React rerenders
