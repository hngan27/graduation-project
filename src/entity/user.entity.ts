import * as bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Enrollment } from './enrollment.entity';
import { StudentLesson } from './student_lesson.entity';
import { Answer } from './answer.entity';
import { Grade } from './grade.entity';
import { UserRole } from '../enums/UserRole';
import { Specialization } from '../enums/Specialization';
import { AuthType } from '../enums/AuthType';
import { FavoriteCourse } from './favorite_course.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hash_password: string;

  @Column({
    type: 'enum',
    enum: AuthType,
    default: AuthType.LOCAL,
  })
  auth_type: AuthType;

  @Column({ nullable: true })
  username: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  about: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({
    type: 'enum',
    enum: Specialization,
    default: Specialization.NONE,
  })
  specialization: Specialization;

  @Column({ nullable: true })
  authCode: string;

  @Column({ type: 'datetime', nullable: true })
  authCodeExpires: Date;

  @Column({ nullable: true })
  isVerify: boolean;

  @OneToMany(() => Course, course => course.instructor)
  instructorCourses: Course[];

  @OneToMany(() => Course, course => course.subInstructor)
  subInstructorCourses: Course[];

  @OneToMany(() => Enrollment, enrollment => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => StudentLesson, studentLesson => studentLesson.student)
  studentLessons: StudentLesson[];

  @OneToMany(() => Answer, answer => answer.student)
  answers: Answer[];

  @OneToMany(() => Grade, grade => grade.student)
  grades: Grade[];

  @OneToMany(() => FavoriteCourse, favorite => favorite.user)
  favoriteCourses: FavoriteCourse[];

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  generateAuthCode() {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString().padStart(6, '0');
  }

  async hashPassword(password: string, auth_type: AuthType): Promise<string> {
    if (auth_type === AuthType.GOOGLE && password === '') {
      password = process.env.GOOGLE_PASSWORD!;
    }
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // So sánh mật khẩu
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.hash_password);
  }
}
