import pug from 'pug';
import path from 'path';
import sendEmail, { mailOptionsTemplate } from '../config/nodemailer-config';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';
import { User } from '../entity/user.entity';
import {
  findUserByUsername,
  findUserByEmail,
  saveUser,
  authenticateUser,
} from '../services/auth.service';
import { UserRole } from '../enums/UserRole';
import { RegisterDTO } from '../dtos/register.dto';
import { LoginDTO } from '../dtos/login.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Specialization } from '../enums/Specialization';
import { AuthType } from '../enums/AuthType';
import { EXPIRED_TIME } from '../constants';
import { sendResetPasswordEmail } from '../utils/sendMailResetPassword';

export const registerGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.render('auth/register', {
      title: i18next.t('register.title'),
    });
  }
);

export const registerPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Chuyển đổi body thành đối tượng RegisterDTO
    const dto = plainToClass(RegisterDTO, req.body);

    // Xác thực dữ liệu DTO
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.render('auth/register', {
        user: dto,
        attribute: req.body,
        errors: errors.map(err => ({
          param: err.property,
          msg: Object.values(err.constraints || {})[0],
        })),
      });
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const userExists = await findUserByUsername(dto.username);
    if (userExists) {
      return res.render('auth/register', {
        user: dto,
        attribute: req.body,
        error_message: i18next.t('username_exists'),
      });
    }

    // Tạo đối tượng User mới
    const user = new User();
    user.name = dto.name;
    user.username = dto.username;
    user.email = dto.email;
    user.hash_password = await user.hashPassword(dto.password, AuthType.LOCAL);
    user.specialization = dto.specialization || Specialization.NONE;

    if (dto.role === UserRole.INSTRUCTOR) {
      user.about = dto.about || '';
      user.role = UserRole.PENDING_APPROVAL; // Đặt trạng thái là PENDING_APPROVAL
    } else {
      user.role = UserRole.STUDENT;
    }

    // Lưu người dùng vào cơ sở dữ liệu
    await saveUser(user);

    // Gửi mã xác thực đến email
    res.redirect(`/auth/verify/${encodeURIComponent(user.email)}`);
  }
);

export const verifyGet = asyncHandler(async (req: Request, res: Response) => {
  const email = req.params.email;

  const user = await findUserByEmail(email);
  if (!user) {
    req.flash('error', req.t('error.userNotFound'));
    return res.redirect('back');
  }

  // Send authentication code to email
  const authCode = user.generateAuthCode();
  user.authCode = authCode;
  user.authCodeExpires = new Date(Date.now() + EXPIRED_TIME);
  user.isVerify = false;

  await saveUser(user);

  const htmlContent = pug.renderFile(
    path.join(__dirname, '../views/emails/authenticate.pug'),
    {
      authCode,
    }
  );

  const mailOptions = {
    ...mailOptionsTemplate,
    to: [user.email],
    subject: '[Smart Education] Account Authentication Code',
    html: htmlContent,
  };

  sendEmail(mailOptions);

  res.render('auth/verify', {
    title: req.t('title.verify_account'),
    email,
  });
});

export const verifyPost = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    req.flash('error', req.t('error.userNotFound'));
    return res.redirect('/auth/login');
  }

  if (user.authCode !== code || user.authCodeExpires < new Date()) {
    req.flash('error', req.t('error.invalidCode'));
    return res.redirect(`/auth/verify/${encodeURIComponent(user.email)}`);
  }

  // Code is valid, active the user
  user.authCode = '';
  user.authCodeExpires = new Date();
  user.isVerify = true;
  await saveUser(user);

  // Thông báo cho người dùng
  if (user.role === UserRole.PENDING_APPROVAL) {
    req.flash('error', i18next.t('register.instructor_pending_approval'));
    return res.redirect('/auth/login');
  }

  req.flash('success', i18next.t('user_saved'));

  req.session.user = user;

  // Chuyển hướng đến trang chính
  if (user.role === UserRole.ADMIN) {
    res.redirect('/admin');
  } else {
    res.redirect('/');
  }
});

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

export const googleCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(400).json({ error: 'Authentication failed' });
    }

    const user = req.user as User;

    if (user.role === UserRole.PENDING_APPROVAL) {
      return res.render('auth/login', {
        title: i18next.t('login.title'),
        error_message: i18next.t('login.errors.pending_approval'),
      });
    }

    req.session.user = user;
    res.redirect('/');
  }
);
