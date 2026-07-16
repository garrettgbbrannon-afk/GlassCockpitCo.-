import type { CategoryId } from "../data/categories";
import type { AnsweredRecord, QuizAttempt } from "./types";

const STORAGE_KEY = "gcc_progress_v1";
const MAX_HISTORY = 1000;

interface ProgressState {
  history: AnsweredRecord[];
  attempts: QuizAttempt[];
}

function emptyState(): ProgressState {
  return { history: [], attempts: [] };
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      history: Array.isArray(parsed.history) ? parsed.history : [],
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
    };
  } catch {
    return emptyState();
  }
}

function save(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode, quota) — fail silently, session still works in-memory
  }
}

export function recordAnswer(record: AnsweredRecord) {
  const state = load();
  state.history.push(record);
  if (state.history.length > MAX_HISTORY) {
    state.history = state.history.slice(state.history.length - MAX_HISTORY);
  }
  save(state);
}

export function recordAttempt(attempt: QuizAttempt) {
  const state = load();
  state.attempts.push(attempt);
  save(state);
}

export function getHistory(): AnsweredRecord[] {
  return load().history;
}

export function getAttempts(): QuizAttempt[] {
  return load().attempts;
}

export interface CategoryStat {
  category: CategoryId;
  correct: number;
  total: number;
  accuracy: number;
}

export function getCategoryStats(): CategoryStat[] {
  const history = load().history;
  const byCategory = new Map<CategoryId, { correct: number; total: number }>();
  for (const record of history) {
    const bucket = byCategory.get(record.category) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (record.correct) bucket.correct += 1;
    byCategory.set(record.category, bucket);
  }
  return Array.from(byCategory.entries()).map(([category, { correct, total }]) => ({
    category,
    correct,
    total,
    accuracy: total > 0 ? correct / total : 0,
  }));
}

const MIN_ANSWERED_FOR_STRUGGLE_SET = 20;

export function hasEnoughDataForStruggleSet(): boolean {
  return load().history.length >= MIN_ANSWERED_FOR_STRUGGLE_SET;
}

export function getWeakestCategories(limit = 4): CategoryId[] {
  return getCategoryStats()
    .filter((s) => s.total >= 2)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit)
    .map((s) => s.category);
}

/** Question ids the pilot has recently missed, most recent first, deduplicated. */
export function getWeakQuestionIds(limit = 60): string[] {
  const history = load().history;
  const seen = new Set<string>();
  const result: string[] = [];
  for (let i = history.length - 1; i >= 0 && result.length < limit; i--) {
    const record = history[i];
    if (!record.correct && !seen.has(record.questionId)) {
      seen.add(record.questionId);
      result.push(record.questionId);
    }
  }
  return result;
}

export function clearProgress() {
  save(emptyState());
}
