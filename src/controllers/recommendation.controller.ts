import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Recommendation } from '../entity/recommendation.entity';

export const getRecs = async (req: Request, res: Response) => {
  const userSession = req.session?.user;
  if (!userSession) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const userId = userSession.id;
  const recs = await AppDataSource.getRepository(Recommendation).find({
    where: { user: { id: userId } },
    relations: ['course'],
    order: { score: 'DESC' },
  });
  res.json(
    recs.map(r => ({
      id: r.course.id,
      name: r.course.name,
      score: r.score,
    }))
  );
};
