import { Router } from 'express';
import { getRecs } from '../controllers/recommendation.controller';
import { requireUser } from '../middleware/require-user.middleware';

const router = Router();
router.get('/api/recommendations', requireUser, getRecs);
export default router;