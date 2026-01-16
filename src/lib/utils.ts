import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function openUrl(url: string, opts?: { newTab?: boolean }) {
  if (!url) return
  if (opts?.newTab) window.open(url, "_blank", "noopener,noreferrer")
  else window.location.href = url
}

export type AppStatus = "online" | "offline" | "unknown"

export async function checkAppStatus(
  url: string,
  opts?: {
    timeoutMs?: number
    method?: "HEAD" | "GET"
  }
): Promise<AppStatus> {
  if (!url) return "unknown"

  const timeoutMs = opts?.timeoutMs ?? 4000
  const method = opts?.method ?? "HEAD"

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      method,
      mode: "no-cors",
      signal: controller.signal,
    })

    /*
      no-cors responses are opaque:
      - we cannot read status
      - but reaching the server without error means "probably online"
    */
    clearTimeout(timeout)
    return "online"
  } catch (err) {
    clearTimeout(timeout)

    if (err instanceof DOMException && err.name === "AbortError") {
      // timeout → likely offline or very slow
      return "offline"
    }

    // network error / CORS / DNS → unknown
    return "unknown"
  }
}
