import { Router, Response, NextFunction } from 'express';
import * as examController from '../controllers/exam.controller';
import { RequestWithCourseID } from '../helpers/lesson.helper';
import { requireUser } from '../middleware/require-user.middleware';
import { requireInstructor } from '../middleware/require-instructor.middleware';
import questionRouter from './examQuestion.routes';

const router: Router = Router();

router.use((req: RequestWithCourseID, res: Response, next: NextFunction) => {
  req.courseID = req.baseUrl.split('/')[2];
  next();
});

router.use(requireUser);

router.get('/create', requireInstructor, examController.examCreateGet);

router.post('/create', requireInstructor, examController.examCreatePost);

router.get('/:id/delete', requireInstructor, examController.examDeleteGet);

router.post('/:id/delete', requireInstructor, examController.examDeletePost);

router.get('/:id/update', requireInstructor, examController.examUpdateGet);

router.post('/:id/update', requireInstructor, examController.examUpdatePost);

router.post('/:id/save-answer', examController.saveAnswer);

router.post('/:id/result', examController.addFeedBackPost);

router.get('/:id/result', examController.resultExam);

router.get('/:id', examController.getExamDetail);

router.post('/:id', examController.submitExam);

router.get('/', examController.getExamInfo);

// Question management routes
router.use('/:id/questions', questionRouter);

export default router;
