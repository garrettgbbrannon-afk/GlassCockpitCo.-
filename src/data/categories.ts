export type CategoryId =
  | "regulations"
  | "weather"
  | "airspace"
  | "performance"
  | "aerodynamics"
  | "systems"
  | "navigation"
  | "charts"
  | "groundOps"
  | "communications"
  | "emergency"
  | "humanFactors";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  short: string;
  weight: number;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "regulations", label: "Regulations", short: "REG", weight: 15, color: "#4fd9e8" },
  { id: "weather", label: "Weather", short: "WX", weight: 15, color: "#6bdc7c" },
  { id: "airspace", label: "Airspace", short: "AIRSP", weight: 10, color: "#f5a623" },
  { id: "performance", label: "Performance", short: "PERF", weight: 10, color: "#d16bdc" },
  { id: "aerodynamics", label: "Aerodynamics", short: "AERO", weight: 10, color: "#5b8def" },
  { id: "systems", label: "Systems", short: "SYS", weight: 10, color: "#e8944f" },
  { id: "navigation", label: "Navigation", short: "NAV", weight: 10, color: "#4fe8c9" },
  { id: "charts", label: "Charts", short: "CHART", weight: 8, color: "#c9e84f" },
  { id: "groundOps", label: "Ground Ops", short: "GND", weight: 8, color: "#a0a8b5" },
  { id: "communications", label: "Communications", short: "COMM", weight: 5, color: "#e84f8c" },
  { id: "emergency", label: "Emergency", short: "EMER", weight: 3, color: "#ef5b5b" },
  { id: "humanFactors", label: "Human Factors", short: "HF", weight: 5, color: "#b5e84f" },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryMeta>;
