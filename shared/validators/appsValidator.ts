import type { AppRecord } from "../models";
import type { Schema } from "../validation/types";
import { stringRules } from "../validation/rules/stringRules";
import { urlRules } from "../validation/rules/urlRules";

export const appRecordSchema: Schema<AppRecord> = {
  name: [stringRules.notBlank()],
  link: [stringRules.notBlank(), urlRules.httpOrHttps()],
  description: [], // optional
  iconUrl: [urlRules.httpOrHttps()],
  category: [], // optional
};
