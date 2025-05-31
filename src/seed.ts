import { MainSeeder } from './seeders/main.seeder';
import { AppDataSource } from './config/data-source';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    const mainSeeder = new MainSeeder(AppDataSource);
    await mainSeeder.run();

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
