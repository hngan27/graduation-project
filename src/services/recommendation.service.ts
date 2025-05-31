import { AppDataSource } from '../config/data-source';
import { CourseInteraction } from '../entity/course_interaction.entity';
import { interactionWeight } from '../constants';
import { Course } from '../entity/course.entity';
import { User } from '../entity/user.entity';
import { Recommendation } from '../entity/recommendation.entity';

export interface Feedback {
  userId: string;
  courseId: string;
  score: number;
}

export async function getAggregatedFeedback(): Promise<Feedback[]> {
  const repo = AppDataSource.getRepository(CourseInteraction);
  const logs = await repo.find({ relations: ['user', 'course'] });

  // key = `${userId}__${courseId}`
  const map = new Map<string, number>();
  logs.forEach(l => {
    const uid = l.user.id;
    const cid = l.course.id;
    const w =
      l.value != null ? l.value : interactionWeight[l.interaction_type] || 1;
    const key = `${uid}__${cid}`;
    map.set(key, (map.get(key) || 0) + w);
  });

  return Array.from(map.entries()).map(([key, score]) => {
    const [userId, courseId] = key.split('__');
    return { userId, courseId, score };
  });
}

export const saveRecommendation = async (
  userId: string,
  courseId: string,
  score: number
) => {
  const repo = AppDataSource.getRepository(Recommendation);
  const rec = repo.create({
    user: { id: userId } as User,
    course: { id: courseId } as Course,
    score,
  });
  await repo.save(rec);
};

export async function getRecommendationsForUser(
  userId: string,
  limit = 6
): Promise<Course[]> {
  const repo = AppDataSource.getRepository(Recommendation);
  const recs = await repo.find({
    where: { user: { id: userId } },
    relations: ['course'],
    order: { score: 'DESC' },
    take: limit,
  });
  return recs.map(r => r.course);
}
