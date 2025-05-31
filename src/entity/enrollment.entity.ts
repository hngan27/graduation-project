import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';
import { EnrollStatus } from '../enums/EnrollStatus';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, student => student.enrollments, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Course, course => course.enrollments, { nullable: false })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({
    type: 'enum',
    enum: EnrollStatus,
    default: EnrollStatus.PENDING,
  })
  status: EnrollStatus;

  @Column({ default: false })
  done: boolean;

  @Column({ type: 'datetime' })
  enrollment_date: Date;

  constructor(partial?: Partial<Enrollment>) {
    Object.assign(this, partial);
  }
}
