import type { CategoryId } from "../data/categories";

export interface Question {
  id: string;
  category: CategoryId;
  prompt: string;
  choices: [string, string, string];
  correct: 0 | 1 | 2;
  explanation: string;
}

export interface AnsweredRecord {
  questionId: string;
  category: CategoryId;
  correct: boolean;
  timestamp: number;
}

export type DeckId = CategoryId | "all" | "weak";

export interface QuizAttempt {
  id: string;
  mode: "exam" | "quiz" | "struggle";
  timestamp: number;
  score: number;
  total: number;
  categoryBreakdown: Partial<Record<CategoryId, { correct: number; total: number }>>;
  flaggedQuestionIds: string[];
}
