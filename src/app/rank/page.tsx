"use client";

import { useEffect, useState, useMemo } from "react";
import type { School } from "@/lib/types";
import { biasColor, TIER_COLORS } from "@/lib/types";
import {
  assignAdjustedRanks,
  DEFAULT_FACTOR_WEIGHTS,
  type FactorWeights,
} from "@/lib/adjustedRank";

export default function RankYourWayPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [conservativeWeight, setConservativeWeight] = useState(30); // 0-100: how much conservative factors matter vs US News
  const [factorWeights, setFactorWeights] = useState<FactorWeights>(() => ({
    ...DEFAULT_FACTOR_WEIGHTS,
  }));

  useEffect(() => {
    fetch("/data/schools.json")
      .then((r) => r.json())
      .then(setSchools);
  }, []);

  // Normalize factor weights to sum to 1 (sliders are 0-100 each)
  const factorSliders = [
    { key: "bias" as const, label: "Twitter bias", desc: "Institutional messaging lean" },
    { key: "fec" as const, label: "FEC balance", desc: "Employee donation split" },
    { key: "fire" as const, label: "Free speech", desc: "FIRE free speech score" },
    { key: "dei" as const, label: "DEI footprint", desc: "Lower = fewer DEI staff" },
  ];

  const setFactor = (key: keyof FactorWeights, value: number) => {
    setFactorWeights((prev) => {
      const next = { ...prev, [key]: value / 100 };
      const sum = next.bias + next.fec + next.fire + next.dei;
      if (sum <= 0) return prev;
      return {
        bias: next.bias / sum,
        fec: next.fec / sum,
        fire: next.fire / sum,
        dei: next.dei / sum,
      };
    });
  };

  const ranked = useMemo(() => {
    if (!schools.length) return [];
    return assignAdjustedRanks(
      schools,
      conservativeWeight / 100,
      factorWeights
    );
  }, [schools, conservativeWeight, factorWeights]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Rank Your Way</h1>
      <p className="text-gray-400 mb-6">
        Adjust how much conservative values matter to you. We blend US News
        &nbsp;2026 rank with our data to produce a personalized ranking.
      </p>

      {/* Sliders panel */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-200 mb-1">
          Your priorities
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          US News ranks schools by academic quality (graduation rates, retention,
          class size, etc.). We add our factors so you can boost schools that
          align with your values.
        </p>

        {/* Master slider */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Weight US News (academics)</span>
            <span className="text-gray-300 font-mono">
              {100 - conservativeWeight}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={conservativeWeight}
            onChange={(e) => setConservativeWeight(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-red-500"
          />
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">All US News</span>
            <span className="text-gray-500">All our factors</span>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="text-sm font-medium text-gray-400 mb-4">
            Among conservative factors, how much does each matter?
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {factorSliders.map(({ key, label, desc }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{label}</span>
                  <span className="text-gray-500 font-mono">
                    {Math.round(factorWeights[key] * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={factorWeights[key] * 100}
                  onChange={(e) => setFactor(key, Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-red-500"
                />
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          US News methodology:{" "}
          <a
            href="https://www.usnews.com/education/best-colleges/articles/how-us-news-calculated-the-rankings"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            How U.S. News Calculated the 2026 Rankings
          </a>
        </p>
      </div>

      {/* Adjusted ranking table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-3 py-3 text-left font-medium text-gray-400 whitespace-nowrap">
                Adj. Rank
              </th>
              <th className="px-3 py-3 text-left font-medium text-gray-400 whitespace-nowrap">
                US News
              </th>
              <th className="px-3 py-3 text-left font-medium text-gray-400 whitespace-nowrap">
                School
              </th>
              <th className="px-3 py-3 text-left font-medium text-gray-400 whitespace-nowrap">
                Tier
              </th>
              <th className="px-3 py-3 text-left font-medium text-gray-400 whitespace-nowrap">
                Bias
              </th>
              <th className="px-3 py-3 text-left font-medium text-gray-400 whitespace-nowrap">
                FEC Rep%
              </th>
              <th className="px-3 py-3 text-left font-medium text-gray-400 whitespace-nowrap">
                FIRE
              </th>
              <th className="px-3 py-3 text-left font-medium text-gray-400 whitespace-nowrap">
                DEI
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((s) => (
              <tr
                key={s.handle}
                className="border-t border-gray-800 hover:bg-gray-900/50 transition-colors"
              >
                <td className="px-3 py-2.5 font-mono font-semibold text-gray-200">
                  #{s.adjustedRank}
                </td>
                <td className="px-3 py-2.5 font-mono text-gray-400">
                  {s.rankDisplay}
                </td>
                <td className="px-3 py-2.5">
                  <a
                    href={`/school/${s.handle}`}
                    className={`hover:opacity-80 font-medium ${
                      (s.biasScore ?? 0) > 15
                        ? "text-red-400 hover:text-red-300"
                        : "text-blue-400 hover:text-blue-300"
                    }`}
                  >
                    {s.name}
                  </a>
                  {s.highlight && (
                    <span className="ml-2 text-xs bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded">
                      conservative highlight
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: (TIER_COLORS[s.tier] ?? "#666") + "33",
                      color: TIER_COLORS[s.tier] ?? "#666",
                    }}
                  >
                    {s.tier}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  {s.biasScore != null ? (
                    <span
                      className="font-mono"
                      style={{ color: biasColor(s.biasScore) }}
                    >
                      {s.biasScore.toFixed(1)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2.5 text-gray-400">
                  {s.fecRepPct != null ? `${s.fecRepPct.toFixed(0)}%` : "—"}
                </td>
                <td className="px-3 py-2.5 text-gray-400">
                  {s.fireScore != null ? s.fireScore.toFixed(1) : "—"}
                </td>
                <td className="px-3 py-2.5 text-gray-400">
                  {s.deiStaff != null ? s.deiStaff : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Adjusted rank is recalculated as you move the sliders. Lower US News
        rank = better academic quality; our factors add a boost for schools that
        match your values.
      </p>
    </div>
  );
}
