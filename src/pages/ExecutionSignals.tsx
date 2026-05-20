import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterDropdown, SignalChip, SourceTag } from '../components/composites';
import type { FilterOption } from '../components/composites';
import { WhatThisSuggests } from '../components/decision';
import { executionSignals, markets } from '../data/scenario';
import type { SignalTone } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';

// Color is reserved for the left accent stripe and the status pill on the right.
// Everything else stays neutral. A page of all-red trains the eye to ignore red.
const TONE_LEFT_BORDER: Record<SignalTone, string> = {
  'on-track': '#16A34A',
  watch: '#F59E0B',
  'at-risk': '#E11D48',
  urgent: '#E11D48',
};

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  paddingBottom: 48,
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 18,
};

const cardStyle = (tone: SignalTone): CSSProperties => ({
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderLeft: `4px solid ${TONE_LEFT_BORDER[tone]}`,
  borderRadius: 12,
  padding: '20px 20px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  transition: 'box-shadow 150ms ease, transform 150ms ease',
});

const topRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
};

const cardHeadlineStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
  lineHeight: 1.35,
  flex: 1,
  minWidth: 0,
};

const countRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 12,
  flexWrap: 'wrap',
  paddingTop: 2,
};

const countBigStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: NAVY,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
};

const countUnitStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: NAVY_55,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const breakdownRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  paddingTop: 6,
};

const breakdownChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 9px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY_70,
  fontSize: 11,
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
};

const breakdownEmphasizedStyle: CSSProperties = {
  ...breakdownChipStyle,
  background: '#E0E7FF',
  color: '#3730A3',
  fontWeight: 700,
};

const descriptionStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.55,
  margin: 0,
};

const metaRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  fontSize: 12,
  color: NAVY_55,
  borderTop: `1px solid ${NAVY_06}`,
  paddingTop: 12,
};

const ownerCellStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const linkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  background: 'transparent',
  border: 'none',
  color: BLUE,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  padding: 0,
};

const FILTER_MARKETS = ['it', 'de', 'es', 'fr', 'pl', 'nl'] as const;
const FILTER_TONES: SignalTone[] = ['at-risk', 'watch'];

// The market with the highest count on each signal gets a small visual nudge
// in its breakdown chip. Keeps the "Italy 47" or "Germany 19" front-of-mind
// without bathing the whole card in color.
function leadingMarketId(breakdown: { marketId: string; count: number }[]): string | null {
  if (breakdown.length === 0) return null;
  return [...breakdown].sort((a, b) => b.count - a.count)[0].marketId;
}

export default function ExecutionSignals() {
  const navigate = useNavigate();
  const [marketFilter, setMarketFilter] = useState<Set<string>>(new Set());
  const [toneFilter, setToneFilter] = useState<Set<SignalTone>>(new Set());

  const filtered = useMemo(() => {
    return executionSignals.filter((s) => {
      const marketMatch =
        marketFilter.size === 0 ||
        s.marketBreakdown.some((b) => marketFilter.has(b.marketId));
      const toneMatch = toneFilter.size === 0 || toneFilter.has(s.tone);
      return marketMatch && toneMatch;
    });
  }, [marketFilter, toneFilter]);

  const marketOptions: FilterOption[] = useMemo(() => {
    const out: FilterOption[] = [];
    FILTER_MARKETS.forEach((id) => {
      const m = markets.find((mk) => mk.id === id);
      if (!m) return;
      const count = executionSignals.reduce((sum, s) => {
        const b = s.marketBreakdown.find((br) => br.marketId === id);
        return sum + (b ? 1 : 0);
      }, 0);
      out.push({ value: id, label: m.name, glyph: m.flag, count });
    });
    return out;
  }, []);

  const severityOptions: FilterOption[] = useMemo(
    () =>
      FILTER_TONES.map((t) => ({
        value: t,
        label: t === 'at-risk' ? 'At Risk' : 'Watch',
        count: executionSignals.filter((s) => s.tone === t).length,
      })),
    [],
  );

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Execution Signals"
        subtitle="Are teams doing the follow-through required to make investments work?"
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <FilterDropdown
          label="Market"
          options={marketOptions}
          selected={marketFilter}
          onApply={setMarketFilter}
        />
        <FilterDropdown
          label="Severity"
          options={severityOptions}
          selected={toneFilter as ReadonlySet<string>}
          onApply={(s) => setToneFilter(new Set(Array.from(s) as SignalTone[]))}
          searchable={false}
        />
        {(marketFilter.size + toneFilter.size) > 0 && (
          <button
            type="button"
            onClick={() => {
              setMarketFilter(new Set());
              setToneFilter(new Set());
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
      </div>

      <div>
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
            Open execution signals
          </div>
          <div style={{ fontSize: 12, color: NAVY_55 }}>
            {filtered.length} of {executionSignals.length} signals shown
          </div>
        </div>
        <div style={gridStyle}>
          {filtered.map((s) => {
            const leadId = leadingMarketId(s.marketBreakdown);
            const totalFromBreakdown = s.marketBreakdown.reduce((sum, b) => sum + b.count, 0);
            const remainder = s.count - totalFromBreakdown;
            return (
              <article key={s.id} style={cardStyle(s.tone)}>
                <div style={topRowStyle}>
                  <h3 style={cardHeadlineStyle}>{s.title}</h3>
                  <SignalChip tone={s.tone} />
                </div>

                <div style={countRowStyle}>
                  <span style={countBigStyle}>{s.count}</span>
                  <span style={countUnitStyle}>{s.unit}</span>
                </div>

                <div style={breakdownRowStyle}>
                  {s.marketBreakdown.map((b) => {
                    const market = markets.find((m) => m.id === b.marketId);
                    if (!market) return null;
                    const emphasised = b.marketId === leadId;
                    return (
                      <span
                        key={b.marketId}
                        style={emphasised ? breakdownEmphasizedStyle : breakdownChipStyle}
                      >
                        {market.flag} {market.name.slice(0, 3).toUpperCase()} {b.count}
                      </span>
                    );
                  })}
                  {remainder > 0 && (
                    <span style={breakdownChipStyle}>+{remainder} other</span>
                  )}
                </div>

                <p style={descriptionStyle}>{s.description}</p>

                <div style={metaRowStyle}>
                  <span style={ownerCellStyle}>
                    <strong style={{ color: NAVY_70, fontWeight: 700 }}>Owner:</strong> {s.owner}
                  </span>
                  <SourceTag label={s.source} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/customer-account-focus?signal=${s.id}`)}
                    style={linkStyle}
                  >
                    View affected segments
                    <ChevronRight size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            background: NAVY_06,
            border: `1px dashed ${NAVY_12}`,
            borderRadius: 12,
            padding: 22,
            textAlign: 'center',
            color: NAVY_55,
            fontSize: 13,
          }}
        >
          No signals match the current filters. Clear a filter to see more.
        </div>
      )}

      <WhatThisSuggests
        text="Italy and Germany dominate the at-risk signals. The next page connects these signals to specific HCP segments."
        to="/customer-account-focus"
        linkLabel="Open Customer and Account Focus"
      />
    </div>
  );
}
