import type { Validator } from "../types";

export const urlRules = {
  httpOrHttps:
    (message = "must be a valid http(s) URL"): Validator =>
    (value) => {
      if (typeof value !== "string") return null;

      const s = value.trim();
      if (s === "") return null; // empty = not provided

      try {
        const url = new URL(s);
        if (url.protocol !== "http:" && url.protocol !== "https:") return message;
        return null;
      } catch {
        return message;
      }
    },
} as const;
