import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  DollarSign,
  Eye,
  GraduationCap,
  LineChart,
  Newspaper,
  SlidersHorizontal,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
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
import { Donut, HeroPriorityList, SourceTag } from '../components/composites';
import type { HeroPriorityItem } from '../components/composites';
import { RecommendationCard } from '../components/decision';
import { executionSignals, gmHome, marketPerformanceContext, markets, overview } from '../data/scenario';
import type { GmWidget, GmWidgetId } from '../data/scenario';
import { usePersistedState } from '../context/usePersistedState';

const RED = '#E11D48';

// Icon lookup for the inline synthesised block's rich chips. Each
// assemblySources entry names its icon by string key, resolved here.
const HERO_ICONS = {
  TrendingUp,
  Activity,
  GraduationCap,
  Users,
  DollarSign,
  BookOpen,
  Database,
} as const;

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

// ─── Hero block (priority + assembly, one card) ───────────────────────────
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';

const heroBlockStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderLeft: `4px solid ${RED}`,
  borderRadius: 12,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  overflow: 'hidden',
};

const heroTopStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: 24,
  padding: '18px 22px',
};

const heroEyebrowRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: RED,
};

const heroPulseDotStyle: CSSProperties = {
  display: 'inline-block',
  width: 7,
  height: 7,
  borderRadius: 999,
  background: RED,
};

const heroHeadlineStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.4,
  margin: '6px 0 0',
  maxWidth: 820,
};

const heroMetaStyle: CSSProperties = {
  fontSize: 12,
  color: 'rgba(5,10,68,0.55)',
  marginTop: 8,
};

const heroHairlineStyle: CSSProperties = {
  height: 1,
  background: NAVY_06,
  border: 'none',
  margin: 0,
};

const synthesisedBlockStyle: CSSProperties = {
  background: '#EAF1FB',
  padding: '18px 22px 20px',
};

const synthesisedEyebrowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: BLUE,
};

const synthesisedBodyStyle: CSSProperties = {
  fontSize: 14,
  color: NAVY,
  lineHeight: 1.55,
  margin: '8px 0 14px',
  maxWidth: 860,
};

const synthesisedChipRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 10,
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const synthesisedChipStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 10,
  padding: '10px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const synthesisedChipIconStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  background: '#EAF1FB',
  color: BLUE,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const synthesisedChipBodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 0,
};

const synthesisedChipLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.25,
};

const synthesisedChipMetaStyle: CSSProperties = {
  fontSize: 11,
  color: 'rgba(5,10,68,0.55)',
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

type DonutTone = 'on-track' | 'watch' | 'at-risk';

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

// ─── Toolbar (cockpit configurability) ────────────────────────────────────

const toolbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
};

const toolbarTitleStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: NAVY,
  margin: 0,
  letterSpacing: '-0.01em',
};

const toolbarCaptionStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_55,
  marginTop: 2,
};

const segmentedWrapStyle: CSSProperties = {
  display: 'inline-flex',
  background: NAVY_06,
  borderRadius: 999,
  padding: 3,
  gap: 2,
};

const segmentBtnStyle = (active: boolean): CSSProperties => ({
  border: 'none',
  borderRadius: 999,
  padding: '6px 14px',
  fontSize: 12,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  background: active ? '#ffffff' : 'transparent',
  color: active ? NAVY : NAVY_55,
  boxShadow: active ? '0 1px 2px rgba(5,10,68,0.10)' : 'none',
});

const customizeBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  height: 34,
  padding: '0 14px',
  borderRadius: 999,
  background: NAVY,
  border: 'none',
  color: '#ffffff',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// ─── Teaser cards ─────────────────────────────────────────────────────────

const TEASER_ACCENT: Record<string, string> = {
  navy: NAVY,
  blue: BLUE,
  amber: '#F59E0B',
  green: '#16A34A',
};

const TEASER_ICON: Record<GmWidgetId, typeof Bell> = {
  alertsTeaser: Bell,
  otxWatchTeaser: Eye,
  trainingToSalesTeaser: LineChart,
  briefingDigest: Newspaper,
  heroRecommendation: Activity,
  weekSummaryTiles: Activity,
  topMovements: TrendingUp,
  performanceScatter: TrendingUp,
};

interface ScatterPoint {
  marketId: string;
  marketName: string;
  flag: string;
  x: number;
  y: number;
  focus: boolean;
}

// Per-market label offset overrides for the DACH scatter.
const LABEL_OFFSETS: Record<string, { dx: number; dy: number; anchor?: 'start' | 'end' }> = {
  de: { dx: 12, dy: 5 },
  ch: { dx: 10, dy: -8 },
  at: { dx: 12, dy: 5 },
};

