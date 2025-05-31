import { Request, Response, NextFunction } from 'express';

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSession = req.session.user;
  if (!userSession) {
    return res.redirect('/auth/login');
  }
  next();
};
