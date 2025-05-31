import { AppDataSource } from '../config/data-source';
import { Course } from '../entity/course.entity';
import { User } from '../entity/user.entity';
import { UserRole } from '../enums/UserRole';
import bcrypt from 'bcrypt';
import { sendAccountEmail } from '../utils/sendMail';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { Enrollment } from '../entity/enrollment.entity';
import { getCoursesByInstructorId } from './course.service';
import { CourseStatus } from '../enums/CourseStatus';
import { EnrollStatus } from '../enums/EnrollStatus';
import * as courseService from './course.service';

const courseRepository = AppDataSource.getRepository(Course);
const userRepository = AppDataSource.getRepository(User);
const enrollmentRepository = AppDataSource.getRepository(Enrollment);

export const getStatistics = async () => {
  // Thống kê số lượng khóa học
  const totalCourses = await courseRepository.count();

  // Thống kê số lượng giảng viên
  const totalInstructors = await userRepository.count({
    where: {
      role: UserRole.INSTRUCTOR, // Sử dụng enum UserRole
    },
  });

  // Thống kê số lượng giảng viên đang chờ phê duyệt
  const pendingInstructors = await userRepository.count({
    where: {
      role: UserRole.PENDING_APPROVAL,
    },
  });

  // Thống kê số lượng đăng ký khóa học
  const totalEnrollments = await enrollmentRepository.count();

  // Thống kê dữ liệu biểu đồ enroll theo thời gian
  const rawChartData = await enrollmentRepository
    .createQueryBuilder('enrollment')
    .select("DATE_FORMAT(enrollment.enrollment_date, '%Y-%m')", 'period')
    .addSelect('COUNT(*)', 'count')
    .groupBy('period')
    .orderBy('period')
    .getRawMany();

  const enrollmentChart = rawChartData.map(row => ({
    period: row.period,
    count: parseInt(row.count, 10),
  }));

  return {
    totalCourses,
    totalInstructors,
    pendingInstructors,
    totalEnrollments,
    enrollmentChart,
  };
};

// Lấy danh sách giảng viên đang chờ phê duyệt
export const getPendingInstructors = async () => {
  const pendingInstructors = await userRepository.find({
    where: {
      role: UserRole.PENDING_APPROVAL,
    },
  });

  return pendingInstructors;
};

export const approveInstructor = async (userId: string): Promise<User> => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  user.role = UserRole.INSTRUCTOR;
  await userRepository.save(user);

  return user;
};

export const rejectInstructor = async (userId: string): Promise<void> => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }
  await userRepository.remove(user);
};

export const getInstructorDetails = async (userId: string): Promise<User> => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const searchInstructors = async (keyword: string): Promise<any[]> => {
  const query = userRepository
    .createQueryBuilder('user')
    .where('user.name LIKE :keyword', { keyword: `%${keyword}%` })
    .andWhere('user.role = :role', { role: UserRole.INSTRUCTOR });

  const instructors = await query.getMany();
  // Lấy số lượng khóa học cho từng instructor
  const instructorsWithCourseCount = await Promise.all(
    instructors.map(async instructor => {
      const courses = await getCoursesByInstructorId(instructor.id);
      return {
        ...instructor,
        numberOfCourse: courses.length,
      };
    })
  );
  return instructorsWithCourseCount;
};

export const searchStudents = async (keyword: string): Promise<any[]> => {
  const query = userRepository
    .createQueryBuilder('user')
    .where('user.name LIKE :keyword', { keyword: `%${keyword}%` })
    .andWhere('user.role = :role', { role: UserRole.STUDENT });

  const students = await query.getMany();

  // Lấy thông tin khóa học cho từng sinh viên
  const studentsWithCourseInfo = await Promise.all(
    students.map(async student => {
      const enrollments = await enrollmentRepository.find({
        where: { student: { id: student.id }, status: EnrollStatus.APPROVED },
        relations: ['course'],
      });

      let completedCourses = 0;
      let inProgressCourses = 0;

      // Tính tiến độ cho từng khóa học
      for (const enrollment of enrollments) {
        const progress = await courseService.getProgressInCourse(
          enrollment.course,
          student
        );

        if (progress === 100) {
          completedCourses++;
        } else if (progress > 0) {
          inProgressCourses++;
        }
      }

      return {
        ...student,
        completedCourses,
        inProgressCourses,
      };
    })
  );

  return studentsWithCourseInfo;
};

export const createUserAccount = async (dto: CreateUserDTO): Promise<User> => {
  const existingUser = await userRepository.findOne({
    where: { email: dto.email },
  });
  if (existingUser) {
    throw new Error('errors.email_taken');
  }

  const password = Math.random().toString(36).slice(-8);
  const hash = await bcrypt.hash(password, 10);

  const user = userRepository.create({
    name: dto.name,
    email: dto.email,
    hash_password: hash,
    role: dto.role,
  });

  const savedUser = await userRepository.save(user);
  await sendAccountEmail(dto.email, dto.email, password, dto.role);
  console.log('User created:', savedUser);
  return savedUser;
};
