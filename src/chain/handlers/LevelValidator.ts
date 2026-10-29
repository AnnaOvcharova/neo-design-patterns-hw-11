import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

export class LevelValidator extends AbstractHandler {
  private allowedLevels = ["info", "warning", "critical"];

  protected process(record: DataRecord): DataRecord {
    if (record.type === "system_error") {
      if (!record.level || !this.allowedLevels.includes(record.level)) {
        throw new Error(`Invalid log level: ${record.level}`);
      }
    }
    return record;
  }
}