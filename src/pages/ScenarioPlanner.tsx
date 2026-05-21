import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import {
  AssumptionList,
  ConditionToggle,
  CriticalPathChain,
  SourceTag,
} from '../components/composites';
import {
  LogDecisionModal,
  RecommendationCard,
  dateFromToday,
} from '../components/decision';
import type { LogDecisionDraft } from '../components/decision';
import { scenarioPlanner } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const TEAL = '#0F766E';
const AMBER = '#F59E0B';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  paddingBottom: 48,
};

const headerStripeStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
};

const directionalChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 999,
  background: '#ECFEFF',
  border: `1px solid #A5F3FC`,
  color: '#0F766E',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 10,
};

const twoColStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
  gap: 24,
  alignItems: 'start',
};

const cardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 22,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

const sliderHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: 12,
};

const sliderValueStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: NAVY,
  fontVariantNumeric: 'tabular-nums',
};

const sliderLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: NAVY_70,
  lineHeight: 1.4,
};

const sliderRangeRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 11,
  color: NAVY_55,
  fontVariantNumeric: 'tabular-nums',
  marginTop: 6,
};

const conditionsWrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const widenedNoteStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  marginTop: 6,
  padding: '8px 12px',
  background: '#FEF3C7',
  border: `1px solid ${AMBER}`,
  borderRadius: 8,
  color: '#7C2D12',
  fontSize: 12,
  lineHeight: 1.45,
  fontWeight: 500,
};

const chartCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 22,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const chartTitleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};

const chartSubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  marginTop: 2,
  fontStyle: 'italic',
};

const chartCentralAssumptionStyle: CSSProperties = {
  marginTop: 8,
  padding: '8px 12px',
  background: NAVY_06,
  borderRadius: 8,
  fontSize: 12,
  color: NAVY_70,
  lineHeight: 1.5,
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

const dividerStyle: CSSProperties = {
  height: 1,
  background: NAVY_06,
  margin: '4px 0',
};

// Custom slider track using a native range input + a styled overlay would be ideal,
// but for v1 we leverage the native range input with inline CSS styling.
const rangeInputStyle: CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  width: '100%',
  height: 6,
  background: `linear-gradient(to right, ${NAVY} 0%, ${NAVY} 0%, ${NAVY_12} 0%, ${NAVY_12} 100%)`,
  borderRadius: 999,
  outline: 'none',
  cursor: 'pointer',
};

const CONDITION_KEYS = [
  'Italy follow-up coverage improves within 60 days',
  'Germany reduction limited to lower-response activities',
] as const;

const DEFAULT_REALLOCATION = scenarioPlanner.defaultReallocationPct;

// Build the confidence band data: at each month, return base + spreads.
// Slider value scales spread between conservative and best linearly:
//   10% = baseline spread (1.0x)
//   0%  = collapses toward base (0x)
//   25% = widens to 1.5x
// Unchecking a condition adds widenBandBy points to the spread.
function buildBandData(
  reallocationPct: number,
  conditionsChecked: Record<string, boolean>,
) {
  const sliderScale = reallocationPct / DEFAULT_REALLOCATION; // 0..2.5
  const condEffects = scenarioPlanner.conditionEffects as Record<string, { widenBandBy: number }>;
  let conditionWiden = 0;
  for (const key of CONDITION_KEYS) {
    if (conditionsChecked[key] === false) {
      conditionWiden += condEffects[key]?.widenBandBy ?? 0;
    }
  }

  return scenarioPlanner.outcomes.base.map((b, idx) => {
    const conservative = scenarioPlanner.outcomes.conservative[idx].value;
    const best = scenarioPlanner.outcomes.best[idx].value;
    const upperSpread = (best - b.value) * sliderScale + conditionWiden;
    const lowerSpread = (b.value - conservative) * sliderScale + conditionWiden;
    return {
      month: idx,
      monthLabel: `M${idx}`,
      base: parseFloat(b.value.toFixed(2)),
      lower: parseFloat((b.value - lowerSpread).toFixed(2)),
      upper: parseFloat((b.value + upperSpread).toFixed(2)),
    };
  });
}

