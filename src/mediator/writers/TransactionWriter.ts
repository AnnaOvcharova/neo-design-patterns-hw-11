import * as fs from "fs";
import * as path from "path";
import { TransactionRecord } from "../../models/DataRecord";

export class TransactionWriter {
  private records: TransactionRecord[] = [];

  write(record: TransactionRecord): void {
    this.records.push(record);
  }

  async finalize(): Promise<void> {
    const dir = path.resolve(process.cwd(), "output");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const header = "timestamp,amount,currency";
    const rows = this.records.map(
      (r) => `${r.timestamp},${r.amount},${r.currency}`
    );
    const content = [header, ...rows].join("\n");
    await fs.promises.writeFile(
      path.join(dir, "transactions.csv"),
      content,
      "utf-8"
    );
  }
}
