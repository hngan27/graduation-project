import { Grade } from '../entity/grade.entity';
import { Question } from '../entity/question.entity';
import { Assignment } from '../entity/assignment.entity';
import { User } from '../entity/user.entity';
import { Answer } from '../entity/answer.entity';
import { Option } from '../entity/option.entity';
import { AppDataSource } from '../config/data-source';
import { AssignmentStatus } from '../enums/AssignmentStatus';
import { RATE_PASS } from '../constants';

const gradeRepository = AppDataSource.getRepository(Grade);
const questionRepository = AppDataSource.getRepository(Question);
const examRepository = AppDataSource.getRepository(Assignment);
const optionRepository = AppDataSource.getRepository(Option);
const answerRepository = AppDataSource.getRepository(Answer);

export const getGradesByCourseId = async (
  courseId: string,
  studentId: string
) => {
  const grades = await gradeRepository.find({
    relations: ['assignment'],
    where: {
      assignment: {
        course: {
          id: courseId,
        },
      },
      student: {
        id: studentId,
      },
    },
  });

  return grades;
};

export const getBestGradeByCourseId = async (
  courseId: string,
  studentId: string
) => {
  const grades = await getGradesByCourseId(courseId, studentId);

  const bestGrade = grades.find(grade => {
    return grade.grade === Math.max(...grades.map(g => g.grade));
  });

  return bestGrade;
};

export const updateGradeWhenStartExam = async (
  exam: Assignment,
  student: User
) => {
  const grades = await getGradesByCourseId(exam.course.id, student.id);
  if (grades.length === 0) {
    const questions = await getQuestionsByExamId(exam.id);
    const newGrade = new Grade({
      student,
      assignment: exam,
      attempt: 1,
      start_time: new Date(),
      status: AssignmentStatus.DOING,
      grade: 0,
      max_grade: questions.length,
    });
    return gradeRepository.save(newGrade);
  }
  let lastAttempt = 1;
  for (const grade of grades) {
    if (grade.attempt > lastAttempt) {
      lastAttempt = grade.attempt;
    }
  }
  if (grades.length === 1 && grades[0].status === AssignmentStatus.TODO) {
    grades[0].start_time = new Date();
    grades[0].status = AssignmentStatus.DOING;
    return gradeRepository.save(grades[0]);
  } else if (grades[0].status !== AssignmentStatus.DOING) {
    const newGrade = new Grade({
      student,
      assignment: exam,
      attempt: lastAttempt + 1,
      start_time: new Date(),
      status: AssignmentStatus.DOING,
      grade: 0,
      max_grade: grades[0].max_grade,
    });
    return gradeRepository.save(newGrade);
  }
};

export const updateGradeWhenSubmitExam = async (
  exam: Assignment,
  student: User,
  grade: number,
  max_grade: number,
  feedback?: string
) => {
  const grades = await getGradesByCourseId(exam.course.id, student.id);
  let lastAttempt = grades[0].attempt;
  let lastGrade = grades[0];
  for (const grade of grades) {
    if (grade.attempt > lastAttempt) {
      lastAttempt = grade.attempt;
      lastGrade = grade;
    }
  }
  lastGrade.submit_time = new Date();
  lastGrade.grade = grade;
  lastGrade.max_grade = max_grade;
  lastGrade.feedback = feedback || '';
  if (grade / max_grade >= RATE_PASS) {
    lastGrade.status = AssignmentStatus.PASS;
  } else {
    lastGrade.status = AssignmentStatus.FAIL;
  }

  return gradeRepository.save(lastGrade);
};

export const getExamById = async (examId: string) => {
  const exam = await examRepository.findOne({
    relations: ['course'],
    where: {
      id: examId,
    },
  });
  if (!exam) return;
  return exam;
};

export const getQuestionsByExamId = async (examId: string) => {
  const questions = await questionRepository.find({
    where: {
      assignment: {
        id: examId,
      },
    },
    relations: ['options', 'answers', 'assignment'],
    order: {
      content: 'ASC',
    },
  });
  if (!questions) return [];
  return questions;
};

