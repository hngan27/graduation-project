import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('favorite_courses')
export class FavoriteCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.favoriteCourses, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, course => course.favoritedBy, { onDelete: 'CASCADE' })
  course: Course;

  @CreateDateColumn()
  created_at: Date;
}
