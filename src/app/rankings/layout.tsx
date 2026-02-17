import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rankings",
  description:
    "155 US universities ranked by Twitter bias, FEC donations, FIRE free speech scores, and more.",
};

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
