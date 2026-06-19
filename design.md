# Ariya prototype · design and engineering decisions

A portable record of every design and engineering choice made on this prototype, written so the same approach can be re-applied for a different customer with minimal re-thinking. Read top to bottom once; thereafter, use as reference.

The doc is split into three layers:

1. **Stack and architecture** · choices that should carry over verbatim.
2. **Product framing** · principles that shape the screens; re-applicable but the demo story and vocabulary will change per customer.
3. **Visual design system** · tokens, type scale, components, copy rules. Mostly portable; the palette and brand wordmark are the per-customer swap.

A **Customization checklist** at the bottom lists exactly what to change when starting a new customer prototype.

---

## 1 · Stack and architecture

### Stack

- **React 19** + **Vite 6** + **TypeScript 5.7**.
- TS config is strict: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. `tsc -b` runs as part of `npm run build`, so unused imports break the build, not just the lint.
- **Tailwind CSS v4** via `@tailwindcss/vite`. No `tailwind.config.js`. Theme tokens live inside `@theme { ... }` in `index.css`. The codebase uses Tailwind sparingly: layout utilities (`flex`, `grid`, spacing, `text-sm`) and one custom `.text-gradient` class. Colors are inline `CSSProperties`, not Tailwind utilities.
- **React Router v7** (`react-router-dom`) for routing. `<BrowserRouter>` wraps `<App/>` in `main.tsx`.
- **lucide-react** for all icons. One icon family, consistent stroke.
- **No state library**. Local React state plus one `Context` per concern. Each context persists to `localStorage`.
- **No UI kit**. Every component is hand-rolled. Styling is inline `CSSProperties` objects defined at the top of the file. A tiny set of cross-cutting CSS classes lives in `index.css` (cards, pills, gradient text, scrollbar, fade-in, print).

Why hand-rolled: the visual language is opinionated enough that a UI kit would fight us more than help. Inline styles keep components self-contained and grep-able.

### Package scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc -b --noEmit"
}
```

### Architectural patterns

- **Persisted state via Context plus `localStorage`.** Every context is one provider, one hook, one storage key. The shared `usePersistedState(key, initial)` hook reads on init and writes on every change via `useEffect`. Namespace keys as `ariya.<feature>.<thing>` (`ariya.ce.scenario`, `ariya.ce.tour`, `ariya.ce.decisionLog`).
- **Modals and overlays go through `createPortal` to `document.body`.** Any modal rendered inside a `position: fixed` ancestor (sidebar, header) will be trapped in that stacking context. Portaling is non-negotiable.
- **Z-index scale**, agreed once and never re-debated:
  - Tour overlay: 70 / 71
  - Content modals: 200+
  - System modals (reset confirmations, error banners): 2000+
- **Reset demo affordance.** A button in the sidebar wipes all `localStorage` keys except a small allow-list (`ariya.auth.session`), then `window.location.assign('/')` for a clean reload. Essential between demo runs.
- **Single source of truth for numbers.** All data lives in `src/data/scenario.ts` (or a small set of files in `src/data/`). Components never hardcode values. If a number is needed and not in the data file, add it there first.
- **Strict TypeScript hygiene.** Because `noUnusedLocals` is on, removing a callsite means removing the import too. Watch this when refactoring; it is a frequent source of broken builds.
- **No `Date.now()` in render paths if avoidable.** Display dates come from the data file, formatted with a tiny in-repo helper. Live timestamps only on legitimately live signals.

### Folder layout

```
src/
  main.tsx              // createRoot + <BrowserRouter><App/>
  App.tsx               // <Routes>, providers, global chrome
  index.css             // tailwind import + @theme + a few utility classes + print
  pages/                // one file per route
  components/
    layout/             // Sidebar, Header, ScrollToTop
    decision/           // Recommendation card, Confidence badge, What-this-suggests callout
    demo/               // Demo overlay (guided walkthrough)
    [misc shared]       // Pills, chips, donut, critical-path chain, etc.
  context/              // One file per Context, each persisted to localStorage
  data/                 // Typed seed data: markets, brands, signals, scenario, decisions, tour steps, sources
