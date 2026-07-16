import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { CATEGORIES } from "../../data/categories";
import { getWeakQuestionIds } from "../../lib/storage";
import type { DeckId } from "../../lib/types";

export default function FlashcardSetup() {
  const navigate = useNavigate();
  const weakCount = getWeakQuestionIds(200).length;

  function start(deck: DeckId) {
    navigate("/flashcards/run", { state: { deck } });
  }

  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title="Flashcards" />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.25em] text-white">
          Flashcards
        </h1>
        <div className="mt-3 h-px w-12 bg-silver-500/40" />
        <p className="mt-4 text-silver-400">Pick a deck. Tap a card to flip it and see the answer.</p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => start("all")}
            className="rounded-xl border border-panel-700 bg-panel-900/60 px-4 py-4 text-left text-sm font-medium text-silver-200 transition-colors hover:border-silver-400/60"
          >
            <div className="font-display text-base font-semibold uppercase tracking-wide text-white">All</div>
            <div className="mt-1 text-silver-400">The entire question bank, shuffled.</div>
          </button>

          <button
            type="button"
            onClick={() => start("weak")}
            disabled={weakCount === 0}
            className="rounded-xl border border-panel-700 bg-panel-900/60 px-4 py-4 text-left text-sm font-medium text-silver-200 transition-colors hover:border-hud-amber/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <div className="font-display text-base font-semibold uppercase tracking-wide text-hud-amber">
              Weak Concepts
            </div>
            <div className="mt-1 text-silver-400">
              {weakCount > 0
                ? `Built from your last ${weakCount} missed questions.`
                : "Take a quiz first so we know what to focus on."}
            </div>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => start(cat.id)}
              className="rounded-xl border border-panel-700 bg-panel-900/60 px-4 py-4 text-left text-sm font-medium text-silver-200 transition-colors hover:border-silver-400/60"
            >
              <div className="font-display text-base font-semibold uppercase tracking-wide text-white">
                {cat.label}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
