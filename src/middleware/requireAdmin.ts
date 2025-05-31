import { Request, Response, NextFunction } from 'express';
import i18next from 'i18next';
import { UserRole } from '../enums/UserRole';

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user || req.session.user.role !== UserRole.ADMIN) {
    req.flash('error', i18next.t('error.unauthorized'));
    return res.redirect('/auth/login');
  }
  next();
};
