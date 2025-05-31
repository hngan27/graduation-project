import { Router } from 'express';
import * as courseController from '../controllers/course.controller';
import { requireInstructor } from '../middleware/require-instructor.middleware';
import upload from '../config/multer-config';

const router: Router = Router();

router.get('/create', requireInstructor, courseController.courseCreateGet);

router.post(
  '/create',
  [requireInstructor, upload.single('image')],
  courseController.courseCreatePost
);

router.get('/:id/delete', requireInstructor, courseController.courseDeleteGet);

router.post(
  '/:id/delete',
  requireInstructor,
  courseController.courseDeletePost
);

router.get('/:id/update', requireInstructor, courseController.courseUpdateGet);

router.post(
  '/:id/update',
  [requireInstructor, upload.single('image')],
  courseController.courseUpdatePost
);

router.get('/:id/manage', courseController.courseManageGet);

router.get('/:id/enroll', courseController.courseEnrollGet);

router.get('/:enrollmentId/approve', courseController.approveEnrollGet);

router.get('/:enrollmentId/reject', courseController.rejectEnrollGet);

router.get(
  '/:id/:enrollmentId/delete',
  requireInstructor,
  courseController.courseManageGet
);

router.post(
  '/:id/:enrollmentId/delete',
  requireInstructor,
  courseController.deleteEnrollPost
);

router.post('/:id/favorite', courseController.addFavoriteCourse);
router.delete('/:id/favorite', courseController.removeFavoriteCourse);

router.get('/:id', courseController.courseDetail);

router.get('/', courseController.courseList);

export default router;
