import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

export class UserIdValidator extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type === "access_log") {
      if (!record.userId || typeof record.userId !== "string" || record.userId.trim() === "") {
        throw new Error("Invalid userId");
      }
    }
    return record;
  }
}