export const THREE_HOURS = 3 * 3600 * 1000;
export const RATE_PASS = 0.8;
export const LIMIT_RECORDS = 5;
export const EXPIRED_TIME = 2 * 60 * 1000;
export const interactionWeight: Record<string, number> = {
  view: 1, // xem chi tiết course
  favorite: 2, // nhấn yêu thích
  enroll: 3, // đăng ký khóa học
  lesson_done: 4, // hoàn thành bài học
  quiz_done: 5, // hoàn thành quiz
  course_completed: 6, // hoàn thành khóa học
  unfavorite: -2,
};
