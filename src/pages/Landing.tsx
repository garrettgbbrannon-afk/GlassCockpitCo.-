import { Link } from "react-router-dom";
import staggerwingHero from "../assets/photos/staggerwing-hero.webp";
import gcMark from "../assets/photos/gc-mark.webp";
import { useAuth } from "../lib/authContext";

export default function Landing() {
  const { user, cloudSyncConfigured } = useAuth();
  const signedIn = cloudSyncConfigured && user;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-panel-950">
      {/* Background photo — slow Ken Burns drift, slightly blurred so type stays the focus */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={staggerwingHero}
          alt="Beechcraft Staggerwing biplane flying against golden sunset clouds"
          className="animate-ken-burns h-full w-full object-cover blur-[1.5px]"
        />
      </div>

      {/* Darkening — strong enough that the headline pops, soft enough the plane stays visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-panel-950/85 via-navy-900/78 to-panel-950/92" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 620px 420px at 50% 42%, rgba(5,7,11,0.55), transparent 72%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 500px at 15% 92%, rgba(106,141,255,0.16), transparent 70%)",
        }}
      />

      {/* Depth — soft drifting orbs, kept low/corners so they never sit behind the headline */}
      <div className="animate-drift-a pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-slate-800/50 blur-3xl" />
      <div className="animate-drift-b pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-navy-900/60 blur-3xl" />
      <div className="animate-drift-a pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-glow-blue/10 blur-3xl" />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2.5">
          <img src={gcMark} alt="" className="h-6 w-auto sm:h-7" draggable={false} />
          <span className="font-sans text-sm font-medium tracking-wide text-white">Glass Cockpit</span>
        </div>
        <Link
          to={signedIn ? "/hub" : "/login"}
          className="rounded-full bg-white/95 px-5 py-2 text-xs font-medium tracking-wide text-panel-950 transition-all hover:-translate-y-px hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
        >
          {signedIn ? (user?.displayName?.split(" ")[0] ?? "Study Hub") : "Log In / Sign Up"}
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in-up drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <h1 className="font-sans text-4xl font-light tracking-tight text-white sm:text-6xl md:text-7xl">
            The Future of
            <br />
            <span className="font-normal">Flight Training.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base font-light text-silver-200 sm:text-lg">
            Modern aircraft. Adaptive practice. Ready pilots.
          </p>
        </div>

        <div
          className="animate-fade-in-up mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:max-w-lg"
          style={{ animationDelay: "0.15s" }}
        >
          <Link
            to="/hub"
            className="group flex-1 rounded-full bg-white px-7 py-3.5 text-center text-sm font-medium text-panel-950 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(255,255,255,0.2)]"
          >
            Begin Training{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/quiz/run"
            state={{ category: "all" }}
            className="glass-panel flex-1 rounded-full px-7 py-3.5 text-center text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(106,141,255,0.35)]"
          >
            Take Flight Quiz
          </Link>
        </div>
      </div>

      <div className="relative z-10 pb-8 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver-500">
          Train. Fly. Elevate.
        </div>
        <p className="mx-auto mt-3 max-w-sm px-6 text-[11px] leading-relaxed text-silver-600">
          Not affiliated with or endorsed by the FAA.{" "}
          <Link to="/terms" className="underline hover:text-silver-400">
            Terms
          </Link>{" "}
          ·{" "}
          <Link to="/privacy" className="underline hover:text-silver-400">
            Privacy
          </Link>
        </p>
      </div>
    </div>
  );
}
