import { AppDataSource } from '../config/data-source';
import { Question } from '../entity/question.entity';
import { Option } from '../entity/option.entity';
import { Assignment } from '../entity/assignment.entity';

const questionRepo = AppDataSource.getRepository(Question);
const optionRepo = AppDataSource.getRepository(Option);
const examRepo = AppDataSource.getRepository(Assignment);

export const createQuestion = async (
  examId: string,
  content: string,
  options: string[],
  correctIndex: string
) => {
  const exam = await examRepo.findOneBy({ id: examId });
  if (!exam) return;
  const question = new Question({ content, assignment: exam });
  await questionRepo.save(question);
  for (let idx = 0; idx < options.length; idx++) {
    const optContent = options[idx];
    if (!optContent) continue;
    const is_correct = idx.toString() === correctIndex;
    const opt = new Option({ content: optContent, is_correct, question });
    await optionRepo.save(opt);
  }
};

export const updateQuestion = async (
  questionId: string,
  content: string,
  options: string[],
  correctIndex: string
) => {
  const question = await questionRepo.findOne({
    where: { id: questionId },
    relations: ['options'],
  });
  if (!question) return;
  question.content = content;
  await questionRepo.save(question);
  // remove old options
  for (const opt of question.options) {
    await optionRepo.delete(opt.id);
  }
  // add new options
  for (let idx = 0; idx < options.length; idx++) {
    const optContent = options[idx];
    if (!optContent) continue;
    const is_correct = idx.toString() === correctIndex;
    const opt = new Option({ content: optContent, is_correct, question });
    await optionRepo.save(opt);
  }
};

export const deleteQuestion = async (questionId: string) => {
  const question = await questionRepo.findOne({
    where: { id: questionId },
    relations: ['options'],
  });
  if (!question) return;
  for (const opt of question.options) {
    await optionRepo.delete(opt.id);
  }
  await questionRepo.delete(questionId);
};
