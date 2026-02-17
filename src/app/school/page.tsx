"use client";

import { useEffect, useState } from "react";
import type { School } from "@/lib/types";
import { biasColor, TIER_COLORS } from "@/lib/types";

export default function SchoolIndexPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/data/schools.json")
      .then((r) => r.json())
      .then(setSchools);
  }, []);

  const filtered = schools
    .filter(
      (s) =>
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.handle.toLowerCase().includes(search.toLowerCase()) ||
        s.state.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.rank - b.rank);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">School Profiles</h1>
      <p className="text-gray-400 mb-6">
        Select a school to view its full bias profile, metrics, and trend data.
      </p>

      <input
        type="text"
        placeholder="Search by name, handle, or state..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm w-full max-w-md mb-8 focus:outline-none focus:border-blue-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((s) => (
          <a
            key={s.handle}
            href={`/school/${s.handle}`}
            className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-gray-500">
                #{s.rankDisplay}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: (TIER_COLORS[s.tier] || "#666") + "33",
                  color: TIER_COLORS[s.tier] || "#666",
                }}
              >
                {s.tier}
              </span>
            </div>
            <div className="font-semibold text-white">{s.name}</div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-gray-500">{s.state || ""}</span>
              {s.biasScore != null && (
                <span
                  className="font-mono"
                  style={{ color: biasColor(s.biasScore) }}
                >
                  {s.biasScore.toFixed(1)}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
