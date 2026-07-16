import { CATEGORY_MAP, type CategoryId } from "../data/categories";

interface CategoryBarProps {
  category: CategoryId;
  correct: number;
  total: number;
}

export default function CategoryBar({ category, correct, total }: CategoryBarProps) {
  const meta = CATEGORY_MAP[category];
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-silver-200">{meta.label}</span>
        <span className="font-mono text-xs text-silver-500">
          {correct}/{total} · {pct}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-panel-700">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: meta.color }}
        />
      </div>
    </div>
  );
}
