import { Request, Response } from 'express';
import * as SearchService from '../services/search.service';

export const search = async (req: Request, res: Response) => {
  const keyword = req.query.keyword as string;
  const lng = (req.query.lng as string) || 'en';

  try {
    const [courses, instructors] = await Promise.all([
      SearchService.searchCourses(keyword),
      SearchService.searchInstructors(keyword),
    ]);

    res.render('searchResult', { courses, instructors, keyword, lng });
  } catch (error) {
    req.flash('error', req.t('error.search_failed'));
  }
};
