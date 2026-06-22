// src/data/scenario.ts
// Locked dataset for the Merz Commercial Effectiveness prototype · DACH re-skin.
// Demo narrative: Xeomin HCP injection training, Germany follow-up cadence sprint.
// Markets are Germany, Switzerland, Austria only. All numbers are illustrative.
// Never introduce parallel numbers in components.
//
// LOCKED ANCHORS (reconcile every screen to these):
//   Agreed 60-day follow-up cadence (benchmark): 65%.
//   Xeomin 60-day post-training follow-up: Germany 44%, Austria 62%, Switzerland 73%.
//   High-potential Xeomin injectors below the 60-day cadence: 71 across DACH.
//     Split: Germany 52, Austria 14, Switzerland 5. Germany is the largest single concentration.

export type Confidence = 'Low' | 'Medium' | 'High';
export type SignalTone = 'on-track' | 'watch' | 'at-risk' | 'urgent';
export type Status = 'On Track' | 'Watch' | 'At Risk' | 'Decision Taken' | 'Pending' | 'Verified' | 'Active';

// ---------------------------------------------------------------------------
// MARKETS
// ---------------------------------------------------------------------------

export interface Market {
  id: string;
  name: string;
  flag: string;
  salesQtdEur: number;          // current quarter sales, in EUR (€M)
  growthVsPlanPct: number;      // signed %
  growthVsLyPct: number;        // signed %
  investmentIntensityPct: number; // commercial investment as % of sales
  needsAttention: boolean;      // drives the ambient-pulse affordance
  oneLineContext: string;       // shown next to the market in lists
}

export const markets: Market[] = [
  { id: 'de', name: 'Germany', flag: '🇩🇪', salesQtdEur: 12.9, growthVsPlanPct: -3.8, growthVsLyPct: 1.2, investmentIntensityPct: 17.2, needsAttention: true,
    oneLineContext: 'Trained Xeomin injectors in place, but post-training follow-up falls below the agreed 60-day cadence.' },
  { id: 'ch', name: 'Switzerland', flag: '🇨🇭', salesQtdEur: 2.1, growthVsPlanPct: 2.6, growthVsLyPct: 5.4, investmentIntensityPct: 9.6, needsAttention: false,
    oneLineContext: 'Healthy anchor. Follow-up discipline strong, training scaling fastest in DACH.' },
  { id: 'at', name: 'Austria', flag: '🇦🇹', salesQtdEur: 2.8, growthVsPlanPct: -0.9, growthVsLyPct: 1.8, investmentIntensityPct: 11.5, needsAttention: false,
    oneLineContext: 'Supporting market. Follow-up steady, local OTx oversight on Hepa-Merz.' },
];

// ---------------------------------------------------------------------------
// BRANDS
// ---------------------------------------------------------------------------

export interface BrandPerformance {
  marketId: string;
  salesQtdEur: number;
  growthVsPlanPct: number;
  trendIndexed: number[]; // 6 quarters, indexed to 100 at Q-5
}

export interface Brand {
  id: string;
  name: string;
  primary: boolean;
  performance: BrandPerformance[];
}

// Xeomin is the primary brand and the only one carrying the HCP execution model.
// Hepa-Merz, Antidry, and Pantogar are local OTx watch brands, each stamped to its
// single local market. There is no cross-market OTx comparison anywhere.
export const brands: Brand[] = [
  {
    id: 'xeomin', name: 'Xeomin', primary: true,
    performance: [
      { marketId: 'de', salesQtdEur: 12.9, growthVsPlanPct: -3.8, trendIndexed: [100, 102, 103, 101, 99, 97] },
      { marketId: 'ch', salesQtdEur: 2.1, growthVsPlanPct: 2.6, trendIndexed: [100, 102, 104, 106, 108, 110] },
      { marketId: 'at', salesQtdEur: 2.8, growthVsPlanPct: -0.9, trendIndexed: [100, 101, 101, 100, 100, 99] },
    ],
  },
  {
    id: 'hepa-merz', name: 'Hepa-Merz', primary: false,
    performance: [
      { marketId: 'de', salesQtdEur: 4.6, growthVsPlanPct: -0.8, trendIndexed: [100, 100, 101, 101, 100, 100] },
      { marketId: 'at', salesQtdEur: 1.2, growthVsPlanPct: 0.4, trendIndexed: [100, 101, 101, 102, 102, 102] },
    ],
  },
  {
    id: 'antidry', name: 'Antidry', primary: false,
    performance: [
      { marketId: 'ch', salesQtdEur: 0.9, growthVsPlanPct: -0.3, trendIndexed: [100, 100, 100, 99, 99, 99] },
    ],
  },
  {
    id: 'pantogar', name: 'Pantogar', primary: false,
    performance: [
      { marketId: 'de', salesQtdEur: 1.7, growthVsPlanPct: 0.6, trendIndexed: [100, 101, 102, 102, 103, 103] },
    ],
  },
];

// ---------------------------------------------------------------------------
// GM HOME summary (landing page, route "/")
// ---------------------------------------------------------------------------

export const overview = {
  summary: {
    marketsAbovePlan: { value: 1, source: 'Sales · refreshed daily' },
    marketsRequiringAttention: { value: 1, source: 'Multi-source · refreshed daily' },
    investmentExposureEur: { value: '€18.6M', source: 'Finance · refreshed weekly' },
    openDecisions: { value: 4, source: 'Decision Log' },
  },
  scatterInterpretation:
    'Higher investment intensity does not translate cleanly into growth above plan. Germany carries the highest investment intensity in DACH but the weakest growth vs plan. Switzerland and Austria sit at lower intensity, with Switzerland above plan. The question is not whether to invest, it is whether the investment is matched by post-training follow-through.',
  // The dominant block above the fold. Drives the News callout and the
  // "Open Recommendation" smooth-scroll target.
  heroCallout: {
    eyebrow: "This Week's Priority",
    headline:
      'High-potential Xeomin injectors in Germany are being trained, but post-training follow-up falls below the agreed 60-day cadence. Ariya flags a focused follow-up sprint for that cohort, with NSM and first-line manager ownership, weekly tracking, and a 60-day review.',
    metaRow: 'Germany · Xeomin · May 19, 2026',
    cta: { label: 'Open Recommendation', scrollToId: 'recommendation-anchor' },
  },
  // Six fragmented sources visibly compressed into one decision. Each chip
  // shows an icon, a bold label, and a one-line meta below the label. Labels
  // are mirrored exactly in recommendation.sources so the "Sources used" row
  // in the card reads as the same list of inputs the synthesised block calls
  // out at the top of the page. Order is fixed: Veeva activity, Training
  // participation, HCP segmentation, Sales or order signals, Plan or forecast
  // data, Brand-plan context.
  assemblySources: [
    { id: 'veeva', label: 'Veeva activity', icon: 'Activity', meta: '71 high-potential injectors below cadence · 52 in Germany' },
    { id: 'training', label: 'Training participation', icon: 'GraduationCap', meta: 'Xeomin injector training · DACH' },
    { id: 'segmentation', label: 'HCP segmentation', icon: 'Users', meta: 'High-potential injectors · DE, CH, AT' },
    { id: 'sales', label: 'Sales or order signals', icon: 'TrendingUp', meta: 'Xeomin DACH · 6 quarters' },
    { id: 'forecast', label: 'Plan or forecast data', icon: 'DollarSign', meta: 'Q1 actuals vs plan' },
    { id: 'brand-plan', label: 'Brand-plan context', icon: 'BookOpen', meta: 'Apr 2026 brand plan' },
  ],
  // Body sentence rendered inside the synthesised block, between the eyebrow
  // and the chips. Names the specific datasets that were cross-referenced.
  synthesisedNote:
    'Germany Veeva activity, training participation, and segmentation data were cross-referenced with Austria and Switzerland follow-up rates and Q1 plan signals. No single source contains this conclusion.',
  recommendation: {
    eyebrow: 'Ariya recommends',
    headerMeta: 'Generated for DACH Leadership · 21 May',
    situation:
      'High-potential Xeomin injectors in Germany are being trained, but post-training follow-up falls below the agreed 60-day cadence. 52 high-potential German injectors sit below the cadence, the largest single concentration across DACH.',
    recommendation:
      'Fix follow-up cadence on the Germany high-potential Xeomin injector cohort.',
    // Brief intro paragraph rendered right under the recommendation headline
    // (above the Dig deeper panel). The detailed Why bullets render further
    // down in the expanded section.
    reasoning:
      'Germany already has the trained injectors and the budget. The gap is post-training execution, not investment. A focused follow-up sprint runs within the existing budget, with NSM and first-line manager ownership, weekly tracking, and a 60-day review.',
    whyBullets: [
      {
        lead: 'Germany has the runway.',
        body: 'High-potential Xeomin injectors are already trained in Germany. The break point is post-training execution: 44% receive a 60-day follow-up vs the agreed 65% cadence, and vs 62% in Austria and 73% in Switzerland. A follow-up sprint funds follow-through on training already delivered, not new programs.',
      },
      {
        lead: 'The cohort is specific and bounded.',
        body: '52 high-potential German injectors sit below the 60-day cadence, out of 71 across DACH. This is an operationally bounded list that NSM and first-line managers can own directly, with weekly tracking.',
      },
      {
        lead: 'Funded within the existing budget.',
        body: 'The sprint is a redirect of attention onto an existing cohort, not new spend. Total Germany commercial budget is unchanged. A 60-day review confirms whether the follow-up cadence has recovered toward the 65% benchmark.',
      },
    ],
    confidence: 'Medium' as Confidence,
    confidenceRationale:
      'Account-level linkage between follow-up and revenue is directional. Segment-level proxy KPIs are reliable.',
    conditions: [
      'High-potential trained injector list confirmed in Germany',
      'Germany National Sales Manager owns the 60-day follow-up cadence',
      'First-line managers track post-training engagement weekly',
      'Review at 60 days using Veeva follow-up and performance signals',
    ],
    nextActions: [
      { action: 'Confirm the Germany high-potential trained injector list', owner: 'Germany NSM', timeframe: 'Within 5 days', priority: true },
      { action: 'Define the Germany follow-up sprint plan', owner: 'Germany NSM, first-line managers', timeframe: 'Within 10 days', priority: true },
      { action: 'Open Scenario Planner to test the directional impact of redirecting Germany marketing budget toward follow-up activation.', owner: 'DACH Leadership', timeframe: 'This week' },
    ],
    nextActionsMeta: '3 steps · this week',
    sources: [
      'Veeva activity',
      'Training participation',
      'HCP segmentation',
      'Sales or order signals',
      'Plan or forecast data',
      'Brand-plan context',
    ],
    // Three different ways to dig deeper before committing. The first hinges
    // into Ask Ariya for the full assembled chain and the 60-day checkpoint
    // view; the second moves to the Scenario Planner to model alternatives;
    // the third opens Source Confidence to trace every number back to its
    // refresh cadence. All sit alongside "Log this decision" in the card's
    // fused end section.
    digDeeper: {
      eyebrow: 'Dig deeper',
      copy: 'Before you commit: pressure-test the assumptions in Ask Ariya, model the Germany follow-up redirect in the Scenario Planner, or trace every number back to its source.',
      ctas: [
        { label: 'Open in Ask Ariya', to: '/ask-ariya?q=germany-60d-checkpoint' },
        { label: 'Open Scenario Planner', to: '/scenario-planner' },
        { label: 'Trace evidence', to: '/source-confidence' },
      ],
    },
    footerMeta: 'Reversible · revisit at 60 days',
  },
  // Germany + Austria. The Germany entry is rendered in "covered above" mode
  // by HeroPriorityList because the priority callout at the top of the page
  // already names it. Duplicating the full headline + evidence here would
  // make the page feel redundant. The muted row shows the italic coveredAbove
  // text plus a "Jump to priority" link, and Austria is promoted to the
  // dominant slot. Switzerland sits in overview.blindSpot below.
  marketsRequiringAttention: [
    { marketId: 'de', headline: 'Germany follow-up gap is the largest single concentration of at-risk Xeomin injectors in DACH.',
      evidence: '52 high-potential trained injectors in Germany below the 60-day cadence (out of 71 across DACH).', cta: 'Open Germany detail →',
      coveredAbove: { text: 'Germany follow-up gap · covered in the priority above.' } },
    { marketId: 'at', headline: 'Austria follow-up is steady but carries the second-largest below-cadence cohort.',
      evidence: '14 high-potential trained injectors in Austria below the 60-day cadence. Follow-up rate 62%, just below the 65% benchmark.', cta: 'Open Austria detail →' },
  ],
  // Quiet watch item rendered at the very bottom of the page as a
  // BlindSpotCard. Low confidence, no action recommended yet. Surfaces
  // an early pattern before it becomes a problem. Switzerland is healthy
  // today (73% within 60 days) but its training is scaling fastest in DACH,
  // the same precondition that preceded Germany's slip.
  blindSpot: {
    eyebrow: 'Watching quietly',
    headline: "Switzerland shows the early shape of Germany's follow-up pattern.",
    body: 'Switzerland Xeomin is above plan and follow-up discipline is healthy today (73% within 60 days). The watchpoint is velocity: training participation is scaling fastest in DACH. Germany follow-up rate began to slip when its training cohort grew faster than its follow-up capacity. Switzerland is in that growth zone now.',
    recommendation: 'No action recommended yet. Reassess at the 60-day checkpoint, when the same data refresh will show whether Switzerland follow-up rate held steady or started to track the Germany curve.',
    confidence: 'Low' as Confidence,
    confidenceRationale: 'Directional pattern recognition only. Confirm at next data refresh.',
    sources: ['Sales or order signals', 'Veeva activity', 'Training participation'],
    watchpointMetrics: [
      { label: 'Switzerland training participation growth, last 2 quarters', value: '+38%', tone: 'watch' as const },
      { label: 'Switzerland post-training 60-day follow-up, current', value: '73%', tone: 'on-track' as const },
      { label: 'Germany follow-up rate, 2 quarters before slip', value: '64%', tone: 'on-track' as const },
    ],
  },
} as const;

