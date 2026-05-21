import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../components/layout/PageHeader';
import { SignalChip, toneFromGrowth } from '../components/composites';
import { WhatThisSuggests } from '../components/decision';
import {
  brands,
  marketPerformanceContext,
  markets,
} from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  paddingBottom: 48,
};

const pillRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

const marketPillBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 14px',
  borderRadius: 999,
  background: 'transparent',
  border: 'none',
  color: NAVY_70,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 120ms ease, color 120ms ease',
};

const marketPillActiveStyle: CSSProperties = {
  background: NAVY,
  color: '#ffffff',
};

const twoColGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
};

const threeColGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 16,
};

const chartCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 12,
  padding: 18,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const chartTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: NAVY,
  margin: 0,
};

const chartSubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  marginTop: 2,
};

const brandCardStyle = (primary: boolean): CSSProperties => ({
  background: '#ffffff',
  border: `1px solid ${primary ? NAVY : NAVY_12}`,
  borderWidth: primary ? 2 : 1,
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const brandNameStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: NAVY,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const brandSalesStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: NAVY,
  fontVariantNumeric: 'tabular-nums',
};

const contextCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 12,
  padding: '8px 24px 22px',
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const contextRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '230px 1fr 110px',
  alignItems: 'center',
  columnGap: 20,
  padding: '18px 0',
  borderBottom: `1px solid ${NAVY_06}`,
};

const contextLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 14,
  fontWeight: 600,
  color: NAVY,
  lineHeight: 1.4,
};

const contextDotStyle = (color: string): CSSProperties => ({
  width: 8,
  height: 8,
  borderRadius: 999,
  background: color,
  flexShrink: 0,
});

const contextValueStyle: CSSProperties = {
  fontSize: 14,
  color: NAVY_70,
  lineHeight: 1.55,
};

const contextNumberStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: NAVY,
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',
};

const interpretationParagraphStyle: CSSProperties = {
  marginTop: 16,
  paddingTop: 16,
  borderTop: `1px solid ${NAVY_12}`,
  fontSize: 14,
  fontStyle: 'italic',
  color: NAVY_70,
  lineHeight: 1.6,
};

// Map signal tone to a tone dot color used in the Performance in Context labels.
const TONE_DOT: Record<'on-track' | 'watch' | 'at-risk', string> = {
  'on-track': '#16A34A',
  watch: '#F59E0B',
  'at-risk': '#E11D48',
};

const noContextStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 12,
  padding: 22,
  color: NAVY_55,
  fontSize: 13,
  fontStyle: 'italic',
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

const EUROPE_AVG_INTENSITY = 11.9;
const EUROPE_AVG_FIELD_ACTIVITY = 100;
const EUROPE_AVG_FOLLOWUP = 65;
const EUROPE_AVG_MARKET_SHARE = 24.0;
const EUROPE_AVG_CONTRIBUTION_MARGIN = 60.0;

function fmtSigned(n: number): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
}

function intensityInterpretation(value: number): string {
  const diff = value - EUROPE_AVG_INTENSITY;
  const direction = diff > 0 ? 'above' : 'below';
  return `${Math.abs(diff).toFixed(1)} points ${direction} the European average of ${EUROPE_AVG_INTENSITY.toFixed(1)}%.`;
}

function fieldActivityInterpretation(value: number): string {
  if (value >= EUROPE_AVG_FIELD_ACTIVITY) {
    return `${value - EUROPE_AVG_FIELD_ACTIVITY} points above the expected baseline of ${EUROPE_AVG_FIELD_ACTIVITY}.`;
  }
  return `${EUROPE_AVG_FIELD_ACTIVITY - value} points below the expected baseline of ${EUROPE_AVG_FIELD_ACTIVITY}.`;
}

function followupInterpretation(value: number): string {
  const diff = value - EUROPE_AVG_FOLLOWUP;
  const direction = diff > 0 ? 'above' : 'below';
  return `${Math.abs(diff)} points ${direction} the European benchmark of ${EUROPE_AVG_FOLLOWUP}%.`;
}

