export type ValidationIssue = {
  path: string;
  message: string;
};

export type Validator = (value: unknown) => string | null;

export type Schema<T> = Partial<Record<keyof T, readonly Validator[]>>;
