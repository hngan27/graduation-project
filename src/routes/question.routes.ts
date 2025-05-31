import { Router } from 'express';
import * as questionController from '../controllers/question.controller';

const router: Router = Router();

router.get('/create', questionController.questionCreateGet);

router.post('/create', questionController.questionCreatePost);

router.get('/:id/delete', questionController.questionDeleteGet);

router.post('/:id/delete', questionController.questionDeletePost);

router.get('/:id/update', questionController.questionUpdateGet);

router.post('/:id/update', questionController.questionUpdatePost);

router.get('/:id', questionController.questionDetail);

router.get('/', questionController.questionList);

export default router;
