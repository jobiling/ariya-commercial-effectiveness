# Ariya Compass · Merz Commercial Effectiveness

This file is the source of truth for Claude Code when working on `aria-commercial-effectiveness`. Read it at the start of every session.

## What we are building

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

# Visual design guidelines

## Color tokens

Defined once in `index.css @theme`; mirrored as per-file constants in TSX (the codebase uses inline styles, not Tailwind utility classes for colors).

```ts
const NAVY        = '#050A44';   // primary text, headings
const BLUE        = '#0055BB';   // links, primary actions
const BLUE_BRIGHT = '#1A6BFF';   // start of the title gradient
const LAVENDER    = '#E8EAF6';   // active nav pill, lavender chips
const CANVAS      = '#F7F8FC';   // hover backgrounds, chip surfaces
const GREEN       = '#16A34A';   // on-track / verified
const AMBER       = '#F59E0B';   // at-risk / watch
const RED         = '#E11D48';   // urgent / critical

// Ink scale on navy (only these four are widely used)
const NAVY_70 = 'rgba(5,10,68,0.70)';  // secondary text
const NAVY_55 = 'rgba(5,10,68,0.55)';  // muted text, eyebrows
const NAVY_12 = 'rgba(5,10,68,0.12)';  // borders
const NAVY_06 = 'rgba(5,10,68,0.06)';  // subtle dividers, chip bg
```

The title gradient is a single CSS class:

```css
.text-gradient {
  background: linear-gradient(135deg, #1A6BFF 0%, #050A44 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Typography

Font: Inter, system-ui, sans-serif (set in `--font-sans` and on the body). No second font.

- Page title (H1), canonical pattern for every inner screen:
  ```tsx
  className="text-gradient text-[28px] font-bold leading-tight mb-2"
  ```
  Followed by a subtitle: `className="text-sm"` with color `NAVY_55`.
- Eyebrow / section label replaces a separate H2: 11px / 800 / letter-spacing 0.6 to 0.8 / uppercase / color `NAVY_55`. BLUE-colored eyebrows exist only on specific accent moments (Weekly Brief kicker); default to `NAVY_55`.
- Card title: 14 to 16px / 600 to 700. 16px on dashboard tiles, 14px in list rows.
- Body: 13 to 14px / line-height 1.5 / color `NAVY_70`.
- Metrics (donut values, big stat numbers): 18 to 28px / 700 to 800, centered or top-aligned depending on context.
- Long numerical tables: tabular-nums preferred but not yet enforced project-wide. Apply on new metric clusters.

## Layout

- App shell: 240px dark navy gradient sidebar (`position: fixed`, full height) plus main content area on white background, max-width ~1280, generous padding (32 to 40px).
- Cards: white background, 12 to 14px border-radius, 1px border `NAVY_12`, soft shadow `0 1px 2px rgba(5,10,68,0.04)`. Hover: `translateY(-1px)` plus slightly elevated shadow via the `.hover-lift` utility.
- Prominent / elevated cards (Germany priority market, Italy follow-up gap): step up to a 6px left accent stripe plus heavier shadow `0 6px 18px rgba(5,10,68,0.10), 0 1px 2px rgba(5,10,68,0.04)` and border in the status color rather than `NAVY_12`.
- Section spacing: 24 to 32px between blocks (`space-y-7`, `space-y-8`, `gap: 24`). Do not be stingy. Whitespace is the design.
- Grids: prefer explicit `'1fr 1fr'` over auto-fit when you want exactly two columns. Use CSS multi-column (`columns: 340px; column-gap: 12; break-inside: avoid`) for masonry-style lists where one outlier card is much taller than its siblings.

## Status / RAG treatment

Labels are stored AND rendered in Title Case: "At Risk", "Watch", "On Track", "Decision Taken", "Pending", "Verified". Never ALL CAPS on status pills. No `textTransform: uppercase` on status.

- On Track / Verified: green dot/border, `#16A34A`.
- At Risk / Watch: amber, `#F59E0B`.
- Urgent / Critical: red, `#E11D48`. Apply a 4px left accent stripe (6px on the prominent treatment), a tinted background (`#FEF2F2`), and a thin status-color outer border. This is the "news callout" pattern.
- Decision Taken / Monitoring: quieter green confirmation banner inside the card. The status pill flips from At Risk to Decision Taken.

## Pills, tags, buttons

- Status pill: status-color tinted bg (`#FEE2E2`, `#FEF3C7`, `#D1FAE5`), matching deep text (`#7F1D1D`, `#92400E`, `#065F46`), 11px / 700, 3px x 9px padding, border-radius 999. Title Case label.
- Neutral chip: `NAVY_06` bg, `NAVY_70` text, 11 to 12px / 600 to 700.
- "On critical path" tag: `#EEF2FF` bg, `#3730A3` text, small indigo dot prefix. Distinct from status tones.
- Primary button: BLUE background, white text, 10px radius, 8 to 14px padding, 13px / 600. Bright-blue hover (`#0047a3`).
- Quiet link button: transparent, BLUE text, 12 to 13px / 600 to 700, no underline. The chevron `→` carries the affordance. Used far more than primary buttons. Most UI is read-mostly.
- Outline / secondary button: white bg, `NAVY_12` border, navy text, 10px radius. Used as the second action next to a primary ("View signal" alongside "Open Decision Brief").
- Toggle pill ("Hide ‹" / "Show ›"): `#F7F8FC` bg, `NAVY_12` border, `NAVY_70` text, 11px / 600, fully rounded. Used to collapse side panels.

## Motion

