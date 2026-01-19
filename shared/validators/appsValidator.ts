import type { AppRecord } from "../models";
import { parseObjectCollecting } from "../validation/schema";
import { isString } from "../validation/rules";

const as = <T>(c: { parse(v: unknown, p: string): T }) => (v: unknown, p: string) => c.parse(v, p);

export function parseAppRecord(body: unknown): AppRecord {
  return parseObjectCollecting<AppRecord>(body, {
    name: as(isString.required()),
    link: as(isString.httpOrHttps.required()),
    description: as(isString.optional()),
    iconUrl: as(isString.httpOrHttps.optional()),
    category: as(isString.optional()),
  });
}
