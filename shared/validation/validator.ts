// validation/validator.ts
import { ValidationError } from "./validationError";

function fail(path: string, message: string): never {
  throw new ValidationError("Invalid request body", [{ path, message }]);
}

export type Validator<T> = (value: unknown, path: string) => T;

export type Chain<T> = {
  /** Parse/validate now (usually used internally by object schemas). */
  parse(value: unknown, path: string): T;

  /** Mark as required (default for most chains, but explicit is nice). */
  required(): Chain<NonNullable<T>>;

  /** Allow undefined/null -> returns undefined, otherwise validates. */
  optional(): Chain<T | undefined>;

  /** Add a custom refinement rule. */
  refine(check: (v: T) => boolean, message: string): Chain<T>;

  /** Transform value (e.g. trim). */
  map<U>(fn: (v: T) => U): Chain<U>;
};

function chain<T>(base: Validator<T>): Chain<T> {
  const api: Chain<T> = {
    parse(value, path) {
      return base(value, path);
    },

    required() {
      return chain<NonNullable<T>>((value, path) => {
        if (value === undefined || value === null) {
          fail(path, "is required");
        }
        return base(value, path) as NonNullable<T>;
      });
    },

    optional() {
      return chain<T | undefined>((value, path) => {
        if (value === undefined || value === null) return undefined;
        return base(value, path);
      });
    },

    refine(check, message) {
      return chain<T>((value, path) => {
        const v = base(value, path);
        if (!check(v)) fail(path, message);
        return v;
      });
    },

    map<U>(fn: (v: T) => U) {
      return chain<U>((value, path) => fn(base(value, path)));
    },
  };

  return api;
}

export const v = {
  string() {
    return chain<string>((value, path) => {
      if (value === undefined || value === null) fail(path, "is required");
      if (typeof value !== "string") fail(path, "must be a string");
      return value;
    });
  },

  number() {
    return chain<number>((value, path) => {
      if (value === undefined || value === null) fail(path, "is required");
      if (typeof value !== "number" || Number.isNaN(value)) {
        fail(path, "must be a number");
      }
      return value;
    });
  },

  boolean() {
    return chain<boolean>((value, path) => {
      if (value === undefined || value === null) fail(path, "is required");
      if (typeof value !== "boolean") fail(path, "must be a boolean");
      return value;
    });
  },
};
