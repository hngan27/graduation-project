import { User } from '../entity/user.entity';

export type UserWithNumberOfCourse = User & { numberOfCourse?: number };

export type InstructorWithStudentCount = UserWithNumberOfCourse & {
  studentCount?: number;
};
