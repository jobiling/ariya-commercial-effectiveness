// src/data/scenario.ts
// Locked dataset for the Merz Commercial Effectiveness prototype.
// Demo narrative: Xeomin HCP injection training investment, Italy vs Germany reallocation.
// All numbers in this file are illustrative. Never introduce parallel numbers in components.

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
  { id: 'it', name: 'Italy', flag: '🇮🇹', salesQtdEur: 18.4, growthVsPlanPct: -3.2, growthVsLyPct: 4.1, investmentIntensityPct: 14.8, needsAttention: true,
    oneLineContext: 'High training spend, follow-up discipline inconsistent across high-potential HCPs.' },
  { id: 'de', name: 'Germany', flag: '🇩🇪', salesQtdEur: 31.7, growthVsPlanPct: -2.1, growthVsLyPct: 1.2, investmentIntensityPct: 17.2, needsAttention: true,
    oneLineContext: 'Heavy marketing spend, pressure on net commercial impact.' },
  { id: 'es', name: 'Spain', flag: '🇪🇸', salesQtdEur: 9.8, growthVsPlanPct: 2.4, growthVsLyPct: 6.0, investmentIntensityPct: 11.4, needsAttention: false,
    oneLineContext: 'Above plan. Watch for sustainability of Q1 momentum into Q2.' },
  { id: 'fr', name: 'France', flag: '🇫🇷', salesQtdEur: 14.1, growthVsPlanPct: 0.6, growthVsLyPct: 3.3, investmentIntensityPct: 12.1, needsAttention: false,
    oneLineContext: 'On plan. Steady execution, no immediate reallocation question.' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', salesQtdEur: 11.2, growthVsPlanPct: 1.1, growthVsLyPct: 2.7, investmentIntensityPct: 10.8, needsAttention: false,
    oneLineContext: 'On plan. KOL engagement strong, watch field force coverage.' },
  { id: 'ch', name: 'Switzerland', flag: '🇨🇭', salesQtdEur: 5.6, growthVsPlanPct: 3.0, growthVsLyPct: 5.4, investmentIntensityPct: 9.6, needsAttention: false,
    oneLineContext: 'Above plan. Smaller market, less reallocation leverage.' },
  { id: 'nl', name: 'Netherlands', flag: '🇳🇱', salesQtdEur: 4.2, growthVsPlanPct: -0.4, growthVsLyPct: 1.8, investmentIntensityPct: 10.2, needsAttention: false,
    oneLineContext: 'Near plan. Limited training program footprint.' },
  { id: 'pl', name: 'Poland', flag: '🇵🇱', salesQtdEur: 3.8, growthVsPlanPct: 1.6, growthVsLyPct: 5.9, investmentIntensityPct: 8.9, needsAttention: false,
    oneLineContext: 'Above plan. Investment intensity below European average.' },
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

export const brands: Brand[] = [
  {
    id: 'xeomin', name: 'Xeomin', primary: true,
    performance: [
      { marketId: 'it', salesQtdEur: 7.2, growthVsPlanPct: -5.4, trendIndexed: [100, 101, 99, 98, 96, 94] },
      { marketId: 'de', salesQtdEur: 12.9, growthVsPlanPct: -3.8, trendIndexed: [100, 102, 103, 101, 99, 97] },
      { marketId: 'es', salesQtdEur: 3.6, growthVsPlanPct: 2.1, trendIndexed: [100, 102, 104, 106, 108, 110] },
      { marketId: 'fr', salesQtdEur: 5.3, growthVsPlanPct: 0.4, trendIndexed: [100, 101, 102, 102, 103, 103] },
      { marketId: 'uk', salesQtdEur: 4.0, growthVsPlanPct: 0.8, trendIndexed: [100, 101, 102, 103, 104, 105] },
      { marketId: 'ch', salesQtdEur: 2.1, growthVsPlanPct: 2.6, trendIndexed: [100, 102, 104, 106, 108, 110] },
      { marketId: 'nl', salesQtdEur: 1.5, growthVsPlanPct: -0.2, trendIndexed: [100, 100, 101, 100, 100, 100] },
      { marketId: 'pl', salesQtdEur: 1.3, growthVsPlanPct: 1.4, trendIndexed: [100, 102, 103, 105, 106, 107] },
    ],
  },
  {
    id: 'belotero', name: 'Belotero', primary: false,
    performance: [
      { marketId: 'it', salesQtdEur: 5.6, growthVsPlanPct: -1.2, trendIndexed: [100, 100, 101, 101, 100, 99] },
      { marketId: 'de', salesQtdEur: 9.8, growthVsPlanPct: -1.4, trendIndexed: [100, 101, 102, 101, 100, 99] },
    ],
  },
  {
    id: 'ultherapy', name: 'Ultherapy', primary: false,
    performance: [
      { marketId: 'it', salesQtdEur: 3.2, growthVsPlanPct: -1.6, trendIndexed: [100, 100, 100, 99, 98, 97] },
      { marketId: 'de', salesQtdEur: 5.4, growthVsPlanPct: -0.9, trendIndexed: [100, 101, 101, 100, 100, 99] },
    ],
  },
];

// ---------------------------------------------------------------------------
// EUROPE OVERVIEW summary
// ---------------------------------------------------------------------------

