"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { School } from "@/lib/types";
import { biasColor, biasLabel, TIER_COLORS } from "@/lib/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className="text-xs text-gray-400 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-2xl font-bold mt-1" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

export default function SchoolProfilePage() {
  const params = useParams();
  const handle = params.handle as string;
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    fetch("/data/schools.json")
      .then((r) => r.json())
      .then(setSchools);
  }, []);

  const school = schools.find((s) => s.handle === handle);
  const allAvg = (field: keyof School) => {
    const vals = schools
      .map((s) => s[field])
      .filter((v) => v != null) as number[];
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  if (!schools.length) {
    return (
      <div className="text-center py-20 text-gray-400">Loading...</div>
    );
  }

  if (!school) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-400">School Not Found</h1>
        <p className="text-gray-400 mt-2">
          No school with handle &quot;{handle}&quot;
        </p>
        <a href="/" className="text-blue-400 mt-4 inline-block">
          &larr; Back to rankings
        </a>
      </div>
    );
  }

  const phases = [
    { label: "Phase 1 (2012–19)", value: school.phase1 },
    { label: "Phase 2 (2020–23)", value: school.phase2 },
    { label: "Phase 3 (2024–26)", value: school.phase3 },
  ];

  const avgPhases = [allAvg("phase1"), allAvg("phase2"), allAvg("phase3")];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-gray-300">
          Rankings
        </a>{" "}
        / {school.name}
      </div>

      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">
            {school.name}
            {school.highlight && (
              <span className="ml-3 text-sm bg-red-900/40 text-red-400 px-2 py-1 rounded align-middle">
                Highlight
              </span>
            )}
          </h1>
          <div className="flex gap-4 text-gray-400">
            <span className="font-mono">#{school.rankDisplay}</span>
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: (TIER_COLORS[school.tier] || "#666") + "33",
                color: TIER_COLORS[school.tier] || "#666",
              }}
            >
              {school.tier}
            </span>
            {school.state && <span>{school.state}</span>}
          </div>
        </div>

        {/* Bias gauge */}
        {school.biasScore != null && (
          <div className="w-72">
            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "gauge+number",
                  value: school.biasScore,
                  gauge: {
                    axis: { range: [-80, 80] },
                    bar: { color: "#444" },
                    steps: [
                      { range: [-80, -40], color: "#2166ac" },
                      { range: [-40, -15], color: "#67a9cf" },
                      { range: [-15, 15], color: "#f7f7f7" },
                      { range: [15, 40], color: "#ef8a62" },
                      { range: [40, 80], color: "#b2182b" },
                    ],
                    threshold: {
                      line: { color: "white", width: 3 },
                      thickness: 0.8,
                      value: school.biasScore,
                    },
                  },
                  number: { font: { color: "#fff" } },
                } as object,
              ]}
              layout={{
                height: 180,
                margin: { t: 20, b: 0, l: 30, r: 30 },
                paper_bgcolor: "transparent",
                font: { color: "#fff" },
              }}
              config={{ displayModeBar: false }}
              style={{ width: "100%" }}
            />
            <div className="text-center text-sm text-gray-400 -mt-2">
              {biasLabel(school.biasScore)}
            </div>
          </div>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard
          label="Tweets Analyzed"
          value={school.tweetCount?.toLocaleString() ?? "—"}
        />
        <MetricCard
          label="FEC Dem%"
          value={
            school.fecDemPct != null ? `${school.fecDemPct.toFixed(0)}%` : "—"
          }
          color="#67a9cf"
        />
        <MetricCard
          label="FEC Total $"
          value={
            school.fecTotal != null
              ? `$${school.fecTotal.toLocaleString()}`
              : "—"
          }
        />
        <MetricCard
          label="FIRE Rank"
          value={school.fireRank != null ? `#${school.fireRank}` : "—"}
          color="#f59e0b"
        />
        <MetricCard
          label="FIRE Grade"
          value={school.fireGrade ?? "—"}
        />
        <MetricCard
          label="DEI Staff"
          value={school.deiStaff != null ? String(school.deiStaff) : "—"}
        />
      </div>

      {/* Phase trend */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Bias Trend Across Phases</h2>
        <Plot
          data={[
            {
              x: phases.map((p) => p.label),
              y: phases.map((p) => p.value),
              mode: "lines+markers+text",
              text: phases.map((p) =>
                p.value != null ? p.value.toFixed(1) : ""
              ),
              textposition: "top center",
              line: { color: biasColor(school.biasScore), width: 3 },
              marker: { size: 12 },
              name: school.name,
              textfont: { color: "#fff" },
            },
            {
              x: phases.map((p) => p.label),
              y: avgPhases,
              mode: "lines+markers",
              line: { color: "#666", width: 2, dash: "dash" },
              marker: { size: 8 },
              name: "All Schools Avg",
            },
          ]}
          layout={{
            height: 350,
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

      {/* Comparison table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4">How This School Compares</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left py-2">Metric</th>
              <th className="text-right py-2">{school.name}</th>
              <th className="text-right py-2">Average</th>
              <th className="text-right py-2">vs Avg</th>
            </tr>
          </thead>
          <tbody>
            {([
              ["Twitter Bias", "biasScore", 1],
              ["FEC Dem%", "fecDemPct", 0],
              ["FIRE Rank", "fireRank", 0],
              ["DEI Staff", "deiStaff", 0],
              ["Tweet Volume", "tweetCount", 0],
            ] as [string, keyof School, number][]).map(
              ([label, field, dec]) => {
                const val = school[field] as number | undefined;
                const av = allAvg(field);
                if (val == null || av == null) return null;
                const diff = val - av;
                return (
                  <tr
                    key={field}
                    className="border-t border-gray-800"
                  >
                    <td className="py-2 text-gray-300">{label}</td>
                    <td className="py-2 text-right font-mono">
                      {val.toFixed(dec)}
                    </td>
                    <td className="py-2 text-right font-mono text-gray-500">
                      {av.toFixed(dec)}
                    </td>
                    <td
                      className={`py-2 text-right font-mono ${
                        diff > 0 ? "text-red-400" : "text-blue-400"
                      }`}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff.toFixed(dec)}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
