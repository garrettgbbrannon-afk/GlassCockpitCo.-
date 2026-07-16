import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import ProgressBar from "../../components/ProgressBar";
import QuestionCard from "../../components/QuestionCard";
import { buildExam, formatClock } from "../../lib/quizEngine";
import { recordAnswer, recordAttempt } from "../../lib/storage";
import type { CategoryId } from "../../data/categories";

const EXAM_SECONDS = 2.5 * 60 * 60;

export default function ExamRunner() {
  const location = useLocation();
  const navigate = useNavigate();
  const timed = (location.state as { timed?: boolean } | null)?.timed ?? true;

  const [questions] = useState(() => buildExam(60));
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [flags, setFlags] = useState<boolean[]>(() => Array(questions.length).fill(false));
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(EXAM_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const submittedRef = useRef(false);

  const current = questions[index];
  const answeredCount = answers.filter((a) => a != null).length;

  function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const categoryBreakdown: Partial<Record<CategoryId, { correct: number; total: number }>> = {};
    let score = 0;
    questions.forEach((q, i) => {
      const isCorrect = answers[i] === q.correct;
      if (isCorrect) score += 1;
      const bucket = categoryBreakdown[q.category] ?? { correct: 0, total: 0 };
      bucket.total += 1;
      if (isCorrect) bucket.correct += 1;
      categoryBreakdown[q.category] = bucket;
      recordAnswer({ questionId: q.id, category: q.category, correct: isCorrect, timestamp: Date.now() });
    });

    const flaggedQuestionIds = questions.filter((_, i) => flags[i]).map((q) => q.id);
    recordAttempt({
      id: `exam-${Date.now()}`,
      mode: "exam",
      timestamp: Date.now(),
      score,
      total: questions.length,
      categoryBreakdown,
      flaggedQuestionIds,
    });

    navigate("/exam/debrief", {
      replace: true,
      state: {
        questions,
        answers,
        flags,
        timed,
        timeSpentSeconds: timed ? EXAM_SECONDS - remaining : elapsed,
      },
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (submittedRef.current) return;
      if (timed) {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(interval);
            submit();
            return 0;
          }
          return r - 1;
        });
      } else {
        setElapsed((e) => e + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timed]);

  function handleSelect(choiceIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = choiceIndex;
      return next;
    });
  }

  function toggleFlag() {
    setFlags((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  function handleSubmitClick() {
    const unanswered = questions.length - answeredCount;
    if (unanswered > 0) {
      const proceed = window.confirm(
        `You have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. Submit anyway?`,
      );
      if (!proceed) return;
    }
    submit();
  }

  return (
    <div className="min-h-screen bg-panel-950 pb-16">
      <TopBar
        title="60-Question Exam"
        right={
          <span
            className={`font-mono text-sm ${timed && remaining < 300 ? "text-hud-red" : "text-silver-200"}`}
          >
            {timed ? formatClock(remaining) : formatClock(elapsed)}
          </span>
        }
      />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <ProgressBar current={answeredCount} total={questions.length} />
          <div className="mt-1.5 text-right font-mono text-xs text-silver-500">
            {answeredCount}/{questions.length} answered
          </div>
        </div>

        <QuestionCard
          question={current}
          selectedIndex={answers[index]}
          onSelect={handleSelect}
          flagged={flags[index]}
          onToggleFlag={toggleFlag}
          questionNumber={index + 1}
          totalQuestions={questions.length}
        />

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-xl border border-panel-600 px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-silver-200 hover:border-panel-400 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Previous
          </button>
          {index === questions.length - 1 ? (
            <button
              type="button"
              onClick={handleSubmitClick}
              className="rounded-xl bg-hud-green px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-panel-950 hover:brightness-110"
            >
              Submit Exam
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="rounded-sm bg-silver-200 px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 hover:bg-silver-100"
            >
              Next
            </button>
          )}
        </div>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.25em] text-silver-500">
            Question Map
          </h2>
          <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
            {questions.map((q, i) => {
              const isCurrent = i === index;
              const isAnswered = answers[i] != null;
              const isFlagged = flags[i];
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`relative aspect-square rounded-lg border font-mono text-xs transition-colors ${
                    isCurrent
                      ? "border-silver-300 bg-silver-300/20 text-white"
                      : isAnswered
                        ? "border-panel-600 bg-panel-700/60 text-silver-200"
                        : "border-panel-700 bg-panel-900/40 text-silver-500"
                  }`}
                >
                  {i + 1}
                  {isFlagged && (
                    <span className="absolute -right-1 -top-1 text-[10px] text-hud-amber">★</span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleSubmitClick}
            className="mt-6 w-full rounded-xl border border-hud-green/50 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-hud-green hover:bg-hud-green/10"
          >
            Submit Exam
          </button>
        </section>
      </main>
    </div>
  );
}