// ---------------------------------------------------------------------------
// MARKET PERFORMANCE detail
// ---------------------------------------------------------------------------

export type StatTone = 'on-track' | 'watch' | 'at-risk';

export interface StatCallout {
  tone: StatTone;
  label: string;        // e.g. "Why it's strong", "What it means", "Why it's the break point"
  body: string;
  action: string;       // CTA text
  actionRoute?: string; // optional route the CTA navigates to
}

export interface MarketContext {
  marketId: string;
  forecastVsActual: { quarter: string; forecast: number; actual: number }[];
  performanceInContext: {
    investmentIntensityPct: number;
    fieldActivityIndex: number; // 100 = expected
    postTrainingFollowUpRatePct: number;
    marketSharePct: number;          // illustrative, Xeomin in aesthetic neuromodulator
    contributionMarginPct: number;   // illustrative
    interpretation: string;
    // Stat-card delta vs benchmark, shown in the top-right pill of each card.
    // Sign indicates direction (positive = above benchmark).
    deltas?: {
      investmentIntensity?: number;
      fieldActivity?: number;
      followup?: number;
      marketShare?: number;
      margin?: number;
    };
    // Inner mini-visualisation data per stat card.
    investmentMix?: { label: string; value: number; color: string }[];
    hcpVisitsPerMonth?: { month: string; visits: number; tone: StatTone }[];
    followupPeers?: { label: string; value: number; highlight?: boolean }[];
    marketShareTrend?: { quarter: string; value: number }[];
    marginTrend?: { quarter: string; value: number }[];
    marketShareBenchmark?: number;
    marginBenchmark?: number;
    // Per-card editorial callout.
    callouts?: {
      investmentIntensity?: StatCallout;
      fieldActivity?: StatCallout;
      followup?: StatCallout;
      marketShare?: StatCallout;
      margin?: StatCallout;
    };
  };
}

// Editorial note rendered at the top of Market Performance to mark the
// surface as one input into the assembly chain rather than a standalone
// BI dashboard. Page-level (not tied to any specific market) so it lives
// next to marketPerformanceContext rather than inside it.
export const marketPerformanceAriyaNote = {
  eyebrow: 'Note',
  body: 'Performance alone does not justify a change. The Germany Xeomin share slope is directionally aligned with the post-training follow-up gap, concentrated in the high-potential injector segment. The decision depends on execution follow-through.',
} as const;

// Shared "how to read this page" framing used on Investment Radar and
// Execution Signals. Three short beats: names the data type, names what
// it does and does not show, names how to read it. Held in one place so
// the wording cannot drift between the two pages.
export const proxyFramingNote = {
  eyebrow: 'How to read this page',
  body: 'Proxy KPIs only. These signals indicate execution discipline, not commercial causality. Read them as directional, not deterministic.',
} as const;

export const marketPerformanceContext: MarketContext[] = [
  {
    marketId: 'de',
    forecastVsActual: [
      { quarter: 'Q1', forecast: 13.4, actual: 12.9 },
      { quarter: 'Q2 forecast', forecast: 13.7, actual: 13.2 },
    ],
    performanceInContext: {
      investmentIntensityPct: 17.2,
      fieldActivityIndex: 104,
      postTrainingFollowUpRatePct: 44,
      marketSharePct: 27.9,
      contributionMarginPct: 62.1,
      interpretation:
        'Performance below plan in Germany coincides with a 44% post-training 60-day follow-up rate among trained injectors, below the agreed 65% cadence. Field activity is above expected, but post-training follow-up is not reaching the highest-potential trained injectors.',
      deltas: {
        investmentIntensity: 5.3,
        fieldActivity: 4,
        followup: -21,
        marketShare: 3.9,
        margin: 2.1,
      },
      investmentMix: [
        { label: 'Marketing', value: 32, color: '#0B2F8A' },
        { label: 'Field activity', value: 30, color: '#1A6BFF' },
        { label: 'HCP training & follow-up', value: 20, color: '#5C9BFF' },
        { label: 'Events & KOL', value: 12, color: '#9BC1FF' },
        { label: 'Other', value: 6, color: '#CFE0FF' },
      ],
      hcpVisitsPerMonth: [
        { month: 'Dec', visits: 98, tone: 'on-track' },
        { month: 'Jan', visits: 104, tone: 'on-track' },
        { month: 'Feb', visits: 106, tone: 'on-track' },
        { month: 'Mar', visits: 108, tone: 'on-track' },
        { month: 'Apr', visits: 105, tone: 'on-track' },
        { month: 'May', visits: 103, tone: 'on-track' },
      ],
      followupPeers: [
        { label: 'Switzerland', value: 73 },
        { label: 'Benchmark', value: 65 },
        { label: 'Austria', value: 62 },
        { label: 'Germany', value: 44, highlight: true },
      ],
      marketShareTrend: [
        { quarter: 'Q-5', value: 28.4 },
        { quarter: 'Q-4', value: 28.2 },
        { quarter: 'Q-3', value: 28.0 },
        { quarter: 'Q-2', value: 28.0 },
        { quarter: 'Q-1', value: 27.9 },
        { quarter: 'Q1', value: 27.9 },
      ],
      marketShareBenchmark: 28,
      marginTrend: [
        { quarter: 'Q-5', value: 62.6 },
        { quarter: 'Q-4', value: 62.4 },
        { quarter: 'Q-3', value: 62.3 },
        { quarter: 'Q-2', value: 62.2 },
        { quarter: 'Q-1', value: 62.1 },
        { quarter: 'Q1', value: 62.1 },
      ],
      marginBenchmark: 60,
      callouts: {
        investmentIntensity: {
          tone: 'watch',
          label: 'What it means',
          body: 'Germany invests above DACH peers, but much goes to broad marketing, not training-driven follow-up activation.',
          action: 'See drivers',
          actionRoute: '/investment-radar',
        },
        fieldActivity: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Volume of visits is above target. But post-training follow-up is not concentrated on the highest-potential trained injectors.',
          action: 'See drivers',
          actionRoute: '/customer-account-focus',
        },
        followup: {
          tone: 'at-risk',
          label: "Why it's the break point",
          body: 'The break point. 21 points below the 65% cadence. Trained injectors are not being re-engaged in the critical 60-day window.',
          action: 'Investigate',
          actionRoute: '/execution-signals',
        },
        marketShare: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Share is stable and above benchmark. The challenge is yield on existing share, not share itself.',
          action: 'See drivers',
          actionRoute: '/investment-radar',
        },
        margin: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Margin is healthy and stable. The growth gap is volume, not profitability.',
          action: 'See drivers',
          actionRoute: '/investment-radar',
        },
      },
    },
  },
  {
    marketId: 'ch',
    forecastVsActual: [
      { quarter: 'Q1', forecast: 2.05, actual: 2.1 },
      { quarter: 'Q2 forecast', forecast: 2.1, actual: 2.16 },
    ],
    performanceInContext: {
      investmentIntensityPct: 9.6,
      fieldActivityIndex: 102,
      postTrainingFollowUpRatePct: 73,
      marketSharePct: 24.6,
      contributionMarginPct: 63.4,
      interpretation:
        'Switzerland is above plan with the healthiest follow-up discipline in DACH (73% within 60 days, above the 65% cadence). Training participation is scaling fastest in DACH, so follow-up capacity is the item to watch as the cohort grows.',
      deltas: {
        investmentIntensity: -2.3,
        fieldActivity: 2,
        followup: 8,
        marketShare: 0.6,
        margin: 3.4,
      },
      investmentMix: [
        { label: 'Marketing', value: 24, color: '#0B2F8A' },
        { label: 'Field activity', value: 32, color: '#1A6BFF' },
        { label: 'HCP training & follow-up', value: 24, color: '#5C9BFF' },
        { label: 'Events & KOL', value: 12, color: '#9BC1FF' },
        { label: 'Other', value: 8, color: '#CFE0FF' },
      ],
      hcpVisitsPerMonth: [
        { month: 'Dec', visits: 96, tone: 'on-track' },
        { month: 'Jan', visits: 100, tone: 'on-track' },
        { month: 'Feb', visits: 102, tone: 'on-track' },
        { month: 'Mar', visits: 103, tone: 'on-track' },
        { month: 'Apr', visits: 104, tone: 'on-track' },
        { month: 'May', visits: 102, tone: 'on-track' },
      ],
      followupPeers: [
        { label: 'Switzerland', value: 73, highlight: true },
        { label: 'Benchmark', value: 65 },
        { label: 'Austria', value: 62 },
        { label: 'Germany', value: 44 },
      ],
      marketShareTrend: [
        { quarter: 'Q-5', value: 23.8 },
        { quarter: 'Q-4', value: 24.0 },
        { quarter: 'Q-3', value: 24.2 },
        { quarter: 'Q-2', value: 24.4 },
        { quarter: 'Q-1', value: 24.5 },
        { quarter: 'Q1', value: 24.6 },
      ],
      marketShareBenchmark: 24,
      marginTrend: [
        { quarter: 'Q-5', value: 62.9 },
        { quarter: 'Q-4', value: 63.0 },
        { quarter: 'Q-3', value: 63.1 },
        { quarter: 'Q-2', value: 63.2 },
        { quarter: 'Q-1', value: 63.3 },
        { quarter: 'Q1', value: 63.4 },
      ],
      marginBenchmark: 60,
      callouts: {
        investmentIntensity: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Lower investment intensity than Germany, yet above plan. Spend is matched by follow-through.',
          action: 'See drivers',
          actionRoute: '/investment-radar',
        },
        fieldActivity: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Field activity is steady and well distributed. Coverage discipline on priority accounts is intact.',
          action: 'See drivers',
          actionRoute: '/customer-account-focus',
        },
        followup: {
          tone: 'on-track',
          label: "Why it's strong",
          body: '73% follow-up coverage, above the 65% cadence. Watch capacity as training scales fastest in DACH.',
          action: 'See drivers',
          actionRoute: '/execution-signals',
        },
        marketShare: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Share is gently rising. Follow-up discipline supports yield on existing share.',
          action: 'See drivers',
          actionRoute: '/investment-radar',
        },
        margin: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Margin is healthy and improving. No profitability concern.',
          action: 'See drivers',
          actionRoute: '/investment-radar',
        },
      },
    },
  },
  {
    marketId: 'at',
    forecastVsActual: [
      { quarter: 'Q1', forecast: 2.85, actual: 2.8 },
      { quarter: 'Q2 forecast', forecast: 2.9, actual: 2.85 },
    ],
    performanceInContext: {
      investmentIntensityPct: 11.5,
      fieldActivityIndex: 100,
      postTrainingFollowUpRatePct: 62,
      marketSharePct: 25.2,
      contributionMarginPct: 61.0,
      interpretation:
        'Austria is near plan with follow-up just below the agreed cadence (62% vs 65%). 14 high-potential injectors sit below the 60-day cadence, the second-largest below-cadence cohort in DACH after Germany.',
      deltas: {
        investmentIntensity: -0.4,
        fieldActivity: 0,
        followup: -3,
        marketShare: 1.2,
        margin: 1.0,
      },
      investmentMix: [
        { label: 'Marketing', value: 28, color: '#0B2F8A' },
        { label: 'Field activity', value: 31, color: '#1A6BFF' },
        { label: 'HCP training & follow-up', value: 21, color: '#5C9BFF' },
        { label: 'Events & KOL', value: 12, color: '#9BC1FF' },
        { label: 'Other', value: 8, color: '#CFE0FF' },
      ],
      hcpVisitsPerMonth: [
        { month: 'Dec', visits: 94, tone: 'on-track' },
        { month: 'Jan', visits: 98, tone: 'on-track' },
        { month: 'Feb', visits: 100, tone: 'on-track' },
        { month: 'Mar', visits: 101, tone: 'on-track' },
        { month: 'Apr', visits: 99, tone: 'on-track' },
        { month: 'May', visits: 98, tone: 'on-track' },
      ],
      followupPeers: [
        { label: 'Switzerland', value: 73 },
        { label: 'Benchmark', value: 65 },
        { label: 'Austria', value: 62, highlight: true },
        { label: 'Germany', value: 44 },
      ],
      marketShareTrend: [
        { quarter: 'Q-5', value: 24.6 },
        { quarter: 'Q-4', value: 24.8 },
        { quarter: 'Q-3', value: 24.9 },
        { quarter: 'Q-2', value: 25.0 },
        { quarter: 'Q-1', value: 25.1 },
        { quarter: 'Q1', value: 25.2 },
      ],
      marketShareBenchmark: 24,
      marginTrend: [
        { quarter: 'Q-5', value: 60.4 },
        { quarter: 'Q-4', value: 60.6 },
        { quarter: 'Q-3', value: 60.7 },
        { quarter: 'Q-2', value: 60.8 },
        { quarter: 'Q-1', value: 60.9 },
        { quarter: 'Q1', value: 61.0 },
      ],
      marginBenchmark: 60,
      callouts: {
        investmentIntensity: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Investment intensity is moderate and broadly matched by activity.',
          action: 'See drivers',
          actionRoute: '/investment-radar',
        },
        fieldActivity: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Field activity is on target. Follow-up cadence is the item to lift toward benchmark.',
          action: 'See drivers',
          actionRoute: '/customer-account-focus',
        },
        followup: {
          tone: 'watch',
          label: 'What it means',
          body: '62% follow-up, just below the 65% cadence. 14 high-potential injectors sit below the threshold.',
          action: 'Investigate',
          actionRoute: '/execution-signals',
        },
        marketShare: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Share is gently rising. No share concern.',
          action: 'See drivers',
          actionRoute: '/investment-radar',
        },
        margin: {
          tone: 'on-track',
          label: "Why it's strong",
          body: 'Margin is healthy and stable.',
          action: 'See drivers',
          actionRoute: '/investment-radar',
        },
      },
    },
  },
];

