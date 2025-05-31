import { AppDataSource } from '../config/data-source';
import { Tag } from '../entity/tag.entity';

const tagRepository = AppDataSource.getRepository(Tag);

export const getAllTags = async () => {
  return await tagRepository.find();
};
