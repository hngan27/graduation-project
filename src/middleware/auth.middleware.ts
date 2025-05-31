import { Request, Response, NextFunction } from 'express';

export const sessionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.user) {
    // Nếu có userId trong session, lưu thông tin người dùng vào res.locals
    res.locals.current_user = req.session.user;
  }
  next();
};