// ---------------------------------------------------------------------------
// INVESTMENT RADAR
// ---------------------------------------------------------------------------

// DACH re-skin: four broad categories. Fewer, broader categories shown well.
export type InvestmentCategoryId =
  | 'hcp-training'
  | 'field-activity'
  | 'marketing'
  | 'events-kol';

export interface InvestmentCell {
  marketId: string;
  spendEur: number;          // €K
  proxyKpi: string;          // short label
  proxyKpiValue: string;     // formatted
  tone: SignalTone;
}

export interface InvestmentCategory {
  id: InvestmentCategoryId;
  name: string;
  proxyKpiDefinition: string;
  cells: InvestmentCell[];
}

// Four broad categories, three DACH market columns. Spend figures roll up the
// finer-grained activities into each broad category. Default selected cell:
// HCP training and follow-up × Germany.
export const investmentRadar: InvestmentCategory[] = [
  {
    id: 'hcp-training', name: 'HCP training and follow-up',
    proxyKpiDefinition: 'Post-training call frequency within 60 days, weighted by injector potential tier. Includes medical education follow-through.',
    cells: [
      { marketId: 'de', spendEur: 2380, proxyKpi: '60-day follow-up', proxyKpiValue: '44%', tone: 'at-risk' },
      { marketId: 'ch', spendEur: 320, proxyKpi: '60-day follow-up', proxyKpiValue: '73%', tone: 'on-track' },
      { marketId: 'at', spendEur: 660, proxyKpi: '60-day follow-up', proxyKpiValue: '62%', tone: 'watch' },
    ],
  },
  {
    id: 'field-activity', name: 'Field activity',
    proxyKpiDefinition: 'Reach, frequency, priority target coverage, and account plan progression on priority accounts.',
    cells: [
      { marketId: 'de', spendEur: 3670, proxyKpi: 'Priority target coverage', proxyKpiValue: '78%', tone: 'on-track' },
      { marketId: 'ch', spendEur: 760, proxyKpi: 'Priority target coverage', proxyKpiValue: '81%', tone: 'on-track' },
      { marketId: 'at', spendEur: 880, proxyKpi: 'Priority target coverage', proxyKpiValue: '74%', tone: 'on-track' },
    ],
  },
  {
    id: 'marketing', name: 'Marketing',
    proxyKpiDefinition: 'Spend vs growth trend alignment, campaign follow-through in Veeva, target overlap. Includes digital and local initiatives.',
    cells: [
      { marketId: 'de', spendEur: 3380, proxyKpi: 'Target overlap', proxyKpiValue: '49%', tone: 'at-risk' },
      { marketId: 'ch', spendEur: 360, proxyKpi: 'Target overlap', proxyKpiValue: '74%', tone: 'on-track' },
      { marketId: 'at', spendEur: 570, proxyKpi: 'Target overlap', proxyKpiValue: '64%', tone: 'watch' },
    ],
  },
  {
    id: 'events-kol', name: 'Events and KOL',
    proxyKpiDefinition: 'Post-event follow-up activity with attendees, planned KOL activity completion, account plan updates.',
    cells: [
      { marketId: 'de', spendEur: 1300, proxyKpi: 'Attendee follow-up', proxyKpiValue: '66%', tone: 'on-track' },
      { marketId: 'ch', spendEur: 340, proxyKpi: 'Attendee follow-up', proxyKpiValue: '73%', tone: 'on-track' },
      { marketId: 'at', spendEur: 460, proxyKpi: 'Attendee follow-up', proxyKpiValue: '66%', tone: 'on-track' },
    ],
  },
];

// Recommendation for the default-selected cell: HCP training × Germany
export const germanyHcpTrainingRecommendation = {
  eyebrow: 'Ariya recommends · Investment view',
  pill: 'Fix execution, not selection',
  headerMeta: 'Germany · HCP training · 21 May',
  situation:
    'Germany Xeomin injection training is invested and the right injectors are selected. 44% of trained injectors received a follow-up call within 60 days, vs the agreed 65% cadence. 52 high-potential trained injectors sit below the follow-up threshold.',
  recommendation:
    'Run a 60-day Germany follow-up sprint targeting the 52 high-potential trained injectors, owned by the Germany NSM with first-line manager accountability.',
  reasoning:
    'The investment selection itself is defensible: training participation is concentrated in high and medium potential injectors. The break point is post-training execution. Closing the follow-up gap is a higher-confidence first move, funded within the existing budget.',
  whyBullets: [
    {
      lead: 'Selection is defensible.',
      body: 'Training participation is concentrated in high and medium potential injectors. The mix mirrors the healthy DACH pattern.',
    },
    {
      lead: 'The break point is post-training execution.',
      body: '44% of trained injectors received a follow-up call within 60 days vs the agreed 65% cadence. 52 high-potential trained injectors are below the threshold.',
    },
    {
      lead: 'Closing the follow-up gap is the higher-confidence first move.',
      body: 'It is operationally bounded and uses the existing investment envelope. Total Germany budget is unchanged.',
    },
  ],
  confidence: 'Medium' as Confidence,
  confidenceRationale:
    'Veeva follow-up data is reliable. Linking follow-up to revenue is directional, not causal.',
  conditions: [
    'High-potential trained injector list confirmed by Germany commercial ops',
    'Germany NSM owns the 60-day follow-up cadence',
    'First-line managers track post-training engagement weekly',
    'Review at 60 days, then decide on cohort 2',
  ],
  nextActions: [
    { action: 'Confirm high-potential trained injector list', owner: 'Germany commercial ops', timeframe: 'Within 5 days', priority: true },
    { action: 'Launch 60-day follow-up sprint', owner: 'Germany NSM', timeframe: 'Within 10 days', priority: true },
    { action: 'Weekly progress check with first-line managers', owner: 'Germany NSM', timeframe: 'Weekly' },
  ],
  nextActionsMeta: '3 steps · 10-day kickoff',
  sources: ['Training participation', 'Veeva activity', 'HCP segmentation'],
  footerMeta: 'Reversible · revisit at 60 days',
} as const;

