import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Conservative College Rankings",
    template: "%s | Conservative College Rankings",
  },
  description:
    "Data-driven analysis of political bias across 155 top US universities. Explore Twitter bias, FEC donations, FIRE free speech rankings, and more.",
  metadataBase: new URL("https://www.conservative-college-rankings.com"),
  openGraph: {
    title: "Conservative College Rankings",
    description:
      "Which universities are the most politically biased? Explore data from 42,000+ tweets, FEC donations, and FIRE free speech rankings across 155 schools.",
    siteName: "Conservative College Rankings",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conservative College Rankings",
    description:
      "Data-driven analysis of political bias across 155 top US universities.",
  },
};

const NAV_ITEMS = [
  { href: "/", label: "Rankings" },
  { href: "/school", label: "School Profile" },
  { href: "/gallery", label: "Charts" },
  { href: "/compare", label: "Compare" },
  { href: "/explore", label: "Explore" },
  { href: "/methodology", label: "Methodology" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-[#1A1A2E] border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">
            <span className="text-red-500">Conservative</span>{" "}
            <span className="text-gray-300">College Rankings</span>
            </a>
            <nav className="hidden md:flex gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
          Conservative College Rankings &middot; 155 Universities &middot;
          42K+ Tweets Analyzed &middot; 2026
        </footer>
      </body>
    </html>
  );
}
