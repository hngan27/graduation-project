import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seeder';
import { CourseSeeder } from './course.seeder';

export class MainSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    await new UserSeeder(this.dataSource).run();
    await new CourseSeeder(this.dataSource).run();
    console.log('All seeders executed successfully');
  }
}
