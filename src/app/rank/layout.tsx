import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rank Your Way",
  description:
    "Adjust how much conservative values matter. Blend US News 2026 rank with our bias, FEC, FIRE, and DEI data for a personalized ranking.",
};

export default function RankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
