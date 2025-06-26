import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';
import {
  findUserByEmail,
  saveUser,
  authenticateUser,
} from '../services/auth.service';
import { UserRole } from '../enums/UserRole';
import { LoginDTO } from '../dtos/login.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthType } from '../enums/AuthType';
import { sendResetPasswordEmail } from '../utils/sendMailResetPassword';

export const loginGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.render('auth/login', {
      title: i18next.t('login.title'),
    });
  }
);

export const loginPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(LoginDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const formattedErrors = errors.map(err => ({
        param: err.property,
        msg: Object.values(err.constraints || {})[0],
      }));

      return res.render('auth/login', {
        title: i18next.t('login.title'),
        errors: formattedErrors,
        messages: { error: formattedErrors.map(err => err.msg) },
        attribute: req.body,
      });
    }

    const user = await authenticateUser(dto.email, dto.password);

    if (user) {
      if (!user.active) {
        return res.render('auth/login', {
          title: i18next.t('login.title'),
          attribute: req.body,
          error_message: i18next.t('login.errors.blocked'),
        });
      }
      // Lưu thông tin người dùng vào session
      req.session.user = user;
      // Đảm bảo lưu session trước khi chuyển hướng
      req.session.save(err => {
        if (err) return next(err);
        if (user.role === UserRole.ADMIN) {
          return res.redirect('/admin');
        }
        return res.redirect('/');
      });
      return;
    } else {
      res.render('auth/login', {
        title: i18next.t('login.title'),
        attribute: req.body,
        error_message: i18next.t('login.errors.invalid_credentials'),
      });
    }
  }
);

export const forgotPasswordGet = asyncHandler(
  async (req: Request, res: Response) => {
    res.render('auth/forgot-password', {
      title: req.t('forgot_password.title'),
    });
  }
);

export const forgotPasswordPost = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      req.flash('error', req.t('error.userNotFound'));
      return res.redirect('back');
    }
    // Generate new random 8-char password
    const newPassword = Math.random().toString(36).slice(-8);
    user.hash_password = await user.hashPassword(newPassword, AuthType.LOCAL);
    await saveUser(user);

    // Send reset password email
    await sendResetPasswordEmail(user.email, newPassword);

    req.flash('success', req.t('reset_password.sent'));
    res.redirect('/auth/login');
  }
);

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
