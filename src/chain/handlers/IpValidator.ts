import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

export class IpValidator extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type === "access_log") {
      const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
      if (!record.ip || !ipv4Regex.test(record.ip)) {
        throw new Error(`Invalid IP address: ${record.ip}`);
      }
    }
    return record;
  }
}
