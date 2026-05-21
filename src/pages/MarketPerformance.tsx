import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { WhatThisSuggests } from '../components/decision';
import { brands, marketPerformanceContext, markets } from '../data/scenario';
import type { StatCallout, StatTone } from '../data/scenario';

// ───────────────────────────────────────────────────────────────────────────
// Tokens
// ───────────────────────────────────────────────────────────────────────────

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_25 = 'rgba(5,10,68,0.25)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';
const GREEN = '#16A34A';
const GREEN_BG = '#ECFDF5';
const AMBER = '#F59E0B';
const AMBER_BG = '#FFFBEB';
const RED = '#E11D48';
const RED_BG = '#FEF2F2';

const TONE_TEXT: Record<StatTone, string> = {
  'on-track': GREEN,
  watch: AMBER,
  'at-risk': RED,
};
const TONE_BG: Record<StatTone, string> = {
  'on-track': GREEN_BG,
  watch: AMBER_BG,
  'at-risk': RED_BG,
};
// Filled bar color for the benchmark bar — same scale as the text tone but
// slightly muted for the long bar.
const TONE_BAR: Record<StatTone, string> = {
  'on-track': '#22C55E',
  watch: '#F59E0B',
  'at-risk': '#F87171',
};

// ───────────────────────────────────────────────────────────────────────────
// Layout
// ───────────────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  paddingBottom: 48,
};

// ── Country pill row ──
const pillRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

const countryPillBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 14px',
  borderRadius: 999,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY_70,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
};

const countryPillActive: CSSProperties = {
  background: NAVY,
  border: `1px solid ${NAVY}`,
  color: '#ffffff',
};

// ── Section header (Level 2: navy bold, outside cards) ──
const sectionHeaderRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 16,
  marginBottom: 14,
  flexWrap: 'wrap',
};

const sectionHeaderTitleStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  color: NAVY,
  lineHeight: 1.3,
  margin: 0,
};

const sectionHeaderSubtitleStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_55,
  margin: '2px 0 0',
  lineHeight: 1.4,
};

const sectionHeaderRightStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  whiteSpace: 'nowrap',
};

// ── Card primitives ──
const cardBase: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 12,
  padding: 18,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

// Level 3 card title (inside cards)
const cardTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: NAVY,
  margin: 0,
};

const cardSubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  marginTop: 2,
};

// Level 4: sub-label inside card body (grey small-caps)
const innerSubLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 8,
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

// ───────────────────────────────────────────────────────────────────────────
// Brand selector card
// ───────────────────────────────────────────────────────────────────────────

interface BrandCardProps {
  name: string;
  primary?: boolean;
  selected: boolean;
  onSelect: () => void;
  salesQtdEur: number | null;
  growthVsPlanPct: number | null;
  trend?: 'up' | 'down' | 'flat';
}

const brandCardStyle = (selected: boolean): CSSProperties => ({
  ...cardBase,
  borderColor: selected ? NAVY : NAVY_12,
  borderWidth: selected ? 2 : 1,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  cursor: 'pointer',
  transition: 'border-color 120ms ease, box-shadow 120ms ease',
});

