import express from 'express';
import { search } from '../controllers/search.controller';

const router = express.Router();

// Route tìm kiếm khóa học và giảng viên
router.get('/search', search);

export default router;
