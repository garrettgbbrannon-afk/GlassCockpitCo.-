import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TopBar from "../../components/TopBar";
import ProgressBar from "../../components/ProgressBar";
import FlashCard from "../../components/FlashCard";
import { buildFlashcardDeck } from "../../lib/quizEngine";
import type { DeckId } from "../../lib/types";

const DECK_LABELS: Record<string, string> = {
  all: "All",
  weak: "Weak Concepts",
};

export default function FlashcardRunner() {
  const location = useLocation();
  const deck = (location.state as { deck?: DeckId } | null)?.deck ?? "all";

  const [cards] = useState(() => buildFlashcardDeck(deck));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deckLabel = DECK_LABELS[deck] ?? deck;

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-panel-950">
        <TopBar title="Flashcards" />
        <main className="mx-auto max-w-xl px-4 py-16 text-center text-silver-400">
          No cards available for this deck yet.
          <div className="mt-6">
            <Link to="/flashcards" className="text-silver-300 underline">
              Choose a different deck
            </Link>
          </div>
        </main>
      </div>
    );
  }

  function goTo(next: number) {
    setIndex(Math.max(0, Math.min(cards.length - 1, next)));
    setFlipped(false);
  }

  const current = cards[index];

  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title={`Flashcards · ${deckLabel}`} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-4">
          <ProgressBar current={index + 1} total={cards.length} />
          <span className="shrink-0 font-mono text-xs text-silver-500">
            {index + 1} / {cards.length}
          </span>
        </div>

        <FlashCard question={current} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="rounded-xl border border-panel-600 px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-silver-200 hover:border-panel-400 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="rounded-sm border border-silver-400/50 px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-silver-300 hover:bg-silver-300/10"
          >
            Flip
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === cards.length - 1}
            className="rounded-sm bg-silver-200 px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 hover:bg-silver-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </div>

        {index === cards.length - 1 && (
          <div className="mt-8 text-center">
            <Link to="/flashcards" className="text-sm text-silver-400 underline hover:text-silver-200">
              Choose another deck
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
