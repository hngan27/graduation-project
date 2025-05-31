import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { StudentLesson } from './student_lesson.entity';
import { Course } from './course.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  file_url: string;

  @Column({ nullable: true })
  created_at: Date;
  
  @OneToMany(() => StudentLesson, studentLesson => studentLesson.lesson)
  studentLessons: StudentLesson[];

  @ManyToMany(() => Course, course => course.lessons)
  courses: Course[];

  constructor(partial?: Partial<Lesson>) {
    Object.assign(this, partial);
  }
}