- Standard transitions: 120 to 150ms ease for color and background. 240ms ease-out for fade-ins on response/answer blocks.
- Hover-lift on cards: `translateY(-1px)` plus shadow step. No bouncing, no spring, no large translations.
- A 2.2s ease-in-out ambient pulse, `ariya-ambient-pulse`, for the "needs attention" affordance only (e.g. Germany market card, Italy follow-up gap).
- A 1.6s ease-out infinite radiating pulse, `ariya-pulse-dot` / `.pulse-dot`, for small status dots in news callouts.

## Tone split

The product has two surfaces with different voices. Never mix tones in one block.

- **Editorial surfaces** (Weekly Brief, Ask Ariya responses, Decision Briefs, Decision Log entries): full sentences, plain English, 17 to 19px headline weights, "what this means" framing. Treat like a memo from a smart analyst.
- **Data surfaces** (Brand Health priority markets, Workstreams cards and critical path, Signals Feed, RAG heatmap, Investment Radar matrix, HCP segment tables): tabular numbers, pills, terse labels, dense layouts.

## Copy rules

- Page-name nouns are Title Case: Europe Overview, Market Performance, Investment Radar, Execution Signals, Customer and Account Focus, Scenario Planner, Ask Ariya, Decision Log, Source Confidence, Decision Brief. These are named UI artefacts.
- Verb-form descriptions stay sentence case: "Decision logged", "Logged via Ask Ariya", "Action needed".
- Section labels are noun phrases, not sentences ("Decisions awaiting input", not "Here are the decisions awaiting input").
- Action labels are verbs ("Open Decision Brief →", not "Decision Brief").
- Status terms always Title Case.
- **Em-dashes (—) are banned.** Use colon, comma, period, or the middle dot `·` as separators. The middle dot is used liberally. The em-dash is not used at all.
- "Generic Filer A" is the only label for the generic competitor in UI. "Generic manufacturer" can appear only in narrative prose paragraphs.
- "SPC" abbreviation is fine once "supplementary protection certificate (SPC)" has been spelt out on first use per page. Never "patent shield" or "patent protection".
- Dates: "Mon DD, YYYY" in headlines ("Apr 28, 2026"), "Mon DD" in compact contexts ("Apr 28"), "YYYY-MM-DD" only in source citations.

## Composite patterns

These are reusable shapes that appear on multiple screens. Reuse, do not reinvent.

- **News callout**: white card plus status-color 4px left stripe, small-caps eyebrow ("This Week's Headline", "Italy Follow-Up Gap"), 17px bold headline, optional metadata row, right-aligned CTA. Tone (red / green) flips with scenario state.
- **Hero block (01 / 02 / 03)**: light grey container, three child rows. Item 01 dominant: red accent stripe, red-tinted bg, 19px headline, evidence chips, two action buttons. Items 02 / 03 compact: small numeral, single-row tags, headline, context, chevron, whole row clickable.
- **Donut readout**: 76px diameter, 8px stroke, value in 18px navy bold centered. Used for Health Breakdown by track. Intentionally a different shape from priority-market progress bars. Reused on Customer and Account Focus for follow-up coverage by segment.
- **Critical-path chain**: light surface, four nodes in a row joined by lucide ChevronRight icons. Endpoint node distinguished by 2px colored border, floating "Endpoint" label, flag icon. Reused on Scenario Planner to show the operational chain ("HCP selection → Training → 60-day follow-up → Commercial impact").
- **Dependencies and blockers inline list**: direction-grouped headers ("↑ Inputs we need" / "↓ Waiting on this"), each dependency rendered as a white sub-card with status pill, optional "⚠ Blocker" badge when an upstream slips.
- **Side-rail collapse**: full panel collapses to a 40px-wide vertical rail with the section label rotated 180° via `writing-mode: vertical-rl` plus `transform: rotate(180deg)`. The whole rail is a button that expands the panel.

---

# The Decision Layer pattern (Merz screens)

Three new patterns extend the existing system for the Merz brief. Add these to `src/components/decision/` and reuse them across new screens.

## Recommendation Card

The visual anchor for screens that contain a "so what." Editorial tone. Anatomy:

1. **Eyebrow**: "Ariya recommends" (BLUE, the accent moment exception).
2. **Situation**: one-line summary of what the data shows.
3. **Recommendation**: 17 to 19px headline, the action in plain language.
4. **Reasoning**: one short paragraph (`NAVY_70`).
5. **Confidence**: ConfidenceBadge, Low / Medium / High, with one-line rationale tooltip. Confidence is rendered as a labeled pill, never green-by-default.
6. **Required conditions**: checklist with unchecked circles (these are conditions to verify, not items already done).
7. **Recommended next actions**: rows with action verb, owner, timeframe.
8. **Sources**: chip row of source tags.
9. **Footer actions**: "Log this decision →" (primary), "Open in Scenario Planner →" (quiet link) where applicable.

## What This Suggests callout

Lighter weight, for diagnostic screens. A teal-bordered single-line callout that connects diagnosis to a downstream decision: "What this suggests: [interpretation]. → [linked next screen]". Used on Execution Signals, Customer and Account Focus, Source Confidence. No diagnostic screen ends without one.

## Confidence band (Scenario Planner)

A Recharts area chart with a base line and a shaded best / conservative band. The band visibly widens when required conditions are unchecked. The chart subtitle always says "Directional. Not a forecast." The central assumption appears in the subtitle.

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

Active route gets the LAVENDER active-pill treatment from the existing sidebar pattern.

---

# Demo Mode

A toggle in the top bar enables a guided 8-step overlay that walks through the brief's section 8.1 demo journey:

1. Europe Overview
2. Market Performance
3. Investment Radar (HCP training × Italy selected)
4. Execution Signals
5. Customer and Account Focus
6. Scenario Planner
7. Ask Ariya
8. Decision Log

Each step shows a one-sentence "What to look for here" hint. Next / Back navigate routes.
