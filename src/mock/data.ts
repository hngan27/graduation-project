import { User } from '../entity/user.entity';
import { Lesson } from '../entity/lesson.entity';
import { UserRole } from '../enums/UserRole';
import { StudentLesson } from '../entity/student_lesson.entity';

export const courseLearns = [
  {
    name: 'Design Accessibility',
    progress: '30%',
    status: 'In Progress',
    level: 'Advanced',
    duration: '5 hours',
  },
  {
    name: 'UX Research',
    progress: '70%',
    status: 'In Progress',
    level: 'Intermediate',
    duration: '8 hours',
  },
  {
    name: 'Figma for Beginner',
    progress: '100%',
    status: 'Completed',
    level: 'Beginner',
    duration: '7 hours',
  },
];

export const courseRecommends = [
  {
    name: 'Design Workshop Facilitation',
    description:
      'Master your skills in design workshop facilitation and learn how to promote collaboration and find...',
    level: 'Advanced',
    duration: '6 hours',
  },
  {
    name: 'Animation for Beginner',
    description:
      'Procreate Dreams has transformed my ability to make animations from my art. Yet when I first op...',
    level: 'Beginner',
    duration: '6 hours',
  },
  {
    name: 'Common Design Pattern',
    description:
      'Master your skills in design workshop facilitation and learn how to promote collaboration and find...',
    level: 'Intermediate',
    duration: '6 hours',
  },
];

export const user = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  username: 'johndoe',
  role: 'INSTRUCTOR',
  birthday: '1990-01-01',
  avatar_url: '/images/avatar.png',
  about:
    'John Doe is Founder of DeepLearning.AI, General Partner at AI Fund,' +
    'Chairman and Co-Founder of Coursera, and an Adjunct Professor at Stanford University. ' +
    'As a pioneer both in machine learning and online education, ' +
    'Dr. John has changed countless lives through his work in AI, ' +
    'authoring or co-authoring over 100 research papers in machine learning, robotics, ' +
    'and related fields. Previously, he was chief scientist at Baidu, the founding lead of the Google Brain team, ' +
    "and the co-founder of Coursera - the world's largest MOOC platform. Dr. Ng now focuses his time primarily on his entrepreneurial ventures, " +
    'looking for the best ways to accelerate responsible AI practices in the larger global economy.',
  phone: '0123456789',
};

export const users = <User[]>[
  {
    id: '1',
    email: 'anhctp@gmail.com',
    username: 'anhctp',
    name: 'Cao Thi Phuong Anh',
    role: UserRole.ADMIN,
    phone: '0123456789',
    about: 'I am a software engineer',
    birthday: new Date('2003-01-01'),
    avatar_url: '/images/avatar.png',
  },
  {
    id: '2',
    email: 'anhctp+1@gmail.com',
    username: 'anhctp.student',
    name: 'Cao Thi Phuong Anh Student',
    role: UserRole.STUDENT,
    phone: '0123456789',
    about: 'I am a software engineer',
    birthday: new Date('2003-01-01'),
    avatar_url: '/images/avatar.png',
  },
  {
    id: '3',
    email: 'anhctp+2@gmail.com',
    username: 'anhctp.instructor',
    name: 'Cao Thi Phuong Anh Instructor',
    role: UserRole.INSTRUCTOR,
    phone: '0123456789',
    about: 'I am a software engineer',
    birthday: new Date('2003-12-01'),
    avatar_url: '/images/avatar.png',
  },
];

