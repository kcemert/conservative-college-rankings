"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Rankings" },
  { href: "/rank", label: "Rank Your Way" },
  { href: "/school", label: "School Profile" },
  { href: "/gallery", label: "Charts" },
  { href: "/compare", label: "Compare" },
  { href: "/explore", label: "Explore" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#1A1A2E] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Hamburger — visible on all sizes */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Logo */}
        <a href="/" className="text-xl font-bold tracking-tight">
          <span className="text-red-500">Conservative</span>{" "}
          <span className="text-gray-300">College Rankings</span>
        </a>

        {/* Spacer to keep logo centered */}
        <div className="w-9" />
      </div>

      {/* Dropdown — same on mobile and desktop */}
      {open && (
        <nav className="border-t border-gray-800 bg-[#1A1A2E]">
          <div className="max-w-7xl mx-auto">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 border-b border-gray-800/50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
