import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) return trimmed
  return `http://${trimmed}`
}

export function openUrl(
  url: string | null | undefined,
  opts?: {
    newTab?: boolean
    allowRelative?: boolean
  }
) {
  if (!url) return
  if (typeof window === "undefined") return

  const raw = url.trim()
  if (!raw) return

  let targetUrl: URL

  try {
    if (opts?.allowRelative && !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(raw)) {
      targetUrl = new URL(raw, window.location.href)
    } else {
      targetUrl = new URL(raw)
    }
  } catch {
    toast.error("Invalid URL", {
      description: raw,
    })
    return
  }

  const protocol = targetUrl.protocol.toLowerCase()
  if (
    protocol !== "http:" &&
    protocol !== "https:" &&
    protocol !== "mailto:" &&
    protocol !== "tel:"
  ) {
    toast.error("Unsupported URL protocol", {
      description: protocol,
    })
    return
  }

  const href = targetUrl.toString()

  if (opts?.newTab) {
    const win = window.open(href, "_blank", "noopener,noreferrer")
    if (!win) {
      toast.error("Popup blocked", {
        description: href,
      })
      window.location.assign(href)
    }
  } else {
    window.location.assign(href)
  }
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
    await fetch(url, {
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
