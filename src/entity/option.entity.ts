import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => Question, question => question.options, { nullable: false })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column()
  is_correct: boolean;

  @OneToMany(() => Answer, answer => answer.option)
  answers: Answer[];

  constructor(partial?: Partial<Option>) {
    Object.assign(this, partial);
  }
}