```

Two folders carry meaning beyond "components":

- `components/decision/` is the home for the **Decision Layer** primitives: Recommendation Card, Confidence Badge, What-this-suggests callout. These shapes appear on the most important screens and must be reused, not re-invented.
- `components/demo/` is the home for the **guided demo overlay**: a top-bar toggle starts an 8-step walkthrough that navigates routes and shows a one-sentence hint per step.

### Routing chrome

- 240px dark navy sidebar, `position: fixed`, full height, navigation pinned at top, "Pilot proposal" plus "Reset demo" plus version line pinned at bottom (`marginTop: auto` flex spacing).
- 64px top header on the right, `position: fixed`, holding only the Demo Mode toggle (and any future global controls). No market or scenario switcher at the top: scenario state belongs to the Scenario Planner screen.
- `ScrollToTop` component listens to route changes and scrolls the viewport to top. Without it, navigating between long pages keeps the previous scroll offset and feels broken.

---

## 2 · Product framing

These principles drive screen layout and copy. They are framework-agnostic, but they are what makes the prototype not look like another dashboard.

### The non-negotiables

1. **Decision-led, not metric-led.** Every screen has a "so what." A bare chart with no interpretive layer is a failure. Diagnostic screens end with a "What this suggests" callout that links to the relevant next screen.
2. **One anchor demo story.** Pick one concrete reallocation, launch, or trade-off and reinforce it on every screen. Other markets and brands exist so the cockpit feels real, but the demo always returns to the anchor. (For Merz it is Xeomin HCP injection training between Italy and Germany.)
3. **Confidence and assumptions are first-class UI.** They appear as labeled pills, never green-by-default. Required conditions appear as unchecked circles, not ticked boxes (these are conditions to verify, not items already done).
4. **Proxy KPIs only.** Never claim "training ROI," "physician ROI," "promotional responsiveness," or "automated causality." Use proxy language: "call frequency," "follow-up coverage," "directional association under explicit assumptions," "scenario comparison with confidence range and caveats."
5. **Single source of truth.** All numbers come from one typed data file. Components read; they do not invent.

### Two named screens carry extra weight

There are always two screens that the customer must remember. For Merz those are **Scenario Planner** and **Ask Ariya**. The visual and editorial quality bar on those two is higher than anywhere else. Budget proportional effort there.

### Vocabulary filter

Every customer brief comes with a few terms that are forbidden and a few that must replace them. Keep a small table at the top of `CLAUDE.md` mapping "Do not say / Say instead." This is more useful than any style guide.

### Tone split

The product has two surfaces with different voices. **Never mix tones in one block.**

- **Editorial surfaces** (Weekly Brief, Ask Ariya responses, Decision Briefs, Decision Log entries): full sentences, plain English, 17 to 19px headline weights, "what this means" framing. Write like a memo from a smart analyst.
- **Data surfaces** (Brand Health, Investment Radar matrix, Signals Feed, RAG heatmap, HCP segment tables): tabular numbers, pills, terse labels, dense layouts.

### Decision Layer primitives

Three reusable shapes carry the "decision-led" promise. Add them to `src/components/decision/` and reuse across screens.

- **Recommendation Card.** The visual anchor of decision screens. Anatomy:
  1. Eyebrow: "Ariya recommends" (BLUE, the one accent moment).
  2. Situation: one line on what the data shows.
  3. Recommendation: 17 to 19px headline, the action in plain language.
  4. Reasoning: one short paragraph in `NAVY_70`.
  5. Confidence: ConfidenceBadge (Low / Medium / High) with a one-line rationale tooltip.
  6. Required conditions: checklist with unchecked circles.
  7. Recommended next actions: rows with action verb, owner, timeframe.
  8. Sources: chip row.
  9. Footer actions: "Log this decision →" (primary), "Open in Scenario Planner →" (quiet link) where applicable.
- **What This Suggests callout.** Lighter weight, for diagnostic screens. A teal-bordered single-line callout that connects diagnosis to a downstream decision: "What this suggests: [interpretation]. → [linked next screen]". No diagnostic screen ends without one.
- **Confidence band (Scenario Planner).** A Recharts area chart with a base line and a shaded best / conservative band. The band visibly widens when required conditions are unchecked. Subtitle always reads "Directional. Not a forecast."

---

## 3 · Visual design system

### Color tokens

Defined once in `index.css @theme` as CSS variables; mirrored as per-file constants in TSX because the codebase uses inline styles for color, not Tailwind utilities. Keep both in sync.

```ts
const NAVY        = '#050A44';   // primary text, headings
const BLUE        = '#0055BB';   // links, primary actions
const BLUE_BRIGHT = '#1A6BFF';   // start of the title gradient
const LAVENDER    = '#E8EAF6';   // active nav pill, lavender chips
const CANVAS      = '#F7F8FC';   // hover backgrounds, chip surfaces
const GREEN       = '#16A34A';   // on-track / verified
const AMBER       = '#F59E0B';   // at-risk / watch
const RED         = '#E11D48';   // urgent / critical

