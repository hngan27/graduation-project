// scripts/export_log.ts
import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import * as fs from 'fs';
import * as path from 'path';
import { getAggregatedFeedback } from '../src/services/recommendation.service';

async function main() {
  const dataDir = path.resolve(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const ds = await AppDataSource.initialize();
  const feedback = await getAggregatedFeedback();  // [{userId, courseId, score},…]
  const lines = feedback.map(f => `${f.userId},${f.courseId},${f.score}`);
  fs.writeFileSync(
    path.join(dataDir, 'feedback.csv'),
    ['user,course,score', ...lines].join('\n')
  );
  await ds.destroy();
  console.log(`Exported ${lines.length} rows to data/feedback.csv`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});