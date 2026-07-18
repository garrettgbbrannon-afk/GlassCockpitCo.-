import type { CategoryId } from "../data/categories";
import type { AnsweredRecord, CardRating, QuizAttempt, SRSCard } from "./types";

const STORAGE_KEY = "gcc_progress_v1";
const MAX_HISTORY = 1000;

export interface ProgressState {
  history: AnsweredRecord[];
  attempts: QuizAttempt[];
  srs: Record<string, SRSCard>;
}

/** Called after any local write, so a cloud-sync layer can push the change up. Set by lib/sync.ts. */
let onChange: ((state: ProgressState) => void) | null = null;

export function setProgressChangeListener(listener: ((state: ProgressState) => void) | null) {
  onChange = listener;
}

function emptyState(): ProgressState {
  return { history: [], attempts: [], srs: {} };
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      history: Array.isArray(parsed.history) ? parsed.history : [],
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      srs: parsed.srs && typeof parsed.srs === "object" ? parsed.srs : {},
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
  onChange?.(state);
}

/** Replaces the entire local progress state — used when importing a backup or pulling from the cloud. */
export function replaceState(state: ProgressState) {
  save(state);
}

export function getState(): ProgressState {
  return load();
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

const EXPORT_VERSION = 1;

export function exportProgress(): string {
  const state = load();
  return JSON.stringify({ version: EXPORT_VERSION, exportedAt: Date.now(), ...state }, null, 2);
}

export function downloadProgressBackup() {
  const blob = new Blob([exportProgress()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `glass-cockpit-progress-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export class ImportError extends Error {}

export function importProgress(json: string, mode: "replace" | "merge" = "merge") {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new ImportError("That file isn't valid JSON.");
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new ImportError("That file doesn't look like a Glass Cockpit progress backup.");
  }
  const incoming = parsed as Partial<ProgressState>;
  if (!Array.isArray(incoming.history) || !Array.isArray(incoming.attempts)) {
    throw new ImportError("That file doesn't look like a Glass Cockpit progress backup.");
  }

  if (mode === "replace") {
    save({
      history: incoming.history,
      attempts: incoming.attempts,
      srs: incoming.srs && typeof incoming.srs === "object" ? incoming.srs : {},
    });
    return;
  }

  const current = load();
  const seenAttempts = new Set(current.attempts.map((a) => a.id));
  const mergedAttempts = [
    ...current.attempts,
    ...incoming.attempts.filter((a) => !seenAttempts.has(a.id)),
  ];
  const seenHistory = new Set(current.history.map((h) => `${h.questionId}-${h.timestamp}`));
  const mergedHistory = [
    ...current.history,
    ...incoming.history.filter((h) => !seenHistory.has(`${h.questionId}-${h.timestamp}`)),
  ].sort((a, b) => a.timestamp - b.timestamp);
  const mergedSrs = { ...current.srs, ...(incoming.srs ?? {}) };

  save({
    history: mergedHistory.length > MAX_HISTORY ? mergedHistory.slice(mergedHistory.length - MAX_HISTORY) : mergedHistory,
    attempts: mergedAttempts,
    srs: mergedSrs,
  });
}

// --- Spaced repetition (SM-2-lite) ---

const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

export function getSRSCard(questionId: string): SRSCard | null {
  return load().srs[questionId] ?? null;
}

export function isCardDue(questionId: string, now = Date.now()): boolean {
  const card = load().srs[questionId];
  return !card || card.dueAt <= now;
}

/** Applies an SM-2-lite update for a flashcard rating and persists it. */
export function rateFlashcard(questionId: string, rating: CardRating) {
  const state = load();
  const existing = state.srs[questionId];
  const ease = existing?.ease ?? DEFAULT_EASE;
  const reps = existing?.reps ?? 0;
  const prevInterval = existing?.intervalDays ?? 0;

  let nextEase = ease;
  let nextInterval: number;
  let nextReps = reps + 1;

  if (rating === "again") {
    nextEase = Math.max(MIN_EASE, ease - 0.2);
    nextInterval = 0; // due again today
    nextReps = 0;
  } else {
    if (rating === "hard") nextEase = Math.max(MIN_EASE, ease - 0.15);
    if (rating === "easy") nextEase = ease + 0.15;

    if (reps === 0) {
      nextInterval = rating === "hard" ? 1 : rating === "easy" ? 3 : 1;
    } else if (reps === 1) {
      nextInterval = rating === "hard" ? 2 : rating === "easy" ? 6 : 4;
    } else {
      const multiplier = rating === "hard" ? 1.2 : rating === "easy" ? nextEase * 1.3 : nextEase;
      nextInterval = Math.round(prevInterval * multiplier);
    }
    nextInterval = Math.max(1, nextInterval);
  }

  state.srs[questionId] = {
    ease: nextEase,
    intervalDays: nextInterval,
    reps: nextReps,
    dueAt: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
  };
  save(state);
}

/** From a candidate list of question ids, returns those due for review, most-overdue first, then never-seen ids. */
export function sortByDue(questionIds: string[]): string[] {
  const srs = load().srs;
  const now = Date.now();
  const due: { id: string; overdueBy: number }[] = [];
  const unseen: string[] = [];
  const notYetDue: { id: string; dueAt: number }[] = [];

  for (const id of questionIds) {
    const card = srs[id];
    if (!card) {
      unseen.push(id);
    } else if (card.dueAt <= now) {
      due.push({ id, overdueBy: now - card.dueAt });
    } else {
      notYetDue.push({ id, dueAt: card.dueAt });
    }
  }

  due.sort((a, b) => b.overdueBy - a.overdueBy);
  notYetDue.sort((a, b) => a.dueAt - b.dueAt);

  return [...due.map((d) => d.id), ...unseen, ...notYetDue.map((d) => d.id)];
}