export const overview = {
  summary: {
    marketsAbovePlan: { value: 3, source: 'Sales · refreshed daily' },
    marketsRequiringAttention: { value: 3, source: 'Multi-source · refreshed daily' },
    investmentExposureEur: { value: '€42.8M', source: 'Finance · refreshed weekly' },
    openDecisions: { value: 7, source: 'Decision Log' },
  },
  scatterInterpretation:
    'Higher investment intensity does not translate cleanly into growth above plan. Germany and Italy carry the highest investment but the weakest growth vs plan. Spain and Switzerland deliver growth at lower intensity. The question is not whether to invest, it is where the investment is associated with follow-through.',
  recommendation: {
    eyebrow: 'Ariya recommends · Europe priority',
    pill: 'Close the Italy gap first',
    headerMeta: 'Generated for Europe Leadership · 21 May',
    situation:
      'Italy and Germany together represent 47% of Europe Xeomin sales and 52% of Xeomin commercial investment, yet both are below plan. The pattern points to execution discipline, not investment size.',
    recommendation:
      'Prioritise an Italy follow-up sprint for high-potential trained HCPs before considering a broad German spend reduction.',
    reasoning:
      'Italy shows the largest gap between training investment and post-training field follow-up. Germany shows pressure on net impact but cutting spend without protecting priority accounts risks downside. The most defensible first move is to close the Italian follow-up gap, then evaluate a targeted German reallocation.',
    whyBullets: [
      {
        lead: 'Italy is the largest single drag.',
        body: 'Investment is concentrated in high-potential trained HCPs, but 60-day post-training follow-up sits at 41% vs a 65% European benchmark.',
      },
      {
        lead: 'Germany is a yield problem, not a coverage problem.',
        body: 'Highest investment intensity and field activity above expected, yet growth vs plan is negative. The candidates for reallocation are lower-response activities.',
      },
      {
        lead: 'The defensible first move is operational.',
        body: 'Close the Italy follow-up gap inside the existing envelope, then evaluate a targeted German reallocation in the next cycle.',
      },
    ],
    confidence: 'Medium' as Confidence,
    confidenceRationale:
      'Account-level linkage between training and revenue is partial. Proxy KPIs are defensible at segment level. Treat as directional, not deterministic.',
    conditions: [
      'High-potential trained HCP list confirmed in Italy',
      'Italy NSM owns the 60-day follow-up cadence',
      'Germany reduction limited to lower-response activities',
      'Priority accounts ring-fenced in Germany',
      'Review at 60 days using CRM and performance signals',
    ],
    nextActions: [
      { action: 'Open Scenario Planner for Italy / Germany reallocation', owner: 'Europe Leadership', timeframe: 'This week', priority: true },
      { action: 'Confirm Italy high-potential trained HCP list', owner: 'Italy NSM', timeframe: 'Within 5 days', priority: true },
      { action: 'Define Italy follow-up sprint plan', owner: 'Italy NSM, first-line managers', timeframe: 'Within 10 days' },
    ],
    nextActionsMeta: '3 steps · 10-day horizon',
    sources: ['Market performance', 'CRM activity', 'Training participation and spend', 'Finance'],
    footerMeta: 'Reversible · revisit at 60 days',
  },
  marketsRequiringAttention: [
    { marketId: 'it', headline: 'Italy follow-up gap is the largest single drag on Xeomin Europe.',
      evidence: '47 high-potential trained HCPs not visited within 60 days.', cta: 'Open Italy detail →' },
    { marketId: 'de', headline: 'Germany commercial spend is the highest in Europe, growth vs plan is the weakest.',
      evidence: 'Marketing intensity 17.2% vs growth vs plan −2.1%.', cta: 'Open Germany detail →' },
    { marketId: 'es', headline: 'Spain is above plan. Watch whether Q1 momentum sustains into Q2.',
      evidence: 'Q1 growth 6.0% vs LY, investment intensity 11.4%.', cta: 'Open Spain detail →' },
  ],
} as const;

// ---------------------------------------------------------------------------
// MARKET PERFORMANCE detail
// ---------------------------------------------------------------------------

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
  };
}

export const marketPerformanceContext: MarketContext[] = [
  {
    marketId: 'it',
    forecastVsActual: [
      { quarter: 'Q1', forecast: 19.0, actual: 18.4 },
      { quarter: 'Q2 forecast', forecast: 19.6, actual: 18.9 },
    ],
    performanceInContext: {
      investmentIntensityPct: 14.8,
      fieldActivityIndex: 96,
      postTrainingFollowUpRatePct: 41,
      marketSharePct: 22.4,
      contributionMarginPct: 58.6,
      interpretation:
        'Performance below plan in Italy coincides with a 41% post-training 60-day follow-up rate among trained HCPs. Field activity is near expected, but it is not concentrated on the highest-potential trained HCPs.',
    },
  },
  {
    marketId: 'de',
    forecastVsActual: [
      { quarter: 'Q1', forecast: 32.4, actual: 31.7 },
      { quarter: 'Q2 forecast', forecast: 33.1, actual: 32.4 },
    ],
    performanceInContext: {
      investmentIntensityPct: 17.2,
      fieldActivityIndex: 104,
      postTrainingFollowUpRatePct: 68,
      marketSharePct: 27.9,
      contributionMarginPct: 62.1,
      interpretation:
        'Germany has the highest investment intensity and field activity well above expected, yet growth vs plan is negative. This is a yield problem, not an effort problem. Lower-response activities are the candidates for reallocation.',
    },
  },
];

// ---------------------------------------------------------------------------
// INVESTMENT RADAR
// ---------------------------------------------------------------------------

export type InvestmentCategoryId =
  | 'hcp-training'
  | 'marketing-campaigns'
  | 'congress-events'
  | 'kol-engagement'
  | 'field-force'
  | 'medical-education'
  | 'digital-engagement'
  | 'local-initiatives'
  | 'account-development';

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