// Ink scale on navy. Only these four are widely used.
const NAVY_70 = 'rgba(5,10,68,0.70)';  // secondary text
const NAVY_55 = 'rgba(5,10,68,0.55)';  // muted text, eyebrows
const NAVY_12 = 'rgba(5,10,68,0.12)';  // borders
const NAVY_06 = 'rgba(5,10,68,0.06)';  // subtle dividers, chip bg
```

A title gradient is encoded as a single class:

```css
.text-gradient {
  background: linear-gradient(135deg, #1A6BFF 0%, #050A44 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Typography

Font: Inter, system-ui, sans-serif (set in `--font-sans` and on `body`). One font, no second face.

- **Page title (H1)**, canonical pattern for every inner screen:
  `className="text-gradient text-[28px] font-bold leading-tight mb-2"`
  Followed by a subtitle: `className="text-sm"` with color `NAVY_55`.
- **Eyebrow / section label** replaces a separate H2: 11px / 800 / letter-spacing 0.6 to 0.8 / uppercase / color `NAVY_55`. BLUE-colored eyebrows are reserved for accent moments (Weekly Brief kicker, "Ariya recommends").
- **Card title**: 14 to 16px / 600 to 700. 16px on dashboard tiles, 14px in list rows.
- **Body**: 13 to 14px / line-height 1.5 / color `NAVY_70`.
- **Metrics** (donut values, big stat numbers): 18 to 28px / 700 to 800.
- **Long numerical tables**: `tabular-nums` is preferred. Apply it on every new metric cluster.

### Layout

- **App shell**: 240px dark navy sidebar (`position: fixed`, full height) plus main content area on white-ish canvas, max-width 1280, padding 32 to 40px.
- **Cards**: white background, 12 to 14px border-radius, 1px border `NAVY_12`, soft shadow `0 1px 2px rgba(5,10,68,0.04)`. Hover: `translateY(-1px)` plus a slightly heavier shadow.
- **Prominent / elevated cards** (the anchor scenario, an urgent gap): step up to a 6px left accent stripe plus heavier shadow `0 6px 18px rgba(5,10,68,0.10), 0 1px 2px rgba(5,10,68,0.04)` and border in the status color.
- **Section spacing**: 24 to 32px between blocks. Whitespace is the design; do not be stingy.
- **Grids**: prefer explicit `'1fr 1fr'` over `auto-fit` when you want exactly two columns. Use CSS multi-column (`columns: 340px; column-gap: 12; break-inside: avoid`) for masonry-style lists where one card is much taller than its siblings.

### Status / RAG treatment

Status labels are stored AND rendered in Title Case: "At Risk", "Watch", "On Track", "Decision Taken", "Pending", "Verified". Never ALL CAPS on status pills. No `textTransform: uppercase` on status.

- **On Track / Verified**: green dot or border, `#16A34A`.
- **At Risk / Watch**: amber, `#F59E0B`.
- **Urgent / Critical**: red, `#E11D48`. Apply a 4px left accent stripe (6px on the prominent treatment), tinted background (`#FEF2F2`), and a thin status-color outer border. This is the "news callout" pattern.
- **Decision Taken / Monitoring**: quieter green confirmation banner inside the card. The status pill flips from At Risk to Decision Taken.

### Pills, tags, buttons

- **Status pill**: tinted bg (`#FEE2E2`, `#FEF3C7`, `#D1FAE5`), matching deep text (`#7F1D1D`, `#92400E`, `#065F46`), 11px / 700, 3px by 9px padding, border-radius 999. Title Case label.
- **Neutral chip**: `NAVY_06` bg, `NAVY_70` text, 11 to 12px / 600 to 700.
- **"On critical path" tag**: `#EEF2FF` bg, `#3730A3` text, indigo dot prefix. Distinct from status tones.
- **Primary button**: BLUE background, white text, 10px radius, 8 to 14px padding, 13px / 600. Bright-blue hover (`#0047a3`).
- **Quiet link button**: transparent, BLUE text, 12 to 13px / 600 to 700, no underline. The chevron `→` carries the affordance. Used far more than primary buttons; most UI is read-mostly.
- **Outline / secondary button**: white bg, `NAVY_12` border, navy text, 10px radius. Used as the second action next to a primary ("View signal" alongside "Open Decision Brief").
- **Toggle pill** ("Hide ‹" / "Show ›"): `#F7F8FC` bg, `NAVY_12` border, `NAVY_70` text, 11px / 600, fully rounded. Used to collapse side panels.

### Motion

- Standard transitions: 120 to 150ms ease for color and background. 240ms ease-out for fade-ins on response / answer blocks.
- Hover-lift on cards: `translateY(-1px)` plus shadow step. No bouncing, no spring, no large translations.
- A 2.2s ease-in-out ambient pulse, `ariya-ambient-pulse`, for the "needs attention" affordance only.
- A 1.6s ease-out radiating pulse, `ariya-pulse-dot` / `.pulse-dot`, for small status dots in news callouts.
- A 180ms `ariya-fade-in` for blocks that appear in response to user action (answers, expanded details).

### Copy rules

- **Page-name nouns are Title Case** ("Europe Overview", "Investment Radar", "Decision Brief"). These are named UI artefacts.
- **Verb-form descriptions stay sentence case** ("Decision logged", "Action needed").
- **Section labels are noun phrases**, not sentences ("Decisions awaiting input", not "Here are the decisions awaiting input").
- **Action labels are verbs** ("Open Decision Brief →", not "Decision Brief").
- **Status terms always Title Case.**
- **Em-dashes (—) are banned.** Use colon, comma, period, or the middle dot `·` as separators. The middle dot is used liberally.
- **One canonical label for the competitor / generic** ("Generic Filer A" in UI, "Generic manufacturer" allowed only in narrative prose).
- **Abbreviations**: spell out on first use per page ("supplementary protection certificate (SPC)"), then abbreviate. Never euphemisms ("patent shield", "patent protection").
- **Dates**: "Mon DD, YYYY" in headlines ("Apr 28, 2026"), "Mon DD" in compact contexts, "YYYY-MM-DD" only in source citations.

### Composite patterns (reusable shapes)

These appear on multiple screens. Reuse, do not reinvent.

- **News callout**: white card plus status-color 4px left stripe, small-caps eyebrow ("This Week's Headline", "Italy Follow-Up Gap"), 17px bold headline, optional metadata row, right-aligned CTA. Tone (red / green) flips with scenario state.
- **Hero block (01 / 02 / 03)**: light grey container, three child rows. Item 01 dominant: red accent stripe, red-tinted bg, 19px headline, evidence chips, two action buttons. Items 02 / 03 compact: small numeral, single-row tags, headline, context, chevron, whole row clickable.
- **Donut readout**: 76px diameter, 8px stroke, value in 18px navy bold centered. Deliberately different in shape from priority-market progress bars.
- **Critical-path chain**: light surface, four nodes in a row joined by lucide `ChevronRight` icons. Endpoint node distinguished by 2px colored border, floating "Endpoint" label, flag icon. Reused on Scenario Planner.
- **Dependencies and blockers inline list**: direction-grouped headers ("↑ Inputs we need" / "↓ Waiting on this"), each dependency a white sub-card with status pill, optional "⚠ Blocker" badge when upstream slips.
- **Side-rail collapse**: full panel collapses to a 40px-wide vertical rail with the section label rotated 180° via `writing-mode: vertical-rl` plus `transform: rotate(180deg)`. The whole rail is a button that expands the panel.

### Cross-cutting CSS classes (kept small on purpose)

Only these live in `index.css`. Everything else is inline `CSSProperties`.

- `.ariya-card` · base card surface.
- `.ariya-pill` · pill geometry (padding, radius, font-size). Color comes from inline style.
- `.ariya-scrollbar` · slim custom scrollbar.
- `.text-gradient` · the H1 title gradient.
- `.ariya-fade-in` · 180ms fade-in animation.
- `.hover-lift` · translateY plus shadow step on hover. (Add when first needed.)
- `.pulse-dot` / `ariya-pulse-dot` · radiating dot for live signals. (Add when first needed.)
- `ariya-ambient-pulse` · ambient breathing pulse for the anchor scenario card. (Add when first needed.)

### Print stylesheet (Decision Log)

When the user prints the Decision Log, hide chrome (sidebar, header, demo-mode toggle, anything tagged `.ariya-no-print`), force `body` background to white, force `<details>` panels open, and apply `break-inside: avoid` to decision cards so they don't split across pages. The Decision Log doubles as a printable briefing artefact; the print path matters.

---

## Customization checklist · new customer

When starting a fresh prototype for another customer, change exactly these:

1. **CLAUDE.md** rewrite:
   - "What we are building" paragraph.
   - The anchor demo story (the one reallocation / launch / trade-off the demo returns to).
   - The non-negotiables (usually identical, but re-confirm "proxy KPIs only" applies).
   - **Vocabulary filter table**: the per-customer "Do not say / Say instead" list. This is the single biggest source of credibility risk.
   - The two named screens that carry the extra quality bar.
2. **Color tokens** in `index.css @theme` and the per-file TSX constants. NAVY, BLUE, BLUE_BRIGHT, LAVENDER swap together. RAG colors usually stay. Update `.text-gradient` start and end stops to match.
3. **Brand wordmark** in the sidebar (`<img src="/<customer>-logo.png" />`) and brand subtitle ("Commercial Effectiveness", "Launch Excellence", etc.).
4. **Page-name nouns** in the sidebar `NAV_ITEMS` array. The shapes (Overview, Performance, Radar / Matrix, Signals, Customer Focus, Scenario Planner, Ask <product>, Decision Log, Source Confidence) usually carry over; the labels are per-customer.
5. **`src/data/scenario.ts`**: rebuild the typed seed. Markets, brands, segments, scenario assumptions, scripted Ask responses, decision log entries, sources. Everything downstream reads from here.
6. **Demo Mode steps** (`src/data/tourSteps.ts` and `components/demo/DemoOverlay.tsx`): the 8-step walkthrough lines up with the new sidebar order.
7. **`package.json` name** and `index.html` `<title>`.
8. **localStorage key prefix**: change `ariya.<feature>.<thing>` to `<customer>.<feature>.<thing>` so two prototypes can coexist in the same browser without state collisions.
9. **Reset-demo allow-list**: confirm which auth keys (if any) should survive the wipe.

Things that should NOT change between customers:

- Stack and TS strictness settings.
- The persisted-Context + `usePersistedState` pattern.
- The createPortal rule and z-index scale.
- The Decision Layer primitives (Recommendation Card, What This Suggests, Confidence band).
- The tone split (editorial vs data) and the copy rules (Title Case for nouns, no em-dashes, middle dot as separator, dates format).
- The composite patterns (news callout, hero 01/02/03, donut readout, critical-path chain, side-rail collapse).
- The print stylesheet shape.

Keep this doc in the repo and update it whenever a non-obvious decision is taken. It is cheaper than re-deciding.
