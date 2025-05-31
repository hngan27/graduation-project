import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

export const questionList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('question list');
  }
);

export const questionDetail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`question detail: ${req.params.id}`);
  }
);

export const questionCreateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('question is created with method GET');
  }
);

export const questionCreatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('question is created with method POST');
  }
);

export const questionDeleteGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`question ${req.params.id} is deleted with method GET`);
  }
);

export const questionDeletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`question ${req.params.id} is deleted with method POST`);
  }
);

export const questionUpdateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`question ${req.params.id} is updated with method GET `);
  }
);

export const questionUpdatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`question ${req.params.id} is updated with method POST`);
  }
);
