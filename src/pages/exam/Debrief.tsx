import { useMemo } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import CategoryBar from "../../components/CategoryBar";
import { CATEGORIES, type CategoryId } from "../../data/categories";
import { formatClock } from "../../lib/quizEngine";
import type { Question } from "../../lib/types";

interface DebriefState {
  questions: Question[];
  answers: (number | null)[];
  flags: boolean[];
  timed: boolean;
  timeSpentSeconds: number;
}

const PASS_THRESHOLD = 0.7;

export default function Debrief() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as DebriefState | null;

  const summary = useMemo(() => {
    if (!state) return null;
    const { questions, answers } = state;
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
    const pct = questions.length > 0 ? score / questions.length : 0;

    const breakdown = new Map<CategoryId, { correct: number; total: number }>();
    questions.forEach((q, i) => {
      const bucket = breakdown.get(q.category) ?? { correct: 0, total: 0 };
      bucket.total += 1;
      if (answers[i] === q.correct) bucket.correct += 1;
      breakdown.set(q.category, bucket);
    });

    const flagged = questions.filter((_, i) => state.flags[i]);

    return { score, total: questions.length, pct, breakdown, flagged };
  }, [state]);

  if (!state || !summary) {
    return <Navigate to="/exam" replace />;
  }

  const passed = summary.pct >= PASS_THRESHOLD;

  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title="Exam Debrief" />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <div className="font-display text-sm uppercase tracking-[0.3em] text-silver-400">Final Score</div>
          <div className={`mt-2 font-display text-6xl font-bold ${passed ? "text-hud-green" : "text-hud-red"}`}>
            {Math.round(summary.pct * 100)}%
          </div>
          <div className="mt-1 text-silver-400">
            {summary.score} of {summary.total} correct
          </div>
          <div
            className={`mx-auto mt-4 w-fit rounded-full border px-4 py-1.5 font-display text-sm font-semibold uppercase tracking-[0.15em] ${
              passed ? "border-hud-green/50 text-hud-green" : "border-hud-red/50 text-hud-red"
            }`}
          >
            {passed ? "Pass" : "Fail"} · 70% required
          </div>
          <div className="mt-3 font-mono text-xs text-silver-500">
            {state.timed ? "Timed" : "Untimed"} · {formatClock(state.timeSpentSeconds)} elapsed
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.25em] text-silver-500">
            Category Accuracy
          </h2>
          <div className="flex flex-col gap-4">
            {CATEGORIES.filter((cat) => summary.breakdown.has(cat.id)).map((cat) => {
              const bucket = summary.breakdown.get(cat.id)!;
              return <CategoryBar key={cat.id} category={cat.id} correct={bucket.correct} total={bucket.total} />;
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.25em] text-silver-500">
            Flagged for Review ({summary.flagged.length})
          </h2>
          {summary.flagged.length === 0 ? (
            <p className="text-sm text-silver-500">You didn't flag any questions.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {summary.flagged.map((q) => (
                <li key={q.id} className="rounded-xl border border-panel-700 bg-panel-900/50 p-4">
                  <div className="text-sm text-silver-200">{q.prompt}</div>
                  <div className="mt-1 text-xs text-silver-500">
                    Correct answer: {q.choices[q.correct]}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigate("/struggle")}
            className="rounded-sm bg-hud-amber px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 hover:brightness-110"
          >
            Practice Weak Areas
          </button>
          <button
            type="button"
            onClick={() => navigate("/exam/run", { state: { timed: state.timed }, replace: true })}
            className="rounded-sm bg-silver-200 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 hover:bg-silver-100"
          >
            Retake Exam
          </button>
          <Link
            to="/hub"
            className="rounded-sm border border-panel-600 px-6 py-3 text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-silver-200 hover:border-panel-400"
          >
            Back to Hub
          </Link>
        </div>
      </main>
    </div>
  );
}
