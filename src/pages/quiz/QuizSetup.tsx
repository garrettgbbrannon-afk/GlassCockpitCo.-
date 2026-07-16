import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { CATEGORIES, type CategoryId } from "../../data/categories";

export default function QuizSetup() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CategoryId | "all">("all");

  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title="Quick Quiz" />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.25em] text-white">
          Quick Quiz
        </h1>
        <div className="mt-3 h-px w-12 bg-silver-500/40" />
        <p className="mt-4 text-silver-400">
          Pick a category, or fly a mixed set. 10 random questions, immediate feedback after each one.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setSelected("all")}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              selected === "all"
                ? "border-silver-300 bg-silver-300/10 text-white"
                : "border-panel-700 bg-panel-900/60 text-silver-300 hover:border-panel-500"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelected(cat.id)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                selected === cat.id
                  ? "border-silver-300 bg-silver-300/10 text-white"
                  : "border-panel-700 bg-panel-900/60 text-silver-300 hover:border-panel-500"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/quiz/run", { state: { category: selected } })}
          className="mt-10 w-full rounded-sm bg-silver-200 px-6 py-4 text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 transition-colors hover:bg-silver-100 sm:w-auto"
        >
          Start Quiz
        </button>
      </main>
    </div>
  );
}
