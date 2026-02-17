"use client";

import { useState } from "react";
import Image from "next/image";

const CHART_INFO: Record<
  string,
  { title: string; description: string }
> = {
  // Core
  "bias_matrix_2x2.png": { title: "The 2x2 Bias Matrix", description: "Schools plotted by tweet bias vs. FEC donation lean." },
  "bias_timeline.png": { title: "Bias Over Time", description: "Average Twitter bias scores by year showing three distinct phases." },
  "donation_pie_grid.png": { title: "FEC Donation Breakdown", description: "Employee political donations at each school." },
  "bias_map.png": { title: "Geographic Bias Map", description: "US map with schools colored by bias, states shaded by average." },
  "fec_twitter_correlation.png": { title: "FEC vs Twitter Correlation", description: "Relationship between donations and Twitter messaging." },
  "fec_twitter_ranking.png": { title: "Combined Bias Rankings", description: "Schools ranked by combined Twitter + FEC bias." },
  "confidence_check.png": { title: "Assessment Confidence", description: "Distribution of AI assessment confidence scores." },
  "regional_bias_portrait.png": { title: "Regional Bias Portrait", description: "Bias patterns by US region." },
  "fire_by_quadrant.png": { title: "FIRE by Quadrant", description: "Free speech rankings mapped to bias quadrants." },
  "keyword_quadrant_heatmap.png": { title: "Keyword by Quadrant", description: "Which keywords dominate each bias quadrant." },
  "advocacy_by_quadrant.png": { title: "Advocacy by Quadrant", description: "How actively each quadrant promotes viewpoints." },
  // Cultural
  "phase_maps_triptych.png": { title: "Geographic Evolution (3 Phases)", description: "State-level bias across three eras." },
  "phase_distributions.png": { title: "Score Distributions by Phase", description: "How bias score distributions changed." },
  "biggest_movers.png": { title: "Biggest Movers", description: "Schools with the largest bias shifts." },
  "elite_heatmap.png": { title: "Elite School Heatmap", description: "Multi-measure bias for top 15 schools." },
  "keyword_timeline.png": { title: "Keyword Timeline", description: "Keyword frequency over time." },
  "keyword_phase_shift.png": { title: "Keyword Phase Shift", description: "Liberal vs conservative keyword trends." },
  "normalization_matrix.png": { title: "Normalization Matrix", description: "Stages of progressive term adoption for top 30 schools." },
  "normalization_by_tier.png": { title: "Normalization by Tier", description: "Elite schools reach higher normalization stages faster." },
  "normalization_timeline.png": { title: "Normalization Timeline", description: "How normalization has advanced over time." },
  "luxury_first_adoption.png": { title: "Adoption Intensity by Tier", description: "Cumulative progressive tweets — elite schools produce 2-3x more." },
  "luxury_adoption_curves.png": { title: "Adoption Cascades", description: "How progressive keyword adoption spreads by tier." },
  "luxury_index_scatter.png": { title: "Luxury Belief Index", description: "Progressive signaling intensity vs. school rank." },
  "silence_heatmap.png": { title: "The Silence Gap", description: "What keywords do schools systematically avoid?" },
  "silence_vs_bias.png": { title: "Silence Correlates With Bias", description: "Schools avoiding conservative keywords are more liberal." },
  "fire_crossref.png": { title: "FIRE Cross-Reference", description: "Our scores vs. FIRE free speech rankings." },
  "progressive_reframing.png": { title: "Progressive Reframing", description: "How progressive language evolves and replaces older terms." },
  "tradition_breakdown.png": { title: "Tradition: A Case Study", description: "How 'tradition' is used differently across schools." },
  // Hypothesis
  "dei_01_staff_vs_twitter.png": { title: "DEI Staff vs Twitter Bias", description: "More DEI staff → more liberal Twitter?" },
  "dei_02_staff_by_quadrant.png": { title: "DEI by Quadrant", description: "DEI staffing across bias quadrants." },
  "news_01_twitter_vs_newspaper.png": { title: "Twitter vs Newspaper", description: "Do student papers mirror university Twitter?" },
  "news_02_scatter_twitter_newspaper.png": { title: "Twitter-Newspaper Scatter", description: "Institutional vs student media bias." },
  "spk_01_mix_vs_twitter.png": { title: "Speakers vs Twitter", description: "Speaker political lean vs Twitter messaging." },
  "spk_04_lean_by_decade.png": { title: "Speaker Lean by Decade", description: "How speaker politics have shifted over decades." },
};

const CATEGORIES = [
  { key: "core", label: "Core Analysis", color: "#2166ac" },
  { key: "cultural", label: "Cultural Shifts", color: "#21ac66" },
  { key: "hypothesis", label: "Hypothesis Testing", color: "#ac6621" },
];

export default function GalleryPage() {
  const [category, setCategory] = useState("core");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [chartList, setChartList] = useState<Record<string, string[]>>({});

  // Load chart catalog
  if (Object.keys(chartList).length === 0) {
    fetch("/data/charts.json")
      .then((r) => r.json())
      .then(setChartList);
  }

  const charts = chartList[category] ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Charts Gallery</h1>
      <p className="text-gray-400 mb-6">
        All analysis charts organized by category. Click to expand.
      </p>

      {/* Category tabs */}
      <div className="flex gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setCategory(cat.key); setExpanded(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === cat.key
                ? "text-white"
                : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
            }`}
            style={
              category === cat.key
                ? { backgroundColor: cat.color }
                : undefined
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Chart grid */}
      <div className="space-y-3">
        {charts.map((filename) => {
          const info = CHART_INFO[filename];
          const isOpen = expanded === filename;
          return (
            <div
              key={filename}
              className="border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : filename)}
                className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-gray-900 transition-colors"
              >
                <div>
                  <span className="font-medium">
                    {info?.title ?? filename.replace(/\.png$/, "").replace(/_/g, " ")}
                  </span>
                  {info?.description && (
                    <span className="text-gray-500 text-sm ml-3">
                      {info.description}
                    </span>
                  )}
                </div>
                <span className="text-gray-500 text-lg">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 bg-gray-900/50">
                  <img
                    src={`/charts/${category}/${filename}`}
                    alt={info?.title ?? filename}
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