// ---------------------------------------------------------------------------
// STRATEGIC CHAIN LINK
// ---------------------------------------------------------------------------
//
// Reusable "Part of: …" link that wires diagnostic-altitude recommendations
// (Investment Radar, Customer & Account Focus, etc.) back to the strategic
// recommendation that lives on GM Home. The link target is the
// `recommendation-anchor` element on GM Home, so the user lands on
// the right section without needing to scroll.

export const strategicChainLink = {
  label: 'Part of: Fix Germany follow-up cadence',
  to: '/#recommendation-anchor',
} as const;

// ---------------------------------------------------------------------------
// EXECUTION SIGNALS
// ---------------------------------------------------------------------------

export interface ExecutionSignal {
  id: string;
  title: string;
  description: string;
  count: number;
  unit: string;
  marketBreakdown: { marketId: string; count: number }[];
  owner: string;
  tone: SignalTone;
  source: string;
}

export const executionSignals: ExecutionSignal[] = [
  {
    id: 'trained-not-visited',
    title: 'High-potential trained injectors not visited within 60 days',
    description:
      'Injectors who completed Xeomin injection training but did not receive a field follow-up within the 60-day window. 71 across DACH; 52 sit in Germany, the largest single concentration.',
    count: 71,
    unit: 'injectors',
    marketBreakdown: [
      { marketId: 'de', count: 52 },
      { marketId: 'at', count: 14 },
      { marketId: 'ch', count: 5 },
    ],
    owner: 'Germany NSM, Austria NSM',
    tone: 'at-risk',
    source: 'Veeva · refreshed daily',
  },
  {
    id: 'below-expected-call-freq',
    title: 'Training participants below expected post-training call frequency',
    description:
      'Trained injectors receiving fewer than 2 calls in the 90 days following training. Threshold defined per priority tier.',
    count: 98,
    unit: 'injectors',
    marketBreakdown: [
      { marketId: 'de', count: 64 },
      { marketId: 'at', count: 22 },
      { marketId: 'ch', count: 12 },
    ],
    owner: 'Germany NSM, Austria NSM',
    tone: 'at-risk',
    source: 'Veeva · refreshed daily',
  },
  {
    id: 'under-covered-priority-accounts',
    title: 'Priority accounts under-covered despite investment',
    description:
      'Priority accounts with active commercial investment but field coverage below the planned cadence over the last quarter.',
    count: 16,
    unit: 'Accounts',
    marketBreakdown: [
      { marketId: 'de', count: 9 },
      { marketId: 'at', count: 4 },
      { marketId: 'ch', count: 3 },
    ],
    owner: 'National sales managers',
    tone: 'watch',
    source: 'Veeva, finance · refreshed weekly',
  },
  {
    id: 'no-followup-logged',
    title: 'Veeva follow-up not logged after training',
    description:
      'Training events with no associated Veeva follow-up activity recorded in the 30 days after the event.',
    count: 29,
    unit: 'Events',
    marketBreakdown: [
      { marketId: 'de', count: 18 },
      { marketId: 'at', count: 8 },
      { marketId: 'ch', count: 3 },
    ],
    owner: 'First-line managers',
    tone: 'watch',
    source: 'Veeva · refreshed daily',
  },
  {
    id: 'volume-without-quality',
    title: 'Strong activity volume but weak target quality',
    description:
      'Territories where call volume exceeds expected but priority injector coverage is below the planned share.',
    count: 11,
    unit: 'Territories',
    marketBreakdown: [
      { marketId: 'de', count: 8 },
      { marketId: 'at', count: 3 },
    ],
    owner: 'First-line managers',
    tone: 'watch',
    source: 'Veeva · refreshed daily',
  },
  {
    id: 'plan-actions-overdue',
    title: 'Country plan actions overdue',
    description:
      'Actions committed in the country plan past their target completion date.',
    count: 13,
    unit: 'Actions',
    marketBreakdown: [
      { marketId: 'de', count: 7 },
      { marketId: 'at', count: 4 },
      { marketId: 'ch', count: 2 },
    ],
    owner: 'National sales managers',
    tone: 'watch',
    source: 'Country plans · refreshed weekly',
  },
];

// ---------------------------------------------------------------------------
// HCP SEGMENTS (Customer and Account Focus)
// ---------------------------------------------------------------------------

export interface HcpSegment {
  id: string;
  marketId: string;
  name: string;
  potentialTier: 'High' | 'Medium' | 'Low';
  count: number;
  trainedPct: number;
  followedUpWithin60dPct: number;
  suggestedAction: string;
  // Account-level growth proxy: segment-weighted growth vs LY for the trained subset.
  // Signed percent. Illustrative.
  growthVsLyPct: number;
}

export const hcpSegments: HcpSegment[] = [
  { id: 'de-derm-high', marketId: 'de', name: 'Xeomin injectors, high potential', potentialTier: 'High',
    count: 188, trainedPct: 70, followedUpWithin60dPct: 44, growthVsLyPct: -2.8,
    suggestedAction: 'Germany follow-up sprint, priority cohort. 52 high-potential injectors below the 60-day cadence.' },
  { id: 'de-derm-med', marketId: 'de', name: 'Xeomin injectors, medium potential', potentialTier: 'Medium',
    count: 264, trainedPct: 52, followedUpWithin60dPct: 51, growthVsLyPct: -1.2,
    suggestedAction: 'Selective post-training follow-up among recent trainees.' },
  { id: 'de-plastic-high', marketId: 'de', name: 'Plastic surgery injectors, high potential', potentialTier: 'High',
    count: 96, trainedPct: 66, followedUpWithin60dPct: 47, growthVsLyPct: -1.8,
    suggestedAction: 'Add to Germany follow-up sprint, secondary cohort.' },
  { id: 'de-aesthetic-low', marketId: 'de', name: 'Aesthetic injectors, low potential', potentialTier: 'Low',
    count: 172, trainedPct: 24, followedUpWithin60dPct: 33, growthVsLyPct: -0.5,
    suggestedAction: 'Deprioritise for now. Revisit selection criteria.' },

  { id: 'ch-derm-high', marketId: 'ch', name: 'Xeomin injectors, high potential', potentialTier: 'High',
    count: 84, trainedPct: 67, followedUpWithin60dPct: 73, growthVsLyPct: 4.6,
    suggestedAction: 'Sustain momentum, monitor as training scales.' },
  { id: 'ch-plastic-high', marketId: 'ch', name: 'Plastic surgery injectors, high potential', potentialTier: 'High',
    count: 48, trainedPct: 62, followedUpWithin60dPct: 71, growthVsLyPct: 3.1,
    suggestedAction: 'Maintain current cadence.' },

  { id: 'at-derm-high', marketId: 'at', name: 'Xeomin injectors, high potential', potentialTier: 'High',
    count: 102, trainedPct: 64, followedUpWithin60dPct: 62, growthVsLyPct: 0.4,
    suggestedAction: 'Lift follow-up toward benchmark. 14 high-potential injectors below the 60-day cadence.' },
  { id: 'at-derm-med', marketId: 'at', name: 'Xeomin injectors, medium potential', potentialTier: 'Medium',
    count: 138, trainedPct: 49, followedUpWithin60dPct: 58, growthVsLyPct: -0.3,
    suggestedAction: 'Maintain current cadence.' },
];

export const germanyHighPotentialInjectorRecommendation = {
  eyebrow: 'Ariya recommends · Segment view',
  pill: 'Priority cohort identified',
  headerMeta: 'Germany · High-potential Xeomin injectors · 21 May',
  situation:
    'German high-potential Xeomin injectors are well-trained (70%) but post-training 60-day follow-up sits at 44%, below the agreed 65% cadence. 52 high-potential injectors sit below the cadence, the single cohort most consistent with the Germany commercial gap.',
  recommendation:
    'Make German high-potential Xeomin injectors the priority cohort for the 60-day follow-up sprint. Define field cadence and first-line manager check-ins.',
  reasoning:
    'Selection has been defensible. Execution discipline is the break point. Concentrating attention here is the highest-leverage operational move available within the existing budget.',
  whyBullets: [
    {
      lead: 'Training coverage is solid.',
      body: '70% of German high-potential Xeomin injectors are trained, in line with the healthy DACH benchmark for the segment.',
    },
    {
      lead: 'Follow-up is the break point.',
      body: 'Post-training 60-day follow-up sits at 44%, vs 73% in Switzerland and 62% in Austria. 52 high-potential injectors sit below the cadence, the cohort most consistent with the Germany commercial gap.',
    },
    {
      lead: 'Highest leverage within the existing budget.',
      body: 'Concentrating field attention here changes commercial signal without adding spend.',
    },
  ],
  confidence: 'Medium' as Confidence,
  confidenceRationale:
    'Segment-level Veeva data is reliable. Causal linkage to Xeomin sales remains directional.',
  conditions: [
    'Field cadence defined and committed by the Germany NSM',
    'First-line managers track follow-up weekly',
    'Status reviewed at 60 days against revenue and Veeva signals',
  ],
  nextActions: [
    { action: 'Schedule follow-up sprint kickoff', owner: 'Germany NSM', timeframe: 'Within 7 days', priority: true },
    { action: 'Assign first-line manager owners per territory', owner: 'Germany NSM', timeframe: 'Within 7 days', priority: true },
  ],
  nextActionsMeta: '2 steps · 7-day horizon',
  sources: ['Veeva activity', 'HCP segmentation', 'Training participation'],
  footerMeta: 'Reversible · revisit at 60 days',
} as const;

// ---------------------------------------------------------------------------
// SCENARIO PLANNER
// ---------------------------------------------------------------------------

export interface ScenarioOutcomeSeries {
  month: number;     // 0..6
  conservative: number;
  base: number;
  best: number;
}

