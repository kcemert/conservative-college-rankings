"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { School, SortField, SortDir } from "@/lib/types";
import { biasColor, biasLabel, TIER_COLORS, TIERS } from "@/lib/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function RankingsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({
    field: "rank",
    dir: "asc",
  });
  const [tierFilter, setTierFilter] = useState<Set<string>>(new Set(["Top 25"]));
  const [biasRange, setBiasRange] = useState<[number, number]>([-80, 80]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/data/schools.json")
      .then((r) => r.json())
      .then(setSchools);
  }, []);

  const filtered = useMemo(() => {
    return schools
      .filter((s) => tierFilter.has(s.tier))
      .filter((s) => {
        if (s.biasScore == null) return true;
        return s.biasScore >= biasRange[0] && s.biasScore <= biasRange[1];
      })
      .filter(
        (s) =>
          !search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.handle.toLowerCase().includes(search.toLowerCase()) ||
          s.state.toLowerCase().includes(search.toLowerCase())
      );
  }, [schools, tierFilter, biasRange, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sort.field] ?? 999;
      const bv = b[sort.field] ?? 999;
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sort]);

  const toggleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    );
  };

  const toggleTier = (tier: string) => {
    setTierFilter((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  const avg = (field: keyof School) => {
    const vals = filtered.map((s) => s[field]).filter((v) => v != null) as number[];
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  const avgBias = avg("biasScore");
  const avgDem = avg("fecDemPct");
  const avgFire = avg("fireRank");

  // Timeline: one line per tier (among filtered schools), avg bias by phase
  const timelineByTier = useMemo(() => {
    const phases = [
      { label: "Phase 1\n(2012–19)", key: "phase1" as const },
      { label: "Phase 2\n(2020–23)", key: "phase2" as const },
      { label: "Phase 3\n(2024–26)", key: "phase3" as const },
    ];
    const x = phases.map((p) => p.label);
    const byTier = new Map<string, School[]>();
    for (const s of filtered) {
      const list = byTier.get(s.tier) ?? [];
      list.push(s);
      byTier.set(s.tier, list);
    }
    const series: { tier: string; y: (number | null)[] }[] = [];
    for (const [tier, tierSchools] of byTier) {
      const y = phases.map((p) => {
        const numbers = tierSchools
          .map((s) => s[p.key])
          .filter((v): v is number => v != null);
        if (numbers.length === 0) return null;
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
      });
      if (y.some((v) => v != null)) series.push({ tier, y });
    }
    return { x, series };
  }, [filtered]);

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 text-xs text-gray-500">
      {sort.field === field ? (sort.dir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Campus Bias Rankings</h1>
      <p className="text-gray-400 mb-6">
        155 US universities ranked by Twitter bias, FEC donations, FIRE free
        speech scores, and more.
      </p>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-sm text-gray-400">Schools</div>
          <div className="text-2xl font-bold">{filtered.length}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-sm text-gray-400">Avg Bias Score</div>
          <div className="text-2xl font-bold" style={{ color: biasColor(avgBias ?? undefined) }}>
            {avgBias != null ? avgBias.toFixed(1) : "—"}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-sm text-gray-400">Avg FEC Dem%</div>
          <div className="text-2xl font-bold text-blue-400">
            {avgDem != null ? `${avgDem.toFixed(0)}%` : "—"}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-sm text-gray-400">Avg FIRE Rank</div>
          <div className="text-2xl font-bold text-amber-400">
            {avgFire != null ? `#${avgFire.toFixed(0)}` : "—"}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search schools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2">
          {TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                tierFilter.has(tier)
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-transparent border-gray-700 text-gray-500"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline — one line per tier (selected schools) */}
      {timelineByTier.series.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-1">
            Bias Over Time by Tier
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Average Twitter bias score by phase for each tier in the current
            selection ({filtered.length} school
            {filtered.length !== 1 ? "s" : ""}).
          </p>
          <Plot
            data={timelineByTier.series.map(({ tier, y }) => ({
              x: timelineByTier.x,
              y: y.map((v) => v ?? undefined),
              mode: "lines+markers+text" as const,
              text: y.map((v) => (v != null ? v.toFixed(1) : "")),
              textposition: "top center" as const,
              name: tier,
              line: {
                color: TIER_COLORS[tier] ?? "#888",
                width: 3,
              },
              marker: { size: 10 },
              textfont: { color: "#ccc" },
            }))}
            layout={{
              height: 320,
              margin: { t: 20, b: 50, l: 50, r: 30 },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
              font: { color: "#ccc" },
              showlegend: true,
              legend: { orientation: "h", y: 1.08, x: 0 },
              xaxis: {
                gridcolor: "#333",
                tickfont: { size: 11 },
              },
              yaxis: {
                title: "Avg Bias Score",
                gridcolor: "#333",
                zeroline: true,
                zerolinecolor: "#555",
              },
              shapes: [
                {
                  type: "line",
                  y0: 0,
                  y1: 0,
                  x0: 0,
                  x1: 1,
                  xref: "paper",
                  line: { color: "#555", dash: "dot" },
                },
              ],
            }}
            config={{ displayModeBar: false }}
            style={{ width: "100%" }}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900">
            <tr>
              {([
                ["rank", "Rank"],
                ["name", "School"],
                ["tier", "Tier"],
                ["state", "State"],
                ["biasScore", "Bias"],
                ["tweetCount", "Tweets"],
                ["fecDemPct", "FEC Dem%"],
                ["fireRank", "FIRE"],
                ["fireGrade", "Grade"],
                ["deiStaff", "DEI Staff"],
              ] as [SortField, string][]).map(([field, label]) => (
                <th
                  key={field}
                  onClick={() => toggleSort(field)}
                  className="px-3 py-3 text-left font-medium text-gray-400 cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  {label}
                  <SortIcon field={field} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr
                key={s.handle}
                className="border-t border-gray-800 hover:bg-gray-900/50 transition-colors"
              >
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
                <td className="px-3 py-2.5 text-gray-400">{s.tier}</td>
                <td className="px-3 py-2.5 text-gray-400">{s.state || "—"}</td>
                <td className="px-3 py-2.5">
                  {s.biasScore != null ? (
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: biasColor(s.biasScore) + "33",
                        color: biasColor(s.biasScore),
                      }}
                    >
                      {s.biasScore.toFixed(1)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2.5 text-gray-400">
                  {s.tweetCount ?? "—"}
                </td>
                <td className="px-3 py-2.5">
                  {s.fecDemPct != null ? (
                    <span className="text-blue-400">
                      {s.fecDemPct.toFixed(0)}%
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2.5 text-gray-400">
                  {s.fireRank != null ? `#${s.fireRank}` : "—"}
                </td>
                <td className="px-3 py-2.5 text-gray-400">
                  {s.fireGrade || "—"}
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
        Click column headers to sort. Click school names for detailed profiles.
      </p>
    </div>
  );
}
