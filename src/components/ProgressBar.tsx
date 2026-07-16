interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
}

export default function ProgressBar({ current, total, color = "var(--color-silver-300)" }: ProgressBarProps) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className="w-full">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-700">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
