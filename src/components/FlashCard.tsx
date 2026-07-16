import type { Question } from "../lib/types";
import { CATEGORY_MAP } from "../data/categories";

interface FlashCardProps {
  question: Question;
  flipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ question, flipped, onFlip }: FlashCardProps) {
  const category = CATEGORY_MAP[question.category];

  return (
    <button
      type="button"
      onClick={onFlip}
      className="group relative h-80 w-full [perspective:1200px] sm:h-96"
    >
      <div
        className="relative h-full w-full rounded-2xl transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front: question */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-panel-700 bg-panel-900/70 p-6 [backface-visibility:hidden] sm:p-8">
          <span
            className="w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: category.color, backgroundColor: `${category.color}1a` }}
          >
            {category.label}
          </span>
          <p className="text-left text-lg leading-relaxed text-white sm:text-xl">{question.prompt}</p>
          <span className="text-xs uppercase tracking-[0.3em] text-silver-500">Tap to flip</span>
        </div>

        {/* Back: answer + explanation */}
        <div
          className="absolute inset-0 flex flex-col justify-center gap-3 rounded-2xl border border-silver-400/40 bg-panel-900/90 p-6 text-left [backface-visibility:hidden] sm:p-8"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-hud-green">
            Answer
          </div>
          <p className="text-lg font-medium text-white">{question.choices[question.correct]}</p>
          <div className="mt-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-silver-300">
            Explanation
          </div>
          <p className="text-sm leading-relaxed text-silver-300">{question.explanation}</p>
        </div>
      </div>
    </button>
  );
}
