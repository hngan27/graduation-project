import { NextFunction, Response, Request } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createLesson,
  deleteLessonByLessonId,
  getLessonById,
  getLessonList,
  getStudentLessonByLessonId,
  markDoneLesson,
  updateLessonById,
} from '../services/lesson.service';
import { RequestWithCourseID } from '../helpers/lesson.helper';
import { getCourseById } from '../services/course.service';
import { getBestGradeByCourseId } from '../services/exam.service';
import cloudinary from '../config/cloudinary-config';
import fs from 'fs';
import i18next from 'i18next';
import {
  dateFromTimeAndDate,
  timeAndDateFromDateObject,
} from '../helpers/date.helper';
import { AppDataSource } from '../config/data-source';
import { Lesson } from '../entity/lesson.entity';
import { StudentLesson } from '../entity/student_lesson.entity';
import { logCourseInteraction } from '../services/courseInteraction.service';
import { interactionWeight } from '../constants';
import { UserRole } from '../enums/UserRole';

export const getLessonDetail = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const userSession = req.session.user;
    if (!userSession) {
      res.redirect('/auth/login');
      return;
    }
    const lessonList = await getLessonList(userSession.id, req.courseID!);
    const lessonDetail = lessonList.find(lesson => lesson.id === req.params.id);
    const studentLesson = lessonDetail?.studentLessons.find(
      studentLesson => studentLesson.student.id === userSession.id
    );
    const grade = await getBestGradeByCourseId(req.courseID!, userSession.id);
    res.render('lessons/index', {
      title: req.t('title.lesson_detail'),
      lessonList,
      examStatus: grade?.status,
      lessonDetail,
      courseID: req.courseID,
      studentLessonId: studentLesson?.id,
    });
  }
);

export const lessonList = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const userSession = req.session.user;
    if (!userSession) {
      res.redirect('/auth/login');
      return;
    }
    const lessonList = await getLessonList(userSession.id, req.courseID!);
    const courseDetail = await getCourseById(req.courseID!);
    const grade = await getBestGradeByCourseId(req.courseID!, userSession.id);
    res.render('lessons/index', {
      title: req.t('title.list_lesson'),
      lessonList,
      examStatus: grade?.status,
      courseDetail,
      courseID: req.courseID,
    });
  }
);

export const lessonCreateGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render(
      user.role === UserRole.ADMIN ? 'admin/lesson-form' : 'lessons/form',
      {
        title: req.t('lesson.create'),
        courseID: req.courseID,
      }
    );
  }
);

export const lessonCreatePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const courseId = req.courseID;
    const course = await getCourseById(courseId!);

    if (!course) {
      req.flash('error', i18next.t('error.courseNotFound'));
      res.redirect('/error');
      return;
    }

    let file_url = '';
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'files',
        resource_type: 'auto',
      });
      file_url = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const title = req.body.title;
    const content = req.body.content;
    await createLesson(course, title, content, file_url);
    res.redirect(`/courses/${courseId}/manage`);
  }
);

export const lessonDeleteGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const lessonId = req.params.id;
    const studentLesson = await getStudentLessonByLessonId(lessonId);
    const lesson = await getLessonById(lessonId);
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render(
      user.role === UserRole.ADMIN ? 'admin/lesson-delete' : 'lessons/delete',{
      courseID: req.courseID,
      studentLesson,
      lesson,
    });
  }
);

export const lessonDeletePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const lessonId = req.params.id;
    const courseId = req.courseID;
    await deleteLessonByLessonId(courseId!, lessonId);
    res.redirect(`/courses/${req.courseID}/manage`);
  }
);

export const lessonUpdateGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/login');
    }
    const lessonDetail = await getLessonById(req.params.id);
    if (!lessonDetail) {
      req.flash('error', i18next.t('error.lessonNotFound'));
      res.redirect('/error');
      return;
    }
    const lesson = { ...lessonDetail };
    res.render(user.role === UserRole.ADMIN
      ? 'admin/lesson-form'
      : 'lessons/form', {
      title: req.t('lesson.edit'),
      courseID: req.courseID,
      lesson,
    });
  }
);

export const lessonUpdatePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const courseId = req.courseID;
    const lessonId = req.params.id;

    const course = await getCourseById(courseId!);
    if (!course) {
      req.flash('error', i18next.t('error.courseNotFound'));
      res.redirect('/error');
      return;
    }

    const lessonDetail = await getLessonById(lessonId);
    if (!lessonDetail) {
      req.flash('error', i18next.t('error.lessonNotFound'));
      return res.redirect('/error');
    }
    let file_url = lessonDetail.file_url;
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'files',
        resource_type: 'auto',
      });
      file_url = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const title = req.body.title;
    const content = req.body.content;
    const studyTime = req.body.studyTime;
    const studyDate = req.body.studyDate;
    const study_time = dateFromTimeAndDate(studyTime, studyDate);

    await updateLessonById(lessonId, [course], title, content, file_url);
    res.redirect(`/courses/${courseId}/manage`);
  }
);

export const markDoneLessonPost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const studentLessonId = req.body.studentLessonId;
    let studentLessonRecord;
    if (studentLessonId) {
      studentLessonRecord = await markDoneLesson(studentLessonId);
    } else {
      // create new record if missing
      const lessonId = req.params.id;
      const lessonRepo = AppDataSource.getRepository(Lesson);
      const lesson = await lessonRepo.findOne({ where: { id: lessonId } });
      if (!lesson) {
        return res.redirect(`/courses/${req.courseID}/lessons/${lessonId}`);
      }
      const userSession = req.session.user!;
      const studentRepo = AppDataSource.getRepository(StudentLesson);
      const newStudentLesson = new StudentLesson({
        student: { id: userSession.id } as any,
        lesson,
        done: true,
      });
      studentLessonRecord = await studentRepo.save(newStudentLesson);
    }
    // Log lesson completion interaction
    if (studentLessonRecord) {
      const userSession = req.session.user!;
      const course = await getCourseById(req.courseID!);
      if (userSession && course) {
        await logCourseInteraction(
          userSession,
          course,
          'lesson_done',
          studentLessonRecord.lesson.id,
          interactionWeight.lesson_done
        );
      }
    }
    if (!studentLessonRecord) {
      return res.redirect(`/courses/${req.courseID}/lessons/${req.params.id}`);
    }
    res.redirect(
      `/courses/${req.courseID}/lessons/${studentLessonRecord.lesson.id}`
    );
  }
);
