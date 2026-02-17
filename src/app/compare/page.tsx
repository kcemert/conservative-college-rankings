"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { School } from "@/lib/types";
import { biasColor } from "@/lib/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const COMPARE_COLORS = ["#2166ac", "#b2182b", "#21ac66", "#ac6621"];

export default function ComparePage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/schools.json")
      .then((r) => r.json())
      .then((data: School[]) => {
        setSchools(data);
        setSelected(data.slice(0, 3).map((s) => s.handle));
      });
  }, []);

  const selectedSchools = useMemo(
    () => schools.filter((s) => selected.includes(s.handle)),
    [schools, selected]
  );

  const toggleSchool = (handle: string) => {
    setSelected((prev) => {
      if (prev.includes(handle)) return prev.filter((h) => h !== handle);
      if (prev.length >= 4) return prev;
      return [...prev, handle];
    });
  };

  if (!schools.length)
    return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const radarMetrics = [
    { label: "Bias (abs)", field: "biasScore" as keyof School, abs: true },
    { label: "FEC Dem%", field: "fecDemPct" as keyof School, abs: false },
    { label: "FIRE Rank", field: "fireRank" as keyof School, abs: false },
    { label: "DEI Staff", field: "deiStaff" as keyof School, abs: false },
    { label: "Tweets", field: "tweetCount" as keyof School, abs: false },
  ];

  const maxVals = radarMetrics.map((m) => {
    const vals = schools
      .map((s) => {
        const v = s[m.field] as number | undefined;
        return v != null ? (m.abs ? Math.abs(v) : v) : 0;
      });
    return Math.max(...vals, 1);
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Compare Schools</h1>
      <p className="text-gray-400 mb-6">
        Select 2–4 schools to compare across all metrics.
      </p>

      {/* School selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-gray-900 rounded-xl border border-gray-800">
          {schools
            .sort((a, b) => a.rank - b.rank)
            .map((s) => (
              <button
                key={s.handle}
                onClick={() => toggleSchool(s.handle)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  selected.includes(s.handle)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                } ${
                  !selected.includes(s.handle) && selected.length >= 4
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  !selected.includes(s.handle) && selected.length >= 4
                }
              >
                #{s.rankDisplay} {s.name}
              </button>
            ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {selected.length}/4 selected
        </p>
      </div>

      {selectedSchools.length >= 2 && (
        <>
          {/* Radar */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Multi-Metric Radar</h2>
            <Plot
              data={selectedSchools.map((s, i) => {
                const vals = radarMetrics.map((m, mi) => {
                  const v = s[m.field] as number | undefined;
                  const raw = v != null ? (m.abs ? Math.abs(v) : v) : 0;
                  return (raw / maxVals[mi]) * 100;
                });
                return {
                  type: "scatterpolar" as const,
                  r: [...vals, vals[0]],
                  theta: [
                    ...radarMetrics.map((m) => m.label),
                    radarMetrics[0].label,
                  ],
                  fill: "toself",
                  name: s.name,
                  line: { color: COMPARE_COLORS[i] },
                  opacity: 0.6,
                };
              })}
              layout={{
                height: 450,
                polar: {
                  radialaxis: { visible: true, range: [0, 100], showticklabels: false },
                  bgcolor: "transparent",
                },
                paper_bgcolor: "transparent",
                font: { color: "#ccc" },
                legend: { orientation: "h", y: -0.1 },
                margin: { t: 20, b: 60 },
              }}
              config={{ displayModeBar: false }}
              style={{ width: "100%" }}
            />
          </div>

          {/* Bar comparisons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {([
              ["Twitter Bias Score", "biasScore"],
              ["FEC Democrat %", "fecDemPct"],
              ["FIRE Free Speech Rank", "fireRank"],
              ["DEI Staff Count", "deiStaff"],
            ] as [string, keyof School][]).map(([label, field]) => (
              <div
                key={field}
                className="bg-gray-900 rounded-xl border border-gray-800 p-5"
              >
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  {label}
                </h3>
                <div className="space-y-2">
                  {selectedSchools.map((s, i) => {
                    const val = s[field] as number | undefined;
                    const maxVal = Math.max(
                      ...selectedSchools
                        .map((ss) => Math.abs((ss[field] as number) ?? 0))
                    );
                    const pct =
                      val != null && maxVal > 0
                        ? (Math.abs(val) / maxVal) * 100
                        : 0;
                    return (
                      <div key={s.handle}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{s.name}</span>
                          <span className="font-mono">
                            {val != null ? val.toFixed(1) : "—"}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: COMPARE_COLORS[i],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Phase comparison */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4">
              Bias Trajectory Comparison
            </h2>
            <Plot
              data={selectedSchools.map((s, i) => ({
                x: ["Phase 1 (2012–19)", "Phase 2 (2020–23)", "Phase 3 (2024–26)"],
                y: [s.phase1, s.phase2, s.phase3],
                mode: "lines+markers+text",
                text: [s.phase1, s.phase2, s.phase3].map((v) =>
                  v != null ? v.toFixed(1) : ""
                ),
                textposition: "top center",
                name: s.name,
                line: { color: COMPARE_COLORS[i], width: 3 },
                marker: { size: 10 },
                textfont: { color: "#ccc" },
              }))}
              layout={{
                height: 400,
                paper_bgcolor: "transparent",
                plot_bgcolor: "transparent",
                font: { color: "#ccc" },
                yaxis: { gridcolor: "#333", title: "Bias Score" },
                legend: { orientation: "h", y: -0.15 },
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
                margin: { t: 20, b: 60 },
              }}
              config={{ displayModeBar: false }}
              style={{ width: "100%" }}
            />
          </div>
        </>
      )}
    </div>
  );
}
