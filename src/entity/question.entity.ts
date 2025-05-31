import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { Option } from './option.entity';
import { Answer } from './answer.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => Assignment, assignment => assignment.questions, {
    nullable: false,
  })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @OneToMany(() => Option, option => option.question)
  options: Option[];

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[];

  constructor(partial?: Partial<Question>) {
    Object.assign(this, partial);
  }
}
