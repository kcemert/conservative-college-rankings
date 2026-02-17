import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col">
        <Header />

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
