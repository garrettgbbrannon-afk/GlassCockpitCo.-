import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";

export default function ExamSetup() {
  const navigate = useNavigate();
  const [timed, setTimed] = useState(true);

  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title="60-Question Exam" />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.25em] text-white">
          60-Question Exam
        </h1>
        <div className="mt-3 h-px w-12 bg-silver-500/40" />
        <p className="mt-4 text-silver-400">
          A full simulated FAA knowledge test, weighted to match the real exam's topic distribution.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTimed(true)}
            className={`rounded-xl border px-5 py-4 text-left transition-colors ${
              timed ? "border-silver-300 bg-silver-300/10" : "border-panel-700 bg-panel-900/60 hover:border-panel-500"
            }`}
          >
            <div className="font-display text-base font-semibold uppercase tracking-wide text-white">Timed</div>
            <div className="mt-1 text-sm text-silver-400">2 hours 30 minutes — matches the real FAA exam.</div>
          </button>
          <button
            type="button"
            onClick={() => setTimed(false)}
            className={`rounded-xl border px-5 py-4 text-left transition-colors ${
              !timed ? "border-silver-300 bg-silver-300/10" : "border-panel-700 bg-panel-900/60 hover:border-panel-500"
            }`}
          >
            <div className="font-display text-base font-semibold uppercase tracking-wide text-white">Untimed</div>
            <div className="mt-1 text-sm text-silver-400">Take as long as you need.</div>
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("/exam/run", { state: { timed } })}
          className="mt-10 w-full rounded-sm bg-silver-200 px-6 py-4 text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 transition-colors hover:bg-silver-100 sm:w-auto"
        >
          Start Exam
        </button>
      </main>
    </div>
  );
}
