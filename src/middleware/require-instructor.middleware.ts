import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../enums/UserRole';

export const requireInstructor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSession = req.session.user;
  if (
    !userSession ||
    (userSession.role !== UserRole.INSTRUCTOR &&
      userSession.role !== UserRole.ADMIN)
  ) {
    req.flash('error', req.t('error.permissionDenied'));
    return res.redirect('/auth/login');
  }
  next();
};
