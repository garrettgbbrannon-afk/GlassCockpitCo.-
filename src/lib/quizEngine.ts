import { CATEGORIES, type CategoryId } from "../data/categories";
import { QUESTIONS } from "../data/questions";
import type { DeckId, Question } from "./types";
import { getWeakestCategories, getWeakQuestionIds } from "./storage";

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function questionsByCategory(category: CategoryId): Question[] {
  return QUESTIONS.filter((q) => q.category === category);
}

export function buildQuickQuiz(category: CategoryId | "all", count = 10): Question[] {
  const pool = category === "all" ? QUESTIONS : questionsByCategory(category);
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

/** Builds a full exam proportionally weighted to match the real FAA topic distribution. */
export function buildExam(count = 60): Question[] {
  const totalWeight = CATEGORIES.reduce((sum, c) => sum + c.weight, 0);
  const selected: Question[] = [];
  const used = new Set<string>();

  for (const cat of CATEGORIES) {
    const pool = shuffle(questionsByCategory(cat.id));
    const share = Math.max(1, Math.round((cat.weight / totalWeight) * count));
    for (const q of pool.slice(0, share)) {
      if (!used.has(q.id)) {
        selected.push(q);
        used.add(q.id);
      }
    }
  }

  // Trim or top-up to hit the exact target count using the remaining shuffled pool.
  let combined = shuffle(selected);
  if (combined.length > count) {
    combined = combined.slice(0, count);
  } else if (combined.length < count) {
    const remaining = shuffle(QUESTIONS.filter((q) => !used.has(q.id)));
    for (const q of remaining) {
      if (combined.length >= count) break;
      combined.push(q);
    }
  }
  return shuffle(combined);
}

const STRUGGLE_SET_SIZE = 10;

/** Builds a 10-question set weighted toward the pilot's historically weakest categories. */
export function buildStruggleSet(count = STRUGGLE_SET_SIZE): Question[] {
  const weakCategories = getWeakestCategories(4);
  const missedIds = new Set(getWeakQuestionIds(80));

  const missedQuestions = shuffle(QUESTIONS.filter((q) => missedIds.has(q.id)));
  const weakCategoryQuestions = shuffle(
    QUESTIONS.filter((q) => weakCategories.includes(q.category) && !missedIds.has(q.id)),
  );
  const everythingElse = shuffle(
    QUESTIONS.filter((q) => !missedIds.has(q.id) && !weakCategories.includes(q.category)),
  );

  const used = new Set<string>();
  const selected: Question[] = [];
  for (const pool of [missedQuestions, weakCategoryQuestions, everythingElse]) {
    for (const q of pool) {
      if (selected.length >= count) break;
      if (!used.has(q.id)) {
        selected.push(q);
        used.add(q.id);
      }
    }
  }
  return shuffle(selected);
}

export function buildFlashcardDeck(deck: DeckId): Question[] {
  if (deck === "all") return shuffle(QUESTIONS);
  if (deck === "weak") {
    const weakIds = getWeakQuestionIds(200);
    const byId = new Map(QUESTIONS.map((q) => [q.id, q]));
    return weakIds.map((id) => byId.get(id)).filter((q): q is Question => q != null);
  }
  return shuffle(questionsByCategory(deck));
}

export function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