function contextToneIntensity(value: number) {
  return value > 14 ? 'at-risk' : value > 12 ? 'watch' : 'on-track';
}
function contextToneFieldActivity(value: number) {
  return value < 95 ? 'at-risk' : value < 100 ? 'watch' : 'on-track';
}
function contextToneFollowup(value: number) {
  return value < 55 ? 'at-risk' : value < 65 ? 'watch' : 'on-track';
}
function contextToneMarketShare(value: number) {
  return value < EUROPE_AVG_MARKET_SHARE - 3 ? 'at-risk' : value < EUROPE_AVG_MARKET_SHARE ? 'watch' : 'on-track';
}
function contextToneMargin(value: number) {
  return value < EUROPE_AVG_CONTRIBUTION_MARGIN - 3 ? 'at-risk' : value < EUROPE_AVG_CONTRIBUTION_MARGIN ? 'watch' : 'on-track';
}

function marketShareInterpretation(value: number): string {
  const diff = value - EUROPE_AVG_MARKET_SHARE;
  const direction = diff > 0 ? 'above' : 'below';
  return `${Math.abs(diff).toFixed(1)} points ${direction} the European Xeomin share benchmark of ${EUROPE_AVG_MARKET_SHARE.toFixed(1)}%.`;
}
function marginInterpretation(value: number): string {
  const diff = value - EUROPE_AVG_CONTRIBUTION_MARGIN;
  const direction = diff > 0 ? 'above' : 'below';
  return `${Math.abs(diff).toFixed(1)} points ${direction} the European contribution margin benchmark of ${EUROPE_AVG_CONTRIBUTION_MARGIN.toFixed(1)}%.`;
}

