import gcMark from "../assets/photos/gc-mark.png";

interface LogoProps {
  size?: "sm" | "lg";
  showTagline?: boolean;
  className?: string;
}

export default function Logo({ size = "sm", showTagline = false, className = "" }: LogoProps) {
  const markHeight = size === "lg" ? "h-16 sm:h-24" : "h-8";
  const wordmarkSize = size === "lg" ? "text-2xl sm:text-4xl" : "text-base";
  const coSize = size === "lg" ? "text-sm sm:text-base" : "text-[10px]";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img src={gcMark} alt="" className={`${markHeight} w-auto select-none`} draggable={false} />
      <div
        className={`font-display font-semibold uppercase tracking-[0.3em] text-white leading-none ${wordmarkSize} -mt-1 sm:-mt-2`}
      >
        Glass Cockpit
      </div>
      <div className={`mt-3 flex items-center gap-3 text-silver-400 leading-none ${coSize}`}>
        <span className="h-px w-6 bg-silver-500/50" />
        <span className="font-display tracking-[0.4em] uppercase">Co.</span>
        <span className="h-px w-6 bg-silver-500/50" />
      </div>
      {showTagline && (
        <div className="mt-6 font-display text-xs leading-none tracking-[0.5em] text-silver-500 uppercase">
          Train. Fly. Elevate.
        </div>
      )}
    </div>
  );
}
