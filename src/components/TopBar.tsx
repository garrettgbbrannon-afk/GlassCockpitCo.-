import { Link } from "react-router-dom";
import gcMark from "../assets/photos/gc-mark.webp";

interface TopBarProps {
  title?: string;
  right?: React.ReactNode;
}

export default function TopBar({ title, right }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-panel-700 bg-panel-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={gcMark} alt="Glass Cockpit Co." className="h-7 w-auto" draggable={false} />
          <span className="font-display font-semibold uppercase tracking-[0.25em] text-white text-sm hidden sm:inline">
            Glass Cockpit <span className="text-silver-400">Co.</span>
          </span>
        </Link>
        {title && (
          <div className="font-display text-sm uppercase tracking-[0.2em] text-silver-300 truncate px-2">
            {title}
          </div>
        )}
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}