export const investmentRadar: InvestmentCategory[] = [
  {
    id: 'hcp-training', name: 'HCP training and education',
    proxyKpiDefinition: 'Post-training call frequency within 60 days, weighted by HCP potential tier.',
    cells: [
      { marketId: 'it', spendEur: 1240, proxyKpi: '60-day follow-up', proxyKpiValue: '41%', tone: 'at-risk' },
      { marketId: 'de', spendEur: 1860, proxyKpi: '60-day follow-up', proxyKpiValue: '68%', tone: 'watch' },
      { marketId: 'es', spendEur: 540, proxyKpi: '60-day follow-up', proxyKpiValue: '72%', tone: 'on-track' },
      { marketId: 'fr', spendEur: 820, proxyKpi: '60-day follow-up', proxyKpiValue: '66%', tone: 'on-track' },
      { marketId: 'uk', spendEur: 690, proxyKpi: '60-day follow-up', proxyKpiValue: '71%', tone: 'on-track' },
      { marketId: 'ch', spendEur: 320, proxyKpi: '60-day follow-up', proxyKpiValue: '74%', tone: 'on-track' },
      { marketId: 'nl', spendEur: 220, proxyKpi: '60-day follow-up', proxyKpiValue: '62%', tone: 'watch' },
      { marketId: 'pl', spendEur: 180, proxyKpi: '60-day follow-up', proxyKpiValue: '64%', tone: 'watch' },
    ],
  },
  {
    id: 'marketing-campaigns', name: 'Marketing campaigns',
    proxyKpiDefinition: 'Spend vs growth trend alignment, campaign follow-through in CRM, target overlap.',
    cells: [
      { marketId: 'it', spendEur: 980, proxyKpi: 'Target overlap', proxyKpiValue: '58%', tone: 'watch' },
      { marketId: 'de', spendEur: 2840, proxyKpi: 'Target overlap', proxyKpiValue: '49%', tone: 'at-risk' },
      { marketId: 'es', spendEur: 410, proxyKpi: 'Target overlap', proxyKpiValue: '71%', tone: 'on-track' },
      { marketId: 'fr', spendEur: 760, proxyKpi: 'Target overlap', proxyKpiValue: '63%', tone: 'on-track' },
      { marketId: 'uk', spendEur: 610, proxyKpi: 'Target overlap', proxyKpiValue: '68%', tone: 'on-track' },
      { marketId: 'ch', spendEur: 220, proxyKpi: 'Target overlap', proxyKpiValue: '74%', tone: 'on-track' },
      { marketId: 'nl', spendEur: 180, proxyKpi: 'Target overlap', proxyKpiValue: '61%', tone: 'watch' },
      { marketId: 'pl', spendEur: 140, proxyKpi: 'Target overlap', proxyKpiValue: '66%', tone: 'on-track' },
    ],
  },
  {
    id: 'congress-events', name: 'Congress and events',
    proxyKpiDefinition: 'Post-event follow-up activity with attendees, account plan updates.',
    cells: [
      { marketId: 'it', spendEur: 460, proxyKpi: 'Attendee follow-up', proxyKpiValue: '52%', tone: 'watch' },
      { marketId: 'de', spendEur: 720, proxyKpi: 'Attendee follow-up', proxyKpiValue: '64%', tone: 'on-track' },
      { marketId: 'es', spendEur: 210, proxyKpi: 'Attendee follow-up', proxyKpiValue: '69%', tone: 'on-track' },
      { marketId: 'fr', spendEur: 320, proxyKpi: 'Attendee follow-up', proxyKpiValue: '61%', tone: 'on-track' },
    ],
  },
  {
    id: 'kol-engagement', name: 'KOL engagement',
    proxyKpiDefinition: 'Engagement frequency, planned activity completion, evidence generation where available.',
    cells: [
      { marketId: 'it', spendEur: 340, proxyKpi: 'Planned activity completion', proxyKpiValue: '74%', tone: 'on-track' },
      { marketId: 'de', spendEur: 580, proxyKpi: 'Planned activity completion', proxyKpiValue: '69%', tone: 'on-track' },
      { marketId: 'es', spendEur: 140, proxyKpi: 'Planned activity completion', proxyKpiValue: '78%', tone: 'on-track' },
      { marketId: 'fr', spendEur: 240, proxyKpi: 'Planned activity completion', proxyKpiValue: '71%', tone: 'on-track' },
    ],
  },
  {
    id: 'field-force', name: 'Field force deployment',
    proxyKpiDefinition: 'Reach, frequency, target coverage, visit discipline on priority accounts.',
    cells: [
      { marketId: 'it', spendEur: 2140, proxyKpi: 'Priority target coverage', proxyKpiValue: '63%', tone: 'watch' },
      { marketId: 'de', spendEur: 3260, proxyKpi: 'Priority target coverage', proxyKpiValue: '78%', tone: 'on-track' },
      { marketId: 'es', spendEur: 920, proxyKpi: 'Priority target coverage', proxyKpiValue: '81%', tone: 'on-track' },
      { marketId: 'fr', spendEur: 1380, proxyKpi: 'Priority target coverage', proxyKpiValue: '74%', tone: 'on-track' },
    ],
  },
  {
    id: 'medical-education', name: 'Medical education programs',
    proxyKpiDefinition: 'Completion, audience match to priority HCP segments, post-program activity.',
    cells: [
      { marketId: 'it', spendEur: 380, proxyKpi: 'Priority audience match', proxyKpiValue: '56%', tone: 'watch' },
      { marketId: 'de', spendEur: 520, proxyKpi: 'Priority audience match', proxyKpiValue: '67%', tone: 'on-track' },
    ],
  },
  {
    id: 'digital-engagement', name: 'Digital engagement',
    proxyKpiDefinition: 'Audience match, engagement depth, conversion to field follow-up.',
    cells: [
      { marketId: 'it', spendEur: 260, proxyKpi: 'Conversion to field follow-up', proxyKpiValue: '38%', tone: 'at-risk' },
      { marketId: 'de', spendEur: 540, proxyKpi: 'Conversion to field follow-up', proxyKpiValue: '52%', tone: 'watch' },
    ],
  },
  {
    id: 'local-initiatives', name: 'Local brand initiatives',
    proxyKpiDefinition: 'Market execution coverage, alignment to brand priorities.',
    cells: [
      { marketId: 'it', spendEur: 180, proxyKpi: 'Brand alignment', proxyKpiValue: '70%', tone: 'on-track' },
      { marketId: 'de', spendEur: 340, proxyKpi: 'Brand alignment', proxyKpiValue: '68%', tone: 'on-track' },
    ],
  },
  {
    id: 'account-development', name: 'Account development investments',
    proxyKpiDefinition: 'Account plan progression, priority account coverage, growth among invested accounts.',
    cells: [
      { marketId: 'it', spendEur: 220, proxyKpi: 'Account plan progression', proxyKpiValue: '54%', tone: 'watch' },
      { marketId: 'de', spendEur: 410, proxyKpi: 'Account plan progression', proxyKpiValue: '61%', tone: 'on-track' },
    ],
  },
];

