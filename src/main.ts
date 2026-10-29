import * as fs from "fs";
import * as path from "path";
import { buildAccessLogChain } from "./chain/chains/AccessLogChain";
import { buildTransactionChain } from "./chain/chains/TransactionChain";
import { buildSystemErrorChain } from "./chain/chains/SystemErrorChain";
import { ProcessingMediator } from "./mediator/ProcessingMediator";
import { AccessLogWriter } from "./mediator/writers/AccessLogWriter";
import { TransactionWriter } from "./mediator/writers/TransactionWriter";
import { ErrorLogWriter } from "./mediator/writers/ErrorLogWriter";
import { RejectedWriter } from "./mediator/writers/RejectedWriter";
import { DataRecord } from "./models/DataRecord";

const handlerMap: Record<string, () => any> = {
  access_log: buildAccessLogChain,
  transaction: buildTransactionChain,
  system_error: buildSystemErrorChain,
};

async function main() {
const filePath = path.resolve(__dirname, "data/records.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const records: any[] = JSON.parse(rawData);

  const mediator = new ProcessingMediator(
    new AccessLogWriter(),
    new TransactionWriter(),
    new ErrorLogWriter(),
    new RejectedWriter()
  );

  for (const record of records) {
    const chainFactory = handlerMap[record.type];
    if (!chainFactory) {
      mediator.onRejected(record, `Unknown record type: ${record.type}`);
      continue;
    }

    try {
      const chain = chainFactory();
      const processed = chain.handle(record);
      mediator.onSuccess(processed as DataRecord);
    } catch (err: any) {
      mediator.onRejected(record, err.message || "Validation failed");
    }
  }

  await mediator.finalize();

  const stats = mediator.getStats();
  console.log(`[INFO] Завантажено записів: ${records.length}`);
  console.log(`[INFO] Успішно оброблено: ${stats.success}`);
  console.log(`[WARN] Відхилено з помилками: ${stats.rejected}`);
  console.log(`[INFO] Звіт збережено у директорії output/`);
}

main().catch(console.error);
