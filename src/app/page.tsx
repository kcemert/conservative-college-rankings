import Link from "next/link";
import Image from "next/image";

const SECTIONS = [
  {
    href: "/rankings",
    title: "Rankings",
    description: "155 universities ranked by Twitter bias, FEC donations, FIRE scores, and more. Sort, filter, and explore.",
    image: "/charts/core/bias_matrix_2x2.png",
  },
  {
    href: "/rank",
    title: "Rank Your Way",
    description: "Blend US News 2026 rank with our data. Adjust how much conservative values matter and see your personalized list.",
    image: "/home-cards/rank-your-way.png",
  },
  {
    href: "/school",
    title: "School Profile",
    description: "Deep dive on any school: bias gauge, FEC, FIRE, DEI, phase trends, and sample tweets.",
    image: "/home-cards/school-profile.png",
  },
  {
    href: "/gallery",
    title: "Charts",
    description: "Browse all 50+ analysis charts: core findings, cultural shifts, and hypothesis tests.",
    image: "/charts/cultural/keyword_timeline.png",
  },
  {
    href: "/compare",
    title: "Compare",
    description: "Side-by-side comparison of 2–4 schools with radar charts and metric breakdowns.",
    image: "/home-cards/compare.png",
  },
  {
    href: "/explore",
    title: "Explore",
    description: "Interactive scatter plots and the 2×2 bias matrix. Hover, zoom, discover patterns.",
    image: "/home-cards/explore.png",
  },
  {
    href: "/methodology",
    title: "Methodology",
    description: "How we collect and score data: Twitter, FEC, FIRE, DEI, and our scoring framework.",
    image: null,
    icon: "📋",
  },
  {
    href: "/about",
    title: "About Us",
    description: "Our mission, why this matters, and how we measure institutional bias.",
    image: null,
    icon: "🎯",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="text-red-500">Conservative</span>{" "}
          <span className="text-gray-300">College Rankings</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Data-driven analysis of political bias across 155 top US universities.
          Explore rankings, adjust by your values, and compare schools.
        </p>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group block bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-all hover:shadow-lg"
          >
            <div className="aspect-[4/3] relative bg-gray-800 overflow-hidden">
              {section.image ? (
                <Image
                  src={section.image}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-gray-800 to-gray-900">
                  {section.icon}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-lg font-semibold text-white">
                  {section.title}
                </h2>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-400 line-clamp-3">
                {section.description}
              </p>
              <span className="inline-block mt-2 text-sm text-red-400 font-medium group-hover:text-red-300">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-red-500">155</div>
          <div className="text-sm text-gray-500">Universities</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-gray-300">42K+</div>
          <div className="text-sm text-gray-500">Tweets Analyzed</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-gray-300">6</div>
          <div className="text-sm text-gray-500">Data Sources</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-gray-300">2026</div>
          <div className="text-sm text-gray-500">US News Edition</div>
        </div>
      </div>
    </div>
  );
}
