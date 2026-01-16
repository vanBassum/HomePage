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