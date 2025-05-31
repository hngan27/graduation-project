import { Not } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user.entity';
import { UserRole } from '../enums/UserRole';
import { AuthType } from '../enums/AuthType';
import {
  UserWithNumberOfCourse,
  InstructorWithStudentCount,
} from '../helpers/user.helper';
import { getStudentCountByCourseId, getUserCourseList } from './course.service';

const userRepository = AppDataSource.getRepository(User);

export const sortInstructorByMajor = (
  instructors: InstructorWithStudentCount[],
  userSession: User
) => {
  return instructors.sort((a, b) => {
    if (
      a.specialization === userSession.specialization &&
      b.specialization !== userSession.specialization
    )
      return -1;

    if (
      a.specialization !== userSession.specialization &&
      b.specialization === userSession.specialization
    )
      return 1;

    return b.studentCount! - a.studentCount!;
  });
};

export const getInstructorList = async () => {
  const instructors: InstructorWithStudentCount[] = await userRepository.find({
    order: { username: 'ASC' },
    where: { role: UserRole.INSTRUCTOR },
  });

  for (const instructor of instructors) {
    const courses = await getUserCourseList(instructor);
    const studentCountsPromises = courses.map(course =>
      getStudentCountByCourseId(course.id)
    );

    const studentCounts = await Promise.all(studentCountsPromises);

    instructor.numberOfCourse = courses.length;
    instructor.studentCount = studentCounts.reduce(
      (acc, count) => acc + count,
      0
    );
  }

  instructors.sort((a, b) => b.studentCount! - a.studentCount!);

  return instructors;
};

export const getSubInstructorList = async (instructor: User) => {
  const subInstructors = await userRepository.find({
    order: { name: 'ASC' },
    where: {
      role: UserRole.INSTRUCTOR,
      id: Not(instructor.id),
      specialization: instructor.specialization,
    },
  });

  return subInstructors;
};

export const getStudentList = async () => {
  const students: UserWithNumberOfCourse[] = await userRepository.find({
    order: { username: 'ASC' },
    where: { role: UserRole.STUDENT },
  });

  for (const student of students) {
    const courses = await getUserCourseList(student);
    student.numberOfCourse = courses.length;
  }

  students.sort((a, b) => b.numberOfCourse! - a.numberOfCourse!);

  return students;
};

export const getUserById = async (id: string) => {
  return userRepository.findOne({ where: { id } });
};

export const updateUser = async (
  id: string,
  updateData: Partial<User>
): Promise<User | null> => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  Object.assign(user, updateData);
  return userRepository.save(user);
};

// Tìm người dùng theo googleId
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return userRepository.findOne({
    where: { email },
  });
};

// Tạo người dùng mới
export const createUser = async (data: Partial<User>): Promise<User> => {
  const newUser = userRepository.create(data);
  newUser.hash_password = await newUser.hashPassword('', AuthType.GOOGLE);
  return userRepository.save(newUser);
};

// Tìm người dùng theo ID
export const findUserById = async (id: string): Promise<User | null> => {
  return userRepository.findOneBy({ id });
};

export const getStudentCountByInstructorId = async (
  instructor: User
): Promise<number> => {
  const coursesOfInstructor = await getUserCourseList(instructor);
  const studentCountsPromises = coursesOfInstructor.map(course =>
    getStudentCountByCourseId(course.id)
  );

  const studentCounts = await Promise.all(studentCountsPromises);

  return studentCounts.reduce((acc, count) => acc + count, 0);
};
export const deleteById = async (id: string): Promise<void> => {
  await userRepository.delete(id);
};
