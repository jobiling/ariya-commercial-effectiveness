import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Donut, FilterDropdown } from '../components/composites';
import type { FilterOption } from '../components/composites';
import { RecommendationCard, WhatThisSuggests } from '../components/decision';
import {
  executionSignals,
  hcpSegments,
  italyHighPotentialDermRecommendation,
  markets,
} from '../data/scenario';
import type { HcpSegment } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const LAVENDER = '#E8EAF6';

type Tier = HcpSegment['potentialTier'];

const TIER_PILL_BG: Record<Tier, string> = {
  High: '#EEF2FF',
  Medium: '#F1F5F9',
  Low: '#F8FAFC',
};
const TIER_PILL_FG: Record<Tier, string> = {
  High: '#3730A3',
  Medium: '#334155',
  Low: '#64748B',
};

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  paddingBottom: 48,
};

const tableCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 0,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  overflow: 'hidden',
};

const tableHeaderRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.5fr 0.85fr 0.65fr 0.55fr 0.85fr 0.95fr 0.8fr 1.35fr',
  alignItems: 'center',
  padding: '14px 18px',
  background: '#FAFBFD',
  borderBottom: `1px solid ${NAVY_12}`,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
  columnGap: 14,
};

const tableRowStyle = (selected: boolean): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: '1.5fr 0.85fr 0.65fr 0.55fr 0.85fr 0.95fr 0.8fr 1.35fr',
  alignItems: 'center',
  padding: '14px 18px',
  background: selected ? LAVENDER : '#ffffff',
  borderBottom: `1px solid ${NAVY_06}`,
  cursor: 'pointer',
  fontSize: 13,
  color: NAVY,
  columnGap: 14,
  transition: 'background 120ms ease',
});

const segNameStyle: CSSProperties = {
  fontWeight: 600,
  lineHeight: 1.4,
  color: NAVY,
};

const marketCellStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 500,
  color: NAVY_70,
};

const tierPillStyle = (tier: Tier): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 9px',
  borderRadius: 999,
  background: TIER_PILL_BG[tier],
  color: TIER_PILL_FG[tier],
  fontSize: 11,
  fontWeight: 700,
});

const numCellStyle: CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 600,
};

const donutCellStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

const suggestionStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_70,
  lineHeight: 1.45,
};

const detailGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1.2fr',
  gap: 24,
  alignItems: 'start',
};

const detailLeftCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 24,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const donutCompareRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 18,
  alignItems: 'center',
};

const donutColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
};

const donutLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: NAVY_55,
  textAlign: 'center',
};

const gapLineStyle: CSSProperties = {
  padding: '12px 14px',
  background: '#FEF2F2',
  border: '1px solid rgba(225,29,72,0.2)',
  borderLeft: '3px solid #E11D48',
  borderRadius: 10,
  fontSize: 13,
  color: NAVY,
  lineHeight: 1.5,
};

const countsRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 12,
  padding: '12px 0 4px',
  borderTop: `1px solid ${NAVY_06}`,
};

const countStatStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const countStatLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const countStatValueStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: NAVY,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.1,
};

const countStatSubStyle: CSSProperties = {
  fontSize: 11,
  color: NAVY_55,
  fontVariantNumeric: 'tabular-nums',
};

const suggestedActionRowStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  padding: '12px 14px',
  background: '#F5F3FF',
  border: '1px solid rgba(99,102,241,0.18)',
  borderRadius: 10,
};

const suggestedActionLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#3730A3',
  flexShrink: 0,
  paddingTop: 1,
};

const suggestedActionTextStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY,
  lineHeight: 1.5,
  fontWeight: 500,
};

const placeholderCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px dashed ${NAVY_12}`,
  borderRadius: 14,
  padding: 24,
  color: NAVY_55,
  fontSize: 13,
  lineHeight: 1.55,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const TRAINING_OPTIONS: FilterOption[] = [
  { value: 'above-60', label: 'Above 60% trained' },
  { value: 'below-60', label: 'Below 60% trained' },
];
const FOLLOWUP_OPTIONS: FilterOption[] = [
  { value: 'above-60', label: 'Above 60% followed up' },
  { value: 'below-60', label: 'Below 60% followed up' },
];
const TIER_OPTIONS: FilterOption[] = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

function donutToneFromPct(pct: number) {
  if (pct < 45) return 'at-risk' as const;
  if (pct < 60) return 'watch' as const;
  return 'on-track' as const;
}

export default function CustomerAccountFocus() {
  const navigate = useNavigate();

  // Build the set of markets that actually have segments.
  const availableMarketIds = useMemo(() => {
    const ids = new Set(hcpSegments.map((s) => s.marketId));
    return Array.from(ids);
  }, []);

  // Default: Italy selected, High tier selected, training and follow-up unfiltered.
  const [marketFilter, setMarketFilter] = useState<Set<string>>(new Set(['it']));
  const [tierFilter, setTierFilter] = useState<Set<string>>(new Set(['High']));
  const [trainingFilter, setTrainingFilter] = useState<Set<string>>(new Set());
  const [followupFilter, setFollowupFilter] = useState<Set<string>>(new Set());
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('it-derm-high');

  // The "Under-covered high-potential HCPs" banner pulls from the execution signal
  // so it stays consistent with the Execution Signals page rather than duplicating data.
  const undercoveredSignal = useMemo(
    () => executionSignals.find((s) => s.id === 'trained-not-visited'),
    [],
  );

  const filteredSegments = useMemo(() => {
    return hcpSegments
      .filter((s) =>
        marketFilter.size === 0 ? true : marketFilter.has(s.marketId),
      )
      .filter((s) =>
        tierFilter.size === 0 ? true : tierFilter.has(s.potentialTier),
      )
      .filter((s) => {
        if (trainingFilter.size === 0) return true;
        const above = s.trainedPct >= 60;
        return (
          (trainingFilter.has('above-60') && above) ||
          (trainingFilter.has('below-60') && !above)
        );
      })
      .filter((s) => {
        if (followupFilter.size === 0) return true;
        const above = s.followedUpWithin60dPct >= 60;
        return (
          (followupFilter.has('above-60') && above) ||
          (followupFilter.has('below-60') && !above)
        );
      });
  }, [marketFilter, tierFilter, trainingFilter, followupFilter]);

  // Tier options annotated with counts under the current market filter.
  const tierOptionsWithCounts: FilterOption[] = useMemo(
    () =>
      TIER_OPTIONS.map((opt) => ({
        ...opt,
        count: hcpSegments.filter(
          (s) =>
            (marketFilter.size === 0 || marketFilter.has(s.marketId)) &&
            s.potentialTier === opt.value,
        ).length,
      })),
    [marketFilter],
  );

  // Market options annotated with counts of segments per market.
  const marketOptionsWithCounts: FilterOption[] = useMemo(() => {
    const out: FilterOption[] = [];
    availableMarketIds.forEach((id) => {
      const m = markets.find((mk) => mk.id === id);
      if (!m) return;
      out.push({
        value: id,
        label: m.name,
        glyph: m.flag,
        count: hcpSegments.filter((s) => s.marketId === id).length,
      });
    });
    return out;
  }, [availableMarketIds]);

  const selectedSegment =
    hcpSegments.find((s) => s.id === selectedSegmentId) ?? filteredSegments[0] ?? hcpSegments[0];

  const isItDermHigh = selectedSegment?.id === 'it-derm-high';

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Customer and Account Focus"
        subtitle="Did we select the right HCPs, and are we following up?"
      />

      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <FilterDropdown
          label="Market"
          options={marketOptionsWithCounts}
          selected={marketFilter}
          onApply={setMarketFilter}
        />
        <FilterDropdown
          label="Potential tier"
          options={tierOptionsWithCounts}
          selected={tierFilter}
          onApply={setTierFilter}
        />
        <FilterDropdown
          label="Training"
          options={TRAINING_OPTIONS}
          selected={trainingFilter}
          onApply={setTrainingFilter}
          searchable={false}
        />
        <FilterDropdown
          label="Follow-up"
          options={FOLLOWUP_OPTIONS}
          selected={followupFilter}
          onApply={setFollowupFilter}
          searchable={false}
        />
        {(marketFilter.size + tierFilter.size + trainingFilter.size + followupFilter.size) > 0 && (
          <button
            type="button"
            onClick={() => {
              setMarketFilter(new Set());
              setTierFilter(new Set());
              setTrainingFilter(new Set());
              setFollowupFilter(new Set());
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: NAVY_70,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              fontFamily: 'inherit',
              padding: 0,
              marginLeft: 8,
            }}
          >
            Clear all
          </button>
        )}
      </section>

      {undercoveredSignal && (
        <section
          style={{
            background: '#ffffff',
            border: `1px solid ${NAVY_12}`,
            borderLeft: `4px solid #E11D48`,
            borderRadius: 12,
            padding: '16px 18px',
            display: 'grid',
            gridTemplateColumns: '32px 1fr auto',
            alignItems: 'center',
            columnGap: 14,
            boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: '#FEE2E2',
              color: '#7F1D1D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={16} strokeWidth={2.4} />
          </span>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#7F1D1D',
              }}
            >
              Under-covered high-potential HCPs
            </div>
            <div style={{ fontSize: 14, color: NAVY, marginTop: 3, lineHeight: 1.45 }}>
              <strong style={{ fontWeight: 700 }}>
                {undercoveredSignal.count} trained HCPs
              </strong>{' '}
              have not received a field follow-up within 60 days.{' '}
              {undercoveredSignal.marketBreakdown.map((b, i, arr) => {
                const m = markets.find((mk) => mk.id === b.marketId);
                if (!m) return null;
                return (
                  <span key={b.marketId}>
                    <strong style={{ fontWeight: 700 }}>{m.flag} {m.name} {b.count}</strong>
                    {i < arr.length - 1 ? ' · ' : ''}
                  </span>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMarketFilter(new Set(['it']));
              setTierFilter(new Set(['High']));
              setFollowupFilter(new Set(['below-60']));
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 32,
              padding: '0 14px',
              borderRadius: 999,
              background: '#0055BB',
              border: 'none',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            Filter to these
            <ChevronRight size={13} strokeWidth={2.6} />
          </button>
        </section>
      )}

      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: NAVY_55,
            }}
          >
            HCP segments
          </div>
          <div style={{ fontSize: 12, color: NAVY_55 }}>
            {filteredSegments.length} of {hcpSegments.length} segments shown · click a row to inspect
          </div>
        </div>
        <div style={tableCardStyle}>
        <div style={tableHeaderRowStyle}>
          <span>Segment</span>
          <span>Market</span>
          <span>Potential tier</span>
          <span style={{ textAlign: 'right' }}>HCPs</span>
          <span>Trained</span>
          <span>Followed up 60d</span>
          <span>Growth vs LY</span>
          <span>Suggested action</span>
        </div>
        {filteredSegments.length === 0 && (
          <div
            style={{
              padding: 22,
              textAlign: 'center',
              color: NAVY_55,
              fontSize: 13,
              fontStyle: 'italic',
            }}
          >
            No segments match the current filters.
          </div>
        )}
        {filteredSegments.map((s) => {
          const selected = selectedSegmentId === s.id;
          const rowMarket = markets.find((m) => m.id === s.marketId);
          return (
            <div
              key={s.id}
              style={tableRowStyle(selected)}
              onClick={() => setSelectedSegmentId(s.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedSegmentId(s.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={selected}
            >
              <span style={segNameStyle}>{s.name}</span>
              <span style={marketCellStyle}>
                <span aria-hidden>{rowMarket?.flag}</span>
                {rowMarket?.name ?? s.marketId}
              </span>
              <span>
                <span style={tierPillStyle(s.potentialTier)}>{s.potentialTier}</span>
              </span>
              <span style={{ ...numCellStyle, textAlign: 'right' }}>{s.count}</span>
              <span style={donutCellStyle}>
                <Donut value={s.trainedPct} size={60} stroke={6} tone={donutToneFromPct(s.trainedPct)} />
              </span>
              <span style={donutCellStyle}>
                <Donut
                  value={s.followedUpWithin60dPct}
                  size={60}
                  stroke={6}
                  tone={donutToneFromPct(s.followedUpWithin60dPct)}
                />
              </span>
              <span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '3px 9px',
                    borderRadius: 999,
                    background:
                      s.growthVsLyPct >= 2 ? '#D1FAE5'
                      : s.growthVsLyPct >= 0 ? '#F1F5F9'
                      : s.growthVsLyPct >= -1.5 ? '#FEF3C7'
                      : '#FEE2E2',
                    color:
                      s.growthVsLyPct >= 2 ? '#065F46'
                      : s.growthVsLyPct >= 0 ? '#334155'
                      : s.growthVsLyPct >= -1.5 ? '#92400E'
                      : '#7F1D1D',
                    fontSize: 11,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.growthVsLyPct >= 0 ? '+' : ''}{s.growthVsLyPct.toFixed(1)}%
                </span>
              </span>
              <span style={suggestionStyle}>{s.suggestedAction}</span>
            </div>
          );
        })}
        </div>
      </section>

      {selectedSegment && (
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
            Selected segment · {selectedSegment.name}
          </div>
          <div style={detailGridStyle}>
            <div style={detailLeftCardStyle}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: NAVY_55,
                  }}
                >
                  Trained vs followed up
                </div>
                <div style={{ fontSize: 13, color: NAVY_70, marginTop: 2 }}>
                  {selectedSegment.count} HCPs · {selectedSegment.potentialTier} potential
                </div>
              </div>

              <div style={donutCompareRowStyle}>
                <div style={donutColStyle}>
                  <Donut
                    value={selectedSegment.trainedPct}
                    size={120}
                    stroke={12}
                    tone={donutToneFromPct(selectedSegment.trainedPct)}
                  />
                  <div style={donutLabelStyle}>Trained</div>
                </div>
                <div style={donutColStyle}>
                  <Donut
                    value={selectedSegment.followedUpWithin60dPct}
                    size={120}
                    stroke={12}
                    tone={donutToneFromPct(selectedSegment.followedUpWithin60dPct)}
                  />
                  <div style={donutLabelStyle}>Followed up · 60 days</div>
                </div>
              </div>

              <div style={gapLineStyle}>
                <strong style={{ color: NAVY, fontWeight: 700 }}>
                  Gap: {Math.max(0, selectedSegment.trainedPct - selectedSegment.followedUpWithin60dPct)} points.
                </strong>{' '}
                Trained share exceeds post-training follow-up. Closing this gap is operational, not financial.
              </div>

              <div style={countsRowStyle}>
                <div style={countStatStyle}>
                  <div style={countStatLabelStyle}>HCPs</div>
                  <div style={countStatValueStyle}>{selectedSegment.count}</div>
                  <div style={countStatSubStyle}>In segment</div>
                </div>
                <div style={countStatStyle}>
                  <div style={countStatLabelStyle}>Trained</div>
                  <div style={countStatValueStyle}>
                    {Math.round((selectedSegment.count * selectedSegment.trainedPct) / 100)}
                  </div>
                  <div style={countStatSubStyle}>
                    of {selectedSegment.count} · {selectedSegment.trainedPct}%
                  </div>
                </div>
                <div style={countStatStyle}>
                  <div style={countStatLabelStyle}>Followed up 60d</div>
                  <div style={countStatValueStyle}>
                    {Math.round(
                      (selectedSegment.count * selectedSegment.followedUpWithin60dPct) / 100,
                    )}
                  </div>
                  <div style={countStatSubStyle}>
                    of {selectedSegment.count} · {selectedSegment.followedUpWithin60dPct}%
                  </div>
                </div>
              </div>

              <div style={suggestedActionRowStyle}>
                <span style={suggestedActionLabelStyle}>Suggested action</span>
                <span style={suggestedActionTextStyle}>{selectedSegment.suggestedAction}</span>
              </div>
            </div>

            <div>
              {isItDermHigh ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <RecommendationCard
                    eyebrow={italyHighPotentialDermRecommendation.eyebrow}
                    meta={italyHighPotentialDermRecommendation.headerMeta}
                    pill={italyHighPotentialDermRecommendation.pill}
                    recommendation={italyHighPotentialDermRecommendation.recommendation}
                    confidence={italyHighPotentialDermRecommendation.confidence}
                    confidenceRationale={italyHighPotentialDermRecommendation.confidenceRationale}
                    conditions={italyHighPotentialDermRecommendation.conditions}
                    nextActions={italyHighPotentialDermRecommendation.nextActions}
                    nextActionsMeta={italyHighPotentialDermRecommendation.nextActionsMeta}
                    sources={italyHighPotentialDermRecommendation.sources}
                    footerMeta={italyHighPotentialDermRecommendation.footerMeta}
                    variant="compact"
                  />
                  <button
                    type="button"
                    onClick={() => navigate('/ask-ariya?q=black-box-italy')}
                    style={{
                      alignSelf: 'flex-start',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 4px',
                      background: 'transparent',
                      border: 'none',
                      color: '#0055BB',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Ask Ariya for the full reasoning
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <div style={placeholderCardStyle}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: NAVY_55,
                    }}
                  >
                    Recommendation in development
                  </div>
                  <p style={{ margin: 0, color: NAVY_70 }}>
                    Italian high-potential dermatologists are the active demo cohort. Select that segment in the table to see the full recommendation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <WhatThisSuggests
        text="Scenario Planner explores what a directional reallocation would look like, anchored on closing this gap."
        to="/scenario-planner"
        linkLabel="Open Scenario Planner"
      />
    </div>
  );
}
