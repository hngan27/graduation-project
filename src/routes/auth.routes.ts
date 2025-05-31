import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import passport from 'passport';

const router: Router = Router();

router.get('/register', authController.registerGet);
router.post('/register', authController.registerPost);

router.get('/verify/:email', authController.verifyGet);
router.post('/verify', authController.verifyPost);

router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);

// Forgot Password
router.get('/forgot-password', authController.forgotPasswordGet);
router.post('/forgot-password', authController.forgotPasswordPost);

router.get('/logout', authController.logout);

// Định tuyến để bắt đầu quy trình xác thực Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Định tuyến để xử lý callback từ Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    accessType: 'offline',
    scope: ['email', 'profile'],
    failureRedirect: '/',
  }),
  authController.googleCallback
);

export default router;