export const scenarioPlanner = {
  scenarioId: 'redirect-de-followup',
  title: 'Redirect Germany marketing spend toward Xeomin follow-up activation',
  subtitle:
    'Directional impact under explicit assumptions. Not a forecast.',
  centralAssumption:
    'Germany improves 60-day follow-up coverage among high-potential trained injectors from 44% to at least 65%.',
  defaultReallocationPct: 10,
  reallocationRangePct: { min: 0, max: 25 },
  outcomes: {
    // Indexed net commercial impact, baseline = 100 at month 0.
    // These three series are used to render a confidence band (best / base / conservative).
    base: [
      { month: 0, value: 100 },
      { month: 1, value: 100.4 },
      { month: 2, value: 101.0 },
      { month: 3, value: 101.6 },
      { month: 4, value: 102.1 },
      { month: 5, value: 102.4 },
      { month: 6, value: 102.6 },
    ],
    conservative: [
      { month: 0, value: 100 },
      { month: 1, value: 100.1 },
      { month: 2, value: 100.3 },
      { month: 3, value: 100.5 },
      { month: 4, value: 100.7 },
      { month: 5, value: 100.8 },
      { month: 6, value: 100.9 },
    ],
    best: [
      { month: 0, value: 100 },
      { month: 1, value: 100.6 },
      { month: 2, value: 101.5 },
      { month: 3, value: 102.4 },
      { month: 4, value: 103.2 },
      { month: 5, value: 103.7 },
      { month: 6, value: 103.9 },
    ],
  },
  assumptions: [
    { text: 'Germany follow-up coverage among high-potential trained injectors improves to 65%+ within 60 days.', source: 'Germany commercial operations commitment.' },
    { text: 'Redirected budget stays within Germany, moving from marketing campaigns to follow-up activation. Total Germany commercial spend unchanged.', source: 'Investment Radar.' },
    { text: 'No price or supply disruption during the 6-month window.', source: 'Finance, supply.' },
    { text: 'No competitive event materially shifts category dynamics over the window.', source: 'Market research.' },
  ],
  conditionsRequiredToHold: [
    'Germany follow-up coverage improves within 60 days',
    'Redirected budget stays within Germany toward follow-up activation',
  ],
  // When a condition is unchecked, widen the band toward conservative on the upside cap and toward 99 on the floor.
  conditionEffects: {
    'Germany follow-up coverage improves within 60 days': { widenBandBy: 0.6 },
    'Redirected budget stays within Germany toward follow-up activation': { widenBandBy: 0.4 },
  },
  operationalChain: [
    { node: 'HCP selection', status: 'Verified' as Status },
    { node: 'Training', status: 'Verified' as Status },
    {
      node: '60-day follow-up',
      status: 'At Risk' as Status,
      focus: true,
      focusNote: 'This is where the follow-up gap sits. The redirect targets this step.',
    },
  ] as { node: string; status: Status; focus?: boolean; focusNote?: string }[],
  // Declared statements about how the scenario plays out. These are not
  // togglable knobs, they are the premises under which the directional
  // impact holds.
  scenarioAssumptions: [
    'Germany follow-up coverage among high-potential trained injectors improves within 60 days',
    'Redirected budget stays within Germany toward follow-up activation',
    'No price or supply disruption during the 6-month window',
    'No competitive event materially shifts category dynamics',
  ],
  // Underlying data sources powering the model. Format: "{source} · {what
  // we're pulling from it}". Distinct from scenarioAssumptions: these are
  // inputs, not premises.
  dataInputs: [
    { source: 'Sales or order signals', description: 'Germany Xeomin run-rate, last 6 months' },
    { source: 'Veeva activity', description: 'trained-injector follow-up coverage' },
    { source: 'Training participation', description: 'participation, completion, cost per injector' },
    { source: 'HCP segmentation', description: 'high-potential injector list, Germany' },
    { source: 'Brand-plan context', description: 'response curves by category' },
    { source: 'Plan or forecast data', description: 'committed vs. flexible spend, by book' },
  ],
  recommendation: {
    eyebrow: 'Ariya recommends · Scenario answer',
    pill: 'Redirect within Germany',
    headerMeta: 'Generated for DACH Leadership · 21 May',
    situation:
      'Redirecting 10% of Germany marketing budget toward Xeomin follow-up activation produces a directional net positive of ~2.5 index points over 6 months in the base case, conditional on Germany follow-up improvement. Total Germany commercial spend is unchanged.',
    // Headline aligned to the hero recommendation on DACH Overview / Ask
    // Ariya so the whole flow tells one story.
    recommendation:
      'Fix follow-up cadence on the Germany high-potential Xeomin injector cohort.',
    reasoning:
      'Germany already has the trained injectors and the budget. The gap is execution, not investment. The redirect stays within Germany, funded from existing marketing budget toward follow-up activation.',
    // Why bullets mirror the hero pattern, tightened to the scenario context
    // (the redirect slider) without inventing a different narrative.
    whyBullets: [
      {
        lead: 'Germany has the runway.',
        body: 'High-potential Xeomin injectors are already trained in Germany. The redirected budget funds follow-through on training already delivered, not new programs.',
      },
      {
        lead: 'The redirect stays within Germany.',
        body: 'Budget moves from marketing campaigns to follow-up activation, both in Germany. Field force and priority account coverage stay protected. Total Germany commercial spend is unchanged.',
      },
      {
        lead: 'Bounded and reversible.',
        body: 'This scenario shows the directional impact of redirecting up to 25% of Germany marketing toward follow-up activation. The actual redirect is not committed at the slider position.',
      },
    ],
    confidence: 'Medium' as Confidence,
    confidenceRationale:
      'Data completeness is moderate. Account-level linkage and market-level confounders require validation. Treat as directional, not deterministic.',
    conditions: [
      'High-potential trained injector list confirmed',
      'National sales manager owns execution',
      'Redirected budget stays within Germany toward follow-up activation',
      'Follow-up cadence defined',
      'First-line managers track post-training engagement',
      'Review after 60 days',
    ],
    nextActions: [
      { action: 'Run Germany high-potential injector follow-up sprint', owner: 'Germany NSM', timeframe: '60 days', priority: true },
      { action: 'Protect Germany priority account coverage', owner: 'Germany NSM', timeframe: 'Immediate', priority: true },
      { action: 'Reassess after 60 days', owner: 'DACH Leadership', timeframe: '60 days' },
      { action: 'Decide whether to expand the redirect', owner: 'DACH Leadership', timeframe: 'Q3 planning' },
    ],
    nextActionsMeta: '4 steps · spans to Q3 planning',
    // Same six sources the hero block calls out on DACH Overview, so
    // "sources used" reads as the same list everywhere the recommendation
    // surfaces.
    sources: [
      'Veeva activity',
      'Training participation',
      'HCP segmentation',
      'Sales or order signals',
      'Plan or forecast data',
      'Brand-plan context',
    ],
    footerMeta: 'Reversible · revisit at 60 days',
  },
  alternateScenarios: [
    { id: 'germany-followup-only', label: 'Increase follow-up for trained injectors (Germany)', enabled: false },
    { id: 'dach-compare', label: 'Compare follow-up cadence across DACH markets', enabled: false },
  ],
} as const;

// ---------------------------------------------------------------------------
// ASK ARIYA scripted Q&A
// ---------------------------------------------------------------------------

export interface AriyaExchange {
  id: string;
  question: string;
  // Visual weight of the answer once it is drafted. `full` renders the rich
  // AssemblyAnswer; `compact` is the lighter variant. Hero defaults to `full`.
  weight?: 'full' | 'compact';
  // Used by Tier 3 ("More questions, by source") rows. The id matches one of
  // overview.assemblySources (e.g. 'market-perf', 'crm', 'training',
  // 'segmentation', 'finance', 'market-context'). The empty state renders
  // the source name on the left of the row.
  boundSource?: string;
  // Structured response, rendered via AssemblyAnswer or PlaceholderAnswer in
  // the chat surface depending on the `placeholder` flag.
  response: {
    // When true, the chat surface renders the PlaceholderAnswer component
    // (recognised-question copy + "Ask the hero question" link) instead of
    // the full AssemblyAnswer. Used for non-hero exchanges whose copy has
    // not been drafted yet.
    placeholder?: boolean;
    recommendedAction: string;
    reasoning: string;
    scenarioView: string;
    requiredConditions: string[];
    recommendedNextActions: { action: string; owner: string; timeframe: string; priority?: boolean }[];
    sources: string[];
    confidence: Confidence;
    confidenceRationale: string;
    linksTo?: { label: string; route: string }[];
    // Optional richer fields for the showcase scenarios. When present, the
    // RecommendationCard renders the navy badge under the eyebrow, structured
    // WHY bullets, header meta strings, and footer meta.
    pill?: string;
    whyBullets?: { lead: string; body: string }[];
    headerMeta?: string;        // e.g. "Generated for Europe Leadership · 21 May"
    nextActionsMeta?: string;   // e.g. "4 steps · spans to Q3 planning"
    footerMeta?: string;        // e.g. "Reversible · revisit at 60 days"
    // Used only by the AssemblyAnswer renderer on Ask Ariya. Each item ties a
    // single sentence of reasoning to one of the sources in `sources`. When
    // present, AssemblyAnswer renders the chain row-by-row between the Sources
    // strip and the recommended action; when absent, it falls back to the
    // single `reasoning` paragraph.
    reasoningChain?: { source: string; text: string }[];
  };
}

// Boilerplate response for not-yet-drafted exchanges. The AskAriya page
// detects `response.placeholder === true` and renders the PlaceholderAnswer
// component instead of fabricating an answer. Individual exchanges flip the
// flag off as their copy gets drafted in subsequent passes.
const PLACEHOLDER_RESPONSE: AriyaExchange['response'] = {
  placeholder: true,
  recommendedAction: '',
  reasoning: '',
  scenarioView: '',
  requiredConditions: [],
  recommendedNextActions: [],
  sources: [],
  confidence: 'Medium',
  confidenceRationale: '',
};

