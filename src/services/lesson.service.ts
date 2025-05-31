import { StudentLesson } from '../entity/student_lesson.entity';
import { AppDataSource } from '../config/data-source';
import { Lesson } from '../entity/lesson.entity';
import { Course } from '../entity/course.entity';
import { formatDateTime } from '../helpers/date.helper';
import { User } from '../entity/user.entity';

const lessonRepository = AppDataSource.getRepository(Lesson);
const courseRepository = AppDataSource.getRepository(Course);
const studentLessonRepository = AppDataSource.getRepository(StudentLesson);

export const getLessonList = async (userId: string, courseId: string) => {
  const lessons = await lessonRepository.find({
    relations: ['courses', 'studentLessons', 'studentLessons.student'],
    where: { courses: { id: courseId } },
    order: {
      created_at: 'ASC',
    },
  });

  const lessonsWithDoneStatus = lessons.map(lesson => {
    const studentLesson = lesson.studentLessons.find(
      sl => sl.student.id === userId
    );
    return {
      ...lesson,
      done: studentLesson ? studentLesson.done : false,
    };
  });
  return lessonsWithDoneStatus;
};

export const getLessonListAdmin = async (courseId: string) => {
  const lessons = await lessonRepository.find({
    relations: ['courses', 'studentLessons', 'studentLessons.student'],
    where: { courses: { id: courseId } },
    order: {
      created_at: 'ASC',
    },
  });
  const lessonsWithFormat = lessons.map(lesson => {
    return {
      ...lesson,
    };
  });
  return lessonsWithFormat;
};

export const getLessonById = async (id: string) =>
  await lessonRepository.findOne({ where: { id } });

export const getLessonsByCourseId = async (
  courseId: string
): Promise<Lesson[]> => {
  return lessonRepository
    .createQueryBuilder('lesson')
    .innerJoin('lesson.courses', 'course')
    .where('course.id = :courseId', { courseId })
    .orderBy('lesson.created_at', 'ASC')
    .getMany();
};

export const markDoneLesson = async (id: string) => {
  const studentLesson = await studentLessonRepository.findOne({
    where: { id },
    relations: ['lesson'],
  });
  if (!studentLesson) {
    return;
  }
  studentLesson.done = !studentLesson.done;
  await studentLessonRepository.save(studentLesson);
  return studentLesson;
};

export const createLesson = async (
  course: Course,
  title: string,
  content: string,
  file_url: string
) => {
  const lesson = new Lesson({
    title,
    content,
    file_url,
    courses: [course],
    created_at: new Date(),
  });
  return await lessonRepository.save(lesson);
};

export const updateLessonById = async (
  lessonId: string,
  courses: Course[],
  title?: string,
  content?: string,
  file_url?: string,
  studentLessons?: StudentLesson[]
) => {
  const lesson = await getLessonById(lessonId);
  if (!lesson) return;
  const lessonUpdate = new Lesson({
    title,
    content,
    file_url,
    courses,
    studentLessons,
  });
  Object.assign(lesson, lessonUpdate);
  return await lessonRepository.save(lesson);
};

export const getLessonListOfInstructor = async (instructor: User) => {
  return lessonRepository.find({
    relations: ['courses', 'courses.instructor', 'courses.subInstructor'],
    where: [
      {
        courses: { instructor: { id: instructor.id } },
      },
      {
        courses: { subInstructor: { id: instructor.id } },
      },
    ],
    order: { title: 'ASC' },
  });
};

export const getStudentLessonByLessonId = async (lessonId: string) => {
  return await studentLessonRepository.find({
    where: {
      lesson: {
        id: lessonId,
      },
    },
  });
};

export const deleteLessonByLessonId = async (
  courseId: string,
  lessonId: string
) => {
  const course = await courseRepository.findOne({
    where: {
      id: courseId,
    },
    relations: ['lessons'],
  });
  if (!course) {
    return;
  }
  course.lessons = course.lessons.filter(l => l.id !== lessonId);
  await courseRepository.save(course);
  return await lessonRepository.delete(lessonId);
};
