import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import ProgressBar from "../../components/ProgressBar";
import QuestionCard from "../../components/QuestionCard";
import { buildQuickQuiz } from "../../lib/quizEngine";
import { recordAnswer, recordAttempt } from "../../lib/storage";
import type { CategoryId } from "../../data/categories";

function commentaryFor(pct: number): string {
  if (pct === 100) return "Perfect score. You could teach this lesson.";
  if (pct >= 90) return "Outstanding. You're exam-ready on this material.";
  if (pct >= 80) return "Strong work. Just a couple of soft spots to clean up.";
  if (pct >= 70) return "Passing territory. Review the misses and you'll be solid.";
  if (pct >= 50) return "Halfway there. This is worth another pass before test day.";
  return "Rough set. Spend some time with flashcards on this material before retrying.";
}

export default function QuizRunner() {
  const location = useLocation();
  const navigate = useNavigate();
  const category = (location.state as { category?: CategoryId | "all" } | null)?.category ?? "all";

  const [questions] = useState(() => buildQuickQuiz(category, 10));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const pct = useMemo(
    () => (questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0),
    [correctCount, questions.length],
  );

  function handleSelect(choiceIndex: number) {
    if (revealed) return;
    setSelected(choiceIndex);
    setRevealed(true);
    const isCorrect = choiceIndex === current.correct;
    if (isCorrect) setCorrectCount((c) => c + 1);
    recordAnswer({
      questionId: current.id,
      category: current.category,
      correct: isCorrect,
      timestamp: Date.now(),
    });
  }

  function handleNext() {
    if (isLast) {
      recordAttempt({
        id: `quiz-${Date.now()}`,
        mode: "quiz",
        timestamp: Date.now(),
        score: correctCount,
        total: questions.length,
        categoryBreakdown: {},
        flaggedQuestionIds: [],
      });
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-panel-950">
        <TopBar title="Quick Quiz" />
        <main className="mx-auto max-w-xl px-4 py-16 text-center text-silver-400">
          No questions available for that category yet.
          <div className="mt-6">
            <Link to="/quiz" className="text-accent-400 underline">
              Back to setup
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-panel-950">
        <TopBar title="Quick Quiz Results" />
        <main className="mx-auto max-w-xl px-4 py-14 text-center sm:py-20">
          <div className="font-display text-sm uppercase tracking-[0.3em] text-silver-400">Score</div>
          <div className="mt-2 font-display text-6xl font-bold text-white">{pct}%</div>
          <div className="mt-1 text-silver-400">
            {correctCount} of {questions.length} correct
          </div>
          <p className="mx-auto mt-6 max-w-md text-silver-300">{commentaryFor(pct)}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate("/quiz/run", { state: { category }, replace: true })}
              className="rounded-xl bg-accent-500 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white hover:bg-accent-600"
            >
              Retake
            </button>
            <Link
              to="/quiz"
              className="rounded-xl border border-panel-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-silver-200 hover:border-panel-400"
            >
              Change Category
            </Link>
            <Link
              to="/hub"
              className="rounded-xl border border-panel-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-silver-200 hover:border-panel-400"
            >
              Back to Hub
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title="Quick Quiz" />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <ProgressBar current={index + (revealed ? 1 : 0)} total={questions.length} />
        </div>

        <QuestionCard
          question={current}
          selectedIndex={selected}
          onSelect={handleSelect}
          revealed={revealed}
          questionNumber={index + 1}
          totalQuestions={questions.length}
        />

        {revealed && (
          <button
            type="button"
            onClick={handleNext}
            className="mt-6 w-full rounded-xl bg-accent-500 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white hover:bg-accent-600"
          >
            {isLast ? "See Results" : "Next Question"}
          </button>
        )}
      </main>
    </div>
  );
}
