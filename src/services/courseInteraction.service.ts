import { AppDataSource } from '../config/data-source';
import { CourseInteraction } from '../entity/course_interaction.entity';
import { User } from '../entity/user.entity';
import { Course } from '../entity/course.entity';

const repo = AppDataSource.getRepository(CourseInteraction);

export async function logCourseInteraction(
  user: User,
  course: Course,
  interaction_type: string,
  target_id?: string,
  value?: number
) {
  const log = new CourseInteraction();
  log.user = user;
  log.course = course;
  log.interaction_type = interaction_type;
  if (target_id) log.target_id = target_id;
  if (value !== undefined) log.value = value;
  await repo.save(log);
}

export async function hasLoggedCourseCompleted(userId: string, courseId: string) {
  const repo = AppDataSource.getRepository(CourseInteraction);
  const count = await repo.count({
    where: {
      user: { id: userId },
      course: { id: courseId },
      interaction_type: 'course_completed',
    },
  });
  return count > 0;
}
