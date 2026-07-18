import type { CategoryId } from "../data/categories";

export interface Question {
  id: string;
  category: CategoryId;
  prompt: string;
  choices: [string, string, string];
  correct: 0 | 1 | 2;
  explanation: string;
  /** Why the tempting wrong choice(s) are wrong — shown when the pilot misses the question. */
  commonMistake?: string;
  /** A short mnemonic or memory hook, shown when one plausibly exists for the concept. */
  mnemonic?: string;
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

export type CardRating = "again" | "hard" | "good" | "easy";

/** Per-question spaced-repetition state (SM-2-lite). */
export interface SRSCard {
  intervalDays: number;
  ease: number;
  dueAt: number;
  reps: number;
}
