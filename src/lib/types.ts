export interface School {
  handle: string;
  rank: number;
  rankDisplay: string;
  name: string;
  highlight: boolean;
  tier: string;
  state: string;
  biasScore?: number;
  tweetCount?: number;
  biasLabel?: string;
  fecDemPct?: number;
  fecRepPct?: number;
  fecTotal?: number;
  fecContributions?: number;
  fecBiasScore?: number;
  fireRank?: number;
  fireScore?: number;
  fireGrade?: string;
  deiStaff?: number;
  phase1?: number;
  phase2?: number;
  phase3?: number;
}

export type SortField = keyof School;
export type SortDir = "asc" | "desc";

export const TIER_COLORS: Record<string, string> = {
  "Top 25": "#2166ac",
  "26-50": "#67a9cf",
  "51-100": "#d1e5f0",
  "101-150": "#fddbc7",
  "Conservative Highlight": "#b2182b",
};

export const TIERS = ["Top 25", "26-50", "51-100", "101-150", "Conservative Highlight"];

export function biasColor(score?: number): string {
  if (score == null) return "#666";
  if (score <= -40) return "#2166ac";
  if (score <= -15) return "#67a9cf";
  if (score <= 15) return "#aaa";
  if (score <= 40) return "#ef8a62";
  return "#b2182b";
}

export function biasLabel(score?: number): string {
  if (score == null) return "No Data";
  if (score <= -40) return "Strong Liberal";
  if (score <= -15) return "Liberal";
  if (score <= 15) return "Moderate";
  if (score <= 40) return "Conservative";
  return "Strong Conservative";
}
