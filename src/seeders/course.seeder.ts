import { DataSource } from 'typeorm';
import { Course } from '../entity/course.entity';
import { CourseLevel } from '../enums/CourseLevel';
import { getUserById } from '../services/user.service';

export class CourseSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const courseRepository = this.dataSource.getRepository(Course);

    const coursesData = [
      {
        id: 'c10d1e4f1-223b-4cdd-9f0e-0123456789a',
        name: 'Web Development Fundamentals',
        description: 'Learn how to build websites.',
        instructorId: '123878ff-cd3d-4c94-aee3-cab0e0f6b27e',
        subInstructorId: '00e813f9-59f4-40aa-bd60-1825d7606314',
        assignmentId: undefined,
        image_url:
          'https://elearningindustry.com/wp-content/uploads/2021/03/shutterstock_745932934.png',
        duration: '5 weeks',
        level: CourseLevel.INTERMEDIATE,
      },
      {
        id: 'c11d1e4f1-223b-4cdd-9f0e-0123456789a',
        name: 'Cybersecurity Essentials',
        description: 'Understand the basics of cybersecurity.',
        instructorId: '00e813f9-59f4-40aa-bd60-1825d7606314',
        subInstructorId: undefined,
        assignmentId: undefined,
        image_url:
          'https://img.freepik.com/free-vector/organic-flat-people-business-training_23-2148919413.jpg',
        duration: '3 weeks',
        level: CourseLevel.BEGINNER,
      },
      {
        id: 'c12d1e4f1-223b-4cdd-9f0e-0123456789a',
        name: 'Python for Data Science',
        description: 'Learn Python for data analysis and visualization.',
        instructorId: 'ad11ffa9-f4b0-4e8b-bbf0-e0f16c3854ce',
        subInstructorId: '00e813f9-59f4-40aa-bd60-1825d7606314',
        assignmentId: undefined,
        image_url: undefined,
        duration: '8 weeks',
        level: CourseLevel.INTERMEDIATE,
      },
      {
        id: 'c13d1e4f1-223b-4cdd-9f0e-0123456789a',
        name: 'Database Management',
        description: 'Introduction to database concepts and SQL.',
        instructorId: '123878ff-cd3d-4c94-aee3-cab0e0f6b27e',
        subInstructorId: undefined,
        assignmentId: undefined,
        image_url:
          'https://animationexplainers.com/wp-content/uploads/2022/04/Employee-Training.jpg',
        duration: '5 weeks',
        level: CourseLevel.BEGINNER,
      },
      {
        id: 'c14d1e4f1-223b-4cdd-9f0e-0123456789a',
        name: 'Cloud Computing Essentials',
        description: 'Understand cloud services and architecture.',
        instructorId: '00e813f9-59f4-40aa-bd60-1825d7606314',
        subInstructorId: 'ad11ffa9-f4b0-4e8b-bbf0-e0f16c3854ce',
        assignmentId: undefined,
        image_url: undefined,
        duration: '4 weeks',
        level: CourseLevel.ADVANCED,
      },
      {
        id: 'c15d1e4f1-223b-4cdd-9f0e-0123456789a',
        name: 'Artificial Intelligence',
        description: 'Explore AI concepts and applications.',
        instructorId: 'ad11ffa9-f4b0-4e8b-bbf0-e0f16c3854ce',
        subInstructorId: '123878ff-cd3d-4c94-aee3-cab0e0f6b27e',
        assignmentId: undefined,
        image_url:
          'https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-team-work-business_516790-1332.jpg',
        duration: '10 weeks',
        level: CourseLevel.EXPERT,
      },
      {
        id: 'c1d1e4f1-223b-4cdd-9f0e-0123456789ab',
        name: 'Introduction to Programming',
        description: 'Learn the basics of programming.',
        instructorId: '123878ff-cd3d-4c94-aee3-cab0e0f6b27e',
        subInstructorId: undefined,
        assignmentId: undefined,
        image_url: undefined,
        duration: '4 weeks',
        level: CourseLevel.BEGINNER,
      },
      {
        id: 'c2d1e4f1-223b-4cdd-9f0e-0123456789ab',
        name: 'Digital Marketing Strategy',
        description: 'Learn to create effective digital marketing plans.',
        instructorId: '123878ff-cd3d-4c94-aee3-cab0e0f6b27e',
        subInstructorId: undefined,
        assignmentId: undefined,
        image_url:
          'https://elearningindustry.com/wp-content/uploads/2021/03/shutterstock_745932934.png',
        duration: '6 weeks',
        level: CourseLevel.INTERMEDIATE,
      },
      {
        id: 'c3d1e4f1-223b-4cdd-9f0e-0123456789ab',
        name: 'Blockchain Fundamentals',
        description: 'Introduction to blockchain technology and its uses.',
        instructorId: '00e813f9-59f4-40aa-bd60-1825d7606314',
        subInstructorId: undefined,
        assignmentId: undefined,
        image_url: undefined,
        duration: '7 weeks',
        level: CourseLevel.BEGINNER,
      },
      {
        id: 'c4d1e4f1-223b-4cdd-9f0e-0123456789ab',
        name: 'Cybersecurity Advanced Practices',
        description: 'Advanced cybersecurity techniques and strategies.',
        instructorId: 'ad11ffa9-f4b0-4e8b-bbf0-e0f16c3854ce',
        subInstructorId: '00e813f9-59f4-40aa-bd60-1825d7606314',
        assignmentId: undefined,
        image_url:
          'https://as2.ftcdn.net/v2/jpg/02/24/04/75/1000_F_224047592_T6VWHi0A74jGZogmE3faVK7dcmteIMvc.jpg',
        duration: '9 weeks',
        level: CourseLevel.ADVANCED,
      },
      {
        id: 'c5d1e4f1-223b-4cdd-9f0e-0123456789ab',
        name: 'Mobile App Development',
        description: 'Learn to develop mobile applications.',
        instructorId: '123878ff-cd3d-4c94-aee3-cab0e0f6b27e',
        subInstructorId: 'ad11ffa9-f4b0-4e8b-bbf0-e0f16c3854ce',
        assignmentId: undefined,
        image_url: undefined,
        duration: '8 weeks',
        level: CourseLevel.INTERMEDIATE,
      },
      {
        id: 'c6d1e4f1-223b-4cdd-9f0e-0123456789ab',
        name: 'Project Management Essentials',
        description: 'Understand the basics of project management.',
        instructorId: '00e813f9-59f4-40aa-bd60-1825d7606314',
        subInstructorId: undefined,
        assignmentId: undefined,
        image_url:
          'https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-team-work-business_516790-1332.jpg',
        duration: '5 weeks',
        level: CourseLevel.BEGINNER,
      },
      {
        id: 'c7d1e4f1-223b-4cdd-9f0e-0123456789ab',
        name: 'Advanced Networking',
        description: 'Deep dive into networking protocols and configurations.',
        instructorId: 'ad11ffa9-f4b0-4e8b-bbf0-e0f16c3854ce',
        subInstructorId: '123878ff-cd3d-4c94-aee3-cab0e0f6b27e',
        assignmentId: undefined,
        image_url: undefined,
        duration: '10 weeks',
        level: CourseLevel.ADVANCED,
      },
      {
        id: 'c8d1e4f1-223b-4cdd-9f0e-0123456789ab',
        name: 'Advanced Data Structures',
        description: 'Deep dive into data structures.',
        instructorId: '00e813f9-59f4-40aa-bd60-1825d7606314',
        subInstructorId: '123878ff-cd3d-4c94-aee3-cab0e0f6b27e',
        assignmentId: undefined,
        image_url:
          'https://t3.ftcdn.net/jpg/02/25/25/54/360_F_225255468_JIVcux271IOhuPqqrsRtvXeKmq5iu944.jpg',
        duration: '6 weeks',
        level: CourseLevel.ADVANCED,
      },
      {
        id: 'c9d1e4f1-223b-4cdd-9f0e-0123456789ab',
        name: 'Machine Learning Techniques',
        description: 'Explore machine learning algorithms.',
        instructorId: 'ad11ffa9-f4b0-4e8b-bbf0-e0f16c3854ce',
        subInstructorId: undefined,
        assignmentId: undefined,
        image_url:
          'https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-team-work-business_516790-1332.jpg',
        duration: '8 weeks',
        level: CourseLevel.EXPERT,
      },
    ];

    for (const courseData of coursesData) {
      const instructor = await getUserById(courseData.instructorId);

      if (!instructor) continue;

      let subInstructor;
      if (courseData.subInstructorId) {
        subInstructor = await getUserById(courseData.subInstructorId);
      }

      if (!subInstructor) subInstructor = undefined;

      const course = new Course({
        ...courseData,
        instructor,
        subInstructor,
      });
      await courseRepository.save(course);
    }

    console.log('Courses seeded successfully');
  }
}