const radioOuterStyle = (selected: boolean): CSSProperties => ({
  width: 16,
  height: 16,
  borderRadius: 999,
  border: `1.5px solid ${selected ? NAVY : NAVY_25}`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const radioInnerStyle: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: NAVY,
};

function BrandCard({
  name,
  primary,
  selected,
  onSelect,
  salesQtdEur,
  growthVsPlanPct,
  trend = 'flat',
}: BrandCardProps) {
  const noData = salesQtdEur == null || growthVsPlanPct == null;

  const tone: StatTone =
    growthVsPlanPct == null
      ? 'watch'
      : growthVsPlanPct < -2
      ? 'at-risk'
      : growthVsPlanPct < 0
      ? 'watch'
      : 'on-track';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? GREEN : trend === 'down' ? RED : NAVY_55;
  const trendLabel =
    trend === 'up' ? 'Trending up' : trend === 'down' ? 'Trending down' : 'Stable';

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onSelect();
        }
      }}
      style={brandCardStyle(selected)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={radioOuterStyle(selected)} aria-hidden>
          {selected && <span style={radioInnerStyle} />}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{name}</span>
        {primary && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: NAVY_55,
            }}
          >
            Primary
          </span>
        )}
        {selected && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: NAVY_55,
            }}
          >
            Viewing
          </span>
        )}
      </div>

      <div style={innerSubLabelStyle}>QTD sales</div>

      {noData ? (
        <div style={{ fontSize: 12, color: NAVY_55, fontStyle: 'italic' }}>
          Not in pilot scope for this market.
        </div>
      ) : (
        <>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: NAVY,
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            €{salesQtdEur!.toFixed(1)}M
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 2,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 9px',
                borderRadius: 999,
                background: TONE_BG[tone],
                color: TONE_TEXT[tone],
                fontSize: 11,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: TONE_TEXT[tone] }} />
              {growthVsPlanPct! > 0 ? '+' : ''}
              {growthVsPlanPct!.toFixed(1)}% vs plan
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                color: trendColor,
              }}
            >
              <TrendIcon size={12} strokeWidth={2.5} />
              {trendLabel}
              <span style={{ color: NAVY_55, fontWeight: 500 }}>· 6q</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Stat card (Performance in context)
// ───────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  subtitle: string;
  value: ReactNode;
  delta: number | undefined;
  deltaUnit: string; // e.g. "pts" or ""
  deltaTone: StatTone;
  // Benchmark bar
  barTone: StatTone;
  barMin: number;
  barMax: number;
  barValue: number;
  benchmark: number;
  benchmarkLabel?: string;
  // Inner sub-section
  innerLabel: string;
  innerContent: ReactNode;
  // Bottom callout
  callout?: StatCallout;
  onCalloutClick?: () => void;
}

const statCardStyle = (tone: StatTone): CSSProperties => ({
  ...cardBase,
  padding: 0,
  borderColor: NAVY_12,
  borderLeft: `4px solid ${TONE_BAR[tone]}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const statCardBodyStyle: CSSProperties = {
  padding: '18px 18px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const statHeaderRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 10,
};

const statValueStyle: CSSProperties = {
  fontSize: 36,
  fontWeight: 800,
  color: NAVY,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
  marginTop: 2,
};

const statValueUnitStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: NAVY,
  marginLeft: 2,
};

const deltaPillStyle = (tone: StatTone): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: 999,
  background: TONE_BG[tone],
  color: TONE_TEXT[tone],
  fontSize: 11,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
});

function StatCard(props: StatCardProps) {
  const calloutTone = props.callout?.tone;
  return (
    <article style={statCardStyle(props.barTone)}>
      <div style={statCardBodyStyle}>
        <div style={statHeaderRowStyle}>
          <div>
            <h3 style={cardTitleStyle}>{props.title}</h3>
            <p style={cardSubtitleStyle}>{props.subtitle}</p>
          </div>
          {props.delta != null && (
            <span style={deltaPillStyle(props.deltaTone)}>
              {props.delta > 0 ? '+' : ''}
              {Number.isInteger(props.delta) ? props.delta : props.delta.toFixed(1)}
              {props.deltaUnit ? ` ${props.deltaUnit}` : ''}
            </span>
          )}
        </div>

        <div>
          {props.value}
        </div>

        <BenchmarkBar
          tone={props.barTone}
          min={props.barMin}
          max={props.barMax}
          value={props.barValue}
          benchmark={props.benchmark}
          benchmarkLabel={props.benchmarkLabel}
        />

        <div>
          <div style={innerSubLabelStyle}>{props.innerLabel}</div>
          {props.innerContent}
        </div>
      </div>

      {props.callout && (
        <div
          style={{
            background: TONE_BG[calloutTone!],
            borderTop: `1px solid ${NAVY_06}`,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: TONE_TEXT[calloutTone!],
                marginBottom: 6,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: TONE_TEXT[calloutTone!] }} />
              {props.callout.label}
            </div>
            <p style={{ fontSize: 13, color: NAVY_70, lineHeight: 1.55, margin: 0 }}>
              {props.callout.body}
            </p>
          </div>
          <button
            type="button"
            onClick={props.onCalloutClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 34,
              padding: '0 14px',
              borderRadius: 8,
              background: '#ffffff',
              border: `1px solid ${NAVY_12}`,
              color: NAVY,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {props.callout.action}
            <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </article>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Benchmark bar
// ───────────────────────────────────────────────────────────────────────────

interface BenchmarkBarProps {
  tone: StatTone;
  min: number;
  max: number;
  value: number;
  benchmark: number;
  benchmarkLabel?: string;
}

function BenchmarkBar({ tone, min, max, value, benchmark, benchmarkLabel }: BenchmarkBarProps) {
  const fillPct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const benchPct = Math.min(100, Math.max(0, ((benchmark - min) / (max - min)) * 100));

  return (
    <div>
      <div
        style={{
          position: 'relative',
          height: 10,
          background: NAVY_06,
          borderRadius: 999,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${fillPct}%`,
            background: TONE_BAR[tone],
            borderRadius: 999,
          }}
        />
        {/* Benchmark marker (vertical tick + triangle below) */}
        <div
          style={{
            position: 'absolute',
            top: -2,
            bottom: -2,
            left: `${benchPct}%`,
            width: 2,
            background: NAVY,
            transform: 'translateX(-1px)',
            borderRadius: 1,
          }}
        />
      </div>
      <div
        style={{
          position: 'relative',
          height: 18,
          fontSize: 10,
          color: NAVY_55,
          fontVariantNumeric: 'tabular-nums',
          marginTop: 4,
        }}
      >
        <span style={{ position: 'absolute', left: 0, top: 0 }}>{min}</span>
        <span
          style={{
            position: 'absolute',
            left: `${benchPct}%`,
            top: 0,
            transform: 'translateX(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            color: NAVY,
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: 8, color: NAVY }}>▼</span>
          {benchmarkLabel ?? `benchmark ${benchmark}`}
        </span>
        <span style={{ position: 'absolute', right: 0, top: 0 }}>{max}</span>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Inner mini-visualisations
