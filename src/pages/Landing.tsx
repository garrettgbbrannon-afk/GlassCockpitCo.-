import { Link } from "react-router-dom";
import bonanzaRunway from "../assets/photos/bonanza-runway.webp";
import Logo from "../components/Logo";

export default function Landing() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-panel-950">
      <img
        src={bonanzaRunway}
        alt="Beechcraft Bonanza facing down the runway at dusk with mountains behind"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-panel-950/90 via-panel-950/50 to-panel-950/95" />
      <div className="absolute inset-0 hud-grid opacity-20" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 480px 320px at center, rgba(5,7,10,0.6) 0%, rgba(5,7,10,0) 70%)",
          }}
        />
        <Logo size="lg" showTagline />
      </div>

      <div className="relative z-10 mb-16 flex w-full max-w-md flex-col gap-3 px-6 sm:flex-row sm:max-w-xl">
        <Link
          to="/hub"
          className="flex-1 rounded-xl bg-accent-500 px-6 py-4 text-center font-display text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-accent-600/30 transition-colors hover:bg-accent-600"
        >
          Begin Training
        </Link>
        <Link
          to="/quiz/run"
          state={{ category: "all" }}
          className="flex-1 rounded-xl border border-silver-500/40 bg-panel-900/60 px-6 py-4 text-center font-display text-sm font-semibold uppercase tracking-[0.15em] text-silver-200 backdrop-blur transition-colors hover:border-silver-400 hover:text-white"
        >
          Quick Quiz
        </Link>
      </div>
    </div>
  );
}