export const getExamByCourseId = async (courseId: string) => {
  const exam = await examRepository.findOne({
    where: { course: { id: courseId } },
    relations: ['course'],
  });
  return exam;
};

export const getQuestionById = async (questionId: string) => {
  const question = await questionRepository.findOne({
    where: {
      id: questionId,
    },
  });
  if (!question) return;
  return question;
};

export const getOptionById = async (optionId: string) => {
  const option = await optionRepository.findOne({
    where: {
      id: optionId,
    },
  });
  if (!option) return;
  return option;
};

export const createAnswersFromExam = async (
  question: Question,
  user: User,
  optionId: string | undefined
) => {
  let attempt = 1;

  const existingAnswers = await answerRepository.find({
    where: {
      question: {
        id: question.id,
      },
      student: {
        id: user.id,
      },
    },
  });

  for (const answer of existingAnswers) {
    if (answer.attempt >= attempt) {
      attempt = answer.attempt + 1;
    }
  }

  const answer = new Answer({
    student: user,
    question,
    attempt,
  });
  if (optionId) {
    const option = await getOptionById(optionId);
    answer.option = option!;
  }
  return answerRepository.save(answer);
};

export const getResultOfExam = async (userId: string, examId: string) => {
  const answers = await answerRepository.find({
    where: {
      student: {
        id: userId,
      },
      question: {
        assignment: {
          id: examId,
        },
      },
    },
    relations: [
      'option',
      'question',
      'question.options',
      'question.assignment',
    ],
    order: {
      question: {
        content: 'ASC',
      },
    },
  });

  let lastAttempt = 1;
  for (const answer of answers) {
    if (answer.attempt > lastAttempt) {
      lastAttempt = answer.attempt;
    }
  }

  const filteredAnswers = answers.filter(answer => {
    return answer.attempt === lastAttempt;
  });

  const score = filteredAnswers.filter(
    answer => answer.option && answer.option.is_correct
  ).length;

  return { filteredAnswers, score };
};

export const getAllUserGradesByCourseId = async (courseId: string) => {
  const grades = await gradeRepository.find({
    relations: ['assignment', 'student'],
    where: {
      assignment: {
        course: {
          id: courseId,
        },
      },
    },
  });
  // Lọc ra grade có điểm cao nhất cho mỗi học viên với mỗi assignment
  const bestGradesMap = new Map();
  for (const grade of grades) {
    if (grade.status === AssignmentStatus.TODO) continue;
    const key = `${grade.student.id}_${grade.assignment.id}`;
    if (!bestGradesMap.has(key) || grade.grade > bestGradesMap.get(key).grade) {
      bestGradesMap.set(key, grade);
    }
  }
  return Array.from(bestGradesMap.values());
};

export const getGradeById = async (gradeId: string) => {
  const grade = await gradeRepository.findOne({
    relations: ['assignment', 'student'],
    where: {
      id: gradeId,
    },
  });

  return grade;
};

export const getResultOfExamByGradeId = async (gradeId: string) => {
  const grade = await getGradeById(gradeId);
  if (!grade) return;
  const answers = await answerRepository.find({
    where: {
      student: {
        id: grade.student.id,
      },
      question: {
        assignment: {
          id: grade.assignment.id,
        },
      },
      attempt: grade.attempt,
    },
    relations: [
      'option',
      'question',
      'question.options',
      'question.assignment',
    ],
    order: {
      question: {
        content: 'ASC',
      },
    },
  });

  const score = answers.filter(
    answer => answer.option && answer.option.is_correct
  ).length;
  return { grade, answers, score };
};

export const updateGradeById = async (
  gradeId: string,
  feedback?: string,
  assignment?: Assignment,
  student?: User,
  status?: AssignmentStatus,
  grade?: number,
  max_grade?: number,
  start_time?: Date,
  submit_time?: Date,
  attempt?: number
) => {
  const gradeObject = await getGradeById(gradeId);
  if (!gradeObject) return;
  const gradeUpdate = new Grade({
    assignment,
    student,
    status,
    grade,
    max_grade,
    feedback,
    start_time,
    submit_time,
    attempt,
  });
  Object.assign(gradeObject, gradeUpdate);
  return await gradeRepository.save(gradeObject);
};
