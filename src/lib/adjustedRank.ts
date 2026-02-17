import type { School } from "./types";

/** 0–1, higher = more conservative-friendly. Missing data → 0.5 (neutral). */
export function normBias(s: School): number {
  if (s.biasScore == null) return 0.5;
  return Math.max(0, Math.min(1, (s.biasScore + 80) / 160));
}

/** 0–1, higher = more Republican donation share. */
export function normFec(s: School): number {
  if (s.fecRepPct != null) return s.fecRepPct / 100;
  if (s.fecBiasScore != null)
    return Math.max(0, Math.min(1, (s.fecBiasScore + 100) / 200));
  return 0.5;
}

/** 0–1, higher = better free speech (FIRE score). */
export function normFire(s: School): number {
  if (s.fireScore != null) return Math.max(0, Math.min(1, s.fireScore / 100));
  return 0.5;
}

/** 0–1, higher = fewer DEI staff (more conservative-friendly). */
export function normDei(s: School): number {
  if (s.deiStaff != null) return Math.max(0, 1 - s.deiStaff / 25);
  return 0.5;
}

export interface FactorWeights {
  bias: number;
  fec: number;
  fire: number;
  dei: number;
}

/** Weights must sum to 1. */
export function conservativeScore(s: School, w: FactorWeights): number {
  return (
    w.bias * normBias(s) +
    w.fec * normFec(s) +
    w.fire * normFire(s) +
    w.dei * normDei(s)
  );
}

/** US News quality component: 0–1, higher = better rank. NR (999) → 0. */
function usnewsQuality(s: School): number {
  const r = s.rank >= 1 && s.rank <= 150 ? s.rank : 150;
  return (151 - r) / 150;
}

/**
 * Composite score for sorting. Higher = better.
 * Blend: (1 - conservativeWeight) * US News + conservativeWeight * conservative score.
 */
export function compositeScore(
  s: School,
  conservativeWeight: number,
  factorWeights: FactorWeights
): number {
  const usn = usnewsQuality(s);
  const cons = conservativeScore(s, factorWeights);
  return (1 - conservativeWeight) * usn + conservativeWeight * cons;
}

export interface SchoolWithAdjustedRank extends School {
  adjustedRank: number;
  compositeScore: number;
}

/**
 * Assign adjusted ranks 1, 2, 3, ... by composite score (desc).
 * Ties broken by US News rank then name.
 */
export function assignAdjustedRanks(
  schools: School[],
  conservativeWeight: number,
  factorWeights: FactorWeights
): SchoolWithAdjustedRank[] {
  const withScore = schools.map((s) => ({
    ...s,
    compositeScore: compositeScore(s, conservativeWeight, factorWeights),
  }));
  withScore.sort((a, b) => {
    if (b.compositeScore !== a.compositeScore)
      return b.compositeScore - a.compositeScore;
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.name.localeCompare(b.name);
  });
  return withScore.map((s, i) => ({
    ...s,
    adjustedRank: i + 1,
  }));
}

export const DEFAULT_FACTOR_WEIGHTS: FactorWeights = {
  bias: 0.35,
  fec: 0.25,
  fire: 0.25,
  dei: 0.15,
};
