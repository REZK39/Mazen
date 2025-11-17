import { Course, GradePoint } from './types';

export const GRADING_SCALE: GradePoint[] = [
  { grade: 'A+', points: 4.0, minPercentage: 97 },
  { grade: 'A', points: 4.0, minPercentage: 93 },
  { grade: 'A-', points: 3.7, minPercentage: 89 },
  { grade: 'B+', points: 3.3, minPercentage: 84 },
  { grade: 'B', points: 3.0, minPercentage: 80 },
  { grade: 'B-', points: 2.7, minPercentage: 76 },
  { grade: 'C+', points: 2.3, minPercentage: 73 },
  { grade: 'C', points: 2.0, minPercentage: 70 },
  { grade: 'C-', points: 1.7, minPercentage: 67 },
  { grade: 'D+', points: 1.3, minPercentage: 64 },
  { grade: 'D', points: 1.0, minPercentage: 60 },
  { grade: 'F', points: 0.0, minPercentage: 0 },
];

export const INITIAL_TERM_1_COURSES: Course[] = [
  { id: 1, name: 'رياضة (1)', credits: 3, score: null },
  { id: 2, name: 'فيزياء (1)', credits: 3, score: null },
  { id: 3, name: 'ميكانيكا (1)', credits: 3, score: null },
  { id: 4, name: 'كيمياء هندسية', credits: 3, score: null },
  { id: 5, name: 'رسم هندسي وإسقاط فراغي', credits: 3, score: null },
  { id: 6, name: 'لغة انجليزية فنية', credits: 2, score: null },
];

export const INITIAL_TERM_2_COURSES: Course[] = [
    { id: 101, name: 'رياضة 2', credits: 3, score: null },
    { id: 102, name: 'فيزياء 2', credits: 3, score: null },
    { id: 103, name: 'ميكانيكا 2', credits: 3, score: null },
    { id: 104, name: 'كيمياء هندسية', credits: 3, score: null },
    { id: 105, name: 'حاسبات وبرمجة', credits: 3, score: null },
    { id: 106, name: 'تاريخ هندسي', credits: 2, score: null },
    { id: 107, name: 'حقوق انسان', credits: 2, score: null },
];
