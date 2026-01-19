// validation/rules.ts
import { v } from "./validator";

export const isString = {
  required: () => v.string().map((s) => s.trim()).refine((s) => s.length > 0, "must be a non-empty string"),
  optional: () => v.string().map((s) => s.trim()).refine((s) => s.length > 0, "must be a non-empty string").optional(),

  httpOrHttps: {
    required: () =>
      v.string()
        .map((s) => s.trim())
        .refine((s) => s.length > 0, "must be a non-empty string")
        .refine((s) => {
          try {
            const url = new URL(s);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        }, "must be a valid http(s) URL"),

    optional: () =>
      v.string()
        .map((s) => s.trim())
        .refine((s) => s.length > 0, "must be a non-empty string")
        .refine((s) => {
          try {
            const url = new URL(s);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        }, "must be a valid http(s) URL")
        .optional(),
  },
} as const;
