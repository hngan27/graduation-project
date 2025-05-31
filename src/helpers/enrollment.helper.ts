import { Enrollment } from '../entity/enrollment.entity';
import { CourseStatus } from '../enums/CourseStatus';

export type EnrollmentWithProgress = Enrollment & {
  progress?: number;
  courseStatus?: CourseStatus;
};