// ───────────────────────────────────────────────────────────────────────────

function InvestmentMix({ mix }: { mix: { label: string; value: number; color: string }[] }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          height: 10,
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 10,
        }}
      >
        {mix.map((m) => (
          <div key={m.label} style={{ width: `${m.value}%`, background: m.color }} />
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: 14,
          rowGap: 4,
          fontSize: 11,
          color: NAVY_70,
        }}
      >
        {mix.map((m) => (
          <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: m.color, flexShrink: 0 }} />
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {m.label}
            </span>
            <span style={{ fontWeight: 700, color: NAVY, fontVariantNumeric: 'tabular-nums' }}>{m.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Per-bar coloured bar chart. Recharts <Bar> doesn't expose per-bar fill via
// the data-driven API without a Cell, so we draw the bars manually.
function VisitsBarColoured({ data }: { data: { month: string; visits: number; tone: StatTone }[] }) {
  const max = Math.max(...data.map((d) => d.visits)) || 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, height: 100, paddingBottom: 16, position: 'relative' }}>
      {data.map((d) => {
        const h = (d.visits / max) * 80;
        return (
          <div key={d.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                width: '100%',
                maxWidth: 32,
                height: `${h}px`,
                background: TONE_BAR[d.tone],
                borderRadius: 4,
              }}
              title={`${d.month}: ${d.visits} visits`}
            />
            <span style={{ marginTop: 6, fontSize: 10, color: NAVY_55 }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function PeerBars({ peers }: { peers: { label: string; value: number; highlight?: boolean }[] }) {
  const max = Math.max(...peers.map((p) => p.value), 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {peers.map((p) => {
        const w = (p.value / max) * 100;
        const isHighlight = p.highlight;
        return (
          <div
            key={p.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 36px',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
            }}
          >
            <span style={{ color: isHighlight ? RED : NAVY_70, fontWeight: isHighlight ? 700 : 500 }}>
              {p.label}
            </span>
            <div style={{ height: 6, background: NAVY_06, borderRadius: 999 }}>
              <div
                style={{
                  width: `${w}%`,
                  height: '100%',
                  background: isHighlight ? RED : '#9BC1FF',
                  borderRadius: 999,
                }}
              />
            </div>
            <span
              style={{
                textAlign: 'right',
                color: isHighlight ? RED : NAVY,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {p.value}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TrendMini({
  data,
  benchmark,
  benchmarkLabel,
}: {
  data: { quarter: string; value: number }[];
  benchmark: number;
  benchmarkLabel: string;
}) {
  return (
    <div style={{ width: '100%', height: 92 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 60, bottom: 4, left: -32 }}>
          <CartesianGrid stroke="rgba(5,10,68,0.05)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="quarter" tick={{ fill: NAVY_55, fontSize: 10 }} tickLine={false} axisLine={{ stroke: NAVY_12 }} />
          <YAxis hide domain={['dataMin - 1', (dataMax: number) => Math.max(dataMax, benchmark) + 1]} />
          <Tooltip
            contentStyle={tooltipBoxStyle as any}
            itemStyle={{ color: '#ffffff' }}
            labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
            formatter={(v: any) => (typeof v === 'number' ? `${v.toFixed(1)}%` : v)}
          />
          <ReferenceLine
            y={benchmark}
            stroke={NAVY_25}
            strokeDasharray="4 4"
            label={{
              value: benchmarkLabel,
              position: 'right',
              fill: NAVY_55,
              fontSize: 10,
              offset: 6,
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={AMBER}
            strokeWidth={2}
            dot={{ fill: AMBER, r: 2.5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────────

export default function MarketPerformance() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const fromUrl = searchParams.get('market');
  const initialMarket = fromUrl && markets.some((m) => m.id === fromUrl) ? fromUrl : 'it';
  const [selectedMarketId, setSelectedMarketId] = useState<string>(initialMarket);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('xeomin');

  useEffect(() => {
    if (fromUrl && markets.some((m) => m.id === fromUrl) && fromUrl !== selectedMarketId) {
      setSelectedMarketId(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromUrl]);

  const selectMarket = (id: string) => {
    setSelectedMarketId(id);
    const next = new URLSearchParams(searchParams);
    next.set('market', id);
    setSearchParams(next, { replace: true });
  };

  const selectedMarket = markets.find((m) => m.id === selectedMarketId) ?? markets[0];
  const selectedBrand = brands.find((b) => b.id === selectedBrandId) ?? brands[0];

  const brandPerf = selectedBrand.performance.find((p) => p.marketId === selectedMarketId);

  const trendData = useMemo(() => {
    if (!brandPerf) return [];
    const actualSeries = brandPerf.trendIndexed;
    const n = actualSeries.length;
    const actualEnd = actualSeries[n - 1];
    const planEnd = actualEnd / (1 + brandPerf.growthVsPlanPct / 100);
    const planStart = 100;
    return actualSeries.map((value, idx) => {
      const t = idx / (n - 1);
      const plan = planStart + (planEnd - planStart) * t;
      const label = idx === n - 1 ? 'Q1 26' : `Q-${n - 1 - idx}`;
      return { label, Actual: value, Plan: parseFloat(plan.toFixed(2)) };
    });
  }, [brandPerf]);

  const contextEntry = marketPerformanceContext.find((c) => c.marketId === selectedMarketId);
  const ctx = contextEntry?.performanceInContext;

  const forecastData = useMemo(
    () =>
      contextEntry?.forecastVsActual.map((row) => ({
        quarter: row.quarter,
        Forecast: row.forecast,
        Actual: row.actual,
      })) ?? [],
    [contextEntry],
  );

  // Brand row for the brand selector
  const brandRow = brands.map((b) => {
    const perf = b.performance.find((p) => p.marketId === selectedMarketId);
    return { id: b.id, name: b.name, primary: b.primary, perf };
  });

  function trendDirection(perf: typeof brandPerf): 'up' | 'down' | 'flat' {
    if (!perf) return 'flat';
    const first = perf.trendIndexed[0];
    const last = perf.trendIndexed[perf.trendIndexed.length - 1];
    const d = last - first;
    return d > 0.5 ? 'up' : d < -0.5 ? 'down' : 'flat';
  }

  const ctxBrandLabel = `${selectedBrand.name} · ${selectedMarket.name}`;

  return (
    <div style={pageStyle}>
      {/* ── Country pill row ───────────────────────────────────────── */}
      <div style={pillRowStyle} role="tablist" aria-label="Select market">
        {markets.map((m) => {
          const active = m.id === selectedMarketId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => selectMarket(m.id)}
              style={{ ...countryPillBase, ...(active ? countryPillActive : null) }}
              role="tab"
              aria-selected={active}
            >
              <span aria-hidden style={{ fontSize: 15, lineHeight: 1 }}>{m.flag}</span>
              {m.name}
            </button>
          );
        })}
      </div>

      {/* ── Brand · {Country} ──────────────────────────────────────── */}
      <section>
        <div style={sectionHeaderRowStyle}>
          <div>
            <h2 style={sectionHeaderTitleStyle}>Brand · {selectedMarket.name}</h2>
            <p style={sectionHeaderSubtitleStyle}>Pick a brand. Everything below reflects this selection.</p>
          </div>
        </div>
        <div
          role="radiogroup"
          aria-label="Select brand"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
        >
          {brandRow.map((b) => (
            <BrandCard
              key={b.id}
              name={b.name}
              primary={b.primary}
              selected={selectedBrandId === b.id}
              onSelect={() => setSelectedBrandId(b.id)}
              salesQtdEur={b.perf?.salesQtdEur ?? null}
              growthVsPlanPct={b.perf?.growthVsPlanPct ?? null}
              trend={b.perf ? trendDirection(b.perf) : 'flat'}
            />
          ))}
        </div>
      </section>

      {/* ── Sales performance ──────────────────────────────────────── */}
      <section>
        <div style={sectionHeaderRowStyle}>
          <div>
            <h2 style={sectionHeaderTitleStyle}>Sales performance</h2>
            <p style={sectionHeaderSubtitleStyle}>
              {selectedMarket.name} run-rate vs plan, and the next two quarters.
            </p>
          </div>
          <span style={sectionHeaderRightStyle}>{ctxBrandLabel}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <article style={cardBase}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <h3 style={cardTitleStyle}>Sales trend vs plan</h3>
                <p style={cardSubtitleStyle}>{selectedBrand.name} · 6 quarters · indexed</p>
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 11, color: NAVY_70, fontWeight: 600 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 14, height: 2, background: BLUE, borderRadius: 2 }} />
                  Actual
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 14, height: 0, borderTop: `2px dashed ${NAVY_55}` }} />
                  Plan
                </span>
              </div>
            </div>
            <div style={{ width: '100%', height: 220, marginTop: 12 }}>
              <ResponsiveContainer>
                <LineChart data={trendData} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
                  <CartesianGrid stroke="rgba(5,10,68,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fill: NAVY_55, fontSize: 11 }} tickLine={false} axisLine={{ stroke: NAVY_12 }} />
                  <YAxis domain={[90, 115]} tick={{ fill: NAVY_55, fontSize: 11 }} tickLine={false} axisLine={{ stroke: NAVY_12 }} />
                  <Tooltip
                    contentStyle={tooltipBoxStyle as any}
                    itemStyle={{ color: '#ffffff' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                    formatter={(v: any) => (typeof v === 'number' ? v.toFixed(1) : v)}
                  />
                  <Line type="monotone" dataKey="Plan" stroke={NAVY_55} strokeWidth={1.8} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="Actual" stroke={BLUE} strokeWidth={2.5} dot={{ fill: BLUE, r: 3 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article style={cardBase}>
            <h3 style={cardTitleStyle}>Forecast vs actual</h3>
            <p style={cardSubtitleStyle}>{selectedBrand.name} · Q1 26 and Q2 26 forecast · EUR millions</p>
            <div style={{ width: '100%', height: 220, marginTop: 12 }}>
              <ResponsiveContainer>
                <BarChart data={forecastData} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
                  <CartesianGrid stroke="rgba(5,10,68,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" tick={{ fill: NAVY_55, fontSize: 11 }} tickLine={false} axisLine={{ stroke: NAVY_12 }} />
                  <YAxis tick={{ fill: NAVY_55, fontSize: 11 }} tickLine={false} axisLine={{ stroke: NAVY_12 }} />
                  <Tooltip
                    contentStyle={tooltipBoxStyle as any}
                    itemStyle={{ color: '#ffffff' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                  />
                  <Bar dataKey="Forecast" fill="rgba(5,10,68,0.25)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="Actual" fill={BLUE} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>
      </section>

      {/* ── Performance in context ────────────────────────────────── */}
      <section>
        <div style={sectionHeaderRowStyle}>
          <div>
            <h2 style={sectionHeaderTitleStyle}>Performance in context</h2>
            <p style={sectionHeaderSubtitleStyle}>
              Five indicators that frame the gap. Bars compare {selectedMarket.name} to the European benchmark.
            </p>
          </div>
          <span style={sectionHeaderRightStyle}>{ctxBrandLabel}</span>
        </div>

        {ctx ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {/* Investment intensity */}
            <StatCard
              title="Investment intensity"
              subtitle={`Total investment as % of net sales · ${selectedMarket.name}`}
              value={
                <span style={statValueStyle}>
                  {ctx.investmentIntensityPct.toFixed(1)}
                  <span style={statValueUnitStyle}>%</span>
                </span>
              }
              delta={ctx.deltas?.investmentIntensity}
              deltaUnit="pts"
              deltaTone={ctx.callouts?.investmentIntensity?.tone ?? 'on-track'}
              barTone={ctx.callouts?.investmentIntensity?.tone ?? 'on-track'}
              barMin={8}
              barMax={18}
              barValue={ctx.investmentIntensityPct}
              benchmark={11.9}
              innerLabel={`What the budget goes into · ${selectedMarket.name} YTD`}
              innerContent={
                ctx.investmentMix ? <InvestmentMix mix={ctx.investmentMix} /> : <FallbackInner />
              }
              callout={ctx.callouts?.investmentIntensity}
              onCalloutClick={() =>
                ctx.callouts?.investmentIntensity?.actionRoute &&
                navigate(ctx.callouts.investmentIntensity.actionRoute)
              }
            />

            {/* Field activity index */}
            <StatCard
              title="Field activity index"
              subtitle="Visits to high-potential HCPs · base 100"
              value={<span style={statValueStyle}>{ctx.fieldActivityIndex}</span>}
              delta={ctx.deltas?.fieldActivity}
              deltaUnit=""
              deltaTone={ctx.callouts?.fieldActivity?.tone ?? 'watch'}
              barTone={ctx.callouts?.fieldActivity?.tone ?? 'watch'}
              barMin={80}
              barMax={120}
              barValue={ctx.fieldActivityIndex}
              benchmark={100}
              innerLabel="HCP visits per month · last 6 months"
              innerContent={
                ctx.hcpVisitsPerMonth ? <VisitsBarColoured data={ctx.hcpVisitsPerMonth} /> : <FallbackInner />
              }
              callout={ctx.callouts?.fieldActivity}
              onCalloutClick={() =>
                ctx.callouts?.fieldActivity?.actionRoute &&
                navigate(ctx.callouts.fieldActivity.actionRoute)
              }
            />

            {/* Post-training 60-day follow-up */}
            <StatCard
              title="Post-training 60-day follow-up"
              subtitle="Share of trained HCPs re-engaged ≤ 60 days"
              value={
                <span style={statValueStyle}>
                  {ctx.postTrainingFollowUpRatePct}
                  <span style={statValueUnitStyle}>%</span>
                </span>
              }
              delta={ctx.deltas?.followup}
              deltaUnit="pts"
              deltaTone={ctx.callouts?.followup?.tone ?? 'at-risk'}
              barTone={ctx.callouts?.followup?.tone ?? 'at-risk'}
              barMin={0}
              barMax={100}
              barValue={ctx.postTrainingFollowUpRatePct}
              benchmark={65}
              innerLabel={`${selectedMarket.name} vs European peers`}
              innerContent={
                ctx.followupPeers ? <PeerBars peers={ctx.followupPeers} /> : <FallbackInner />
              }
              callout={ctx.callouts?.followup}
              onCalloutClick={() =>
                ctx.callouts?.followup?.actionRoute &&
                navigate(ctx.callouts.followup.actionRoute)
              }
            />

            {/* Market share */}
            <StatCard
              title={`Market share · ${selectedBrand.name}`}
              subtitle={`Volume share in toxin category · ${selectedMarket.name}`}
              value={
                <span style={statValueStyle}>
                  {ctx.marketSharePct.toFixed(1)}
                  <span style={statValueUnitStyle}>%</span>
                </span>
              }
              delta={ctx.deltas?.marketShare}
              deltaUnit="pts"
              deltaTone={ctx.callouts?.marketShare?.tone ?? 'watch'}
              barTone={ctx.callouts?.marketShare?.tone ?? 'watch'}
              barMin={18}
              barMax={28}
              barValue={ctx.marketSharePct}
              benchmark={ctx.marketShareBenchmark ?? 24}
              innerLabel="Share over 6 quarters"
              innerContent={
                ctx.marketShareTrend ? (
                  <TrendMini
                    data={ctx.marketShareTrend}
                    benchmark={ctx.marketShareBenchmark ?? 24}
                    benchmarkLabel={`benchmark ${ctx.marketShareBenchmark ?? 24}`}
                  />
                ) : (
                  <FallbackInner />
                )
              }
              callout={ctx.callouts?.marketShare}
              onCalloutClick={() =>
                ctx.callouts?.marketShare?.actionRoute &&
                navigate(ctx.callouts.marketShare.actionRoute)
              }
            />

            {/* Contribution margin */}
            <StatCard
              title="Contribution margin"
              subtitle={`Variable margin · ${selectedBrand.name} ${selectedMarket.name}`}
              value={
                <span style={statValueStyle}>
                  {ctx.contributionMarginPct.toFixed(1)}
                  <span style={statValueUnitStyle}>%</span>
                </span>
              }
              delta={ctx.deltas?.margin}
              deltaUnit="pts"
              deltaTone={ctx.callouts?.margin?.tone ?? 'watch'}
              barTone={ctx.callouts?.margin?.tone ?? 'watch'}
              barMin={45}
              barMax={70}
              barValue={ctx.contributionMarginPct}
              benchmark={ctx.marginBenchmark ?? 60}
              innerLabel="Margin over 6 quarters"
              innerContent={
                ctx.marginTrend ? (
                  <TrendMini
                    data={ctx.marginTrend}
                    benchmark={ctx.marginBenchmark ?? 60}
                    benchmarkLabel={`benchmark ${ctx.marginBenchmark ?? 60}`}
                  />
                ) : (
                  <FallbackInner />
                )
              }
              callout={ctx.callouts?.margin}
              onCalloutClick={() =>
                ctx.callouts?.margin?.actionRoute && navigate(ctx.callouts.margin.actionRoute)
              }
            />
          </div>
        ) : (
          <div
            style={{
              ...cardBase,
              padding: 22,
              color: NAVY_55,
              fontSize: 13,
              fontStyle: 'italic',
              lineHeight: 1.55,
            }}
          >
            Context view not in pilot scope for this market. Italy and Germany are the active demo markets.
          </div>
        )}
      </section>

      <WhatThisSuggests
        text="Italy and Germany show different break points. Investment Radar isolates which categories carry which problem."
        to="/investment-radar"
        linkLabel="Open Investment Radar"
      />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Fallback rendered when a card's mini-vis data is missing.
// ───────────────────────────────────────────────────────────────────────────

function FallbackInner() {
  return (
    <div style={{ fontSize: 11, color: NAVY_55, fontStyle: 'italic' }}>
      Detail not in pilot scope for this market.
    </div>
  );
}

