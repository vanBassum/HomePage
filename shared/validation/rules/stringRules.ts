import type { Validator } from "../types";

export const stringRules = {
  notBlank:
    (message = "must be a non-empty string"): Validator =>
    (value) => {
      if (typeof value !== "string") return message;
      if (value.trim() === "") return message;
      return null;
    },

  maxLen:
    (max: number, message = `must be at most ${max} characters`): Validator =>
    (value) => {
      if (typeof value !== "string") return null;
      return value.length <= max ? null : message;
    },
} as const;
