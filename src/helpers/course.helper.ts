import { Course } from '../entity/course.entity';
import { EnrollStatus } from '../enums/EnrollStatus';
import { CourseStatus } from 'src/enums/CourseStatus';

export type CourseWithEnrollStatus = Course & { enrollStatus?: EnrollStatus };

export type CourseWithProgress = Course & {
  status?: CourseStatus;
  progress?: number;
  enrollStatus?: EnrollStatus;
};

export type CourseWithStudentCount = Course & { studentCount?: number };