// Recommendation for the default-selected cell: HCP training × Italy
export const italyHcpTrainingRecommendation = {
  eyebrow: 'Ariya recommends · Investment view',
  pill: 'Fix execution, not selection',
  headerMeta: 'Italy · HCP training · 21 May',
  situation:
    '€1.24M invested in Italy HCP injection training over 18 months. 41% of trained HCPs received a follow-up call within 60 days, vs a 65% benchmark across European markets. 47 high-potential trained HCPs sit below the follow-up threshold.',
  recommendation:
    'Run a 60-day Italy follow-up sprint targeting the 47 high-potential trained HCPs, owned by the Italy NSM with first-line manager accountability.',
  reasoning:
    'The investment selection itself is defensible: training participation is concentrated in high and medium potential segments. The break point is post-training execution. Closing the follow-up gap is a higher-confidence first move than reducing training spend.',
  whyBullets: [
    {
      lead: 'Selection is defensible.',
      body: 'Training participation is concentrated in high and medium potential segments. The mix mirrors the European pattern.',
    },
    {
      lead: 'The break point is post-training execution.',
      body: '41% of trained HCPs received a follow-up call within 60 days vs a 65% benchmark. 47 high-potential trained HCPs are below the threshold.',
    },
    {
      lead: 'Closing the follow-up gap is the higher-confidence first move',
      body: 'than reducing training spend. It is operationally bounded and uses the existing investment envelope.',
    },
  ],
  confidence: 'Medium' as Confidence,
  confidenceRationale:
    'CRM follow-up data is reliable. Linking follow-up to revenue is directional, not causal.',
  conditions: [
    'High-potential trained HCP list confirmed by Italy commercial ops',
    'Italy NSM owns the 60-day follow-up cadence',
    'First-line managers track post-training engagement weekly',
    'Review at 60 days, then decide on cohort 2',
  ],
  nextActions: [
    { action: 'Confirm high-potential trained HCP list', owner: 'Italy commercial ops', timeframe: 'Within 5 days', priority: true },
    { action: 'Launch 60-day follow-up sprint', owner: 'Italy NSM', timeframe: 'Within 10 days', priority: true },
    { action: 'Weekly progress check with first-line managers', owner: 'Italy NSM', timeframe: 'Weekly' },
  ],
  nextActionsMeta: '3 steps · 10-day kickoff',
  sources: ['Training participation and spend', 'CRM activity', 'HCP segmentation'],
  footerMeta: 'Reversible · revisit at 60 days',
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
    title: 'High-potential trained HCPs not visited within 60 days',
    description:
      'HCPs who completed Xeomin injection training but did not receive a field follow-up within the 60-day window.',
    count: 84,
    unit: 'HCPs',
    marketBreakdown: [
      { marketId: 'it', count: 47 },
      { marketId: 'de', count: 19 },
      { marketId: 'nl', count: 8 },
      { marketId: 'pl', count: 10 },
    ],
    owner: 'Italy NSM, Germany NSM',
    tone: 'at-risk',
    source: 'CRM · refreshed daily',
  },
  {
    id: 'below-expected-call-freq',
    title: 'Training participants below expected post-training call frequency',
    description:
      'Trained HCPs receiving fewer than 2 calls in the 90 days following training. Threshold defined per priority tier.',
    count: 132,
    unit: 'HCPs',
    marketBreakdown: [
      { marketId: 'it', count: 71 },
      { marketId: 'de', count: 38 },
      { marketId: 'fr', count: 12 },
      { marketId: 'es', count: 11 },
    ],
    owner: 'Italy NSM, Germany NSM',
    tone: 'at-risk',
    source: 'CRM · refreshed daily',
  },
  {
    id: 'under-covered-priority-accounts',
    title: 'Priority accounts under-covered despite investment',
    description:
      'Priority accounts with active commercial investment but field coverage below the planned cadence over the last quarter.',
    count: 23,
    unit: 'Accounts',
    marketBreakdown: [
      { marketId: 'it', count: 9 },
      { marketId: 'de', count: 6 },
      { marketId: 'fr', count: 4 },
      { marketId: 'es', count: 4 },
    ],
    owner: 'National sales managers',
    tone: 'watch',
    source: 'CRM, finance · refreshed weekly',
  },
  {
    id: 'no-followup-logged',
    title: 'CRM follow-up not logged after training',
    description:
      'Training events with no associated CRM follow-up activity recorded in the 30 days after the event.',
    count: 41,
    unit: 'Events',
    marketBreakdown: [
      { marketId: 'it', count: 22 },
      { marketId: 'de', count: 11 },
      { marketId: 'fr', count: 5 },
      { marketId: 'pl', count: 3 },
    ],
    owner: 'First-line managers',
    tone: 'watch',
    source: 'CRM · refreshed daily',
  },
  {
    id: 'volume-without-quality',
    title: 'Strong activity volume but weak target quality',
    description:
      'Territories where call volume exceeds expected but priority HCP coverage is below the planned share.',
    count: 14,
    unit: 'Territories',
    marketBreakdown: [
      { marketId: 'de', count: 8 },
      { marketId: 'it', count: 4 },
      { marketId: 'fr', count: 2 },
    ],
    owner: 'First-line managers',
    tone: 'watch',
    source: 'CRM · refreshed daily',
  },
  {
    id: 'plan-actions-overdue',
    title: 'Country plan actions overdue',
    description:
      'Actions committed in the country plan past their target completion date.',
    count: 17,
    unit: 'Actions',
    marketBreakdown: [
      { marketId: 'it', count: 7 },
      { marketId: 'de', count: 5 },
      { marketId: 'es', count: 3 },
      { marketId: 'fr', count: 2 },
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
  { id: 'it-derm-high', marketId: 'it', name: 'Dermatologists, high potential', potentialTier: 'High',
    count: 142, trainedPct: 64, followedUpWithin60dPct: 38, growthVsLyPct: -2.8,
    suggestedAction: 'Italy follow-up sprint, priority cohort.' },
  { id: 'it-derm-med', marketId: 'it', name: 'Dermatologists, medium potential', potentialTier: 'Medium',
    count: 218, trainedPct: 41, followedUpWithin60dPct: 49, growthVsLyPct: -1.2,
    suggestedAction: 'Selective post-training follow-up among recent trainees.' },
  { id: 'it-plastic-high', marketId: 'it', name: 'Plastic surgeons, high potential', potentialTier: 'High',
    count: 76, trainedPct: 58, followedUpWithin60dPct: 45, growthVsLyPct: -1.8,
    suggestedAction: 'Add to Italy follow-up sprint, secondary cohort.' },
  { id: 'it-aesthetic-low', marketId: 'it', name: 'Aesthetic physicians, low potential', potentialTier: 'Low',
    count: 184, trainedPct: 22, followedUpWithin60dPct: 31, growthVsLyPct: -0.5,
    suggestedAction: 'Deprioritise for now. Revisit selection criteria.' },

  { id: 'de-derm-high', marketId: 'de', name: 'Dermatologists, high potential', potentialTier: 'High',
    count: 196, trainedPct: 71, followedUpWithin60dPct: 72, growthVsLyPct: 0.9,
    suggestedAction: 'Protect coverage during any spend reallocation.' },
  { id: 'de-derm-med', marketId: 'de', name: 'Dermatologists, medium potential', potentialTier: 'Medium',
    count: 312, trainedPct: 52, followedUpWithin60dPct: 64, growthVsLyPct: 0.4,
    suggestedAction: 'Maintain current cadence.' },
  { id: 'de-plastic-high', marketId: 'de', name: 'Plastic surgeons, high potential', potentialTier: 'High',
    count: 108, trainedPct: 66, followedUpWithin60dPct: 69, growthVsLyPct: 1.2,
    suggestedAction: 'Protect coverage during any spend reallocation.' },

  { id: 'es-derm-high', marketId: 'es', name: 'Dermatologists, high potential', potentialTier: 'High',
    count: 88, trainedPct: 67, followedUpWithin60dPct: 74, growthVsLyPct: 4.6,
    suggestedAction: 'Sustain Q1 momentum, monitor.' },

  { id: 'fr-derm-high', marketId: 'fr', name: 'Dermatologists, high potential', potentialTier: 'High',
    count: 124, trainedPct: 61, followedUpWithin60dPct: 66, growthVsLyPct: 2.1,
    suggestedAction: 'Maintain current cadence.' },
];

export const italyHighPotentialDermRecommendation = {
  eyebrow: 'Ariya recommends · Segment view',
  pill: 'Priority cohort identified',
  headerMeta: 'Italy · High-potential dermatologists · 21 May',
  situation:
    'Italian high-potential dermatologists are well-trained (64%) but post-training 60-day follow-up sits at 38%. This is the single segment most consistent with the Italy commercial gap.',
  recommendation:
    'Make Italian high-potential dermatologists the priority cohort for the 60-day follow-up sprint. Define field cadence and first-line manager check-ins.',
  reasoning:
    'Selection has been defensible. Execution discipline is the break point. Concentrating attention here is the highest-leverage operational move available within the existing investment.',
  whyBullets: [
    {
      lead: 'Training coverage is solid.',
      body: '64% of Italian high-potential dermatologists are trained, in line with the European benchmark for the segment.',
    },
    {
      lead: 'Follow-up is the break point.',
      body: 'Post-training 60-day follow-up sits at 38%, vs 72% in Germany for the equivalent segment. This is the single segment most consistent with the Italy commercial gap.',
    },
    {
      lead: 'Highest leverage within the existing investment.',
      body: 'Concentrating field attention here changes commercial signal without adding spend.',
    },
  ],
  confidence: 'Medium' as Confidence,
  confidenceRationale:
    'Segment-level CRM data is reliable. Causal linkage to Xeomin sales remains directional.',
  conditions: [
    'Field cadence defined and committed by the Italy NSM',
    'First-line managers track follow-up weekly',
    'Status reviewed at 60 days against revenue and CRM signals',
  ],
  nextActions: [
    { action: 'Schedule follow-up sprint kickoff', owner: 'Italy NSM', timeframe: 'Within 7 days', priority: true },
    { action: 'Assign first-line manager owners per territory', owner: 'Italy NSM', timeframe: 'Within 7 days', priority: true },
  ],
  nextActionsMeta: '2 steps · 7-day horizon',
  sources: ['CRM activity', 'HCP segmentation', 'Training participation'],
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
  scenarioId: 'reallocate-de-it',
  title: 'Reallocate Germany marketing → Italy follow-up activation',
  subtitle:
    'Directional impact under explicit assumptions. Not a forecast.',
  centralAssumption:
    'Italy improves 60-day follow-up coverage among high-potential trained HCPs from 41% to at least 60%.',
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
    { text: 'Italy follow-up coverage among high-potential trained HCPs improves to 60%+ within 60 days.', source: 'Italy commercial operations commitment.' },
    { text: 'Germany reduction limited to lower-response activities, identified via the Investment Radar marketing-campaigns proxy KPI.', source: 'Investment Radar.' },
    { text: 'No price or supply disruption during the 6-month window.', source: 'Finance, supply.' },
    { text: 'No competitive event materially shifts category dynamics over the window.', source: 'Market research.' },
  ],
  conditionsRequiredToHold: [
    'Italy follow-up coverage improves within 60 days',
    'Germany reduction limited to lower-response activities',
  ],
  // When a condition is unchecked, widen the band toward conservative on the upside cap and toward 99 on the floor.
  conditionEffects: {
    'Italy follow-up coverage improves within 60 days': { widenBandBy: 0.6 },
    'Germany reduction limited to lower-response activities': { widenBandBy: 0.4 },
  },
  operationalChain: [
    { node: 'HCP selection', status: 'Verified' },
    { node: 'Training delivered', status: 'Verified' },
    { node: '60-day follow-up', status: 'At Risk' },
    { node: 'Commercial impact', status: 'Pending' },
  ],
  recommendation: {
    eyebrow: 'Ariya recommends · Scenario answer',
    pill: "Reallocate, don't shift",
    headerMeta: 'Generated for Europe Leadership · 21 May',
    situation:
      'A 10% reallocation of Germany marketing spend to Italy post-training activation produces a directional net positive of ~2.5 index points over 6 months in the base case, conditional on Italy follow-up improvement.',
    recommendation:
      'Reallocate only toward high-potential trained HCPs in Italy, with a defined follow-up plan and field manager accountability.',
    reasoning:
      'Italy shows evidence of higher potential response among trained HCPs when follow-up occurs, but follow-up discipline is inconsistent. Germany shows pressure on net impact, but reducing spend without protecting priority accounts may create downside risk.',
    whyBullets: [
      {
        lead: 'Italy upside is conditional.',
        body: 'Trained HCPs show higher potential response, but only where follow-up actually occurs. Follow-up discipline today is inconsistent.',
      },
      {
        lead: 'Germany downside is real.',
        body: 'Net impact is already under pressure. Cutting spend without ring-fencing priority accounts creates downside risk.',
      },
      {
        lead: 'Net direction is positive',
        body: 'under the assumption Italy lifts follow-up coverage on high-potential trained HCPs within 60 days.',
      },
    ],
    confidence: 'Medium' as Confidence,
    confidenceRationale:
      'Data completeness is moderate. Account-level linkage and market-level confounders require validation. Treat as directional, not deterministic.',
    conditions: [
      'High-potential trained HCP list confirmed',
      'National sales manager owns execution',
      'Germany reduction limited to lower-response activities',
      'Follow-up cadence defined',
      'First-line managers track post-training engagement',
      'Review after 60 days',
    ],
    nextActions: [
      { action: 'Run Italy high-potential HCP follow-up sprint', owner: 'Italy NSM', timeframe: '60 days', priority: true },
      { action: 'Protect Germany priority account coverage', owner: 'Germany NSM', timeframe: 'Immediate', priority: true },
      { action: 'Reassess after 60 days', owner: 'Europe Leadership', timeframe: '60 days' },
      { action: 'Decide whether to expand reallocation', owner: 'Europe Leadership', timeframe: 'Q3 planning' },
    ],
    nextActionsMeta: '4 steps · spans to Q3 planning',
    sources: [
      'Market performance',
      'CRM activity',
      'Training participation and spend',
      'HCP segmentation',
      'Brand plan assumptions',
      'Finance · spend',
    ],
    footerMeta: 'Reversible · revisit at 60 days',
  },
  alternateScenarios: [
    { id: 'italy-followup-only', label: 'Increase follow-up for trained HCPs (Italy)', enabled: false },
    { id: 'cross-market-compare', label: 'Compare investment options across markets', enabled: false },
  ],
} as const;

