import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => User,   { nullable:false, onDelete:'CASCADE' }) user: User;
  @ManyToOne(() => Course, { nullable:false, onDelete:'CASCADE' }) course: Course;

  @Column('float') score: number;
  @CreateDateColumn() created_at: Date;
}