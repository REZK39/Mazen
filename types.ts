
export interface Course {
  id: number;
  name: string;
  credits: number;
  score: number | null; // Student's percentage score (0-100)
}

export interface GradePoint {
  grade: string;
  points: number;
  minPercentage: number;
}

export interface CalculationResult {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
  maxPoints: number;
}

export type Term = 'term1' | 'term2' | 'combined';
