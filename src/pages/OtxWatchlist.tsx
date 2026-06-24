import { useState, type CSSProperties } from 'react';
import { Eye, TriangleAlert } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { markets, otxWatchlist } from '../data/scenario';
import type { OtxWatchEntry, SignalTone } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const LAVENDER = '#E8EAF6';
const AMBER = '#F59E0B';
const AMBER_BG = '#FFFBEB';

// OTx markets in display order. Germany is the default view.
const OTX_MARKETS = ['de', 'ch', 'at'] as const;

const TONE_TEXT: Record<SignalTone, string> = {
  'on-track': '#16A34A',
  watch: '#92400E',
  'at-risk': '#B91C1C',
  urgent: '#B91C1C',
};
const TONE_DOT: Record<SignalTone, string> = {
  'on-track': '#16A34A',
  watch: AMBER,
  'at-risk': '#E11D48',
  urgent: '#E11D48',
};

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
  paddingBottom: 56,
};

const noteStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  alignSelf: 'flex-start',
  padding: '8px 14px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY_70,
  fontSize: 12,
  fontWeight: 700,
};

// Lead "Active OTx signal" callout. Surfaces the one entry with a resource
// mismatch at the top of every view, so the default page leads with the live
// signal instead of an all-steady country tab.
const leadCardStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '16px 18px',
  borderRadius: 14,
  background: AMBER_BG,
  border: '1px solid rgba(245,158,11,0.45)',
  borderLeft: `4px solid ${AMBER}`,
};

const leadEyebrowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#92400E',
};

const leadBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 36,
  padding: '0 16px',
  borderRadius: 999,
  background: NAVY,
  border: 'none',
  color: '#ffffff',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

// Country selector · reuses the Market Performance market-selector pattern.
// Selected pill uses the LAVENDER active treatment, others NAVY_06.
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
  background: NAVY_06,
  border: `1px solid ${NAVY_12}`,
  color: NAVY_70,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
};

const countryPillActive: CSSProperties = {
  background: LAVENDER,
  border: `1px solid ${LAVENDER}`,
  color: NAVY,
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 16,
};

const cardStyle = (mismatch: boolean): CSSProperties => ({
  background: '#ffffff',
  border: `1px solid ${mismatch ? 'rgba(245,158,11,0.45)' : NAVY_12}`,
  borderRadius: 14,
  padding: 20,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

const cardHeadStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
};

const brandStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 800,
  color: NAVY,
  margin: 0,
  lineHeight: 1.2,
};

const marketStampStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: NAVY_55,
  marginTop: 3,
};

const watchPillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '4px 10px',
  borderRadius: 999,
  background: AMBER_BG,
  color: '#92400E',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.02em',
  border: '1px solid rgba(245,158,11,0.4)',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const contextStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.55,
  margin: 0,
};

const metricsRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 10,
};

const metricCellStyle: CSSProperties = {
  background: NAVY_06,
  borderRadius: 9,
  padding: '10px 12px',
};

const metricLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const metricValueRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  marginTop: 4,
};

const resourceWatchStyle = (mismatch: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 9,
  padding: '12px 14px',
  borderRadius: 10,
  background: mismatch ? AMBER_BG : NAVY_06,
  border: `1px solid ${mismatch ? 'rgba(245,158,11,0.3)' : NAVY_12}`,
});

const resourceLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 3,
};

function OtxCard({ entry }: { entry: OtxWatchEntry }) {
  const market = markets.find((m) => m.id === entry.marketId);
  return (
    <article style={cardStyle(entry.resourceMismatch)}>
      <div style={cardHeadStyle}>
        <div>
          <h2 style={brandStyle}>{entry.brand}</h2>
          <div style={marketStampStyle}>
            {market?.flag} {market?.name} · local watch
          </div>
        </div>
        {entry.resourceMismatch && (
          <span style={watchPillStyle}>
            <TriangleAlert size={12} strokeWidth={2.5} />
            Watch
          </span>
        )}
      </div>

      <p style={contextStyle}>{entry.localContext}</p>

      <div style={metricsRowStyle}>
        {entry.metrics.map((m) => (
          <div key={m.label} style={metricCellStyle}>
            <div style={metricLabelStyle}>{m.label}</div>
            <div style={metricValueRowStyle}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: TONE_DOT[m.tone] }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: TONE_TEXT[m.tone] }}>{m.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={resourceWatchStyle(entry.resourceMismatch)}>
        <Eye size={15} strokeWidth={2} color={entry.resourceMismatch ? AMBER : NAVY_55} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={resourceLabelStyle}>Resource watch</div>
          <div style={{ fontSize: 13, color: NAVY_70, lineHeight: 1.5 }}>{entry.resourceWatch}</div>
        </div>
      </div>
    </article>
  );
}

export default function OtxWatchlist() {
  const [selectedMarketId, setSelectedMarketId] = useState<string>('de');

  // Countries that actually have OTx entries, in display order.
  const countryPills = OTX_MARKETS
    .map((id) => markets.find((m) => m.id === id))
    .filter((m): m is (typeof markets)[number] => Boolean(m));

  const selectedMarket = markets.find((m) => m.id === selectedMarketId);
  // Drive the visible cards off each brand entry's marketId.
  const visibleEntries = otxWatchlist.entries.filter((e) => e.marketId === selectedMarketId);

  // The one live OTx signal across the portfolio: the entry flagged with a
  // resource mismatch. Leads the page so the default view earns its weight.
  const activeSignal = otxWatchlist.entries.find((e) => e.resourceMismatch);
  const activeSignalMarket = activeSignal && markets.find((m) => m.id === activeSignal.marketId);

  return (
    <div style={pageStyle}>
      <PageHeader
        title="OTx Watchlist"
        subtitle={`Local oversight for the OTx portfolio in ${selectedMarket?.name ?? ''}, alongside the Xeomin execution model.`}
      />

      {activeSignal && activeSignalMarket && (
        <div style={leadCardStyle}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={leadEyebrowStyle}>
              <TriangleAlert size={12} strokeWidth={2.5} />
              Active OTx signal · {activeSignalMarket.flag} {activeSignalMarket.name}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: '3px 0 2px' }}>
              {activeSignal.brand}: possible resource mismatch
            </div>
            <p style={{ margin: 0, fontSize: 13, color: NAVY_70, lineHeight: 1.5 }}>
              {activeSignal.resourceWatch}
            </p>
          </div>
          {selectedMarketId === activeSignal.marketId ? (
            <span style={{ ...leadEyebrowStyle, color: '#92400E', flexShrink: 0 }}>Shown below</span>
          ) : (
            <button
              type="button"
              style={leadBtnStyle}
              onClick={() => setSelectedMarketId(activeSignal.marketId)}
            >
              Review in {activeSignalMarket.name}
            </button>
          )}
        </div>
      )}

      <div style={pillRowStyle} role="tablist" aria-label="Select country">
        {countryPills.map((m) => {
          const active = m.id === selectedMarketId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMarketId(m.id)}
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

      <div style={noteStyle}>
        <Eye size={13} strokeWidth={2.25} />
        {otxWatchlist.note}
      </div>

      <div style={gridStyle}>
        {visibleEntries.map((e) => (
          <OtxCard key={e.id} entry={e} />
        ))}
      </div>
    </div>
  );
}
