export default function AboutPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>

      <div className="space-y-10">
        {/* Mission */}
        <section className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Conservative College Rankings exists to give families, students, and
            policymakers an objective, data-driven picture of political bias at
            America&apos;s top universities. We believe that higher education
            should be a marketplace of ideas — not a one-sided echo chamber.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mt-4">
            By measuring what universities actually say and do — through their
            official social media, employee political donations, free speech
            climates, and institutional staffing — we aim to bring transparency
            to a system that has operated largely without accountability.
          </p>
        </section>

        {/* Why This Matters */}
        <section>
          <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">
            Why This Matters
          </h2>
          <div className="mt-4 space-y-4 text-gray-300 leading-relaxed">
            <p>
              Parents spend hundreds of thousands of dollars sending their
              children to college. Students invest four of their most formative
              years in these institutions. Yet there is remarkably little
              transparency about the political environment they&apos;re walking
              into.
            </p>
            <p>
              Studies consistently show that faculty political donations skew
              overwhelmingly toward one party. Our research extends this
              analysis beyond faculty to the institutional level — examining how
              universities themselves communicate, what topics they prioritize,
              what they systematically ignore, and how their messaging has
              shifted over time.
            </p>
            <p>
              We don&apos;t believe universities need to be conservative. We
              believe they need to be{" "}
              <span className="text-white font-semibold">
                honest, balanced, and open to the full spectrum of ideas
              </span>
              . Our data helps identify which schools live up to that standard
              and which fall short.
            </p>
          </div>
        </section>

        {/* What We Measure */}
        <section>
          <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">
            What We Measure
          </h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Institutional Messaging",
                desc: "We analyze 42,000+ tweets from official university accounts across 30 political keywords, scored by AI for political lean.",
                icon: "📱",
              },
              {
                title: "Employee Donations",
                desc: "FEC records reveal how university employees allocate their political contributions between parties.",
                icon: "💰",
              },
              {
                title: "Free Speech Climate",
                desc: "We cross-reference our findings with FIRE's independent free speech rankings for external validation.",
                icon: "🗣️",
              },
              {
                title: "The Silence Gap",
                desc: "We measure what schools don't say. Systematic avoidance of certain topics is itself a form of bias.",
                icon: "🤫",
              },
              {
                title: "Normalization Patterns",
                desc: "We track how progressive terminology moves from radical to mandatory in institutional communications.",
                icon: "📈",
              },
              {
                title: "Cultural Evolution",
                desc: "We map how bias has shifted across three phases: pre-2020, the George Floyd effect, and the Trump correction.",
                icon: "🔄",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-900 rounded-xl border border-gray-800 p-5"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Approach */}
        <section>
          <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">
            Our Approach
          </h2>
          <div className="mt-4 space-y-4 text-gray-300 leading-relaxed">
            <p>
              We are committed to methodological rigor and transparency. Every
              data source, scoring methodology, and limitation is documented on
              our{" "}
              <a
                href="/methodology"
                className="text-blue-400 hover:text-blue-300"
              >
                Methodology
              </a>{" "}
              page.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-gray-900 rounded-xl border border-gray-800">
                <div className="text-3xl font-bold text-red-500">155</div>
                <div className="text-sm text-gray-400 mt-1">
                  Universities Analyzed
                </div>
              </div>
              <div className="text-center p-4 bg-gray-900 rounded-xl border border-gray-800">
                <div className="text-3xl font-bold text-red-500">42,000+</div>
                <div className="text-sm text-gray-400 mt-1">
                  Tweets Assessed
                </div>
              </div>
              <div className="text-center p-4 bg-gray-900 rounded-xl border border-gray-800">
                <div className="text-3xl font-bold text-red-500">6</div>
                <div className="text-sm text-gray-400 mt-1">
                  Independent Data Sources
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-200 mb-3">Get In Touch</h2>
          <p className="text-gray-400">
            Questions, feedback, or media inquiries? We&apos;d love to hear from
            you.
          </p>
          <p className="text-gray-400 mt-2">
            Email us at{" "}
            <a
              href="mailto:info@conservative-college-rankings.com"
              className="text-blue-400 hover:text-blue-300"
            >
              info@conservative-college-rankings.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
