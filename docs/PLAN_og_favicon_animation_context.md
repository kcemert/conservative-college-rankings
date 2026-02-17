# Plan: OG Images, Favicon, Framer Motion, and Agent Context

Your friend’s suggestions break down into four areas. Here’s what each means and how to implement it in this Next.js app.

---

## 1. Open Graph images

**What they are:** The image and title/description shown when a link is shared on Twitter, Facebook, LinkedIn, Slack, etc. Right now we set `openGraph.title` and `description` in `layout.tsx`, but we don’t set an image, so platforms either show nothing or a generic fallback.

**What to do:**
- **Option A (simple):** Add a static OG image (e.g. `public/og.png` or `app/opengraph-image.png`) — 1200×630px, with logo + tagline. Then in metadata: `openGraph: { images: ['/og.png'] }`.
- **Option B (fancy):** Use Next.js **dynamic OG images** via `ImageResponse` in a route like `app/opengraph-image.tsx`. You can render a small React “card” (title, tagline, maybe a chart or logo) and Next will turn it into a PNG at request time. Good for a single canonical share image.

**Recommendation:** Start with Option A (one static `og.png`) for the homepage/share. Add dynamic per-page OG images later if you want different previews per route.

**Steps:**
1. Create or export a 1200×630 image (design tool or Next.js `ImageResponse` in a one-off script).
2. Save as `src/app/opengraph-image.png` (Next.js 13+ convention) or `public/og.png`.
3. In `layout.tsx`, set `openGraph.images = [{ url: '/og.png', width: 1200, height: 630 }]` (or use the `opengraph-image.png` convention so Next auto-picks it).
4. Add `twitter.images = ['/og.png']` if you want Twitter to use it explicitly.

---

## 2. Favicon

**What it is:** The small icon in the browser tab (and sometimes in bookmarks). We already have a default `app/favicon.ico` from the Next.js scaffold.

**What to do:**
- **Replace** `src/app/favicon.ico` with a custom one that matches the site (e.g. “CCR” or a minimal logo mark).
- Next.js also supports `app/icon.png` (or `.ico`) and `app/apple-icon.png` for Apple devices; we can add those for better coverage.

**Steps:**
1. Create 32×32 (or 48×48) favicon and optional 180×180 Apple touch icon.
2. Replace `src/app/favicon.ico` and optionally add `src/app/icon.png` and `src/app/apple-icon.png`.
3. No code changes needed if filenames stay as above; Next.js serves them automatically.

---

## 3. Framer Motion and layout shift

**What “animate things that currently cause layout shift” means:** When data loads asynchronously (e.g. `schools.json`), the table and timeline appear after a delay and the page “jumps.” That’s layout shift. Framer Motion can’t remove the shift entirely, but it can:
- **Reserve space** (e.g. skeleton or min-height) so layout is stable, and/or
- **Animate the appearance** (fade-in, slide-up) so the change feels intentional instead of jarring.

**What to do:**
- Install: `npm install framer-motion`
- Use `motion` components and `initial` / `animate` / `exit` (and optionally `layout`) so that:
  - The rankings table (and timeline) render in a placeholder state (skeleton or spinner) with fixed/min height, then animate in when data is ready.
  - Optional: menu dropdown, cards on About, or other key UI can use subtle fade/slide for polish.

**Concrete targets in this app:**
- **Rankings page:** While `schools.length === 0`, show a skeleton table (same columns, gray bars) or a spinner in a fixed-height block; when `filtered`/`sorted` are ready, replace with `motion.div` + `animate={{ opacity: 1 }}` (and maybe `y: 0` from a small offset). That reduces perceived layout shift.
- **School profile:** Same idea for the profile content vs loading state.
- **Header dropdown:** Optional: animate open/close with `animate` + height/opacity.

**Steps:**
1. Add `framer-motion` and use `"use client"` where you use `motion`.
2. On the rankings page: add a loading/skeleton state with stable height; when data is ready, render the real table/timeline inside `motion.div` with `initial={{ opacity: 0 }}` and `animate={{ opacity: 1 }}`.
3. Optionally add similar treatment to Compare, Explore, and School Profile where data fetches cause visible jumps.

---

## 4. “Kinetic-context map” on your local machine

**What it might mean:** This isn’t a single well-known product name. It could mean:

- **Context for AI agents:** A local doc or “context map” (e.g. markdown, MCP server, or a small app) that describes your project so an AI assistant has up-to-date context when you work on it.
- **Something like Context.ai:** There are tools (e.g. docs.context.ai) that support “local deployment” and context for agents; “kinetic-context map” might be a product or workflow your friend uses to keep agent context fresh.
- **Literal “map” of the codebase:** A generated diagram or outline of routes, components, and data flow so an agent (or you) can navigate the project quickly.

**What to do (practical):**
- **Ask your friend** exactly what they use: product name, repo, or “context map” format. Then we can wire it in (e.g. a script that dumps route/component tree, or a small MCP server that serves `PLAN_*.md` and key files).
- **Without that:** We can still add a minimal “agent context” artifact in the repo, e.g.:
  - `docs/AGENT_CONTEXT.md`: short summary of stack (Next.js, Tailwind, Plotly), main routes, where data comes from (`/data/schools.json`), and where to change OG/favicon/motion. Update it when we add OG, favicon, and Framer Motion so any future agent (or you) has a single place to read.

---

## Suggested implementation order

| # | Task                         | Effort | Impact |
|---|------------------------------|--------|--------|
| 1 | OG image (static) + metadata | Small  | High (sharing) |
| 2 | Favicon (replace + optional apple) | Small  | Medium |
| 3 | Framer Motion: rankings loading + animate-in | Medium | Medium (UX) |
| 4 | Framer Motion: other pages / menu | Small  | Low–medium |
| 5 | Agent context doc (and optional kinetic-context once clarified) | Small  | For you/agents |

---

## File changes summary

- **OG:** `public/og.png` (or `app/opengraph-image.png`), `layout.tsx` (metadata).
- **Favicon:** Replace `app/favicon.ico`; optional `app/icon.png`, `app/apple-icon.png`.
- **Motion:** `package.json` (framer-motion), `app/page.tsx` (skeleton + motion wrapper), optionally `components/Header.tsx` and other pages.
- **Context:** `docs/AGENT_CONTEXT.md` (and later, whatever “kinetic-context map” turns out to be).

If you want to proceed, we can do (1) and (2) first, then (3) and (4), and add (5) and a note for kinetic-context once you have more detail from your friend.
