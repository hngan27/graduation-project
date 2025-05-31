import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('course_interactions')
export class CourseInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, { nullable: false, onDelete: 'CASCADE' })
  course: Course;

  @Column()
  interaction_type: string; // 'view', 'favorite', 'enroll', 'lesson_done', 'quiz_done', 'course_completed'

  @Column({ nullable: true })
  target_id: string; // id của lesson, quiz, ... nếu có

  @Column({ nullable: true, type: 'int' })
  value: number; // điểm số, rating, ... nếu có

  @CreateDateColumn()
  created_at: Date;
}
