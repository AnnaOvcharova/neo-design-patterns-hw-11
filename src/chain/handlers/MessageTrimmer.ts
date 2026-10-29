import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

export class MessageTrimmer extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type === "system_error") {
      if (typeof record.message !== "string") {
        throw new Error("Invalid message format");
      }
      return { ...record, message: record.message.trim().slice(0, 255) };
    }
    return record;
  }
}