// Custom dot renderer. Germany is emphasised (heavier dot, navy bold text).
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

function arraysEqual(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export default function GMHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const hero = overview.heroCallout;

  // The cockpit's ordered widget list, persisted. Defaults to the default layout.
  const [widgetIds, setWidgetIds] = usePersistedState<GmWidgetId[]>(
    'ariya.ce.gmHome',
    [...gmHome.layouts.default],
  );
  const [panelOpen, setPanelOpen] = useState(false);

  const widgetById = useMemo(() => {
    const map = new Map<GmWidgetId, GmWidget>();
    gmHome.widgets.forEach((w) => map.set(w.id, w));
    return map;
  }, []);

  const activePreset: 'default' | 'customized' | 'custom' = arraysEqual(
    widgetIds,
    gmHome.layouts.default,
  )
    ? 'default'
    : arraysEqual(widgetIds, gmHome.layouts.customized)
    ? 'customized'
    : 'custom';

  // Hash-based scroll so strategicChainLink lands on the recommendation block.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const handle = window.requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => window.cancelAnimationFrame(handle);
    }
  }, [location.hash]);

  const scatterData: ScatterPoint[] = markets.map((m) => ({
    marketId: m.id,
    marketName: m.name,
    flag: m.flag,
    x: m.investmentIntensityPct,
    y: m.growthVsPlanPct,
    focus: m.id === 'de',
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
      coveredAbove: (item as { coveredAbove?: { text: string } }).coveredAbove,
    };
  });

  // Top opportunity areas: markets above plan, sorted by growth vs plan descending.
  const opportunityMarkets = [...markets]
    .filter((m) => m.growthVsPlanPct > 0)
    .sort((a, b) => b.growthVsPlanPct - a.growthVsPlanPct)
    .slice(0, 3);

  // Composite risk score derived from the existing summary. 1 of 3 DACH markets
  // needs attention, plus 4 open decisions. The score is illustrative.
  const marketsAtRisk = overview.summary.marketsRequiringAttention.value;
  const totalMarkets = markets.length;
  const riskFraction = marketsAtRisk / totalMarkets;
  const openDecisionsValue = overview.summary.openDecisions.value;
  const riskScore = Math.round(
    riskFraction * 60 + Math.min(openDecisionsValue / 10, 1) * 40,
  );
  const riskLabel =
    riskScore >= 60 ? 'Urgent'
    : riskScore >= 40 ? 'At Risk'
    : riskScore >= 20 ? 'Watch'
    : 'On Track';
  const riskPalette = STATUS_PALETTE[riskLabel];

  // ─── Widget renderers ───────────────────────────────────────────────────

  function renderHero(): ReactNode {
    return (
      <section style={heroBlockStyle} aria-label="This week's priority, synthesised sources, and Ariya recommendation">
        <div style={heroTopStyle}>
          <div>
            <div style={heroEyebrowRowStyle}>
              <span style={heroPulseDotStyle} aria-hidden />
              {hero.eyebrow}
            </div>
            <h2 style={heroHeadlineStyle}>{hero.headline}</h2>
            <div style={heroMetaStyle}>{hero.metaRow}</div>
          </div>
        </div>

        <hr style={heroHairlineStyle} aria-hidden />

        <div style={synthesisedBlockStyle}>
          <div style={synthesisedEyebrowStyle}>
            <Database size={12} strokeWidth={2.25} color={BLUE} aria-hidden />
            Ariya synthesised {overview.assemblySources.length} sources to surface this
          </div>
          <p style={synthesisedBodyStyle}>{overview.synthesisedNote}</p>
          <ul style={synthesisedChipRowStyle}>
            {overview.assemblySources.map((s) => {
              const Icon = HERO_ICONS[s.icon as keyof typeof HERO_ICONS] ?? Database;
              return (
                <li key={s.id} style={synthesisedChipStyle}>
                  <span style={synthesisedChipIconStyle}>
                    <Icon size={14} strokeWidth={2} aria-hidden />
                  </span>
                  <div style={synthesisedChipBodyStyle}>
                    <span style={synthesisedChipLabelStyle}>{s.label}</span>
                    <span style={synthesisedChipMetaStyle}>{s.meta}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <hr style={heroHairlineStyle} aria-hidden />

        <div id="recommendation-anchor" style={{ scrollMarginTop: 80 }}>
          <RecommendationCard
            eyebrow={overview.recommendation.eyebrow}
            recommendation={overview.recommendation.recommendation}
            summary={overview.recommendation.reasoning}
            whyBullets={overview.recommendation.whyBullets}
            confidence={overview.recommendation.confidence}
            confidenceRationale={overview.recommendation.confidenceRationale}
            conditions={overview.recommendation.conditions}
            nextActions={overview.recommendation.nextActions}
            nextActionsMeta={overview.recommendation.nextActionsMeta}
            sources={overview.recommendation.sources}
            footerMeta={overview.recommendation.footerMeta}
            digDeeper={overview.recommendation.digDeeper}
            seamless
            collapsible
            defaultCollapsed
            actions={[
              {
                label: 'Log this decision →',
                onClick: () => navigate('/decision-log?from=gm-home'),
                primary: true,
              },
            ]}
          />
        </div>
      </section>
    );
  }

  function renderTiles(): ReactNode {
    return (
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
            <span style={cockpitEyebrowStyle}>Composite risk</span>
            <span style={cockpitStatusPillStyle(riskPalette.pillBg, riskPalette.pillFg)}>
              {riskLabel}
            </span>
            <span style={cockpitCaptionStyle}>updated May 19, 2026</span>
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
    );
  }

  function renderTopMovements(): ReactNode {
    return (
      <section>
        <div style={sectionLabelStyle}>Markets requiring leadership attention</div>
        <HeroPriorityList
          items={heroItems}
          primaryLabelFor={(item) => `Open ${item.marketName} detail`}
          secondaryCtaLabel="Dig Deeper with Ariya"
          onPrimary={(item) => navigate(item.route)}
          onSecondary={() => navigate('/ask-ariya?q=germany-60d-checkpoint')}
        />
        <div style={{ ...sectionLabelStyle, marginTop: 22 }}>Top opportunity areas</div>
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
    );
  }

  function renderScatter(): ReactNode {
    return (
      <section style={chartCardStyle}>
        <h2 style={chartTitleStyle}>Performance vs Investment Intensity</h2>
        <p style={chartSubtitleStyle}>Q1 2026 · 3 DACH markets · Germany highlighted</p>

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
              <Scatter data={scatterData} shape={CustomDot} isAnimationActive={false} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <p style={interpretationStyle}>{overview.scatterInterpretation}</p>
      </section>
    );
  }

  function renderTeaser(w: GmWidget): ReactNode {
    if (!w.teaser) return null;
    const accent = TEASER_ACCENT[w.teaser.accent] ?? NAVY;
    const Icon = TEASER_ICON[w.id];
    // The briefing card has an overdue task, so it reads as At Risk: amber
    // stripe/icon, but the link uses the standard blue link colour.
    const isBriefing = w.id === 'briefingDigest';
    const linkColor = isBriefing ? BLUE : accent;
    return (
      <button
        type="button"
        onClick={() => navigate(w.teaser!.to)}
        style={{
          background: '#ffffff',
          border: `1px solid ${NAVY_12}`,
          borderLeft: `4px solid ${accent}`,
          borderRadius: 12,
          padding: '16px 18px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          width: '100%',
        }}
      >
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: NAVY_06,
            color: accent,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={18} strokeWidth={2} aria-hidden />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: NAVY_55 }}>
            {w.teaser.eyebrow}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: '2px 0 3px', lineHeight: 1.3 }}>
            {w.teaser.headline}
          </div>
          {isBriefing ? briefingTiers() : (
            <p style={{ margin: 0, fontSize: 13, color: NAVY_70, lineHeight: 1.5 }}>{w.teaser.body}</p>
          )}
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: linkColor, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {w.teaser.cta}
          <ArrowRight size={14} strokeWidth={2.5} />
        </span>
      </button>
    );
  }

  // Two labelled tiers for the Morning Briefing card. Both Germany numbers are
  // sourced from the shared cohort values, not typed into this component:
  //   followup rate  → marketPerformanceContext['de'].postTrainingFollowUpRatePct
  //   below-cadence  → executionSignals['trained-not-visited'] DE breakdown
  function briefingTiers(): ReactNode {
    const germanyFollowupPct =
      marketPerformanceContext.find((c) => c.marketId === 'de')?.performanceInContext
        .postTrainingFollowUpRatePct;
    const germanyBelowCadence = executionSignals
      .find((s) => s.id === 'trained-not-visited')
      ?.marketBreakdown.find((b) => b.marketId === 'de')?.count;
    const tierLabel: CSSProperties = {
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      color: NAVY_55,
      margin: '6px 0 2px',
    };
    const tierBody: CSSProperties = { margin: 0, fontSize: 13, color: NAVY_70, lineHeight: 1.5 };
    return (
      <div>
        <div style={tierLabel}>Signals</div>
        <p style={tierBody}>
          Germany follow-up slipped to {germanyFollowupPct}%. {germanyBelowCadence} injectors below cadence in Germany.
        </p>
        <div style={tierLabel}>Assigned tasks</div>
        <p style={tierBody}>
          Injector follow-up list overdue 2 days. Austria post-training log due this week.
        </p>
      </div>
    );
  }

  function renderWidget(id: GmWidgetId): ReactNode {
    const w = widgetById.get(id);
    if (!w) return null;
    switch (id) {
      case 'heroRecommendation':
        return renderHero();
      case 'weekSummaryTiles':
        return renderTiles();
      case 'topMovements':
        return renderTopMovements();
      case 'performanceScatter':
        return renderScatter();
      default:
        return renderTeaser(w);
    }
  }

  // ─── Customize panel handlers ───────────────────────────────────────────

  const toggleWidget = (id: GmWidgetId) => {
    setWidgetIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const moveWidget = (id: GmWidgetId, dir: -1 | 1) => {
    setWidgetIds((prev) => {
      const i = prev.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div style={pageStyle}>
      {/* Toolbar · proves the cockpit is configurable. */}
      <div style={toolbarStyle}>
        <div>
          <h1 style={toolbarTitleStyle}>GM Home</h1>
          <p style={toolbarCaptionStyle}>
            Your cockpit for DACH commercial effectiveness. Arrange it the way you run the business.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={segmentedWrapStyle} role="tablist" aria-label="Cockpit layout">
            <button
              type="button"
              role="tab"
              aria-selected={activePreset === 'default'}
              onClick={() => setWidgetIds([...gmHome.layouts.default])}
              style={segmentBtnStyle(activePreset === 'default')}
            >
              Default
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePreset === 'customized'}
              onClick={() => setWidgetIds([...gmHome.layouts.customized])}
              style={segmentBtnStyle(activePreset === 'customized')}
            >
              Customized
            </button>
            {activePreset === 'custom' && (
              <span style={segmentBtnStyle(true)}>Custom</span>
            )}
          </div>
          <button type="button" style={customizeBtnStyle} onClick={() => setPanelOpen(true)}>
            <SlidersHorizontal size={14} strokeWidth={2.25} />
            Customize
          </button>
        </div>
      </div>

      {widgetIds.map((id) => (
        <div key={id}>{renderWidget(id)}</div>
      ))}

      {widgetIds.length === 0 && (
        <div
          style={{
            background: NAVY_06,
            border: `1px dashed ${NAVY_12}`,
            borderRadius: 12,
            padding: 28,
            textAlign: 'center',
            color: NAVY_55,
            fontSize: 13,
          }}
        >
          No widgets selected. Open Customize to add some.
        </div>
      )}

      {panelOpen && (
        <CustomizePanel
          widgetIds={widgetIds}
          onClose={() => setPanelOpen(false)}
          onToggle={toggleWidget}
          onMove={moveWidget}
          onLoadDefault={() => setWidgetIds([...gmHome.layouts.default])}
          onLoadCustomized={() => setWidgetIds([...gmHome.layouts.customized])}
        />
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Customize panel (portal modal). Add, remove, and reorder widgets, and view
// the markets, brands, and signals the cockpit is scoped to.
// ───────────────────────────────────────────────────────────────────────────

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(5,10,68,0.32)',
  zIndex: 2000,
  display: 'flex',
  justifyContent: 'flex-end',
};

const drawerStyle: CSSProperties = {
  width: 'min(440px, 92vw)',
  height: '100%',
  background: '#ffffff',
  boxShadow: '-12px 0 32px rgba(5,10,68,0.16)',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
};

const drawerHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '18px 20px',
  borderBottom: `1px solid ${NAVY_12}`,
  position: 'sticky',
  top: 0,
  background: '#ffffff',
  zIndex: 1,
};

const drawerSectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: NAVY_55,
  margin: '18px 20px 8px',
};

const widgetRowStyle = (on: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 12px',
  margin: '0 14px 8px',
  borderRadius: 10,
  border: `1px solid ${on ? NAVY_12 : 'transparent'}`,
  background: on ? '#ffffff' : NAVY_06,
});

const iconBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 26,
  height: 26,
  borderRadius: 7,
  border: `1px solid ${NAVY_12}`,
  background: '#ffffff',
  color: NAVY_70,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const checkBtnStyle = (on: boolean): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  borderRadius: 6,
  border: `1.5px solid ${on ? NAVY : NAVY_12}`,
  background: on ? NAVY : '#ffffff',
  color: '#ffffff',
  cursor: 'pointer',
  flexShrink: 0,
});

