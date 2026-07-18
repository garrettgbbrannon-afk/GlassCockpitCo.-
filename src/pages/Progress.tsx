import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import CategoryBar from "../components/CategoryBar";
import { CATEGORIES } from "../data/categories";
import { useAuth } from "../lib/authContext";
import {
  ImportError,
  clearProgress,
  downloadProgressBackup,
  getAttempts,
  getCategoryStats,
  importProgress,
} from "../lib/storage";

const MODE_LABELS: Record<string, string> = {
  exam: "60-Question Exam",
  quiz: "Quick Quiz",
  struggle: "Struggle Set",
};

export default function Progress() {
  const { user, cloudSyncConfigured } = useAuth();
  const [importMessage, setImportMessage] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshKey is a deliberate cache-bust trigger
  const stats = useMemo(() => getCategoryStats(), [refreshKey]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshKey is a deliberate cache-bust trigger
  const attempts = useMemo(() => [...getAttempts()].reverse().slice(0, 15), [refreshKey]);

  const overall = useMemo(() => {
    const totalCorrect = stats.reduce((sum, s) => sum + s.correct, 0);
    const totalAnswered = stats.reduce((sum, s) => sum + s.total, 0);
    return {
      totalAnswered,
      accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    };
  }, [stats]);

  const sortedCategories = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        cat,
        stat: stats.find((s) => s.category === cat.id) ?? { correct: 0, total: 0, accuracy: 0 },
      })).sort((a, b) => a.stat.accuracy - b.stat.accuracy),
    [stats],
  );

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importProgress(String(reader.result), "merge");
        setImportMessage({ kind: "success", text: "Progress restored and merged with what's on this device." });
        setRefreshKey((k) => k + 1);
      } catch (err) {
        setImportMessage({
          kind: "error",
          text: err instanceof ImportError ? err.message : "Something went wrong reading that file.",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleClearProgress() {
    const proceed = window.confirm(
      "This clears all locally stored progress (history, attempts, flashcard scheduling) on this device. This can't be undone unless you have a backup file. Continue?",
    );
    if (!proceed) return;
    clearProgress();
    setImportMessage(null);
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title="Progress" />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10 text-center">
          <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.25em] text-white sm:text-3xl">
            Progress
          </h1>
          <div className="mx-auto mt-3 mb-3 h-px w-12 bg-silver-500/40" />
          <p className="text-silver-400">Your study history on this device.</p>
        </div>

        <div className="mb-10 flex items-center justify-between rounded-xl border border-panel-700 bg-panel-900/40 px-4 py-3 text-sm">
          {cloudSyncConfigured && user ? (
            <>
              <span className="text-silver-300">
                Synced to <span className="text-white">{user.email}</span>
              </span>
              <Link to="/login" className="text-silver-400 underline hover:text-silver-200">
                Manage
              </Link>
            </>
          ) : (
            <>
              <span className="text-silver-400">
                {cloudSyncConfigured
                  ? "Not signed in — progress stays on this device only."
                  : "Progress is saved on this device only."}
              </span>
              {cloudSyncConfigured && (
                <Link to="/login" className="text-silver-300 underline hover:text-white">
                  Log In
                </Link>
              )}
            </>
          )}
        </div>

        {overall.totalAnswered === 0 ? (
          <div className="rounded-2xl border border-panel-700 bg-panel-900/50 p-8 text-center text-silver-400">
            No study history yet. Take a Quick Quiz or Exam to start building your progress record.
            <div className="mt-6">
              <Link to="/hub" className="text-silver-300 underline">
                Back to Study Hub
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-panel-700 bg-panel-900/50 p-5 text-center">
                <div className="font-display text-3xl font-bold text-white">{overall.totalAnswered}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-silver-500">
                  Questions Answered
                </div>
              </div>
              <div className="rounded-2xl border border-panel-700 bg-panel-900/50 p-5 text-center">
                <div
                  className={`font-display text-3xl font-bold ${
                    overall.accuracy >= 70 ? "text-hud-green" : "text-hud-amber"
                  }`}
                >
                  {overall.accuracy}%
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-silver-500">
                  Overall Accuracy
                </div>
              </div>
            </div>

            <section className="mt-12">
              <h2 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.25em] text-silver-500">
                Category Accuracy
              </h2>
              <div className="flex flex-col gap-4">
                {sortedCategories.map(({ cat, stat }) => (
                  <CategoryBar key={cat.id} category={cat.id} correct={stat.correct} total={stat.total} />
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.25em] text-silver-500">
                Recent Attempts
              </h2>
              {attempts.length === 0 ? (
                <p className="text-sm text-silver-500">No completed quizzes or exams yet.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {attempts.map((a) => {
                    const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
                    return (
                      <li
                        key={a.id}
                        className="flex items-center justify-between rounded-xl border border-panel-700 bg-panel-900/40 px-4 py-3 text-sm"
                      >
                        <div>
                          <div className="font-medium text-silver-200">{MODE_LABELS[a.mode] ?? a.mode}</div>
                          <div className="text-xs text-silver-500">
                            {new Date(a.timestamp).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <div className={`font-mono text-sm font-semibold ${pct >= 70 ? "text-hud-green" : "text-hud-amber"}`}>
                          {a.score}/{a.total} · {pct}%
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}

        <section className="mt-12">
          <h2 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.25em] text-silver-500">
            Backup &amp; Restore
          </h2>
          <p className="mb-4 text-sm text-silver-400">
            Progress is stored only on this device. Download a backup before clearing browser data or
            switching devices, and restore it here later.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={downloadProgressBackup}
              className="flex-1 rounded-sm border border-panel-600 px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-silver-200 hover:border-panel-400"
            >
              Download Backup
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="flex-1 rounded-sm border border-panel-600 px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.15em] text-silver-200 hover:border-panel-400"
            >
              Restore From Backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {importMessage && (
            <p
              className={`mt-3 text-sm ${importMessage.kind === "success" ? "text-hud-green" : "text-hud-red"}`}
            >
              {importMessage.text}
            </p>
          )}

          <button
            type="button"
            onClick={handleClearProgress}
            className="mt-8 text-xs uppercase tracking-[0.15em] text-silver-600 underline hover:text-hud-red"
          >
            Clear all progress on this device
          </button>
        </section>
      </main>
    </div>
  );
}