// ---------------------------------------------------------------------------
// ASK ARIYA scripted Q&A
// ---------------------------------------------------------------------------

export interface AriyaExchange {
  id: string;
  question: string;
  // Structured response, rendered via the RecommendationCard variant in the chat surface.
  response: {
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
  };
}

export const askAriya: AriyaExchange[] = [
  {
    id: 'reallocate-de-it',
    question:
      "If we shift 10% of Germany's marketing budget to Italy post-training activation for Xeomin, what is the directional impact?",
    response: {
      recommendedAction:
        'Do not shift budget broadly. Reallocate only toward high-potential trained HCPs in Italy with a defined follow-up plan and field manager accountability.',
      reasoning:
        'Italy shows evidence of higher potential response among trained HCPs when follow-up occurs, but follow-up discipline is inconsistent. Germany shows pressure on net impact, but reducing spend without protecting priority accounts may create downside risk.',
      scenarioView:
        'Directional net impact appears positive under the assumption that Italy improves follow-up coverage among high-potential trained HCPs within 60 days. Confidence is medium because account-level linkage and market-level confounders require validation.',
      requiredConditions: [
        'High-potential trained HCP list confirmed',
        'Follow-up cadence defined',
        'National sales manager owns execution',
        'First-line managers track post-training engagement',
        'Germany reduction limited to lower-response activities',
        'Review after 60 days',
      ],
      recommendedNextActions: [
        { action: 'Run Italy high-potential HCP follow-up sprint', owner: 'Italy NSM', timeframe: '60 days', priority: true },
        { action: 'Protect Germany priority account coverage', owner: 'Germany NSM', timeframe: 'Immediate', priority: true },
        { action: 'Reassess after 60 days', owner: 'Europe Leadership', timeframe: '60 days' },
        { action: 'Decide whether to expand reallocation', owner: 'Europe Leadership', timeframe: 'Q3 planning' },
      ],
      sources: ['Market performance', 'CRM activity', 'Training participation and spend', 'HCP segmentation', 'Brand plan assumptions', 'Finance · spend'],
      confidence: 'Medium',
      confidenceRationale: 'Data completeness is moderate. Account-level linkage and market-level confounders require validation. Treat as directional, not deterministic.',
      linksTo: [
        { label: 'Open in Scenario Planner', route: '/scenario-planner' },
        { label: 'Log this decision', route: '/decision-log?from=ask-ariya' },
      ],
      pill: "Reallocate, don't shift",
      whyBullets: [
        {
          lead: 'Italy upside is conditional.',
          body: 'Trained HCPs show higher potential response, but only where follow-up actually occurs. Follow-up discipline today is inconsistent.',
        },
        {
          lead: 'Germany downside is real.',
          body: 'Net impact is already under pressure. Cutting spend without ring-fencing priority accounts creates downside risk.',
        },
        {
          lead: 'Net direction is positive',
          body: 'under the assumption Italy lifts follow-up coverage on high-potential trained HCPs within 60 days.',
        },
      ],
      headerMeta: 'Generated for Europe Leadership · 21 May',
      nextActionsMeta: '4 steps · spans to Q3 planning',
      footerMeta: 'Reversible · revisit at 60 days',
    },
  },
  {
    id: 'losing-most-value',
    question: 'Where are we losing the most commercial value across Europe?',
    response: {
      recommendedAction:
        'Focus first on the Italy follow-up gap. It is the single largest correctable drag on Xeomin Europe.',
      reasoning:
        'Italy concentrates HCP training investment but only 41% of high-potential trained HCPs receive a follow-up within 60 days, vs a 65% European benchmark. The gap maps to ~47 high-potential trained HCPs with no recent field contact.',
      scenarioView:
        'Closing this gap is operationally bounded and within the existing investment envelope. Directional impact is contained to Italy in the short term.',
      requiredConditions: [
        'High-potential trained HCP list confirmed',
        '60-day follow-up cadence committed',
        'First-line manager weekly tracking',
      ],
      recommendedNextActions: [
        { action: 'Launch Italy follow-up sprint', owner: 'Italy NSM', timeframe: 'Within 10 days' },
        { action: 'Confirm trained HCP list', owner: 'Italy commercial ops', timeframe: 'Within 5 days' },
      ],
      sources: ['CRM activity', 'Training participation and spend', 'HCP segmentation'],
      confidence: 'Medium',
      confidenceRationale: 'Diagnosis is well-supported. Magnitude of recovered revenue is directional.',
      linksTo: [
        { label: 'Open Execution Signals', route: '/execution-signals' },
      ],
    },
  },
  {
    id: 'best-incremental',
    question: 'Which markets show the best incremental investment opportunity?',
    response: {
      recommendedAction:
        'Spain and Italy are the two strongest incremental candidates, for opposite reasons. Spain on momentum, Italy on closing the execution gap.',
      reasoning:
        'Spain delivers growth above plan at moderate investment intensity, suggesting a higher marginal yield on additional spend. Italy carries weak execution discipline against existing spend, so the highest-yield move is operational, not financial.',
      scenarioView:
        'A targeted Spain incremental is likely additive. An Italy operational fix is likely the higher-leverage move within the current envelope.',
      requiredConditions: [
        'Spain Q2 momentum confirmed before incremental',
        'Italy execution baseline established before expansion',
      ],
      recommendedNextActions: [
        { action: 'Confirm Spain Q1 to Q2 momentum', owner: 'Spain NSM', timeframe: '4 weeks' },
        { action: 'Italy follow-up sprint as zero-cost incremental', owner: 'Italy NSM', timeframe: '60 days' },
      ],
      sources: ['Market performance', 'Investment Radar', 'CRM activity'],
      confidence: 'Medium',
      confidenceRationale: 'Cross-market comparisons are directional given different brand and segment mixes.',
    },
  },
  {
    id: 'right-hcps-italy',
    question: 'Are we selecting the right HCPs for Xeomin injection training in Italy?',
    response: {
      recommendedAction:
        'Selection is broadly defensible. The break point is post-training execution, not the selection criteria.',
      reasoning:
        '64% of Italian high-potential dermatologists are trained, which is in line with the European benchmark. The drop happens after training: 38% follow-up within 60 days vs 72% in Germany for the equivalent segment.',
      scenarioView:
        'Improving selection at the margin is a smaller lever than improving follow-up. Address execution first, revisit selection criteria after the sprint.',
      requiredConditions: [
        'Italy follow-up sprint runs as planned',
        'Selection criteria reviewed at the next planning cycle',
      ],
      recommendedNextActions: [
        { action: 'Run Italy follow-up sprint', owner: 'Italy NSM', timeframe: '60 days' },
        { action: 'Plan selection criteria review for Q3', owner: 'Italy commercial ops, BU head', timeframe: 'Q3 planning' },
      ],
      sources: ['Training participation', 'HCP segmentation', 'CRM activity'],
      confidence: 'Medium',
      confidenceRationale: 'Segment-level data is reliable. Individual selection edge cases not validated here.',
      linksTo: [
        { label: 'Open Customer and Account Focus', route: '/customer-account-focus' },
      ],
    },
  },
  {
    id: 'italy-nsm-30d',
    question: 'What should the Italy national sales manager do in the next 30 days?',
    response: {
      recommendedAction:
        'Three actions, in order: confirm the high-potential trained HCP list, launch the follow-up sprint, install a weekly first-line manager rhythm.',
      reasoning:
        'These three actions are the operational chain that turns existing training investment into commercial impact within the current envelope.',
      scenarioView:
        'A 30-day window is enough to demonstrate change in CRM follow-up signal. Commercial impact signal requires the full 60-day window.',
      requiredConditions: [
        'Italy commercial ops confirms HCP list within 5 days',
        'First-line managers have territory ownership',
      ],
      recommendedNextActions: [
        { action: 'Confirm high-potential trained HCP list', owner: 'Italy commercial ops', timeframe: 'Within 5 days' },
        { action: 'Launch follow-up sprint', owner: 'Italy NSM', timeframe: 'Within 10 days' },
        { action: 'Install weekly tracking', owner: 'Italy NSM', timeframe: 'Within 14 days' },
      ],
      sources: ['CRM activity', 'Training participation', 'Country plan'],
      confidence: 'High',
      confidenceRationale: 'Operational actions are within existing accountability and timeframes.',
    },
  },
  {
    id: 'germany-net-impact',
    question: "Why is Germany's net commercial impact under pressure despite the highest spend in Europe?",
    response: {
      recommendedAction:
        'Treat Germany as a yield problem, not a coverage problem. The candidate reallocation pool is in lower-response marketing activities, not in field force or priority account coverage.',
      reasoning:
        'Germany field activity is above expected and priority account target coverage sits at 78%. The signal pointing to weakness is marketing-campaign target overlap at 49%, well below the European average.',
      scenarioView:
        'A targeted reduction in lower-response marketing activities is the safest source for any reallocation. Reducing field force or coverage on priority accounts is not advisable.',
      requiredConditions: [
        'Lower-response marketing activities identified by Investment Radar proxy KPI',
        'Priority account coverage explicitly protected',
      ],
      recommendedNextActions: [
        { action: 'List lower-response marketing activities for Germany', owner: 'Germany BU lead', timeframe: 'Within 10 days' },
        { action: 'Define protected priority account list', owner: 'Germany NSM', timeframe: 'Within 10 days' },
      ],
      sources: ['Investment Radar', 'CRM activity', 'Finance · spend'],
      confidence: 'Medium',
      confidenceRationale: 'Diagnosis is well-supported. Magnitude of reallocation effect is directional.',
      linksTo: [
        { label: 'Open Investment Radar', route: '/investment-radar' },
      ],
    },
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
    decision: 'Launch Italy high-potential HCP follow-up sprint for trained Xeomin injectors.',
    owner: 'Europe Leadership',
    marketAndBrand: 'Italy · Xeomin',
    evidenceUsed: ['Italy 41% follow-up vs 65% benchmark', '47 high-potential trained HCPs without 60-day contact'],
    assumptions: ['Italy commercial ops confirms HCP list within 5 days', 'First-line managers track weekly'],
    expectedImpact: 'Directional commercial recovery within 60 days, measured via CRM follow-up rate and Xeomin Italy run-rate.',
    actionsAssigned: [
      { action: 'Confirm high-potential trained HCP list', owner: 'Italy commercial ops', due: 'May 17, 2026' },
      { action: 'Launch follow-up sprint', owner: 'Italy NSM', due: 'May 22, 2026' },
    ],
    followUpDate: 'Jul 11, 2026',
    triggerForReassessment: 'Italy follow-up rate below 55% at 30 days · trained HCP list not confirmed within 5 days',
    status: 'Active',
    alternativesConsidered: [
      {
        option: 'Increase HCP training budget in Italy',
        rejected:
          'Training participation is already concentrated in high-potential segments. The break point is post-training execution, not selection or volume.',
      },
      {
        option: 'Reduce Italy training spend and reallocate to Spain',
        rejected:
          'Would erode the existing trained cohort and remove the lever that closes the follow-up gap. Spain incremental is conditional on Q2 momentum confirmation.',
      },
    ],
    source: 'Manual',
  },
  {
    id: 'd-002',
    date: 'May 14, 2026',
    decision: 'Hold any broad reduction in Germany marketing pending Investment Radar diagnosis.',
    owner: 'Europe Leadership',
    marketAndBrand: 'Germany · Xeomin',
    evidenceUsed: ['Germany marketing-campaigns target overlap 49%', 'Germany priority account coverage 78%'],
    assumptions: ['Lower-response marketing activities can be identified before next planning cycle'],
    expectedImpact: 'Preserves field force and priority account coverage. Sets up a defensible reallocation in Q3.',
    actionsAssigned: [
      { action: 'Identify lower-response marketing activities', owner: 'Germany BU lead', due: 'May 24, 2026' },
    ],
    followUpDate: 'Jun 14, 2026',
    triggerForReassessment: 'Germany growth vs plan worsens beyond −3% · Q2 mid-quarter check',
    status: 'On Track',
    alternativesConsidered: [
      {
        option: 'Apply across-the-board 10% reduction to Germany marketing immediately',
        rejected:
          'Risks priority account coverage and field force capacity without isolating which activities actually underperform. Investment Radar diagnosis required first.',
      },
      {
        option: 'Maintain current Germany spend with no diagnostic',
        rejected:
          'Leaves a visible underperformance signal unaddressed and removes the case for a defensible Q3 reallocation.',
      },
    ],
    source: 'Ask Ariya',
  },
  {
    id: 'd-003',
    date: 'May 8, 2026',
    decision: 'Continue Spain investment intensity at current level. Monitor Q2 momentum before any incremental.',
    owner: 'Iberia BU head',
    marketAndBrand: 'Spain · Xeomin',
    evidenceUsed: ['Spain growth vs plan +2.4%', 'Spain investment intensity 11.4%'],
    assumptions: ['Q1 momentum is not driven by one-off events'],
    expectedImpact: 'Confirms sustainable trajectory before scaling.',
    actionsAssigned: [
      { action: 'Q1 to Q2 momentum check', owner: 'Spain NSM', due: 'Jun 30, 2026' },
    ],
    followUpDate: 'Jun 30, 2026',
    triggerForReassessment: 'Spain Q2 growth below +1.0%',
    status: 'On Track',
    alternativesConsidered: [
      {
        option: 'Increase Spain investment by 15% in Q2',
        rejected:
          'Q1 momentum is not yet confirmed sustainable. Risk of inflating spend against a transient signal.',
      },
      {
        option: 'Reduce Spain investment to fund Italy operations sprint',
        rejected:
          'Would erode the only above-plan momentum in Iberia. The Italy sprint is operational and does not require Spain budget reallocation.',
      },
    ],
    source: 'Manual',
  },
  {
    id: 'd-004',
    date: 'Apr 28, 2026',
    decision: 'Approve KOL engagement plan for Plastic Surgery segment in Italy and Germany.',
    owner: 'Europe Medical lead',
    marketAndBrand: 'Italy, Germany · Xeomin',
    evidenceUsed: ['Plastic surgeons high potential, undercovered in Italy', 'KOL planned activity completion 69 to 74%'],
    assumptions: ['Medical and commercial cadence aligned on shared KOL list'],
    expectedImpact: 'Sustains evidence generation and advocacy signals into H2.',
    actionsAssigned: [
      { action: 'Finalise shared KOL list', owner: 'Italy and Germany medical leads', due: 'May 19, 2026' },
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
          'Italian plastic surgeons are an undercovered high-potential cohort. Equal attention is required to keep the Italy follow-up sprint defensible.',
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

export const sourceConfidence: DataSource[] = [
  {
    id: 'market-perf', name: 'Market performance', owner: 'Europe BI',
    lastRefresh: 'Daily, last May 19, 2026',
    completenessPct: 96,
    knownGaps: ['Some sub-national volume splits delayed by 2 days'],
    confidencePerRecommendation: [
      { recommendation: 'Italy follow-up sprint', confidence: 'Medium' },
      { recommendation: 'Hold Germany broad reduction', confidence: 'Medium' },
    ],
    caveats: ['Channel-level sales unavailable in some markets'],
    manualValidationStatus: 'Validated',
  },
  {
    id: 'crm', name: 'CRM activity', owner: 'Europe Commercial Ops',
    lastRefresh: 'Daily, last May 19, 2026',
    completenessPct: 91,
    knownGaps: ['Follow-up free-text fields not consistently used in IT and NL'],
    confidencePerRecommendation: [
      { recommendation: 'Italy follow-up sprint', confidence: 'High' },
      { recommendation: 'Germany lower-response activities', confidence: 'Medium' },
    ],
    caveats: ['Activity logged ≠ activity completed. Quality varies by territory.'],
    manualValidationStatus: 'Validated',
  },
  {
    id: 'training', name: 'Training participation and spend', owner: 'Europe Medical Ops',
    lastRefresh: 'Weekly, last May 16, 2026',
    completenessPct: 88,
    knownGaps: ['Some local Xeomin events not yet integrated for Q1 2026'],
    confidencePerRecommendation: [
      { recommendation: 'Italy follow-up sprint', confidence: 'High' },
      { recommendation: 'Reassess selection criteria', confidence: 'Medium' },
    ],
    caveats: ['HCP-level linkage to CRM is partial in IT and NL.'],
    manualValidationStatus: 'Spot-checked',
  },
  {
    id: 'segmentation', name: 'Segmentation and targeting', owner: 'Europe Commercial Ops',
    lastRefresh: 'Quarterly, last refresh Q2 2026',
    completenessPct: 84,
    knownGaps: ['Potential tiers not refreshed in Q1 for IT plastic surgery segment'],
    confidencePerRecommendation: [
      { recommendation: 'High-potential dermatologist cohort', confidence: 'Medium' },
    ],
    caveats: ['Potential tiering uses 18-month look-back; recent shifts not captured.'],
    manualValidationStatus: 'Spot-checked',
  },
  {
    id: 'finance', name: 'Finance and spend', owner: 'Europe Finance',
    lastRefresh: 'Monthly, last May 5, 2026',
    completenessPct: 93,
    knownGaps: ['Local initiative spend categorisation inconsistent across BUs'],
    confidencePerRecommendation: [
      { recommendation: 'Germany reallocation pool', confidence: 'Medium' },
    ],
    caveats: ['Cross-functional cost allocations are approximations.'],
    manualValidationStatus: 'Validated',
  },
  {
    id: 'mr', name: 'Market research and brand materials', owner: 'Europe Marketing',
    lastRefresh: 'Project-based, latest study Apr 2026',
    completenessPct: 72,
    knownGaps: ['No 2026 quantitative tracker for IT plastic surgery channel'],
    confidencePerRecommendation: [
      { recommendation: 'Italy selection criteria review', confidence: 'Low' },
    ],
    caveats: ['Qualitative inputs cannot replace longitudinal data.'],
    manualValidationStatus: 'Not yet validated',
  },
];

// ---------------------------------------------------------------------------
// DEMO MODE steps
// ---------------------------------------------------------------------------

export const demoSteps = [
  { route: '/', label: 'Europe Overview',
    hint: 'Italy and Germany are flagged as priority markets. The Recommendation Card is the anchor, not the scatter.' },
  { route: '/market-performance', label: 'Market Performance',
    hint: 'Italy performance is shown alongside investment, field activity, and post-training follow-up.' },
  { route: '/investment-radar', label: 'Investment Radar',
    hint: 'HCP training × Italy is selected. The proxy KPI is named explicitly.' },
  { route: '/execution-signals', label: 'Execution Signals',
    hint: '47 Italian high-potential trained HCPs sit below the 60-day follow-up threshold.' },
  { route: '/customer-account-focus', label: 'Customer and Account Focus',
    hint: 'Italian high-potential dermatologists are the priority cohort for the follow-up sprint.' },
  { route: '/scenario-planner', label: 'Scenario Planner',
    hint: 'Move the slider. Toggle a condition. The confidence band visibly responds. The recommendation does not change in tone.' },
  { route: '/ask-ariya', label: 'Ask Ariya',
    hint: "Ask the question from section 9 verbatim. The response is structured, not chatty." },
  { route: '/decision-log', label: 'Decision Log',
    hint: 'The decision logged from Scenario Planner or Ask Ariya appears at the top with owner and follow-up trigger.' },
] as const;