const scopeChipStyle = (on: boolean): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '5px 11px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  border: `1px solid ${on ? NAVY : NAVY_12}`,
  background: on ? NAVY : '#ffffff',
  color: on ? '#ffffff' : NAVY_55,
});

const presetBtnStyle: CSSProperties = {
  flex: 1,
  height: 36,
  borderRadius: 9,
  border: `1px solid ${NAVY_12}`,
  background: '#ffffff',
  color: NAVY,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

function CustomizePanel({
  widgetIds,
  onClose,
  onToggle,
  onMove,
  onLoadDefault,
  onLoadCustomized,
}: {
  widgetIds: GmWidgetId[];
  onClose: () => void;
  onToggle: (id: GmWidgetId) => void;
  onMove: (id: GmWidgetId, dir: -1 | 1) => void;
  onLoadDefault: () => void;
  onLoadCustomized: () => void;
}) {
  // Visible widgets first, in their current order; then the hidden ones.
  const visible = widgetIds
    .map((id) => gmHome.widgets.find((w) => w.id === id))
    .filter((w): w is GmWidget => Boolean(w));
  const hidden = gmHome.widgets.filter((w) => !widgetIds.includes(w.id));

  return createPortal(
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true" aria-label="Customize cockpit">
      <div style={drawerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={drawerHeaderStyle}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Customize cockpit</div>
            <div style={{ fontSize: 12, color: NAVY_55, marginTop: 2 }}>
              Add, remove, and reorder widgets. Scope the markets, brands, and signals.
            </div>
          </div>
          <button type="button" style={iconBtnStyle} onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '14px 14px 0' }}>
          <button type="button" style={presetBtnStyle} onClick={onLoadDefault}>
            Reset to default
          </button>
          <button type="button" style={presetBtnStyle} onClick={onLoadCustomized}>
            Load customized example
          </button>
        </div>

        <div style={drawerSectionLabelStyle}>On the cockpit · reorder with arrows</div>
        {visible.map((w, i) => (
          <div key={w.id} style={widgetRowStyle(true)}>
            <button
              type="button"
              style={checkBtnStyle(true)}
              onClick={() => onToggle(w.id)}
              aria-label={`Hide ${w.title}`}
            >
              <Check size={13} strokeWidth={3} />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{w.title}</div>
              <div style={{ fontSize: 11, color: NAVY_55, lineHeight: 1.4 }}>{w.description}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <button
                type="button"
                style={{ ...iconBtnStyle, width: 24, height: 18, opacity: i === 0 ? 0.35 : 1 }}
                onClick={() => onMove(w.id, -1)}
                disabled={i === 0}
                aria-label={`Move ${w.title} up`}
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                style={{ ...iconBtnStyle, width: 24, height: 18, opacity: i === visible.length - 1 ? 0.35 : 1 }}
                onClick={() => onMove(w.id, 1)}
                disabled={i === visible.length - 1}
                aria-label={`Move ${w.title} down`}
              >
                <ChevronDown size={13} />
              </button>
            </div>
          </div>
        ))}

        {hidden.length > 0 && (
          <>
            <div style={drawerSectionLabelStyle}>Available to add</div>
            {hidden.map((w) => (
              <div key={w.id} style={widgetRowStyle(false)}>
                <button
                  type="button"
                  style={checkBtnStyle(false)}
                  onClick={() => onToggle(w.id)}
                  aria-label={`Add ${w.title}`}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{w.title}</div>
                  <div style={{ fontSize: 11, color: NAVY_55, lineHeight: 1.4 }}>{w.description}</div>
                </div>
              </div>
            ))}
          </>
        )}

        <div style={drawerSectionLabelStyle}>Markets</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 20px' }}>
          {gmHome.scope.markets.map((m) => (
            <span key={m.id} style={scopeChipStyle(m.on)}>
              {m.on && <Check size={12} strokeWidth={3} />}
              {m.label}
            </span>
          ))}
        </div>

        <div style={drawerSectionLabelStyle}>Brands</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 20px' }}>
          {gmHome.scope.brands.map((b) => (
            <span key={b.id} style={scopeChipStyle(b.on)}>
              {b.on && <Check size={12} strokeWidth={3} />}
              {b.label}
            </span>
          ))}
        </div>

        <div style={drawerSectionLabelStyle}>Signals</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 20px' }}>
          {gmHome.scope.signals.map((s) => (
            <span key={s.id} style={scopeChipStyle(s.on)}>
              {s.on && <Check size={12} strokeWidth={3} />}
              {s.label}
            </span>
          ))}
        </div>

        <div style={{ padding: '20px', marginTop: 'auto' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              height: 40,
              borderRadius: 10,
              border: 'none',
              background: NAVY,
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
