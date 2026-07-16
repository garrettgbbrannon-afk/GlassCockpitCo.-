import type { Question } from "../lib/types";
import { CATEGORY_MAP } from "../data/categories";

interface QuestionCardProps {
  question: Question;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  revealed?: boolean;
  flagged?: boolean;
  onToggleFlag?: () => void;
  questionNumber?: number;
  totalQuestions?: number;
}

export default function QuestionCard({
  question,
  selectedIndex,
  onSelect,
  revealed = false,
  flagged = false,
  onToggleFlag,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const category = CATEGORY_MAP[question.category];

  return (
    <div className="rounded-2xl border border-panel-700 bg-panel-900/60 p-5 sm:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: category.color, backgroundColor: `${category.color}1a` }}
          >
            {category.label}
          </span>
          {questionNumber != null && totalQuestions != null && (
            <span className="font-mono text-xs text-silver-500">
              {questionNumber} / {totalQuestions}
            </span>
          )}
        </div>
        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              flagged
                ? "border-hud-amber/60 bg-hud-amber/10 text-hud-amber"
                : "border-panel-600 text-silver-400 hover:border-hud-amber/40 hover:text-hud-amber"
            }`}
          >
            <span>{flagged ? "★" : "☆"}</span>
            Flag
          </button>
        )}
      </div>

      <p className="mb-6 text-lg leading-relaxed text-white sm:text-xl">{question.prompt}</p>

      <div className="flex flex-col gap-3">
        {question.choices.map((choice, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === question.correct;

          let stateClasses =
            "border-panel-600 bg-panel-800/60 text-silver-200 hover:border-silver-400/60 hover:bg-panel-800";
          if (revealed) {
            if (isCorrect) {
              stateClasses = "border-hud-green/60 bg-hud-green/10 text-white";
            } else if (isSelected && !isCorrect) {
              stateClasses = "border-hud-red/60 bg-hud-red/10 text-white";
            } else {
              stateClasses = "border-panel-700 bg-panel-800/30 text-silver-500";
            }
          } else if (isSelected) {
            stateClasses = "border-silver-300 bg-silver-300/10 text-white";
          }

          return (
            <button
              key={index}
              type="button"
              data-testid={`choice-${index}`}
              disabled={revealed}
              onClick={() => onSelect(index)}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-default ${stateClasses}`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current font-mono text-xs">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="leading-snug">{choice}</span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-5 rounded-xl border border-panel-700 bg-panel-800/40 p-4">
          <div className="mb-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-silver-300">
            Explanation
          </div>
          <p className="text-sm leading-relaxed text-silver-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
