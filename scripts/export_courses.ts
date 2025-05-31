// scripts/export_courses.ts
import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import * as fs from 'fs';
import * as path from 'path';
import { Course } from '../src/entity/course.entity';

async function main() {
  const dataDir = path.resolve(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const ds = await AppDataSource.initialize();
  const courses = await ds.getRepository(Course).find({ relations: ['tags'] });
  const lines = courses.map(c => {
    const tags = c.tags.map(t => t.name).join(' ');
    const text = `${c.name} ${c.description||''} ${tags}`.replace(/,/g,' ');
    return `${c.id},${text}`;
  });
  fs.writeFileSync(
    path.join(dataDir, 'courses.csv'),
    ['course_id,text', ...lines].join('\n')
  );
  await ds.destroy();
  console.log(`Exported ${lines.length} courses to data/courses.csv`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});