export default function MarketPerformance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fromUrl = searchParams.get('market');
  const initialMarket = fromUrl && markets.some((m) => m.id === fromUrl) ? fromUrl : 'it';
  const [selectedMarketId, setSelectedMarketId] = useState<string>(initialMarket);

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

  const xeomin = brands.find((b) => b.id === 'xeomin')!;
  const xeominPerf = xeomin.performance.find((p) => p.marketId === selectedMarketId);
  const trendData = useMemo(() => {
    if (!xeominPerf) return [];
    // Build a plan reference series. The plan starts at the baseline index (100, same
    // place actual starts at Q-5) and ends at the implied plan value at Q1 26, derived
    // from growthVsPlanPct (actual = plan * (1 + growthVsPlanPct / 100)).
    // Linear interpolation between the two endpoints. This is illustrative, not a forecast.
    const actualSeries = xeominPerf.trendIndexed;
    const n = actualSeries.length; // 6 quarters
    const actualEnd = actualSeries[n - 1];
    const planEnd = actualEnd / (1 + xeominPerf.growthVsPlanPct / 100);
    const planStart = 100;
    return actualSeries.map((value, idx) => {
      const t = idx / (n - 1); // 0..1
      const plan = planStart + (planEnd - planStart) * t;
      const label = idx === n - 1 ? 'Q1 26' : `Q-${n - 1 - idx}`;
      return {
        label,
        Actual: value,
        Plan: parseFloat(plan.toFixed(2)),
      };
    });
  }, [xeominPerf]);

  const contextEntry = marketPerformanceContext.find((c) => c.marketId === selectedMarketId);

  const forecastData = useMemo(
    () =>
      contextEntry?.forecastVsActual.map((row) => ({
        quarter: row.quarter,
        Forecast: row.forecast,
        Actual: row.actual,
      })) ?? [],
    [contextEntry],
  );

  // Brand row: pull QTD sales and growth per brand for the selected market.
  const brandRow = brands.map((b) => {
    const perf = b.performance.find((p) => p.marketId === selectedMarketId);
    return {
      id: b.id,
      name: b.name,
      primary: b.primary,
      perf,
    };
  });

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Market Performance"
        subtitle="Which markets are performing above or below expectation, and why?"
      />

      {/* Market pill row */}
      <div style={pillRowStyle} role="tablist" aria-label="Select market">
        {markets.map((m) => {
          const active = m.id === selectedMarketId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => selectMarket(m.id)}
              style={{ ...marketPillBaseStyle, ...(active ? marketPillActiveStyle : null) }}
              role="tab"
              aria-selected={active}
            >
              <span aria-hidden>{m.flag}</span>
              {m.name}
            </button>
          );
        })}
      </div>

      {/* Sales trend + Forecast vs actual */}
      <div style={twoColGridStyle}>
        <section style={chartCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <h2 style={chartTitleStyle}>Sales trend vs plan</h2>
              <p style={chartSubtitleStyle}>Xeomin · 6 quarters · indexed</p>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: NAVY_70, fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 2, background: BLUE, borderRadius: 2 }} />
                Actual
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 14,
                    height: 0,
                    borderTop: `2px dashed ${NAVY_55}`,
                  }}
                />
                Plan
              </span>
            </div>
          </div>
          <div style={{ width: '100%', height: 220, marginTop: 12 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
                <CartesianGrid stroke="rgba(5,10,68,0.08)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: NAVY_55, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: NAVY_12 }}
                />
                <YAxis
                  domain={[90, 115]}
                  tick={{ fill: NAVY_55, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: NAVY_12 }}
                />
                <Tooltip
                  contentStyle={tooltipBoxStyle as any}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                  formatter={(v: any) => (typeof v === 'number' ? v.toFixed(1) : v)}
                />
                <Line
                  type="monotone"
                  dataKey="Plan"
                  stroke={NAVY_55}
                  strokeWidth={1.8}
                  strokeDasharray="5 4"
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="Actual"
                  stroke={BLUE}
                  strokeWidth={2.5}
                  dot={{ fill: BLUE, r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section style={chartCardStyle}>
          <h2 style={chartTitleStyle}>Forecast vs actual</h2>
          <p style={chartSubtitleStyle}>Xeomin · Q1 26 and Q2 26 forecast · EUR millions</p>
          <div style={{ width: '100%', height: 220, marginTop: 12 }}>
            <ResponsiveContainer>
              <BarChart data={forecastData} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
                <CartesianGrid stroke="rgba(5,10,68,0.08)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="quarter"
                  tick={{ fill: NAVY_55, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: NAVY_12 }}
                />
                <YAxis
                  tick={{ fill: NAVY_55, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: NAVY_12 }}
                />
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
        </section>
      </div>

      {/* Brand performance row */}
      <section>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: NAVY_55,
            marginBottom: 10,
          }}
        >
          Brand performance · {selectedMarket.name}
        </div>
        <div style={threeColGridStyle}>
          {brandRow.map((b) => {
            if (!b.perf) {
              return (
                <div key={b.id} style={brandCardStyle(false)}>
                  <div style={brandNameStyle}>{b.name}</div>
                  <div style={{ fontSize: 12, color: NAVY_55, fontStyle: 'italic' }}>
                    Not in pilot scope for this market.
                  </div>
                </div>
              );
            }
            const tone = toneFromGrowth(b.perf.growthVsPlanPct);
            const sparklineData = b.perf.trendIndexed.map((v, idx) => ({ idx, v }));
            // Tight Y domain so the variation reads. Pad by ~25% of the actual range,
            // with a minimum padding of 1 index point so dead-flat series still draw a line.
            const minV = Math.min(...b.perf.trendIndexed);
            const maxV = Math.max(...b.perf.trendIndexed);
            const range = Math.max(maxV - minV, 1);
            const pad = Math.max(range * 0.25, 0.6);
            const yDomain: [number, number] = [minV - pad, maxV + pad];
            // Stroke color reflects direction: red if last < first, navy/green otherwise.
            const last = b.perf.trendIndexed[b.perf.trendIndexed.length - 1];
            const first = b.perf.trendIndexed[0];
            const sparkColor =
              last < first - 0.5 ? '#E11D48' : last > first + 0.5 ? '#16A34A' : BLUE;
            return (
              <div key={b.id} style={brandCardStyle(b.primary)}>
                <div style={brandNameStyle}>
                  {b.name}
                  {b.primary && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: NAVY_55,
                        textTransform: 'uppercase',
                      }}
                    >
                      Primary
                    </span>
                  )}
                </div>
                <div style={{ width: '100%', height: 56 }}>
                  <ResponsiveContainer>
                    <AreaChart data={sparklineData} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
                      <defs>
                        <linearGradient id={`grad-${b.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={sparkColor} stopOpacity={0.32} />
                          <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <YAxis hide domain={yDomain} />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={sparkColor}
                        strokeWidth={2}
                        fill={`url(#grad-${b.id})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <div style={brandSalesStyle}>€{b.perf.salesQtdEur.toFixed(1)}M</div>
                  <SignalChip tone={tone} label={`${fmtSigned(b.perf.growthVsPlanPct)} vs plan`} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Performance in context */}
      <section>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: NAVY_55,
            marginBottom: 10,
          }}
        >
          Performance in context · {selectedMarket.name}
        </div>
        {contextEntry ? (
          <div style={contextCardStyle}>
            <div style={{ ...contextRowStyle, borderTop: 'none' }}>
              <div style={contextLabelStyle}>
                <span style={contextDotStyle(TONE_DOT[contextToneIntensity(contextEntry.performanceInContext.investmentIntensityPct)])} />
                Investment intensity
              </div>
              <div style={contextValueStyle}>
                {intensityInterpretation(contextEntry.performanceInContext.investmentIntensityPct)}
              </div>
              <div style={contextNumberStyle}>{contextEntry.performanceInContext.investmentIntensityPct.toFixed(1)}%</div>
            </div>
            <div style={contextRowStyle}>
              <div style={contextLabelStyle}>
                <span style={contextDotStyle(TONE_DOT[contextToneFieldActivity(contextEntry.performanceInContext.fieldActivityIndex)])} />
                Field activity index
              </div>
              <div style={contextValueStyle}>
                {fieldActivityInterpretation(contextEntry.performanceInContext.fieldActivityIndex)}
              </div>
              <div style={contextNumberStyle}>{contextEntry.performanceInContext.fieldActivityIndex}</div>
            </div>
            <div style={contextRowStyle}>
              <div style={contextLabelStyle}>
                <span style={contextDotStyle(TONE_DOT[contextToneFollowup(contextEntry.performanceInContext.postTrainingFollowUpRatePct)])} />
                Post-training 60-day follow-up
              </div>
              <div style={contextValueStyle}>
                {followupInterpretation(contextEntry.performanceInContext.postTrainingFollowUpRatePct)}
              </div>
              <div style={contextNumberStyle}>{contextEntry.performanceInContext.postTrainingFollowUpRatePct}%</div>
            </div>
            <div style={contextRowStyle}>
              <div style={contextLabelStyle}>
                <span style={contextDotStyle(TONE_DOT[contextToneMarketShare(contextEntry.performanceInContext.marketSharePct)])} />
                Market share · Xeomin
              </div>
              <div style={contextValueStyle}>
                {marketShareInterpretation(contextEntry.performanceInContext.marketSharePct)}
              </div>
              <div style={contextNumberStyle}>{contextEntry.performanceInContext.marketSharePct.toFixed(1)}%</div>
            </div>
            <div style={{ ...contextRowStyle, borderBottom: 'none' }}>
              <div style={contextLabelStyle}>
                <span style={contextDotStyle(TONE_DOT[contextToneMargin(contextEntry.performanceInContext.contributionMarginPct)])} />
                Contribution margin
              </div>
              <div style={contextValueStyle}>
                {marginInterpretation(contextEntry.performanceInContext.contributionMarginPct)}
              </div>
              <div style={contextNumberStyle}>{contextEntry.performanceInContext.contributionMarginPct.toFixed(1)}%</div>
            </div>
            <p style={interpretationParagraphStyle}>{contextEntry.performanceInContext.interpretation}</p>
          </div>
        ) : (
          <div style={noContextStyle}>
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

