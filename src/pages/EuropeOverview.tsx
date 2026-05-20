import { useRef, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
} from 'recharts';
import { PageHeader } from '../components/layout/PageHeader';
import { Donut, NewsCallout, HeroPriorityList, SourceTag } from '../components/composites';
import type { HeroPriorityItem } from '../components/composites';
import { RecommendationCard } from '../components/decision';
import { markets, overview } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  paddingBottom: 48,
};

type DonutTone = 'on-track' | 'watch' | 'at-risk';

// Per-status palette for the cockpit header score block. The tone is carried by
// the donut ring and the status pill only.
const STATUS_PALETTE: Record<string, { pillBg: string; pillFg: string; donutTone: DonutTone }> = {
  'Urgent':   { pillBg: '#FEE2E2', pillFg: '#7F1D1D', donutTone: 'at-risk' },
  'At Risk':  { pillBg: '#FEF3C7', pillFg: '#92400E', donutTone: 'watch' },
  'Watch':    { pillBg: '#FEF9F0', pillFg: '#92400E', donutTone: 'watch' },
  'On Track': { pillBg: '#D1FAE5', pillFg: '#065F46', donutTone: 'on-track' },
};

const cockpitCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: '20px 24px',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: 24,
  alignItems: 'center',
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const cockpitScoreColStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  paddingRight: 24,
  borderRight: `1px solid ${NAVY_12}`,
};

const cockpitScoreMetaStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  maxWidth: 200,
};

const cockpitEyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const cockpitStatusPillStyle = (bg: string, fg: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: 999,
  background: bg,
  color: fg,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.04em',
  alignSelf: 'flex-start',
});

const cockpitCaptionStyle: CSSProperties = {
  fontSize: 11,
  color: NAVY_55,
  lineHeight: 1.4,
  marginTop: 2,
};

const cockpitStatsRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 18,
  paddingLeft: 4,
};

const cockpitStatStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const cockpitStatEyebrowStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const cockpitStatValueStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.1,
  fontVariantNumeric: 'tabular-nums',
};

const chartCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const chartTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};

const chartSubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  marginTop: 2,
};

const interpretationStyle: CSSProperties = {
  marginTop: 12,
  paddingTop: 14,
  borderTop: `1px solid ${NAVY_12}`,
  fontSize: 13,
  fontStyle: 'italic',
  color: NAVY_70,
  lineHeight: 1.55,
};

const tooltipBoxStyle: CSSProperties = {
  background: NAVY,
  color: '#ffffff',
  padding: '8px 10px',
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1.4,
  boxShadow: '0 8px 24px rgba(5,10,68,0.18)',
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 10,
};

interface ScatterPoint {
  marketId: string;
  marketName: string;
  flag: string;
  x: number;
  y: number;
  focus: boolean;
}

// Per-market label offset overrides. Keys are market ids. Used to nudge labels for
// markets that are close together so text does not collide. Default is right of the dot.
const LABEL_OFFSETS: Record<string, { dx: number; dy: number; anchor?: 'start' | 'end' }> = {
  ch: { dx: 10, dy: -8 },                   // top-left cluster, push label above the dot
  pl: { dx: -10, dy: 4, anchor: 'end' },    // left of dot to avoid colliding with uk
  uk: { dx: 10, dy: 4 },
  nl: { dx: 10, dy: 4 },
  es: { dx: 10, dy: -8 },                   // above the dot, fr is just below
  fr: { dx: 10, dy: 14 },                   // below the dot to clear es
  it: { dx: 12, dy: 5 },
  de: { dx: 12, dy: 5 },
};

// Custom dot renderer. All 8 markets are labeled. Italy and Germany are emphasised
// (heavier dot, navy bold text, flag). Others render smaller, in muted navy.
function CustomDot(props: any) {
  const { cx, cy, payload } = props as { cx: number; cy: number; payload: ScatterPoint };
  if (cx == null || cy == null) return null;
  const focus = payload.focus;
  const r = focus ? 7 : 5;
  const fill = focus ? NAVY : 'rgba(5,10,68,0.55)';
  const offset = LABEL_OFFSETS[payload.marketId] ?? { dx: 10, dy: 4 };
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke="#ffffff" strokeWidth={2} />
      <text
        x={cx + offset.dx}
        y={cy + offset.dy}
        textAnchor={offset.anchor ?? 'start'}
        fontSize={focus ? 12 : 11}
        fontWeight={focus ? 700 : 600}
        fill={focus ? NAVY : NAVY_55}
      >
        <tspan>{payload.flag} </tspan>
        <tspan>{payload.marketName}</tspan>
      </text>
    </g>
  );
}

