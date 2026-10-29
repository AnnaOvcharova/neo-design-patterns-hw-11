import * as fs from "fs";
import * as path from "path";
import { AccessLogRecord } from "../../models/DataRecord";

export class AccessLogWriter {
  private records: AccessLogRecord[] = [];

  write(record: AccessLogRecord): void {
    this.records.push(record);
  }

  async finalize(): Promise<void> {
    const dir = path.resolve(process.cwd(), "output");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await fs.promises.writeFile(
      path.join(dir, "access_logs.json"),
      JSON.stringify(this.records, null, 2),
      "utf-8"
    );
  }
}
