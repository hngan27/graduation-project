import { AppDataSource } from '../config/data-source';
import { FavoriteCourse } from '../entity/favorite_course.entity';
import { User } from '../entity/user.entity';
import { Course } from '../entity/course.entity';

const favoriteCourseRepository = AppDataSource.getRepository(FavoriteCourse);

export const addFavoriteCourse = async (user: User, course: Course) => {
  const exist = await favoriteCourseRepository.findOne({ where: { user: { id: user.id }, course: { id: course.id } } });
  if (exist) return exist;
  const favorite = new FavoriteCourse();
  favorite.user = user;
  favorite.course = course;
  return await favoriteCourseRepository.save(favorite);
};

export const removeFavoriteCourse = async (user: User, course: Course) => {
  return await favoriteCourseRepository.delete({ user: { id: user.id }, course: { id: course.id } });
};

export const isFavoriteCourse = async (user: User, course: Course) => {
  return await favoriteCourseRepository.findOne({ where: { user: { id: user.id }, course: { id: course.id } } });
};

export const getFavoriteCoursesOfUser = async (user: User) => {
  return await favoriteCourseRepository.find({ where: { user: { id: user.id } }, relations: ['course'] });
};
