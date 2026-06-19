# Ariya Compass · Merz Commercial Effectiveness

This file is the source of truth for Claude Code when working on `ariya-commercial-effectiveness`. Read it at the start of every session.

It pairs with **[design.md](design.md)**, the portable spec covering stack, architectural patterns, full design system, Decision Layer primitives, cross-cutting CSS, and the per-customer customization checklist. This CLAUDE.md holds only what is customer-specific. When the two disagree, this file wins for Merz-specific framing; design.md wins for engineering and visual system rules.

---

# Engineering preamble

Pinned so Claude Code does not re-infer it each session. Full detail in `design.md`.

## Stack

React 19 · Vite 6 · TypeScript 5.7 strict (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`). Tailwind CSS v4 via `@tailwindcss/vite`, tokens in `@theme` inside `index.css`, no `tailwind.config.js`. React Router v7. lucide-react. No state library. No UI kit. Components are hand-rolled with inline `CSSProperties`; a tiny set of CSS classes in `index.css` covers cross-cutting effects.

## Scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc -b --noEmit"
}
```

## Patterns that matter

- **Persisted state via Context plus `localStorage`.** One provider, one hook, one storage key per concern, all built on the shared `usePersistedState(key, initial)` hook. Reads on init, writes on every change. Keys are namespaced as `ariya.<feature>.<thing>` (e.g. `ariya.ce.scenario`, `ariya.ce.tour`, `ariya.ce.decisionLog`). Change the namespace prefix when forking for a new customer.
- **Modals and overlays go through `createPortal` to `document.body`.** Anything rendered inside the fixed sidebar or fixed header is trapped in that stacking context. Non-negotiable.
- **Z-index scale**: tour overlay 70 / 71 · content modals 200+ · system modals 2000+.
- **Reset demo affordance.** Clears all `localStorage` except `ariya.auth.session`, then `window.location.assign('/')`. Lives in the sidebar footer.
- **Single source of truth for numbers.** Everything in `src/data/scenario.ts`. Components never hardcode values. If a number is needed and not present, add it to `scenario.ts` first, then read it.
- **TypeScript hygiene.** `noUnusedLocals` is on; `tsc -b` runs as part of `npm run build`. Remove imports when you remove their callsite.
- **No `Date.now()` / `Math.random()` in render paths.** Display dates come from data; randomness is seeded.

## Folder layout

```
src/
  main.tsx              // createRoot + <BrowserRouter><App/>
  App.tsx               // <Routes>, providers, global chrome
  index.css             // tailwind import + @theme + cross-cutting classes + print
  pages/                // one file per route
  components/
    layout/             // Sidebar, Header, ScrollToTop
    decision/           // RecommendationCard, ConfidenceBadge, WhatThisSuggests
    demo/               // DemoOverlay (guided 8-step walkthrough)
    [misc shared]       // Pills, chips, donut, critical-path chain, etc.
  context/              // One file per Context, each persisted to localStorage
  data/                 // Typed seed data; scenario.ts is the canonical source
```

## Visual design system

The full system (color tokens, typography, layout, RAG, pills/buttons, motion, copy rules, composite patterns, Decision Layer primitives, cross-cutting CSS, print stylesheet) lives in **[design.md](design.md)**. Do not duplicate it here. The short version for grep:

- Palette: `NAVY #050A44` · `BLUE #0055BB` · `BLUE_BRIGHT #1A6BFF` · `LAVENDER #E8EAF6` · `CANVAS #F7F8FC` · `GREEN #16A34A` · `AMBER #F59E0B` · `RED #E11D48`. Ink scale `NAVY_70 / NAVY_55 / NAVY_12 / NAVY_06`.
- H1 canonical pattern: `className="text-gradient text-[28px] font-bold leading-tight mb-2"` with `NAVY_55` subtitle.
- Status labels are stored AND rendered in Title Case ("At Risk", "On Track"). Never ALL CAPS on status pills.
- **Em-dashes (—) are banned.** Use colon, comma, period, or middle dot `·`.
- Editorial vs Data tone split. Never mix in one block.
- Decision Layer primitives live in `src/components/decision/` and must be reused, not re-invented.

---

# What we are building

An illustrative prototype of Ariya Compass for Europe Commercial Effectiveness, prepared for a follow-up conversation with Dan Staner at Merz. The prototype must show Ariya Compass as a **commercial effectiveness decision layer** for Europe leadership. It must not look like another dashboard, CRM reporting interface, training tracker, or generic AI assistant.

The active demo scenario is **Xeomin HCP injection training investment and reallocation between Italy and Germany**. HCP training lives inside Investment Radar. It is never a top-level menu item.

The two screens Dan must remember are **Scenario Planner** and **Ask Ariya**. Quality bar on those two is higher than anywhere else.

## The non-negotiables

1. Decision-led screens, not metric-led. Every screen has a "so what." A bare chart with no interpretive layer is a failure.
2. The Italy and Germany Xeomin reallocation is the live demo story. Every screen reinforces it. Other markets and brands exist so the cockpit feels real.
3. Confidence and assumptions are first-class UI, not footnotes.
4. Proxy KPIs only. We never claim "promotional responsiveness," "training ROI," or "physician ROI."
5. All numbers come from `src/data/scenario.ts`. Components never hardcode values.

## Vocabulary filter (from the brief)

Never use these terms. Use the replacement on the right.

| Do not say | Say instead |
|---|---|
| Training ROI | HCP training investment effectiveness |
| Physician ROI | Commercial impact signals from trained HCP groups |
| Promotional responsiveness | Proxy KPIs: call frequency, follow-up, target coverage, account development |
| Automated causality | Directional association under explicit assumptions |
| Guaranteed financial impact | Scenario comparison with confidence range and caveats |
| Full CRM integration required | Start with selected extracts from available sources |
| Full Europe rollout | Focused pilot with selected markets, source sets, and users |

---

# Data

All screens read from `src/data/scenario.ts`. The file exports typed objects for:

- `markets`: 8 European markets with performance, investment intensity, growth vs plan
- `brands`: Xeomin, Belotero, Ultherapy with per-market sales and growth
- `investmentRadar`: matrix of investment category × market with spend and proxy KPI signal
- `hcpSegments`: HCP segments per market with potential tier, count, trained %, followed up within 60 days %
- `executionSignals`: 6 proxy-based execution signals
- `scenarioPlanner`: the Italy / Germany reallocation scenario with conservative / base / best outcomes, assumptions, and recommendation
- `askAriya`: 6 scripted question-and-response pairs
- `decisionLog`: 4 existing decision entries (with status, owner, follow-up trigger, review date)
- `sourceConfidence`: 6 data sources with owner, last refresh, completeness, known gaps

Do not introduce parallel numbers anywhere. If a number is needed and not in `scenario.ts`, add it to `scenario.ts` first, then read it.

---

# Routing

The 9 screens, in this exact order, in the left nav:

1. Europe Overview
2. Market Performance
3. Investment Radar
4. Execution Signals
5. Customer and Account Focus
6. Scenario Planner
7. Ask Ariya
8. Decision Log
9. Source Confidence

Icons (lucide): Compass, TrendingUp, Target, Activity, Users, GitBranch, Sparkles, BookOpen, ShieldCheck.

Sidebar footer (below the nav): "Pilot proposal" link · "Reset demo" button · `Illustrative data · v0.1` version line.

Active route gets the white-pill active treatment from the existing sidebar pattern.

---

# Demo Mode

A toggle in the top header enables a guided 8-step overlay that walks through the brief's section 8.1 demo journey:

1. Europe Overview
2. Market Performance
3. Investment Radar (HCP training × Italy selected)
4. Execution Signals
5. Customer and Account Focus
6. Scenario Planner
7. Ask Ariya
8. Decision Log

Each step shows a one-sentence "What to look for here" hint. Next / Back navigate routes.
