import { Link } from "react-router-dom";
import staggerwingHero from "../assets/photos/staggerwing-hero.webp";
import Logo from "../components/Logo";

export default function Landing() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-panel-950">
      <img
        src={staggerwingHero}
        alt="Beechcraft Staggerwing biplane flying over green hills"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-panel-950/85 via-panel-950/25 to-panel-950/90" />
      <div className="absolute inset-0 hud-grid opacity-10" />

      <div className="relative z-10 flex flex-col items-center px-6 pt-14 text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:pt-20">
        <Logo size="lg" showTagline />
      </div>

      <div className="relative z-10 mb-16 flex w-full max-w-md flex-col gap-3 px-6 sm:flex-row sm:max-w-xl">
        <Link
          to="/hub"
          className="flex-1 rounded-sm bg-silver-200 px-6 py-4 text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-panel-950 transition-colors hover:bg-silver-100"
        >
          Begin Training
        </Link>
        <Link
          to="/quiz/run"
          state={{ category: "all" }}
          className="flex-1 rounded-sm border border-silver-500/40 bg-panel-900/60 px-6 py-4 text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-silver-200 backdrop-blur transition-colors hover:border-silver-300 hover:text-white"
        >
          Quick Quiz
        </Link>
      </div>
    </div>
  );
}