export const askAriya: AriyaExchange[] = [
  {
    // Hero exchange. The one place where the full assembly chain plays out
    // on screen, source by source, reasoning row by reasoning row. Other
    // pages link here via /ask-ariya?q=germany-60d-checkpoint, and the Dig
    // Deeper bridge on DACH Overview routes to the same id.
    id: 'germany-60d-checkpoint',
    question: 'If we run the Germany sprint, what does the 60-day checkpoint look like and what is the next decision?',
    weight: 'full',
    response: {
      recommendedAction:
        'Fix follow-up cadence on the Germany high-potential Xeomin injector cohort.',
      reasoning:
        'Germany Xeomin share is slipping and the slope is directionally aligned with the post-training follow-up gap. Selection of trained injectors in Germany is defensible: 70% of high-potential injectors are trained, in line with the healthy DACH benchmark. The break point is post-training execution. 44% of trained German high-potential injectors receive a follow-up within 60 days, vs 73% in Switzerland and 62% in Austria. The gap is concentrated in the cohort that matters most to Xeomin Germany outcomes.',
      scenarioView:
        'Closing the Germany follow-up gap is operationally bounded and within the existing budget. The optional redirect of Germany marketing budget toward follow-up activation stays within Germany. Total Germany commercial spend is unchanged.',
      requiredConditions: [
        'High-potential trained injector list confirmed by Germany commercial operations',
        'Germany NSM owns the 60-day follow-up cadence',
        'First-line managers track post-training engagement weekly',
        'Any redirect stays within Germany toward follow-up activation',
        'Review at 60 days using Veeva follow-up and performance signals',
      ],
      recommendedNextActions: [
        { action: 'Confirm Germany high-potential trained injector list', owner: 'Germany commercial ops', timeframe: 'Within 5 days', priority: true },
        { action: 'Launch 60-day follow-up sprint', owner: 'Germany NSM', timeframe: 'Within 10 days', priority: true },
        { action: 'Install weekly first-line manager tracking', owner: 'Germany NSM', timeframe: 'Within 14 days' },
        { action: 'Reassess at 60 days, then decide on the redirect scope', owner: 'DACH Leadership', timeframe: '60 days' },
      ],
      sources: [
        'Veeva activity',
        'Training participation',
        'HCP segmentation',
        'Sales or order signals',
        'Plan or forecast data',
        'Brand-plan context',
      ],
      reasoningChain: [
        { source: 'Sales or order signals', text: 'Germany Xeomin share is slipping into Q2, while Switzerland and Austria hold.' },
        { source: 'Training participation', text: 'Germany high-potential injectors are trained at 70%, in line with the healthy DACH benchmark.' },
        { source: 'Veeva activity', text: 'Germany 60-day post-training follow-up sits at 44% in the high-potential injector segment, vs 73% in Switzerland and 62% in Austria.' },
        { source: 'HCP segmentation', text: 'German high-potential injectors are the largest single below-cadence cohort, 52 of 71 across DACH.' },
        { source: 'Plan or forecast data', text: 'Germany investment intensity is 17.2%, the highest in DACH. The Germany gap is execution, not spend.' },
        { source: 'Brand-plan context', text: 'No competitive event or supply disruption explains the Germany slope over the window.' },
      ],
      confidence: 'Medium',
      confidenceRationale:
        'Segment-level proxy KPIs are reliable. Account-level linkage between follow-up and revenue is directional, not causal.',
      linksTo: [
        { label: 'Open in Scenario Planner', route: '/scenario-planner' },
        { label: 'Open Source Confidence', route: '/source-confidence' },
        { label: 'Log this decision', route: '/decision-log?from=ask-ariya' },
      ],
    },
  },
  // ─────────────────────────────────────────────────────────────────────
  // Non-hero exchanges (Tier 1, Tier 2, Tier 3). Response copy for these
  // is intentionally left as placeholder in v1: the AskAriya page detects
  // `response.placeholder === true` and renders the PlaceholderAnswer
  // component instead of a fake assembled answer. Copy is drafted one
  // exchange at a time in subsequent passes.
  // ─────────────────────────────────────────────────────────────────────

  // Tier 1 · Pressure-test the recommendation: Germany follow-up sprint
  {
    id: 'germany-downside-60d',
    question: "What's the downside if Germany follow-up doesn't improve at 60 days?",
    weight: 'full',
    response: PLACEHOLDER_RESPONSE,
  },
  {
    id: 'germany-redirect-sizing',
    question: 'How much Germany marketing budget could we redirect to follow-up activation without hurting coverage?',
    weight: 'full',
    response: PLACEHOLDER_RESPONSE,
  },
  {
    id: 'germany-selection-alternative',
    question: 'Why focus on follow-up instead of revisiting which German injectors we trained?',
    weight: 'full',
    response: PLACEHOLDER_RESPONSE,
  },

  // Tier 2 · Other open decisions
  {
    id: 'switzerland-watch',
    question: 'Is Switzerland at risk of repeating the Germany follow-up pattern as training scales?',
    weight: 'compact',
    response: PLACEHOLDER_RESPONSE,
  },
  {
    id: 'austria-cohort-update',
    question: 'What does the Austria below-cadence cohort look like, and who owns it?',
    weight: 'compact',
    response: PLACEHOLDER_RESPONSE,
  },
  {
    id: 'kol-germany-austria',
    question: 'Are the KOL engagement plans for Germany and Austria still on track?',
    weight: 'compact',
    response: PLACEHOLDER_RESPONSE,
  },

  // Tier 3 · More questions, by source
  {
    id: 'src-market-slipping',
    question: 'Which DACH markets are slipping fastest on Xeomin right now?',
    boundSource: 'sales',
    weight: 'compact',
    response: PLACEHOLDER_RESPONSE,
  },
  {
    id: 'src-veeva-followup',
    question: 'Where is post-training follow-up discipline weakest across DACH?',
    boundSource: 'veeva',
    weight: 'compact',
    response: PLACEHOLDER_RESPONSE,
  },
  {
    id: 'src-training-misfit',
    question: 'Are we training the right injectors everywhere we run programs?',
    boundSource: 'training',
    weight: 'compact',
    response: PLACEHOLDER_RESPONSE,
  },
  {
    id: 'src-segmentation-coverage',
    question: 'Which high-potential injector segments are most under-covered today?',
    boundSource: 'segmentation',
    weight: 'compact',
    response: PLACEHOLDER_RESPONSE,
  },
  {
    id: 'src-forecast-misalignment',
    question: 'Where is commercial investment intensity most out of line with growth?',
    boundSource: 'forecast',
    weight: 'compact',
    response: PLACEHOLDER_RESPONSE,
  },
  {
    id: 'src-context-signals',
    question: 'Are any external signals likely to shift the Germany or Austria picture in the next quarter?',
    boundSource: 'brand-plan',
    weight: 'compact',
    response: PLACEHOLDER_RESPONSE,
  },
];

// ---------------------------------------------------------------------------
// DECISION LOG
// ---------------------------------------------------------------------------

export interface DecisionLogEntry {
  id: string;
  date: string; // Mon DD, YYYY
  decision: string;
  owner: string;
  marketAndBrand: string;
  evidenceUsed: string[];
  assumptions: string[];
  expectedImpact: string;
  actionsAssigned: { action: string; owner: string; due: string }[];
  followUpDate: string;
  triggerForReassessment: string;
  status: Status;
  alternativesConsidered?: { option: string; rejected: string }[];
  // Provenance is kept in the data for future analytics but is not surfaced in the UI.
  // All decisions are taken manually by humans; the source distinction adds no signal at the log level.
  source?: 'Manual' | 'Scenario Planner' | 'Ask Ariya';
}

export const decisionLog: DecisionLogEntry[] = [
  {
    id: 'd-001',
    date: 'May 12, 2026',
    // Aligned to the hero recommendation wording from DACH Overview / Ask
    // Ariya (germany-60d-checkpoint) so the log entry visibly ties back to
    // the recommendation that produced it.
    decision: 'Fix follow-up cadence on the Germany high-potential Xeomin injector cohort.',
    owner: 'DACH Leadership',
    marketAndBrand: 'Germany · Xeomin',
    // Evidence row mirrors the hero's anchor numbers: the 44% vs 65% cadence
    // and the Germany-specific 52-of-71 cohort.
    evidenceUsed: [
      'Germany 44% follow-up vs the agreed 65% cadence (73% Switzerland, 62% Austria)',
      '52 high-potential trained injectors in Germany without 60-day contact (out of 71 across DACH)',
      'Germany Xeomin injection training already invested',
      'Six sources synthesised: Veeva activity, Training participation, HCP segmentation, Sales or order signals, Plan or forecast data, Brand-plan context',
    ],
    assumptions: [
      'High-potential trained injector list confirmed by Germany commercial operations',
      'Germany NSM owns the 60-day follow-up cadence',
      'Any redirect stays within Germany toward follow-up activation',
    ],
    expectedImpact: 'Directional commercial recovery within 60 days, measured via Veeva follow-up rate and Xeomin Germany run-rate.',
    actionsAssigned: [
      { action: 'Confirm high-potential trained injector list', owner: 'Germany commercial ops', due: 'May 17, 2026' },
      { action: 'Launch follow-up sprint', owner: 'Germany NSM', due: 'May 22, 2026' },
    ],
    followUpDate: 'Jul 11, 2026',
    triggerForReassessment: 'Germany follow-up rate below 55% at 30 days · trained injector list not confirmed within 5 days',
    status: 'Active',
    alternativesConsidered: [
      {
        option: 'Increase HCP training budget in Germany',
        rejected:
          'Training participation is already concentrated in high-potential injectors. The break point is post-training execution, not selection or volume.',
      },
      {
        option: 'Defer the follow-up sprint to the next planning cycle',
        rejected:
          'Would leave 52 high-potential injectors below cadence and let the share slope continue. The sprint is operationally bounded and runs within the existing budget.',
      },
    ],
    source: 'Manual',
  },
  {
    id: 'd-002',
    date: 'May 14, 2026',
    decision: 'Test redirecting a share of Germany marketing budget toward follow-up activation, within Germany.',
    owner: 'DACH Leadership',
    marketAndBrand: 'Germany · Xeomin',
    evidenceUsed: ['Germany marketing-campaigns target overlap 49%', 'Germany priority account coverage 78%'],
    assumptions: ['Redirected budget stays within Germany', 'Total Germany commercial spend unchanged'],
    expectedImpact: 'Preserves field force and priority account coverage. Concentrates budget on follow-up activation.',
    actionsAssigned: [
      { action: 'Identify lower-response marketing activities to redirect', owner: 'Germany BU lead', due: 'May 24, 2026' },
    ],
    followUpDate: 'Jun 14, 2026',
    triggerForReassessment: 'Germany growth vs plan worsens beyond −4% · Q2 mid-quarter check',
    status: 'On Track',
    alternativesConsidered: [
      {
        option: 'Apply an across-the-board cut to Germany marketing immediately',
        rejected:
          'Risks priority account coverage and field force capacity without isolating which activities actually underperform. Investment Radar diagnosis required first.',
      },
      {
        option: 'Maintain current Germany marketing mix with no diagnostic',
        rejected:
          'Leaves a visible underperformance signal unaddressed and removes the case for a within-Germany redirect.',
      },
    ],
    source: 'Ask Ariya',
  },
  {
    id: 'd-003',
    date: 'May 8, 2026',
    decision: 'Continue Switzerland investment intensity at current level. Monitor follow-up capacity as training scales.',
    owner: 'Switzerland BU head',
    marketAndBrand: 'Switzerland · Xeomin',
    evidenceUsed: ['Switzerland growth vs plan +2.6%', 'Switzerland 60-day follow-up 73%'],
    assumptions: ['Follow-up capacity keeps pace with the fastest training growth in DACH'],
    expectedImpact: 'Confirms sustainable trajectory before the cohort outgrows follow-up capacity.',
    actionsAssigned: [
      { action: 'Follow-up capacity check at next refresh', owner: 'Switzerland NSM', due: 'Jun 30, 2026' },
    ],
    followUpDate: 'Jun 30, 2026',
    triggerForReassessment: 'Switzerland follow-up rate drops below 68%',
    status: 'On Track',
    alternativesConsidered: [
      {
        option: 'Increase Switzerland investment by 15% in Q2',
        rejected:
          'Momentum is healthy but follow-up capacity is the watch item. Adding spend before capacity is confirmed risks the Germany pattern.',
      },
      {
        option: 'No monitoring until next quarterly review',
        rejected:
          'Switzerland training is scaling fastest in DACH. Early signal matters before the follow-up gap can open.',
      },
    ],
    source: 'Manual',
  },
  {
    id: 'd-004',
    date: 'Apr 28, 2026',
    decision: 'Approve KOL engagement plan for the Xeomin injector segment in Germany and Austria.',
    owner: 'DACH Medical lead',
    marketAndBrand: 'Germany, Austria · Xeomin',
    evidenceUsed: ['High-potential injectors undercovered in Austria', 'KOL planned activity completion 69 to 78%'],
    assumptions: ['Medical and commercial cadence aligned on shared KOL list'],
    expectedImpact: 'Sustains evidence generation and advocacy signals into H2.',
    actionsAssigned: [
      { action: 'Finalise shared KOL list', owner: 'Germany and Austria medical leads', due: 'May 19, 2026' },
    ],
    followUpDate: 'Jul 28, 2026',
    triggerForReassessment: 'KOL planned activity completion below 60%',
    status: 'Verified',
    alternativesConsidered: [
      {
        option: 'Defer KOL engagement plan to H2',
        rejected:
          'Forfeits evidence-generation timing tied to the upcoming congress cycle. Medical and commercial cadence would lose Q2-Q3 alignment.',
      },
      {
        option: 'Limit KOL plan to Germany only',
        rejected:
          'Austrian high-potential injectors are an undercovered cohort. Equal attention keeps the Austria follow-up trajectory on benchmark.',
      },
    ],
    source: 'Manual',
  },
];

// ---------------------------------------------------------------------------
// SOURCE CONFIDENCE
// ---------------------------------------------------------------------------

export type ManualValidationStatus = 'Validated' | 'Spot-checked' | 'Not yet validated';

export interface DataSource {
  id: string;
  name: string;
  owner: string;
  lastRefresh: string; // human label
  completenessPct: number;
  knownGaps: string[];
  confidencePerRecommendation: { recommendation: string; confidence: Confidence }[];
  caveats: string[];
  // Whether a human has hand-validated the source for the demo scenario.
  manualValidationStatus: ManualValidationStatus;
}