function ScatterTooltip(props: any) {
  const active = props.active as boolean | undefined;
  const payload = props.payload as { payload: ScatterPoint }[] | undefined;
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div style={tooltipBoxStyle}>
      <div style={{ fontWeight: 700 }}>{p.flag} {p.marketName}</div>
      <div style={{ opacity: 0.85 }}>Investment intensity {p.x.toFixed(1)}%</div>
      <div style={{ opacity: 0.85 }}>Growth vs plan {p.y > 0 ? '+' : ''}{p.y.toFixed(1)}%</div>
    </div>
  );
}

export default function EuropeOverview() {
  const navigate = useNavigate();
  const recommendationRef = useRef<HTMLDivElement | null>(null);

  const scrollToRecommendation = () => {
    recommendationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scatterData: ScatterPoint[] = markets.map((m) => ({
    marketId: m.id,
    marketName: m.name,
    flag: m.flag,
    x: m.investmentIntensityPct,
    y: m.growthVsPlanPct,
    focus: m.id === 'it' || m.id === 'de',
  }));

  const tiles = [
    { label: 'Markets above plan', value: overview.summary.marketsAbovePlan.value, source: overview.summary.marketsAbovePlan.source },
    { label: 'Markets requiring attention', value: overview.summary.marketsRequiringAttention.value, source: overview.summary.marketsRequiringAttention.source },
    { label: 'Investment exposure', value: overview.summary.investmentExposureEur.value, source: overview.summary.investmentExposureEur.source },
    { label: 'Open decisions', value: overview.summary.openDecisions.value, source: overview.summary.openDecisions.source },
  ];

  const heroItems: HeroPriorityItem[] = overview.marketsRequiringAttention.map((item) => {
    const market = markets.find((m) => m.id === item.marketId);
    return {
      id: item.marketId,
      flag: market?.flag ?? '',
      marketName: market?.name ?? item.marketId,
      headline: item.headline,
      evidence: item.evidence,
      route: `/market-performance?market=${item.marketId}`,
    };
  });

  // Shorten the headline to one line for the news callout. Use the first sentence only.
  const calloutHeadline = overview.recommendation.situation.split('. ')[0] + '.';

  // Top opportunity areas: markets above plan, sorted by growth vs plan descending.
  // Cap at 3 to mirror the "Markets requiring attention" hero list cardinality.
  const opportunityMarkets = [...markets]
    .filter((m) => m.growthVsPlanPct > 0)
    .sort((a, b) => b.growthVsPlanPct - a.growthVsPlanPct)
    .slice(0, 3);

  // Composite risk score derived from the existing summary.
  // 3 markets need attention out of 8 → 37.5%, plus open decisions = 7, plus investment
  // exposure €42.8M concentrated in Italy + Germany. The score is illustrative.
  const marketsAtRisk = overview.summary.marketsRequiringAttention.value;
  const totalMarkets = markets.length;
  const riskFraction = marketsAtRisk / totalMarkets; // 3/8 = 0.375
  // Map to a 0-100 composite. Weighting: 60% markets-at-risk share + 40% open decisions
  // density (capped at 10 open).
  const openDecisionsValue = overview.summary.openDecisions.value;
  const riskScore = Math.round(
    riskFraction * 60 + Math.min(openDecisionsValue / 10, 1) * 40,
  ); // ≈ 50 with current data
  const riskLabel =
    riskScore >= 60 ? 'Urgent'
    : riskScore >= 40 ? 'At Risk'
    : riskScore >= 20 ? 'Watch'
    : 'On Track';
  const riskPalette = STATUS_PALETTE[riskLabel];

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Europe Overview"
        subtitle="Where does Europe leadership need to focus this week?"
      />

      <section style={cockpitCardStyle}>
        <div style={cockpitScoreColStyle}>
          <Donut
            value={riskScore}
            size={72}
            stroke={8}
            tone={riskPalette.donutTone}
            showPct={false}
            label="/ 100"
          />
          <div style={cockpitScoreMetaStyle}>
            <span style={cockpitEyebrowStyle}>Commercial effectiveness · Europe</span>
            <span style={cockpitStatusPillStyle(riskPalette.pillBg, riskPalette.pillFg)}>
              {riskLabel}
            </span>
            <span style={cockpitCaptionStyle}>Composite risk score · updated May 19, 2026</span>
          </div>
        </div>
        <div style={cockpitStatsRowStyle}>
          {tiles.map((t) => (
            <div key={t.label} style={cockpitStatStyle}>
              <span style={cockpitStatEyebrowStyle}>{t.label}</span>
              <span style={cockpitStatValueStyle}>{t.value}</span>
              <SourceTag label={t.source} />
            </div>
          ))}
        </div>
      </section>

      <NewsCallout
        tone="red"
        eyebrow="This Week's Priority"
        headline={calloutHeadline}
        meta="Italy · Germany · Xeomin · May 19, 2026"
        ctaLabel="Open Recommendation"
        onCta={scrollToRecommendation}
      />

      <section style={chartCardStyle}>
        <h2 style={chartTitleStyle}>Performance vs Investment Intensity</h2>
        <p style={chartSubtitleStyle}>Q1 2026 · 8 European markets · Italy and Germany highlighted</p>

        <div style={{ width: '100%', height: 320, marginTop: 14 }}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 16, right: 96, bottom: 36, left: 8 }}>
              <CartesianGrid stroke="rgba(5,10,68,0.08)" strokeDasharray="3 3" />
              <ReferenceLine y={0} stroke="rgba(5,10,68,0.18)" strokeDasharray="4 4" />
              <XAxis
                type="number"
                dataKey="x"
                name="Investment intensity"
                unit="%"
                domain={[6, 20]}
                tick={{ fill: NAVY_55, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: NAVY_12 }}
                label={{ value: 'Investment intensity (% of sales)', position: 'bottom', offset: 14, fill: NAVY_55, fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Growth vs plan"
                unit="%"
                domain={[-5, 5]}
                tick={{ fill: NAVY_55, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: NAVY_12 }}
                label={{ value: 'Growth vs plan (%)', angle: -90, position: 'insideLeft', offset: 12, fill: NAVY_55, fontSize: 12 }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip content={<ScatterTooltip />} cursor={{ stroke: NAVY_12 }} />
              <Scatter
                data={scatterData}
                shape={CustomDot}
                isAnimationActive={false}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <p style={interpretationStyle}>{overview.scatterInterpretation}</p>
      </section>

      <div ref={recommendationRef}>
        <RecommendationCard
          situation={overview.recommendation.situation}
          recommendation={overview.recommendation.recommendation}
          reasoning={overview.recommendation.reasoning}
          confidence={overview.recommendation.confidence}
          confidenceRationale={overview.recommendation.confidenceRationale}
          conditions={overview.recommendation.conditions}
          nextActions={overview.recommendation.nextActions}
          sources={overview.recommendation.sources}
          accent="teal"
          collapsible
          actions={[
            {
              label: 'Open in Scenario Planner →',
              onClick: () => navigate('/scenario-planner'),
              primary: true,
            },
            {
              label: 'Log this decision →',
              onClick: () => navigate('/decision-log?from=europe-overview'),
            },
          ]}
        />
      </div>

      <section>
        <div style={sectionLabelStyle}>Markets requiring leadership attention</div>
        <HeroPriorityList
          items={heroItems}
          primaryLabelFor={(item) => `Open ${item.marketName} detail`}
          secondaryCtaLabel="Add to brief"
          onPrimary={(item) => navigate(item.route)}
          onSecondary={() => {/* Add-to-brief is a v2 affordance. No-op in v1. */}}
        />
      </section>

      <section>
        <div style={sectionLabelStyle}>Top opportunity areas</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 12,
          }}
        >
          {opportunityMarkets.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => navigate(`/market-performance?market=${m.id}`)}
              style={{
                background: '#ffffff',
                border: `1px solid ${NAVY_12}`,
                borderLeft: `3px solid #16A34A`,
                borderRadius: 12,
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(5,10,68,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(5,10,68,0.04)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>
                  {m.flag} {m.name}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: '#D1FAE5',
                    color: '#065F46',
                    fontSize: 11,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  +{m.growthVsPlanPct.toFixed(1)}% vs plan
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: NAVY_70, lineHeight: 1.5 }}>
                {m.oneLineContext}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