// All scenarios live in one list. The active one is selectable; the previews are
// rendered in the same dropdown, visibly disabled with a one-line description.
interface ScenarioOption {
  value: string;
  label: string;
  description: string;
  active?: boolean;
}

const SCENARIOS: ScenarioOption[] = [
  {
    value: 'reallocate-de-it',
    label: 'Reallocate Germany → Italy',
    description: 'Models reallocating up to 25% of Germany Xeomin marketing spend toward Italy post-training activation.',
    active: true,
  },
  {
    value: 'italy-followup-only',
    label: 'Increase follow-up for trained HCPs (Italy)',
    description: 'Isolates the operational impact of closing the Italy follow-up gap without any budget reallocation.',
  },
  {
    value: 'reduce-weak-execution',
    label: 'Reduce spend in markets with weak execution follow-through',
    description: 'Identifies markets where investment is uncoupled from CRM follow-up discipline and tests the impact of trimming spend in those activities.',
  },
  {
    value: 'reallocate-to-undertrained',
    label: 'Reallocate training budget toward high-potential under-trained accounts',
    description: 'Models redirecting training spend from saturated cohorts toward high-potential HCPs and accounts with low current training coverage.',
  },
  {
    value: 'cross-market-compare',
    label: 'Compare investment options across markets',
    description: 'Benchmarks investment yield across all 8 European markets to surface alternative reallocation candidates.',
  },
];

const ACTIVE_SCENARIO = SCENARIOS.find((s) => s.active)!;

