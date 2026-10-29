import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

export class CurrencyNormalizer extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type === "transaction") {
      if (!record.currency || typeof record.currency !== "string") {
        throw new Error("Invalid currency");
      }
      return { ...record, currency: record.currency.trim().toUpperCase() };
    }
    return record;
  }
}