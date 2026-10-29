import * as fs from "fs";
import * as path from "path";

export interface RejectedItem {
  record: any;
  error: string;
}

export class RejectedWriter {
  private lines: string[] = [];

  write(record: any, error: string): void {
    const item: RejectedItem = { record, error };
    this.lines.push(JSON.stringify(item));
  }

  async finalize(): Promise<void> {
    const dir = path.resolve(process.cwd(), "output");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const content = this.lines.length > 0 ? this.lines.join("\n") + "\n" : "";
    await fs.promises.writeFile(
      path.join(dir, "rejected.jsonl"),
      content,
      "utf-8"
    );
  }
}