export default function ScenarioPlanner() {
  const navigate = useNavigate();
  const [reallocationPct, setReallocationPct] = useState<number>(DEFAULT_REALLOCATION);
  const [conditions, setConditions] = useState<Record<string, boolean>>({
    [CONDITION_KEYS[0]]: true,
    [CONDITION_KEYS[1]]: true,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Close the preview dropdown on outside click.
  useEffect(() => {
    if (!previewOpen) return;
    const onClick = (e: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(e.target as Node)) {
        setPreviewOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [previewOpen]);

  const bandData = useMemo(
    () => buildBandData(reallocationPct, conditions),
    [reallocationPct, conditions],
  );

  const widened = !conditions[CONDITION_KEYS[0]] || !conditions[CONDITION_KEYS[1]];

  // Background gradient for the range input track so the filled portion uses NAVY.
  const trackPct = (reallocationPct / scenarioPlanner.reallocationRangePct.max) * 100;
  const dynamicRangeStyle: CSSProperties = {
    ...rangeInputStyle,
    background: `linear-gradient(to right, ${NAVY} 0%, ${NAVY} ${trackPct}%, ${NAVY_12} ${trackPct}%, ${NAVY_12} 100%)`,
  };

  const draft: LogDecisionDraft = {
    decision: scenarioPlanner.recommendation.recommendation,
    owner: 'Europe Leadership',
    marketAndBrand: 'Italy, Germany · Xeomin',
    evidenceUsed: [
      `${reallocationPct}% Germany marketing budget reallocation modelled`,
      'Italy 41% follow-up vs 65% benchmark',
      '47 high-potential trained HCPs without 60-day contact',
    ],
    assumptions: scenarioPlanner.assumptions.map((a) => a.text),
    expectedImpact:
      'Directional commercial recovery within 60 days, measured via CRM follow-up rate and Xeomin Italy run-rate.',
    followUpDate: dateFromToday(60),
    triggerForReassessment:
      'Italy follow-up rate below 55% at 30 days · trained HCP list not confirmed within 5 days',
    status: 'Active',
    source: 'Scenario Planner',
  };

  const openInAskAriya = () => {
    navigate(`/ask-ariya?question=${encodeURIComponent('If we shift 10% of Germany')}`);
  };

  return (
    <div style={pageStyle}>
      <div style={headerStripeStyle}>
        <PageHeader
          title="Scenario Planner"
          subtitle="Directional impact under explicit assumptions. Not a forecast."
        />
        <span style={directionalChipStyle}>
          <Info size={12} strokeWidth={2.5} /> Directional · Not a forecast
        </span>
      </div>

      <div>
        <div style={sectionLabelStyle}>Scenario</div>
        <div ref={previewRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            onClick={() => setPreviewOpen((v) => !v)}
            aria-expanded={previewOpen}
            aria-haspopup="listbox"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 320,
              height: 42,
              padding: '0 16px',
              borderRadius: 10,
              background: '#ffffff',
              border: `1px solid ${NAVY_12}`,
              color: NAVY,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
              justifyContent: 'space-between',
            }}
          >
            <span>{ACTIVE_SCENARIO.label}</span>
            {previewOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {previewOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: 420,
                background: '#ffffff',
                border: `1px solid ${NAVY_12}`,
                borderRadius: 12,
                boxShadow: '0 12px 28px rgba(5,10,68,0.16), 0 2px 6px rgba(5,10,68,0.06)',
                zIndex: 40,
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
              role="listbox"
              aria-label="Choose scenario"
            >
              {SCENARIOS.map((s) => {
                const selectable = s.active;
                return (
                  <div
                    key={s.value}
                    role="option"
                    aria-selected={!!s.active}
                    aria-disabled={!selectable}
                    onClick={() => {
                      if (selectable) setPreviewOpen(false);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: s.active ? '#E8EAF6' : 'transparent',
                      cursor: selectable ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      opacity: selectable ? 1 : 0.78,
                      transition: 'background 120ms ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectable && !s.active) e.currentTarget.style.background = NAVY_06;
                    }}
                    onMouseLeave={(e) => {
                      if (selectable && !s.active) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, lineHeight: 1.4 }}>
                        {s.label}
                      </span>
                      {s.active ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: NAVY,
                            color: '#ffffff',
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Selected
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: NAVY_06,
                            color: NAVY_70,
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Coming soon
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 12, color: NAVY_70, lineHeight: 1.5 }}>
                      {s.description}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <div style={sectionLabelStyle}>Operational chain · where this scenario depends on execution</div>
        <CriticalPathChain
          nodes={scenarioPlanner.operationalChain.map((n) => ({
            node: n.node,
            status: n.status,
          }))}
        />
      </div>

      <div style={twoColStyle}>
        {/* LEFT: Inputs card */}
        <section style={cardStyle}>
          <div>
            <div style={sectionLabelStyle}>Inputs</div>
            <div style={sliderHeaderStyle}>
              <label style={sliderLabelStyle} htmlFor="realloc-slider">
                Share of Germany marketing budget to reallocate
              </label>
              <span style={sliderValueStyle}>{reallocationPct}%</span>
            </div>
            <input
              id="realloc-slider"
              type="range"
              min={scenarioPlanner.reallocationRangePct.min}
              max={scenarioPlanner.reallocationRangePct.max}
              step={1}
              value={reallocationPct}
              onChange={(e) => setReallocationPct(Number(e.target.value))}
              style={dynamicRangeStyle}
              aria-valuemin={scenarioPlanner.reallocationRangePct.min}
              aria-valuemax={scenarioPlanner.reallocationRangePct.max}
              aria-valuenow={reallocationPct}
            />
            <div style={sliderRangeRowStyle}>
              <span>{scenarioPlanner.reallocationRangePct.min}%</span>
              <span>Default 10%</span>
              <span>{scenarioPlanner.reallocationRangePct.max}%</span>
            </div>
          </div>

          <div style={dividerStyle} />

          <div>
            <div style={sectionLabelStyle}>Conditions to verify</div>
            <div style={conditionsWrapStyle}>
              {CONDITION_KEYS.map((key) => (
                <ConditionToggle
                  key={key}
                  label={key}
                  checked={conditions[key]}
                  onChange={(checked) =>
                    setConditions((prev) => ({ ...prev, [key]: checked }))
                  }
                />
              ))}
            </div>
            {widened && (
              <div style={widenedNoteStyle}>
                <Info size={14} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  Confidence band widened because a required condition is unchecked.
                </span>
              </div>
            )}
          </div>

          <div style={dividerStyle} />

          <AssumptionList items={scenarioPlanner.assumptions} />

          <div style={{ ...dividerStyle, marginTop: 4 }} />

          <SourceTag
            label={scenarioPlanner.recommendation.sources.join(' · ')}
          />
        </section>

        {/* RIGHT: Chart card only */}
        <section style={chartCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h2 style={chartTitleStyle}>Directional net commercial impact · 6-month window</h2>
              <p style={chartSubtitleStyle}>Directional. Not a forecast.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: NAVY_70, fontWeight: 600, alignSelf: 'flex-end' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, height: 2.5, background: TEAL, borderRadius: 2 }} />
                Base
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 10, background: 'rgba(15,118,110,0.20)', borderRadius: 3 }} />
                Confidence band
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              marginTop: 8,
            }}
          >
            <p style={chartCentralAssumptionStyle}>
              <strong style={{ color: NAVY, fontWeight: 700 }}>Central assumption (fixed):</strong>{' '}
              {scenarioPlanner.centralAssumption}
            </p>
            <p
              style={{
                margin: 0,
                padding: '8px 12px',
                background: '#E0E7FF',
                border: '1px solid #C7D2FE',
                borderRadius: 8,
                fontSize: 12,
                color: '#3730A3',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: '#1E1B4B', fontWeight: 700 }}>Currently modelling:</strong>{' '}
              <strong style={{ color: '#1E1B4B', fontWeight: 700 }}>{reallocationPct}%</strong>{' '}
              reallocation
              {' · '}
              <strong style={{ color: '#1E1B4B', fontWeight: 700 }}>
                {Object.values(conditions).filter(Boolean).length} of {CONDITION_KEYS.length}
              </strong>{' '}
              conditions assumed met
              {widened ? ' · confidence band widened' : ''}
            </p>
          </div>

          <div style={{ width: '100%', height: 340, marginTop: 12 }}>
            <ResponsiveContainer>
              <ComposedChart data={bandData} margin={{ top: 12, right: 24, bottom: 32, left: 8 }}>
                <defs>
                  <linearGradient id="band-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.12} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(5,10,68,0.06)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fill: NAVY_55, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: NAVY_12 }}
                  label={{
                    value: 'Months from now (M0 = today)',
                    position: 'insideBottom',
                    offset: -4,
                    fill: NAVY_55,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                <YAxis
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  tick={{ fill: NAVY_55, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: NAVY_12 }}
                  label={{
                    value: 'Net commercial impact · indexed, baseline = 100',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 16,
                    fill: NAVY_55,
                    fontSize: 11,
                    fontWeight: 600,
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip
                  contentStyle={tooltipBoxStyle as any}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                  formatter={(v: any, name: any) => [
                    typeof v === 'number' ? v.toFixed(2) : v,
                    name === 'upper' ? 'Best' : name === 'lower' ? 'Conservative' : 'Base',
                  ]}
                />
                <ReferenceLine y={100} stroke={NAVY_12} strokeDasharray="4 4" />
                {/* Upper bound area, filled to lower bound via baseLine of zero (custom approach) */}
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="none"
                  fill="url(#band-grad)"
                  isAnimationActive={true}
                  animationDuration={220}
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="none"
                  fill="#ffffff"
                  isAnimationActive={true}
                  animationDuration={220}
                />
                <Line
                  type="monotone"
                  dataKey="base"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ fill: TEAL, r: 3 }}
                  isAnimationActive={true}
                  animationDuration={220}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Full-width recommendation below the inputs + chart row */}
      <RecommendationCard
        situation={scenarioPlanner.recommendation.situation}
        recommendation={scenarioPlanner.recommendation.recommendation}
        reasoning={scenarioPlanner.recommendation.reasoning}
        confidence={scenarioPlanner.recommendation.confidence}
        confidenceRationale={scenarioPlanner.recommendation.confidenceRationale}
        conditions={scenarioPlanner.recommendation.conditions}
        nextActions={scenarioPlanner.recommendation.nextActions}
        sources={scenarioPlanner.recommendation.sources}
        accent="teal"
        collapsible
        actions={[
          {
            label: 'Log this decision →',
            onClick: () => setModalOpen(true),
            primary: true,
          },
          {
            label: 'Open in Ask Ariya →',
            onClick: openInAskAriya,
          },
        ]}
      />

      <LogDecisionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        draft={draft}
        onLogged={() => navigate('/decision-log?from=scenario-planner')}
      />
    </div>
  );
}

