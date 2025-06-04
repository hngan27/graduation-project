import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createAnswersFromExam,
  getExamById,
  getBestGradeByCourseId,
  updateGradeWhenStartExam,
  updateGradeWhenSubmitExam,
  getQuestionsByExamId,
  getResultOfExam,
  getResultOfExamByGradeId,
  updateGradeById,
  getExamByCourseId,
} from '../services/exam.service';
import { RequestWithCourseID } from '../helpers/lesson.helper';
import { validateUserCurrent } from './user.controller';
import { getUserById } from '../services/user.service';
import { getLessonList } from '../services/lesson.service';
import { AppDataSource } from '../config/data-source';
import { Assignment } from '../entity/assignment.entity';
import { Course } from '../entity/course.entity';
import { logCourseInteraction } from '../services/courseInteraction.service';
import { interactionWeight } from '../constants';

export const examList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('exam list');
  }
);

export const getExamInfo = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const userSession = req.session.user!;
    const lessonList = await getLessonList(userSession.id, req.courseID!);
    const grade = await getBestGradeByCourseId(req.courseID!, userSession.id);
    const exam = await getExamByCourseId(req.courseID!);
    res.render('lessons/index', {
      title: req.t('lesson.finalExam'),
      lessonList,
      examStatus: grade?.status,
      grade,
      exam,
      courseID: req.courseID,
    });
  }
);

export const getExamDetail = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const userSession = req.session.user!;
    const questions = await getQuestionsByExamId(req.params.id);
    const exam = await getExamById(req.params.id);
    await updateGradeWhenStartExam(exam!, userSession);

    res.render('exams/detail', {
      title: req.t('exam.doExam'),
      questions,
      exam,
      courseID: req.courseID,
      selectedAnswers: req.session.selectedAnswers || {},
    });
  }
);

export const saveAnswer = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const { questionId, answerId } = req.body;

    if (!req.session.selectedAnswers) {
      req.session.selectedAnswers = {};
    }

    req.session.selectedAnswers[questionId] = answerId;

    res.json({ success: true, message: 'Answer saved' });
  }
);

export const examCreateGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    res.render('exams/form', {
      title: req.t('exam.createExam'),
      courseID: req.courseID,
      exam: null,
      action: `/courses/${req.courseID}/exam/create`,
    });
  }
);

export const examCreatePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const { name, description, deadline, time_limit, attempt_limit } =
      req.body as Record<string, string>;
    const courseRepo = AppDataSource.getRepository(Course);
    const assignmentRepo = AppDataSource.getRepository(Assignment);
    const course = await courseRepo.findOne({
      where: { id: req.courseID! },
      relations: ['assignment'],
    });
    if (!course) {
      req.flash('error', req.t('error.courseNotFound'));
      return res.redirect('/error');
    }
    // Prevent duplicate assignment for the same course
    const existing = await assignmentRepo.findOne({
      where: { course: { id: req.courseID! } },
    });
    if (existing) {
      req.flash('error', req.t('exam.alreadyExists'));
      return res.redirect(`/courses/${req.courseID}/manage`);
    }
    const assignment = new Assignment({
      name,
      description,
      time_limit: time_limit ? Number(time_limit) : undefined,
      attempt_limit: attempt_limit ? Number(attempt_limit) : undefined,
      course,
    });
    await assignmentRepo.save(assignment);
    // Update course.assignment to show in management view
    course.assignment = assignment;
    await courseRepo.save(course);
    return res.redirect(`/courses/${req.courseID}/manage`);
  }
);

export const examDeleteGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const exam = await getExamById(req.params.id);
    if (!exam) {
      req.flash('error', req.t('error.notFound'));
      return res.redirect(`/courses/${req.courseID}/manage`);
    }
    res.render('exams/delete', {
      title: req.t('exam.deleteExam'),
      courseID: req.courseID,
      exam,
      action: `/courses/${req.courseID}/exam/${exam.id}/delete`,
    });
  }
);

export const examDeletePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    await AppDataSource.getRepository(Assignment).delete(req.params.id);
    res.redirect(`/courses/${req.courseID}/manage`);
  }
);

export const examUpdateGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const exam = await getExamById(req.params.id);
    if (!exam) {
      req.flash('error', req.t('error.notFound'));
      return res.redirect(`/courses/${req.courseID}/manage`);
    }
    res.render('exams/form', {
      title: req.t('exam.editExam'),
      courseID: req.courseID,
      exam,
      action: `/courses/${req.courseID}/exam/${exam.id}/update`,
    });
  }
);

export const examUpdatePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const { name, description, deadline, time_limit, attempt_limit } =
      req.body as Record<string, string>;
    const repository = AppDataSource.getRepository(Assignment);
    const exam = await repository.findOne({
      where: { id: req.params.id },
      relations: ['course'],
    });
    if (!exam) {
      req.flash('error', req.t('error.notFound'));
      return res.redirect(`/courses/${req.courseID}/manage`);
    }
    exam.name = name;
    exam.description = description;
    exam.time_limit = time_limit ? Number(time_limit) : undefined;
    exam.attempt_limit = attempt_limit ? Number(attempt_limit) : undefined;
    await repository.save(exam);
    res.redirect(`/courses/${req.courseID}/manage`);
  }
);

export const submitExam = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await validateUserCurrent(req, res, next);
    req.session.selectedAnswers = {};
    const questions = await getQuestionsByExamId(req.params.id);
    const answers = req.body as { [key: string]: string };
    let user;
    for (const question of questions) {
      const optionId = answers[question.id];
      user = await getUserById(res.locals.user.id);
      await createAnswersFromExam(question!, user!, optionId);
    }
    // Ghi log tương tác khi nộp bài thi
    const exam = await getExamById(req.params.id);
    if (user && exam && exam.course) {
      // Tính điểm
      const result = await getResultOfExam(user.id, exam.id);
      const score = result?.score ?? 0;
      await logCourseInteraction(
        user,
        exam.course,
        'quiz_done',
        exam.id,
        interactionWeight.quiz_done
      );
    }
    res.redirect(`${req.params.id}/result`);
  }
);

export const resultExam = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const userSession = req.session.user!;
    const gradeId = req.query.grade as string;
    if (gradeId) {
      const result = await getResultOfExamByGradeId(gradeId);
      const detailAnswers = result?.answers;
      const score = result?.score;
      const exam = result?.grade.assignment;
      const grade = result?.grade;
      res.render('exams/result', {
        title: req.t('exam.viewResult'),
        detailAnswers,
        score,
        exam,
        grade,
        courseID: req.courseID,
        gradeId,
      });
    } else {
      const exam = await getExamById(req.params.id);
      const result = await getResultOfExam(userSession.id, req.params.id);
      const detailAnswers = result?.filteredAnswers;
      const score = result?.score;
      const totalQuestions = result?.filteredAnswers.length;
      await updateGradeWhenSubmitExam(
        exam!,
        userSession,
        score,
        totalQuestions
      );

      res.render('exams/result', {
        title: req.t('exam.viewResult'),
        detailAnswers,
        score,
        exam,
        courseID: req.courseID,
      });
    }
  }
);

export const addFeedBackPost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const gradeId = req.query.grade as string;
    const courseId = req.courseID;
    const feedback = req.body.feedback;
    await updateGradeById(gradeId, feedback);
    res.redirect(`/courses/${courseId}/manage`);
  }
);
