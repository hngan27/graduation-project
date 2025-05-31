import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from './user.entity';
import { AssignmentStatus } from '../enums/AssignmentStatus';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Assignment, assignment => assignment.grades, {
    nullable: false,
  })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @ManyToOne(() => User, student => student.grades, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.TODO,
  })
  status: AssignmentStatus;

  @Column('float')
  grade: number;

  @Column('float')
  max_grade: number;

  @Column({ nullable: true })
  feedback: string;

  @Column({ type: 'datetime', nullable: true })
  start_time: Date;

  @Column({ type: 'datetime', nullable: true })
  submit_time: Date;

  @Column({ default: 1 })
  attempt: number;

  constructor(partial?: Partial<Grade>) {
    Object.assign(this, partial);
  }
}