export const fullLessons = [
  {
    id: '1234',
    title: 'Ruby',
    content: `Hướng dẫn học MySQL
      Phần này sẽ giúp cho các bạn nắm được các nguyên tắc cơ bản về cơ sở dữ liệu quan hệ và các kỹ năng lập trình SQL. Các chủ đề bao gồm kiến trúc cơ sở dữ liệu quan hệ, kỹ thuật thiết kế cơ sở dữ liệu và các kỹ năng truy vấn đơn giản và phức tạp. Sau khi hoàn thành, các bạn sẽ hiểu các hàm SQL, tham gia các kỹ thuật, các đối tượng cơ sở dữ liệu và các ràng buộc và sẽ có thể viết các câu lệnh SELECT, INSERT, UPDATE và DELETE hữu ích.Trong 1 ngày các bạn focus vào các nội dung bên dưới:
      Thiết kế cơ sở dữ liệu quan hệ
      Thao tác tạo Cơ sở dữ liệu và tables
      Viết được các truy vấn dữ liệu (cơ bản đến nâng cao)
      Hiểu và thao tác được với Transaction
      Nắm được Views, Function, Triggers và stored procedures (không bắt buộc)
      Kết thúc khóa học, các bạn có thể nắm được:
      Thiết kế các cấu trúc bảng chuẩn hóa cho các cơ sở dữ liệu quan hệ
      Tạo cơ sở dữ liệu và bảng
      Sử dụng primary and foreign keys
      Sử dụng toán tử thiết lập (UNION, INTERSECT, EXCEPT)
      Sử dụng DML cho SELECT, INSERT, UPDATE, DELETE
      Viết các Query cơ bản với Where and optional khác (group by, order, having,...)
      Viết các Query nâng cao: Join và subquery
      Hiểu thế nào là Transaction và vai trò của Transaction
      Sử dụng triggers and stored procedures`,
    file_url: '/src/public/stylesheets/bootstrap.min.css',
    study_time: new Date('2024-01-22'),
    done: false,
  },
  {
    id: '1235',
    title: 'MySQL',
    content: `Hướng dẫn học MySQL
      Phần này sẽ giúp cho các bạn nắm được các nguyên tắc cơ bản về cơ sở dữ liệu quan hệ và các kỹ năng lập trình SQL. Các chủ đề bao gồm kiến trúc cơ sở dữ liệu quan hệ, kỹ thuật thiết kế cơ sở dữ liệu và các kỹ năng truy vấn đơn giản và phức tạp. Sau khi hoàn thành, các bạn sẽ hiểu các hàm SQL, tham gia các kỹ thuật, các đối tượng cơ sở dữ liệu và các ràng buộc và sẽ có thể viết các câu lệnh SELECT, INSERT, UPDATE và DELETE hữu ích.Trong 1 ngày các bạn focus vào các nội dung bên dưới:
      Thiết kế cơ sở dữ liệu quan hệ
      Thao tác tạo Cơ sở dữ liệu và tables
      Viết được các truy vấn dữ liệu (cơ bản đến nâng cao)
      Hiểu và thao tác được với Transaction
      Nắm được Views, Function, Triggers và stored procedures (không bắt buộc)
      Kết thúc khóa học, các bạn có thể nắm được:
      Thiết kế các cấu trúc bảng chuẩn hóa cho các cơ sở dữ liệu quan hệ
      Tạo cơ sở dữ liệu và bảng
      Sử dụng primary and foreign keys
      Sử dụng toán tử thiết lập (UNION, INTERSECT, EXCEPT)
      Sử dụng DML cho SELECT, INSERT, UPDATE, DELETE
      Viết các Query cơ bản với Where and optional khác (group by, order, having,...)
      Viết các Query nâng cao: Join và subquery
      Hiểu thế nào là Transaction và vai trò của Transaction
      Sử dụng triggers and stored procedures`,
    file_url: '/src/public/stylesheets/bootstrap.min.css',
    study_time: new Date('2024-01-23'),
    done: true,
  },
  {
    id: '1236',
    title: 'Git',
    content: `Hướng dẫn học MySQL
      Phần này sẽ giúp cho các bạn nắm được các nguyên tắc cơ bản về cơ sở dữ liệu quan hệ và các kỹ năng lập trình SQL. Các chủ đề bao gồm kiến trúc cơ sở dữ liệu quan hệ, kỹ thuật thiết kế cơ sở dữ liệu và các kỹ năng truy vấn đơn giản và phức tạp. Sau khi hoàn thành, các bạn sẽ hiểu các hàm SQL, tham gia các kỹ thuật, các đối tượng cơ sở dữ liệu và các ràng buộc và sẽ có thể viết các câu lệnh SELECT, INSERT, UPDATE và DELETE hữu ích.Trong 1 ngày các bạn focus vào các nội dung bên dưới:
      Thiết kế cơ sở dữ liệu quan hệ
      Thao tác tạo Cơ sở dữ liệu và tables
      Viết được các truy vấn dữ liệu (cơ bản đến nâng cao)
      Hiểu và thao tác được với Transaction
      Nắm được Views, Function, Triggers và stored procedures (không bắt buộc)
      Kết thúc khóa học, các bạn có thể nắm được:
      Thiết kế các cấu trúc bảng chuẩn hóa cho các cơ sở dữ liệu quan hệ
      Tạo cơ sở dữ liệu và bảng
      Sử dụng primary and foreign keys
      Sử dụng toán tử thiết lập (UNION, INTERSECT, EXCEPT)
      Sử dụng DML cho SELECT, INSERT, UPDATE, DELETE
      Viết các Query cơ bản với Where and optional khác (group by, order, having,...)
      Viết các Query nâng cao: Join và subquery
      Hiểu thế nào là Transaction và vai trò của Transaction
      Sử dụng triggers and stored procedures`,
    file_url: '/src/public/stylesheets/bootstrap.min.css',
    study_time: new Date('2024-01-23'),
    done: false,
  },
];
