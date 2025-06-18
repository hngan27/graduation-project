import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Unique
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('recommendations')
@Unique(['user', 'course']) 
export class Recommendation {
  @PrimaryGeneratedColumn('increment') id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' }) user: User;
  @ManyToOne(() => Course, { nullable: false, onDelete: 'CASCADE' })
  course: Course;

  @Column('float') score: number;
  @CreateDateColumn() created_at: Date;
}
