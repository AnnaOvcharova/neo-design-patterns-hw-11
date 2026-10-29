import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

export class AmountParser extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type === "transaction") {
      if (record.amount === undefined || record.amount === null || record.amount === "") {
        throw new Error("Missing required field 'amount'");
      }
      const parsedAmount = typeof record.amount === "string" ? parseFloat(record.amount) : record.amount;
      if (isNaN(parsedAmount)) {
        throw new Error("Invalid amount");
      }
      return { ...record, amount: parsedAmount };
    }
    return record;
  }
}