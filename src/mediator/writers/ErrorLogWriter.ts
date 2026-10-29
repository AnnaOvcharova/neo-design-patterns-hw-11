import * as fs from "fs";
import * as path from "path";
import { SystemErrorRecord } from "../../models/DataRecord";

export class ErrorLogWriter {
  private records: SystemErrorRecord[] = [];

  write(record: SystemErrorRecord): void {
    this.records.push(record);
  }

  async finalize(): Promise<void> {
    const dir = path.resolve(process.cwd(), "output");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const lines = this.records.map((r) => JSON.stringify(r)).join("\n");
    await fs.promises.writeFile(
      path.join(dir, "errors.jsonl"),
      lines ? lines + "\n" : "",
      "utf-8"
    );
  }
}
