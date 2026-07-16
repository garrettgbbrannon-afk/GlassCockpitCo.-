import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import ProgressBar from "../../components/ProgressBar";
import QuestionCard from "../../components/QuestionCard";
import { buildStruggleSet } from "../../lib/quizEngine";
import { hasEnoughDataForStruggleSet, recordAnswer, recordAttempt } from "../../lib/storage";
import cub from "../../assets/photos/cub.webp";

function commentaryFor(pct: number): string {
  if (pct >= 90) return "Whatever was tripping you up before, it isn't anymore.";
  if (pct >= 70) return "Solid improvement on your weak spots. Keep this up.";
  if (pct >= 50) return "Progress, but these categories still need attention.";
  return "These are still your soft spots — worth a flashcard session before your next attempt.";
}

export default function StruggleRunner() {
  const navigate = useNavigate();
  const eligible = hasEnoughDataForStruggleSet();

  const [questions] = useState(() => (eligible ? buildStruggleSet(10) : []));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const pct = useMemo(
    () => (questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0),
    [correctCount, questions.length],
  );

  if (!eligible) {
    return (
      <div className="min-h-screen bg-panel-950">
        <TopBar title="Struggle Set" />
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
          <img src={cub} alt="Piper Cub in flight" className="mx-auto mb-8 h-40 w-full rounded-2xl object-cover opacity-70" />
          <h1 className="font-display text-xl font-semibold uppercase tracking-[0.2em] text-white">
            Not enough data yet
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-silver-400">
            Take a couple of Quick Quizzes or an exam first — the Struggle Set needs some history to know
            which categories to target.
          </p>
          <Link
            to="/quiz"
            className="mt-8 inline-block rounded-sm bg-silver-200 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 hover:bg-silver-100"
          >
            Take a Quick Quiz
          </Link>
        </main>
      </div>
    );
  }

  const current = questions[index];
  const isLast = index === questions.length - 1;

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
        id: `struggle-${Date.now()}`,
        mode: "struggle",
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

  if (finished) {
    return (
      <div className="min-h-screen bg-panel-950">
        <TopBar title="Struggle Set Results" />
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
              onClick={() => navigate("/struggle", { replace: true })}
              className="rounded-sm bg-silver-200 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 hover:bg-silver-100"
            >
              Retake
            </button>
            <Link
              to="/hub"
              className="rounded-sm border border-panel-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-silver-200 hover:border-panel-400"
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
      <TopBar title="Struggle Set" />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <ProgressBar current={index + (revealed ? 1 : 0)} total={questions.length} color="var(--color-hud-amber)" />
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
            className="mt-6 w-full rounded-xl bg-hud-amber px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-panel-950 hover:brightness-110"
          >
            {isLast ? "See Results" : "Next Question"}
          </button>
        )}
      </main>
    </div>
  );
}
