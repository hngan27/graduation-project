import { Router, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { RequestWithCourseID } from '../helpers/lesson.helper';
import { requireUser } from '../middleware/require-user.middleware';
import { requireInstructor } from '../middleware/require-instructor.middleware';
import * as examQuestionController from '../controllers/examQuestion.controller';

const router = Router({ mergeParams: true });

// All routes require logged-in instructor
router.use((req: RequestWithCourseID, res: Response, next: NextFunction) => {
  // courseID already set by parent router
  next();
});
router.use(requireUser, requireInstructor);

// List questions for an exam
router.get('/', examQuestionController.questionListGet);

// Create a question
router.get('/create', examQuestionController.questionCreateGet);
router.post('/create', examQuestionController.questionCreatePost);

// Update a question
router.get('/:questionId/update', examQuestionController.questionUpdateGet);
router.post('/:questionId/update', examQuestionController.questionUpdatePost);

// Delete a question
router.get('/:questionId/delete', examQuestionController.questionDeleteGet);
router.post('/:questionId/delete', examQuestionController.questionDeletePost);

export default router;
