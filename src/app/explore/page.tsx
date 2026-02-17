"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { School } from "@/lib/types";
import { TIER_COLORS, TIERS, biasColor } from "@/lib/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function ExplorePage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [tab, setTab] = useState<"scatter" | "matrix">("scatter");

  useEffect(() => {
    fetch("/data/schools.json")
      .then((r) => r.json())
      .then(setSchools);
  }, []);

  const withBoth = useMemo(
    () => schools.filter((s) => s.biasScore != null && s.fecDemPct != null),
    [schools]
  );

  if (!schools.length)
    return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Explore</h1>
      <p className="text-gray-400 mb-6">
        Interactive visualizations — hover, zoom, and click to discover
        patterns.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["scatter", "matrix"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
            }`}
          >
            {t === "scatter" ? "FEC vs Twitter Bias" : "2x2 Bias Matrix"}
          </button>
        ))}
      </div>

      {tab === "scatter" && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <Plot
            data={TIERS.map((tier) => {
              const tierSchools = withBoth.filter((s) => s.tier === tier);
              return {
                x: tierSchools.map((s) => s.fecBiasScore ?? 0),
                y: tierSchools.map((s) => s.biasScore),
                text: tierSchools.map(
                  (s) =>
                    `${s.name}<br>Rank #${s.rankDisplay}<br>Bias: ${s.biasScore?.toFixed(1)}<br>FEC Dem%: ${s.fecDemPct?.toFixed(0)}%<br>${s.state}`
                ),
                hoverinfo: "text",
                mode: "markers",
                name: tier,
                marker: {
                  color: TIER_COLORS[tier],
                  size: tierSchools.map(
                    (s) => Math.max(8, 25 - (s.rank / 155) * 20)
                  ),
                  opacity: 0.8,
                  line: { color: "#fff", width: 1 },
                },
                type: "scatter" as const,
              };
            })}
            layout={{
              height: 650,
              xaxis: {
                title: "FEC Bias Score (← Dem | Rep →)",
                gridcolor: "#333",
                zeroline: true,
                zerolinecolor: "#555",
              },
              yaxis: {
                title: "Twitter Bias Score (← Liberal | Conservative →)",
                gridcolor: "#333",
                zeroline: true,
                zerolinecolor: "#555",
              },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
              font: { color: "#ccc" },
              legend: { orientation: "h", y: -0.12 },
              margin: { t: 20 },
              shapes: [
                {
                  type: "line",
                  y0: 0, y1: 0, x0: -100, x1: 100,
                  line: { color: "#555", dash: "dash" },
                },
                {
                  type: "line",
                  x0: 0, x1: 0, y0: -80, y1: 80,
                  line: { color: "#555", dash: "dash" },
                },
              ],
            }}
            config={{ displayModeBar: false }}
            style={{ width: "100%" }}
          />
          <p className="text-sm text-gray-500 mt-3">
            Bubble size inversely proportional to rank. Hover for details.
          </p>
        </div>
      )}

      {tab === "matrix" && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <Plot
            data={[
              ...["Full Progressive", "Mixed", "Independent/Conservative"].map(
                (quad, qi) => {
                  const colors = ["#2166ac", "#999", "#b2182b"];
                  const qs = withBoth.filter((s) => {
                    const libTw = (s.biasScore ?? 0) < -10;
                    const libFec = (s.fecDemPct ?? 0) > 70;
                    if (qi === 0) return libTw && libFec;
                    if (qi === 2) return !libTw && !libFec;
                    return (libTw && !libFec) || (!libTw && libFec);
                  });
                  return {
                    x: qs.map((s) => s.fecDemPct),
                    y: qs.map((s) => s.biasScore),
                    text: qs.map((s) => `${s.name} (#${s.rankDisplay})`),
                    hoverinfo: "text",
                    mode: "markers",
                    name: quad,
                    marker: {
                      color: colors[qi],
                      size: 10,
                      opacity: 0.7,
                    },
                    type: "scatter" as const,
                  };
                }
              ),
            ]}
            layout={{
              height: 600,
              xaxis: {
                title: "FEC Democrat %",
                gridcolor: "#333",
              },
              yaxis: {
                title: "Twitter Bias Score",
                gridcolor: "#333",
              },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
              font: { color: "#ccc" },
              legend: { orientation: "h", y: -0.12 },
              margin: { t: 20 },
              shapes: [
                {
                  type: "line",
                  y0: -10, y1: -10, x0: 0, x1: 100,
                  line: { color: "#555", dash: "dash" },
                },
                {
                  type: "line",
                  x0: 70, x1: 70, y0: -80, y1: 80,
                  line: { color: "#555", dash: "dash" },
                },
              ],
              annotations: [
                { x: 85, y: -50, text: "Full Progressive", showarrow: false, font: { color: "#2166ac", size: 14 } },
                { x: 85, y: 30, text: "Mixed", showarrow: false, font: { color: "#999", size: 14 } },
                { x: 40, y: 30, text: "Independent /<br>Conservative", showarrow: false, font: { color: "#b2182b", size: 14 } },
              ],
            }}
            config={{ displayModeBar: false }}
            style={{ width: "100%" }}
          />

          {/* Quadrant counts */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Full Progressive", color: "#2166ac", count: withBoth.filter((s) => (s.biasScore ?? 0) < -10 && (s.fecDemPct ?? 0) > 70).length },
              { label: "Mixed", color: "#999", count: withBoth.filter((s) => !((s.biasScore ?? 0) < -10 && (s.fecDemPct ?? 0) > 70) && !((s.biasScore ?? 0) >= -10 && (s.fecDemPct ?? 0) <= 70)).length },
              { label: "Independent / Conservative", color: "#b2182b", count: withBoth.filter((s) => (s.biasScore ?? 0) >= -10 && (s.fecDemPct ?? 0) <= 70).length },
            ].map((q) => (
              <div
                key={q.label}
                className="text-center p-4 rounded-xl border border-gray-800"
              >
                <div className="text-3xl font-bold" style={{ color: q.color }}>
                  {q.count}
                </div>
                <div className="text-sm text-gray-400">{q.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
