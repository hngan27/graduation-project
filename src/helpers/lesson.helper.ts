import { Request } from 'express';

export interface RequestWithCourseID extends Request {
  courseID?: string;
}
