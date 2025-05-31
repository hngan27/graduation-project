import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../entity/user.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  senderId: string;

  @ManyToOne(() => User, user => user.id, {
    eager: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'varchar', length: 36 })
  recipientId: string;

  @ManyToOne(() => User, user => user.id, {
    eager: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column('text')
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'boolean', default: false })
  deletedBySender: boolean;

  @Column({ type: 'boolean', default: false })
  deletedByRecipient: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  constructor(partial?: Partial<ChatMessage>) {
    Object.assign(this, partial);
  }
}