// Six DACH sources. Provenance framing for the pilot: selected DACH source
// extracts, with Veeva field mapping by market. Not all fields and spend
// categories are clean yet.
export const sourceConfidence: DataSource[] = [
  {
    id: 'veeva', name: 'Veeva activity', owner: 'DACH Commercial Ops',
    lastRefresh: 'Daily, last May 19, 2026',
    completenessPct: 91,
    knownGaps: ['Follow-up free-text fields not consistently used in DE and AT'],
    confidencePerRecommendation: [
      { recommendation: 'Germany follow-up sprint', confidence: 'High' },
      { recommendation: 'Austria below-cadence cohort', confidence: 'Medium' },
    ],
    caveats: ['Veeva CRM extracts: activity logged ≠ activity completed. Field mapping varies by market.'],
    manualValidationStatus: 'Validated',
  },
  {
    id: 'training', name: 'Training participation', owner: 'DACH Medical Ops',
    lastRefresh: 'Weekly, last May 16, 2026',
    completenessPct: 88,
    knownGaps: ['Some local Xeomin injector events not yet integrated for Q1 2026'],
    confidencePerRecommendation: [
      { recommendation: 'Germany follow-up sprint', confidence: 'High' },
      { recommendation: 'Reassess selection criteria', confidence: 'Medium' },
    ],
    caveats: ['Injector-level linkage to Veeva is partial in DE and AT.'],
    manualValidationStatus: 'Spot-checked',
  },
  {
    id: 'segmentation', name: 'HCP segmentation and targeting', owner: 'DACH Commercial Ops',
    lastRefresh: 'Quarterly, last refresh Q2 2026',
    completenessPct: 84,
    knownGaps: ['Potential tiers not refreshed in Q1 for DE plastic surgery injector segment'],
    confidencePerRecommendation: [
      { recommendation: 'High-potential injector cohort', confidence: 'Medium' },
    ],
    caveats: ['Potential tiering uses 18-month look-back; recent shifts not captured.'],
    manualValidationStatus: 'Spot-checked',
  },
  {
    id: 'sales', name: 'Sales or order signals (IQVIA)', owner: 'DACH BI',
    lastRefresh: 'Daily, last May 19, 2026',
    completenessPct: 96,
    knownGaps: ['Some sub-national volume splits delayed by 2 days'],
    confidencePerRecommendation: [
      { recommendation: 'Germany follow-up sprint', confidence: 'Medium' },
      { recommendation: 'Switzerland watch item', confidence: 'Medium' },
    ],
    caveats: ['Channel-level sales unavailable in some markets.'],
    manualValidationStatus: 'Validated',
  },
  {
    id: 'forecast', name: 'Plan or forecast data', owner: 'DACH Finance',
    lastRefresh: 'Monthly, last May 5, 2026',
    completenessPct: 93,
    knownGaps: ['Local initiative spend categorisation inconsistent across BUs'],
    confidencePerRecommendation: [
      { recommendation: 'Germany within-market redirect', confidence: 'Medium' },
    ],
    caveats: ['Cross-functional cost allocations are approximations.'],
    manualValidationStatus: 'Validated',
  },
  {
    id: 'brand-plan', name: 'Brand-plan context', owner: 'DACH Marketing',
    lastRefresh: 'Project-based, latest study Apr 2026',
    completenessPct: 72,
    knownGaps: ['No 2026 quantitative tracker for DE plastic surgery injector channel'],
    confidencePerRecommendation: [
      { recommendation: 'Germany selection criteria review', confidence: 'Low' },
    ],
    caveats: ['Qualitative inputs cannot replace longitudinal data.'],
    manualValidationStatus: 'Not yet validated',
  },
];

// ---------------------------------------------------------------------------
// OTX WATCHLIST
// ---------------------------------------------------------------------------
//
// Secondary oversight layer. Local sell-out, share, distribution or coverage,
// and activity level for Hepa-Merz, Antidry, Pantogar. Each entry is stamped
// to its single local market. NO cross-market comparison anywhere: each card
// stands alone against its own local context.

export interface OtxMetric {
  label: string;
  value: string;
  tone: SignalTone;
}

export interface OtxWatchEntry {
  id: string;
  brand: string;          // exact spelling
  marketId: string;       // de | ch | at
  localContext: string;   // local context line, no benchmark vs other markets
  metrics: OtxMetric[];
  resourceWatch: string;  // "resource watch" line
  resourceMismatch: boolean; // flags the Watch pill
}

export const otxWatchlist = {
  note: 'Local portfolio watch. No cross-market comparison.',
  entries: [
    {
      id: 'hepa-merz-de',
      brand: 'Hepa-Merz',
      marketId: 'de',
      localContext: 'Germany local watch. Call activity steady, recommendation follow-up in line with the local plan.',
      metrics: [
        { label: 'Local call activity', value: 'Steady', tone: 'on-track' as SignalTone },
        { label: 'Recommendation follow-up', value: 'In line', tone: 'on-track' as SignalTone },
        { label: 'Coverage discipline', value: 'Holding', tone: 'on-track' as SignalTone },
      ],
      resourceWatch: 'Resource use matches local activity. No mismatch flagged.',
      resourceMismatch: false,
    },
    {
      id: 'hepa-merz-at',
      brand: 'Hepa-Merz',
      marketId: 'at',
      localContext: 'Austria local watch. Sell-out steady against the local plan, coverage discipline intact.',
      metrics: [
        { label: 'Local call activity', value: 'Steady', tone: 'on-track' as SignalTone },
        { label: 'Recommendation follow-up', value: 'In line', tone: 'on-track' as SignalTone },
        { label: 'Coverage discipline', value: 'Holding', tone: 'on-track' as SignalTone },
      ],
      resourceWatch: 'Resource use matches local activity. No mismatch flagged.',
      resourceMismatch: false,
    },
    {
      id: 'antidry-ch',
      brand: 'Antidry',
      marketId: 'ch',
      localContext: 'Switzerland local watch. High field activity but local sell-out is flat against the category trend.',
      metrics: [
        { label: 'Sell-out trend', value: 'Flat', tone: 'watch' as SignalTone },
        { label: 'Category share', value: 'Steady', tone: 'on-track' as SignalTone },
        { label: 'Distribution or coverage', value: 'Broad', tone: 'on-track' as SignalTone },
        { label: 'Activity level', value: 'High', tone: 'watch' as SignalTone },
      ],
      resourceWatch: 'High field activity with flat sell-out. Possible resource mismatch worth a local review.',
      resourceMismatch: true,
    },
    {
      id: 'pantogar-de',
      brand: 'Pantogar',
      marketId: 'de',
      localContext: 'Germany local watch, single-market by design. Sell-out and share steady against the local plan.',
      metrics: [
        { label: 'Sell-out', value: 'Steady', tone: 'on-track' as SignalTone },
        { label: 'Share', value: 'Steady', tone: 'on-track' as SignalTone },
        { label: 'Distribution or coverage', value: 'Broad', tone: 'on-track' as SignalTone },
        { label: 'Activity level', value: 'Moderate', tone: 'on-track' as SignalTone },
      ],
      resourceWatch: 'Resource use matches local activity. No mismatch flagged.',
      resourceMismatch: false,
    },
  ] as OtxWatchEntry[],
} as const;

// ---------------------------------------------------------------------------
// ALERTS AND NOTIFICATIONS
// ---------------------------------------------------------------------------
//
// The "works while you sleep" capability. Configurable in-system, email, and
// Teams alerts, plus one low-confidence early-pattern watch item in the feed.

export type AlertChannelId = 'in-system' | 'email' | 'teams';
export type AlertStatus = 'Triggered' | 'Armed' | 'Snoozed';

export interface AlertChannel {
  id: AlertChannelId;
  label: string;
  description: string;
  on: boolean;
}

export interface AlertRule {
  id: string;
  condition: string;
  channels: AlertChannelId[];
  status: AlertStatus;
}

export interface AlertFeedItem {
  id: string;
  timestamp: string;       // human label
  marketId: string;        // de | ch | at
  title: string;
  body: string;
  channels: AlertChannelId[];
  tone: SignalTone;
  confidence?: Confidence; // present on the low-confidence watch item
}

export const alerts = {
  channels: [
    { id: 'in-system', label: 'In-system', description: 'Cockpit bell and the GM Home feed.', on: true },
    { id: 'email', label: 'Email', description: 'Daily digest plus immediate triggers to the owner.', on: true },
    { id: 'teams', label: 'Teams', description: 'Posts to the DACH commercial channel.', on: true },
  ] as AlertChannel[],
  rules: [
    {
      id: 'de-followup-below-60',
      condition: 'Germany Xeomin 60-day follow-up below 60%',
      channels: ['in-system', 'email'],
      status: 'Triggered' as AlertStatus,
    },
    {
      id: 'dach-followup-drop-5pts',
      condition: 'Any DACH market follow-up drops more than 5 points week over week',
      channels: ['teams'],
      status: 'Armed' as AlertStatus,
    },
    {
      id: 'otx-sellout-threshold',
      condition: 'OTx local sell-out share drops below market threshold',
      channels: ['in-system'],
      status: 'Armed' as AlertStatus,
    },
  ] as AlertRule[],
  // Newest first.
  feed: [
    {
      id: 'f-1',
      timestamp: 'May 19, 2026 · 06:40',
      marketId: 'de',
      title: 'Germany Xeomin 60-day follow-up fell to 44%',
      body: 'Below the 60% rule threshold and the agreed 65% cadence. 52 high-potential injectors sit below cadence. Routed to the Germany NSM.',
      channels: ['in-system', 'email'],
      tone: 'at-risk' as SignalTone,
    },
    {
      id: 'f-2',
      timestamp: 'May 18, 2026 · 17:10',
      marketId: 'at',
      title: 'Austria follow-up holding at 62%',
      body: 'Just below the 65% cadence, steady week over week. No rule triggered. Informational.',
      channels: ['in-system'],
      tone: 'watch' as SignalTone,
    },
    {
      id: 'f-3',
      timestamp: 'May 17, 2026 · 09:05',
      marketId: 'ch',
      title: 'Switzerland may be showing the early shape of Germany’s follow-up pattern',
      body: 'Follow-up healthy at 73% today, but training is scaling fastest in DACH. No action yet, reassess at the 60-day checkpoint.',
      channels: ['in-system'],
      tone: 'watch' as SignalTone,
      confidence: 'Low' as Confidence,
    },
  ] as AlertFeedItem[],
} as const;

// ---------------------------------------------------------------------------
// TRAINING-TO-SALES SIGNAL
// ---------------------------------------------------------------------------
//
// Connects trained injector cohorts to later order or sales patterns using
// territory-catchment allocation. Stated as directional, never exact at the
// individual-HCP level. Two cohort series indexed to 100 at the training month
// (month 0), spanning month -3 to +6.

export interface CohortPoint {
  month: number;   // -3 .. +6
  trainedAndFollowedUp: number;
  trainedButUnderFollowed: number;
}

