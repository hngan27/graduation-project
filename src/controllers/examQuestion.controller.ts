import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { RequestWithCourseID } from '../helpers/lesson.helper';
import { getExamById, getQuestionsByExamId } from '../services/exam.service';
import { getQuestionById as fetchQuestionById } from '../services/exam.service';
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../services/examQuestion.service';
import { AppDataSource } from '../config/data-source';
import { Question } from '../entity/question.entity';
import { Option } from '../entity/option.entity';
import { UserRole } from '../enums/UserRole';

// List questions
export const questionListGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const examId = req.params.id;
    const exam = await getExamById(examId);
    if (!exam) {
      req.flash('error', req.t('error.notFound'));
      return res.redirect(`/courses/${req.courseID}/manage`);
    }
    const questions = await getQuestionsByExamId(examId);
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render(
      user.role === UserRole.ADMIN ? 'admin/question-list' : 'exams/questions/list', {
      title: req.t('exam.listQuestions'),
      courseID: req.courseID,
      exam,
      questions,
    });
  }
);

// Show create form
export const questionCreateGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const examId = req.params.id;
    res.render('exams/questions/form', {
      title: req.t('exam.createQuestion'),
      courseID: req.courseID,
      examId,
      question: null,
      options: Array(4).fill({ content: '', is_correct: false }),
      action: `/courses/${req.courseID}/exam/${examId}/questions/create`,
    });
  }
);

// Handle create
export const questionCreatePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const examId = req.params.id;
    const content = req.body.content as string;
    const opts = Array.isArray(req.body.options)
      ? (req.body.options as string[])
      : [req.body.options as string];
    const correct = req.body.correct as string;
    await createQuestion(examId, content, opts, correct);
    res.redirect(`/courses/${req.courseID}/exam/${examId}/questions`);
  }
);

// Show update form
export const questionUpdateGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const examId = req.params.id;
    const questionId = req.params.questionId;
    const repository = AppDataSource.getRepository(Question);
    const question = await repository.findOne({
      where: { id: questionId },
      relations: ['options'],
    });
    if (!question) {
      req.flash('error', req.t('error.notFound'));
      return res.redirect(`/courses/${req.courseID}/exam/${examId}/questions`);
    }
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render(
      user.role === UserRole.ADMIN ? 'admin/question-form' : 'exams/questions/form', {
      title: req.t('exam.editQuestion'),
      courseID: req.courseID,
      examId,
      question,
      options: question.options,
      action: `/courses/${req.courseID}/exam/${examId}/questions/${questionId}/update`,
    });
  }
);

// Handle update
export const questionUpdatePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const examId = req.params.id;
    const questionId = req.params.questionId;
    const content = req.body.content as string;
    const opts = Array.isArray(req.body.options)
      ? (req.body.options as string[])
      : [req.body.options as string];
    const correct = req.body.correct as string;
    await updateQuestion(questionId, content, opts, correct);
    res.redirect(`/courses/${req.courseID}/exam/${examId}/questions`);
  }
);

// Show delete confirm
export const questionDeleteGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const examId = req.params.id;
    const questionId = req.params.questionId;
    const repository = AppDataSource.getRepository(Question);
    const question = await repository.findOne({ where: { id: questionId } });
    if (!question) {
      req.flash('error', req.t('error.notFound'));
      return res.redirect(`/courses/${req.courseID}/exam/${examId}/questions`);
    }
    res.render('exams/questions/delete', {
      title: req.t('exam.deleteQuestion'),
      courseID: req.courseID,
      examId,
      question,
      action: `/courses/${req.courseID}/exam/${examId}/questions/${questionId}/delete`,
    });
  }
);

// Handle delete
export const questionDeletePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const examId = req.params.id;
    const questionId = req.params.questionId;
    await deleteQuestion(questionId);
    res.redirect(`/courses/${req.courseID}/exam/${examId}/questions`);
  }
);
