import { Router } from 'express';
import homeRouter from './home.routes';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import courseRouter from './course.routes';
import lessonRouter from './lesson.routes';
import examRouter from './exam.routes';
import questionRouter from './question.routes';
import searchRouter from './search.routes';
import adminRouter from './admin.routes';
import upload from '../config/multer-config';
import chatRouter from './chat.routes';

import {
  getUserProfile,
  userUpdateProfileGet,
  userUpdateProfilePost,
} from '../controllers/user.controller';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/courses', courseRouter);
router.use('/courses/:courseId/lessons', lessonRouter);
router.use('/courses/:courseId/exam', examRouter);
router.use('/questions', questionRouter);
router.use('/', searchRouter);
router.use('/', homeRouter);
router.use('/admin', adminRouter);
router.use('/chat', chatRouter);
router.get('/profile', getUserProfile);
router.get('/profile/update', userUpdateProfileGet);
router.post('/profile/update', upload.single('avatar'), userUpdateProfilePost);

export default router;
