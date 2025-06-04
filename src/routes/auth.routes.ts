import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import passport from 'passport';

const router: Router = Router();

router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);

// Forgot Password
router.get('/forgot-password', authController.forgotPasswordGet);
router.post('/forgot-password', authController.forgotPasswordPost);

router.get('/logout', authController.logout);

export default router;
