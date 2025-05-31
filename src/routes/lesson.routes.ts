import { Router, Response, NextFunction } from 'express';
import * as lessonController from '../controllers/lesson.controller';
import { RequestWithCourseID } from '../helpers/lesson.helper';
import upload from '../config/multer-config';

const router: Router = Router();

router.use((req: RequestWithCourseID, res: Response, next: NextFunction) => {
  req.courseID = req.baseUrl.split('/')[2];
  next();
});

router.get('/create', lessonController.lessonCreateGet);

router.post(
  '/create',
  upload.single('file'),
  lessonController.lessonCreatePost
);

router.get('/:id/delete', lessonController.lessonDeleteGet);

router.post('/:id/delete', lessonController.lessonDeletePost);

router.get('/:id/update', lessonController.lessonUpdateGet);

router.post(
  '/:id/update',
  upload.single('file'),
  lessonController.lessonUpdatePost
);

router.get('/:id', lessonController.getLessonDetail);

router.get('/', lessonController.lessonList);

router.post('/:id', lessonController.markDoneLessonPost);

export default router;
