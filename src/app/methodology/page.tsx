export default function MethodologyPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Methodology</h1>

      <div className="prose prose-invert prose-sm max-w-none space-y-8">
        {/* Data Sources */}
        <section>
          <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">
            Data Sources
          </h2>
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400">
                Twitter / X Data
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                <li>Official university Twitter accounts for 155 US universities</li>
                <li>Period: 2012–2026 (tweets matching 30 political keywords)</li>
                <li>Collection: Automated scraping via Nitter proxy instances</li>
                <li>
                  15 liberal keywords (diversity, equity, inclusion, social
                  justice, sustainability, etc.) and 15 conservative keywords
                  (veterans, military, faith, constitution, free speech, etc.)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400">
                AI Bias Assessment
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                <li>Model: Google Gemini 2.5 Flash</li>
                <li>
                  Framework: Custom scoring rubric rating each tweet from -100
                  (strong liberal advocacy) through 0 (neutral) to +100 (strong
                  conservative advocacy)
                </li>
                <li>Coverage: ~42,000 tweets assessed with confidence scores</li>
                <li>
                  Validation: High-confidence subset (&gt;0.7) shows consistent
                  patterns
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400">
                FEC Donation Data
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                <li>
                  Source: Federal Election Commission individual contributions
                  (2020–2024 cycles)
                </li>
                <li>
                  Method: Employer name fuzzy-matching against university name
                  variants
                </li>
                <li>
                  Metric: Dem% = Democratic / (Democratic + Republican)
                  contributions
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400">
                FIRE Free Speech Rankings
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                <li>
                  Source: Foundation for Individual Rights and Expression (2026)
                </li>
                <li>Coverage: 138 of 155 schools matched</li>
                <li>
                  Correlation: r=0.33 (p&lt;0.0001) with our Twitter bias scores
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400">
                Additional Sources
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                <li>DEI staffing: Web scraping of university DEI office pages</li>
                <li>
                  Student newspapers: Keyword-based analysis of editorial content
                </li>
                <li>
                  Commencement speakers: Wikipedia historical speaker lists with
                  heuristic political classification
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Scoring */}
        <section>
          <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">
            Scoring Methodology
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-400">
                Twitter Bias Score (-100 to +100)
              </h3>
              <div className="mt-3 grid grid-cols-5 gap-2 text-center text-xs">
                {[
                  { range: "-100 to -40", label: "Strong Liberal", color: "#2166ac" },
                  { range: "-40 to -15", label: "Liberal", color: "#67a9cf" },
                  { range: "-15 to +15", label: "Moderate", color: "#999" },
                  { range: "+15 to +40", label: "Conservative", color: "#ef8a62" },
                  { range: "+40 to +100", label: "Strong Conservative", color: "#b2182b" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: s.color + "33", color: s.color }}
                  >
                    <div className="font-bold">{s.range}</div>
                    <div className="mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400">
                Normalization Scale (0–4)
              </h3>
              <div className="mt-3 grid grid-cols-5 gap-2 text-center text-xs">
                {[
                  { stage: "0", label: "Absent", desc: "Never appears" },
                  { stage: "1", label: "Exploring", desc: "Occasional, informational" },
                  { stage: "2", label: "Accepting", desc: "Regular, positive framing" },
                  { stage: "3", label: "Normative", desc: "Deeply integrated" },
                  { stage: "4", label: "Mandatory", desc: "Institutional requirement" },
                ].map((s) => (
                  <div
                    key={s.stage}
                    className="p-3 rounded-lg bg-gray-800 text-gray-300"
                  >
                    <div className="font-bold text-lg">{s.stage}</div>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-gray-500 mt-1">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section>
          <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">
            Limitations
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-3 mt-4">
            <li>
              <strong>Twitter ≠ Reality:</strong> University Twitter reflects
              messaging strategy, not the views of all faculty, students, or
              administrators.
            </li>
            <li>
              <strong>AI Scoring:</strong> While consistent, AI assessments may
              have systematic biases. Results are relative comparisons, not
              absolute truths.
            </li>
            <li>
              <strong>FEC Data:</strong> Only captures politically active
              employees who self-report their employer.
            </li>
            <li>
              <strong>Temporal Coverage:</strong> Tweet collection density varies
              by school and time period.
            </li>
            <li>
              <strong>Keyword Approach:</strong> Predefined keywords may miss
              relevant content or capture false positives.
            </li>
          </ol>
        </section>

        {/* Freshness */}
        <section>
          <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">
            Data Freshness
          </h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Twitter Data", date: "Feb 2026" },
              { label: "FEC Data", date: "2020–2024" },
              { label: "FIRE Rankings", date: "2026 ed." },
              { label: "US News Rankings", date: "2026 ed." },
            ].map((d) => (
              <div
                key={d.label}
                className="p-3 bg-gray-900 rounded-lg border border-gray-800 text-center"
              >
                <div className="text-sm text-gray-400">{d.label}</div>
                <div className="font-bold text-gray-200 mt-1">{d.date}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