export const trainingToSales = {
  market: 'Germany',
  confidence: 'Medium' as Confidence,
  methodNote:
    'Sales or order signals are allocated directionally to trained injector cohorts using territory catchment and available in-market data. This is intended for management insight, not exact individual-HCP attribution.',
  subtitle: 'Directional. Not exact at individual-HCP level.',
  trainingMonthLabel: 'Training',
  series: [
    { month: -3, trainedAndFollowedUp: 99, trainedButUnderFollowed: 100 },
    { month: -2, trainedAndFollowedUp: 99, trainedButUnderFollowed: 100 },
    { month: -1, trainedAndFollowedUp: 100, trainedButUnderFollowed: 100 },
    { month: 0, trainedAndFollowedUp: 100, trainedButUnderFollowed: 100 },
    { month: 1, trainedAndFollowedUp: 101, trainedButUnderFollowed: 100 },
    { month: 2, trainedAndFollowedUp: 103, trainedButUnderFollowed: 100.5 },
    { month: 3, trainedAndFollowedUp: 105, trainedButUnderFollowed: 100.5 },
    { month: 4, trainedAndFollowedUp: 106, trainedButUnderFollowed: 101 },
    { month: 5, trainedAndFollowedUp: 107, trainedButUnderFollowed: 101 },
    { month: 6, trainedAndFollowedUp: 108, trainedButUnderFollowed: 101 },
  ] as CohortPoint[],
  // Readout numbers at month +6.
  readout: {
    followedUpIndex: 108,
    underFollowedIndex: 101,
    gapPoints: 7,
  },
  caveats: [
    'Cohort allocation uses territory catchment, not individual-HCP linkage.',
    'Order signals lag training; the window shown is illustrative.',
    'No claim of causation. The relationship is directional under stated assumptions.',
  ],
  sources: ['Training participation', 'Veeva activity', 'Sales or order signals'],
} as const;

// ---------------------------------------------------------------------------
// MORNING BRIEFING
// ---------------------------------------------------------------------------
//
// A management note, not a dashboard. Five short sections, each a prioritized
// list of one-line items with an optional owner chip and an optional "Open"
// link to the relevant screen.

export interface BriefingItem {
  text: string;
  owner?: string;       // owner chip, where relevant
  to?: string;          // optional quiet "Open" link to a relevant page
  confidence?: Confidence;  // shown on low-confidence watch items
}

export interface BriefingSection {
  id: string;
  title: string;
  blurb: string;        // one-line section framing
  items: BriefingItem[];
}

export const morningBriefing = {
  dateLabel: 'May 19, 2026',
  standfirst:
    'Five things worth your attention before the day starts. Prioritized, with owners and the next move.',
  sections: [
    {
      id: 'top-changes',
      title: 'Top changes since yesterday',
      blurb: 'What moved, in plain terms.',
      items: [
        { text: 'Germany Xeomin 60-day follow-up slipped to 44%, three points below last month.', to: '/market-performance?market=de' },
        { text: 'Austria training participation rose, follow-up steady at 62%.', to: '/customer-account-focus' },
        { text: 'Switzerland Antidry sell-out flat despite high field activity.', to: '/otx-watchlist' },
      ],
    },
    {
      id: 'signals-attention',
      title: 'Signals requiring attention',
      blurb: 'Proxy signals that crossed a threshold.',
      items: [
        { text: '52 high-potential German injectors sit below the 60-day cadence.', to: '/execution-signals' },
        { text: 'Germany marketing-campaign target overlap at 49%.', to: '/investment-radar' },
      ],
    },
    {
      id: 'questions-to-ask',
      title: 'Questions to ask',
      blurb: 'The questions a sharp analyst would raise.',
      items: [
        { text: 'Which first-line managers own the 52 German injectors below cadence?', to: '/customer-account-focus' },
        { text: 'Is the Germany trained-injector denominator double-counting any cohort?', to: '/source-confidence' },
      ],
    },
    {
      id: 'assigned-overdue',
      title: 'Assigned and overdue',
      blurb: 'Commitments with a clock on them.',
      items: [
        { text: 'Confirm the 52-injector list.', owner: 'Germany NSM', to: '/decision-log' },
        { text: 'Log post-training activity for recent trainees.', owner: 'Austria first-line managers', to: '/execution-signals' },
      ],
    },
    {
      id: 'watch-low-confidence',
      title: 'Watch items, low confidence',
      blurb: 'Early patterns. No action yet.',
      items: [
        {
          text: 'Switzerland may be showing the early shape of Germany’s follow-up pattern. No action yet, reassess at the 60-day checkpoint.',
          confidence: 'Low' as Confidence,
          to: '/market-performance?market=ch',
        },
      ],
    },
  ] as BriefingSection[],
  // Extra metadata for the assigned/overdue chips, kept separate so the item
  // text stays clean. Indexed by item text prefix is brittle, so we carry the
  // due labels inline here for the two assigned items.
  dueLabels: {
    'Confirm the 52-injector list.': 'Overdue 2 days',
    'Log post-training activity for recent trainees.': 'Due this week',
  } as Record<string, string>,
} as const;

// ---------------------------------------------------------------------------
// DEMO MODE steps
// ---------------------------------------------------------------------------

export const demoSteps = [
  { route: '/', label: 'GM Home',
    hint: 'The customizable GM cockpit. Germany is flagged as the priority market and the Recommendation Card is the anchor. The Dig Deeper bridge connects this recommendation to the 60-day checkpoint in Ask Ariya.' },
  { route: '/market-performance', label: 'Market Performance',
    hint: 'Germany performance is shown alongside investment, field activity, and post-training follow-up.' },
  { route: '/investment-radar', label: 'Investment Radar',
    hint: 'HCP training × Germany is selected. The proxy KPI is named explicitly.' },
  { route: '/execution-signals', label: 'Veeva Execution Screening',
    hint: '52 German high-potential trained injectors sit below the 60-day follow-up cadence.' },
  { route: '/customer-account-focus', label: 'Customer and Account Focus',
    hint: 'German high-potential Xeomin injectors are the priority cohort for the follow-up sprint.' },
  { route: '/scenario-planner', label: 'Scenario Planner',
    hint: 'Move the slider. Toggle a condition. The confidence band visibly responds. The recommendation does not change in tone.' },
  { route: '/ask-ariya', label: 'Ask Ariya',
    hint: 'Ask the operational checkpoint question verbatim. The response is structured, not chatty.' },
  { route: '/decision-log', label: 'Decision Log',
    hint: 'The decision logged from Scenario Planner or Ask Ariya appears at the top with owner and follow-up trigger.' },
] as const;

// ---------------------------------------------------------------------------
// GM HOME (customizable cockpit)
// ---------------------------------------------------------------------------
//
// The landing page is a configurable cockpit. `widgets` is the registry of
// available widget cards; `layouts` holds two named, ordered arrangements that
// prove the cockpit is configurable. The page renders an ordered list of
// widget ids and exposes a Customize panel to add, remove, and reorder them.

export type GmWidgetId =
  | 'heroRecommendation'
  | 'weekSummaryTiles'
  | 'topMovements'
  | 'performanceScatter'
  | 'alertsTeaser'
  | 'otxWatchTeaser'
  | 'trainingToSalesTeaser'
  | 'briefingDigest';

export interface GmWidget {
  id: GmWidgetId;
  title: string;          // shown in the Customize panel and as the widget label
  description: string;    // one-line, shown in the Customize panel
  group: 'Decision' | 'Performance' | 'Teaser';
  // Teaser widgets render a compact card that bridges to another screen.
  teaser?: {
    eyebrow: string;
    headline: string;
    body: string;
    cta: string;
    to: string;
    accent: 'navy' | 'blue' | 'amber' | 'green';
  };
}

export const gmHome = {
  // Markets, brands, and signals the GM can scope the cockpit to. Shown as
  // chips in the Customize panel. The defaults match the live DACH demo.
  scope: {
    markets: [
      { id: 'de', label: 'Germany', on: true },
      { id: 'ch', label: 'Switzerland', on: true },
      { id: 'at', label: 'Austria', on: true },
    ],
    brands: [
      { id: 'xeomin', label: 'Xeomin', on: true },
      { id: 'hepa-merz', label: 'Hepa-Merz', on: false },
      { id: 'antidry', label: 'Antidry', on: false },
      { id: 'pantogar', label: 'Pantogar', on: false },
    ],
    signals: [
      { id: 'followup', label: '60-day follow-up', on: true },
      { id: 'coverage', label: 'Priority coverage', on: true },
      { id: 'otx', label: 'OTx sell-out', on: false },
    ],
  },
  widgets: [
    {
      id: 'heroRecommendation', group: 'Decision',
      title: "This Week's Priority",
      description: 'Hero recommendation with the six-source assembly strip. The cockpit anchor.',
    },
    {
      id: 'weekSummaryTiles', group: 'Performance',
      title: 'Week summary',
      description: 'Composite risk score and four summary tiles.',
    },
    {
      id: 'topMovements', group: 'Performance',
      title: 'Top movements',
      description: 'Markets requiring attention and top opportunity areas.',
    },
    {
      id: 'performanceScatter', group: 'Performance',
      title: 'Performance vs investment',
      description: 'DACH scatter of growth vs plan against investment intensity.',
    },
    {
      id: 'alertsTeaser', group: 'Teaser',
      title: 'Alerts and Notifications',
      description: 'Recent triggered and armed alert rules.',
      teaser: {
        eyebrow: 'Alerts and Notifications',
        headline: '3 rules armed · 1 triggered',
        body: 'Germany Xeomin 60-day follow-up below 60% triggered an in-system and email alert.',
        cta: 'Open Alerts',
        to: '/alerts',
        accent: 'amber',
      },
    },
    {
      id: 'otxWatchTeaser', group: 'Teaser',
      title: 'OTx Watchlist',
      description: 'Local OTx portfolio watch, no cross-market comparison.',
      teaser: {
        eyebrow: 'OTx Watchlist',
        headline: 'Local portfolio watch',
        body: 'Antidry Switzerland: high field activity with flat sell-out. Possible resource mismatch.',
        cta: 'Open OTx Watchlist',
        to: '/otx-watchlist',
        accent: 'navy',
      },
    },
    {
      id: 'trainingToSalesTeaser', group: 'Teaser',
      title: 'Training-to-Sales Signal',
      description: 'Directional cohort signal from trained injectors to later orders.',
      teaser: {
        eyebrow: 'Training-to-Sales Signal',
        headline: 'Followed-up cohort is pulling ahead',
        body: 'Germany trained-and-followed-up injectors index +8 at month 6 vs +1 for the under-followed cohort. Directional.',
        cta: 'Open Training-to-Sales',
        to: '/training-to-sales',
        accent: 'blue',
      },
    },
    {
      id: 'briefingDigest', group: 'Teaser',
      title: 'Morning Briefing',
      description: "Today's prioritized management note.",
      teaser: {
        eyebrow: 'Morning Briefing',
        headline: 'Five things for today',
        body: 'Germany follow-up slipped to 44%. 52 injectors below cadence. Two owners overdue.',
        cta: 'Open Morning Briefing',
        to: '/morning-briefing',
        accent: 'green',
      },
    },
  ] as GmWidget[],
  layouts: {
    default: [
      'heroRecommendation',
      'weekSummaryTiles',
      'topMovements',
      'performanceScatter',
      'alertsTeaser',
      'otxWatchTeaser',
    ] as GmWidgetId[],
    // A visibly different arrangement: briefing and training-to-sales pinned
    // to the top, hero kept, OTx added, performance scatter hidden.
    customized: [
      'briefingDigest',
      'trainingToSalesTeaser',
      'heroRecommendation',
      'topMovements',
      'otxWatchTeaser',
    ] as GmWidgetId[],
  },
} as const;
