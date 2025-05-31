import { AppDataSource } from '../config/data-source';
import { Course } from '../entity/course.entity';
import { User } from '../entity/user.entity';
import { UserWithNumberOfCourse } from 'src/helpers/user.helper';
import { getUserCourseList } from './course.service';

const courseRepository = AppDataSource.getRepository(Course);
const userRepository = AppDataSource.getRepository(User);

export const searchCourses = async (keyword: string): Promise<Course[]> => {
  return await courseRepository
    .createQueryBuilder('course')
    .where('course.name LIKE :keyword', { keyword: `%${keyword}%` })
    .orWhere('course.description LIKE :keyword', { keyword: `%${keyword}%` })
    .orWhere('course.level LIKE :keyword', { keyword: `%${keyword}%` })
    .getMany();
};

export const searchInstructors = async (keyword: string) => {
  const instructors: UserWithNumberOfCourse[] = await userRepository
    .createQueryBuilder('user')
    .where('user.name LIKE :keyword', { keyword: `%${keyword}%` })
    .orWhere('user.about LIKE :keyword', { keyword: `%${keyword}%` })
    .orWhere('user.specialization LIKE :keyword', { keyword: `%${keyword}%` })
    .andWhere('user.role = :role', { role: 'INSTRUCTOR' })
    .getMany();

  for (const instructor of instructors) {
    const courses = await getUserCourseList(instructor);
    instructor.numberOfCourse = courses.length;
  }
  return instructors;
};
