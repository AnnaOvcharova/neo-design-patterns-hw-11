import { DataRecord } from "../models/DataRecord";
import { AccessLogWriter } from "./writers/AccessLogWriter";
import { TransactionWriter } from "./writers/TransactionWriter";
import { ErrorLogWriter } from "./writers/ErrorLogWriter";
import { RejectedWriter } from "./writers/RejectedWriter";

export class ProcessingMediator {
  private writerMap: Record<string, any>;
  private rejectedWriter: RejectedWriter;
  private successCount = 0;
  private rejectedCount = 0;

  constructor(
    accessLogWriter: AccessLogWriter,
    transactionWriter: TransactionWriter,
    errorLogWriter: ErrorLogWriter,
    rejectedWriter: RejectedWriter
  ) {
    this.writerMap = {
      access_log: accessLogWriter,
      transaction: transactionWriter,
      system_error: errorLogWriter,
    };
    this.rejectedWriter = rejectedWriter;
  }

  onSuccess(record: DataRecord): void {
    this.successCount++;
    const writer = this.writerMap[record.type];
    if (writer) {
      writer.write(record);
    }
  }

  onRejected(original: DataRecord | any, error: string): void {
    this.rejectedCount++;
    this.rejectedWriter.write(original, error);
  }

  async finalize(): Promise<void> {
    const writers = Object.values(this.writerMap);
    await Promise.all([
      ...writers.map((w) => w.finalize()),
      this.rejectedWriter.finalize(),
    ]);
  }

  getStats(): { success: number; rejected: number } {
    return {
      success: this.successCount,
      rejected: this.rejectedCount,
    };
  }
}
