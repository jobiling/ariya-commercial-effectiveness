import { useMemo, useState, type CSSProperties } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../components/layout/PageHeader';
import { RecommendationCard } from '../components/decision';
import {
  investmentRadar,
  italyHcpTrainingRecommendation,
  markets,
} from '../data/scenario';
import type { InvestmentCategoryId, InvestmentCell } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';

const TONE_BG = {
  'at-risk': '#FEF2F2',
  watch: '#FEF9F0',
  'on-track': '#ffffff',
  urgent: '#FEF2F2',
} as const;

const TONE_KPI_TEXT = {
  'at-risk': '#7F1D1D',
  watch: '#92400E',
  'on-track': NAVY_70,
  urgent: '#7F1D1D',
} as const;

const PRIMARY_MARKETS = ['it', 'de', 'es', 'fr'] as const;
const SECONDARY_MARKETS = ['uk', 'ch', 'nl', 'pl'] as const;

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  paddingBottom: 48,
};

const positioningRowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.01em',
  color: NAVY_55,
};

const matrixCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 18,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const matrixHeaderRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
  marginBottom: 14,
};

const moreToggleStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 28,
  padding: '0 12px',
  borderRadius: 999,
  background: NAVY_06,
  border: 'none',
  color: NAVY_70,
  fontSize: 11,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  letterSpacing: '0.02em',
};

const tableWrapStyle: CSSProperties = {
  overflowX: 'auto',
};

const rowHeaderStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: NAVY,
  textAlign: 'left',
  padding: '10px 12px',
  minWidth: 180,
  background: '#ffffff',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  borderBottom: `1px solid ${NAVY_06}`,
  lineHeight: 1.3,
};

const colHeaderStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: NAVY_55,
  textAlign: 'center',
  padding: '8px 4px',
  minWidth: 86,
};

const cellBaseStyle: CSSProperties = {
  padding: 3,
  textAlign: 'center',
};

const cellInnerStyle = (
  tone: keyof typeof TONE_BG,
  selected: boolean,
  clickable: boolean,
): CSSProperties => ({
  background: TONE_BG[tone],
  border: selected ? `2px solid ${NAVY}` : `1px solid ${NAVY_12}`,
  borderRadius: 8,
  padding: '8px 8px',
  cursor: clickable ? 'pointer' : 'default',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minHeight: 50,
  justifyContent: 'center',
  transition: 'box-shadow 120ms ease',
  boxShadow: selected ? '0 0 0 4px rgba(5,10,68,0.06)' : 'none',
});

const cellSpendStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: NAVY,
  fontVariantNumeric: 'tabular-nums',
};

const cellKpiStyle = (tone: keyof typeof TONE_KPI_TEXT): CSSProperties => ({
  fontSize: 11,
  fontWeight: 600,
  color: TONE_KPI_TEXT[tone],
  fontVariantNumeric: 'tabular-nums',
});

const emptyCellStyle: CSSProperties = {
  background: NAVY_06,
  border: `1px dashed ${NAVY_12}`,
  borderRadius: 10,
  padding: '10px',
  minHeight: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontStyle: 'italic',
  color: NAVY_55,
  textAlign: 'center',
  lineHeight: 1.35,
};

// Top-level grid: matrix on the left, sticky detail aside on the right.
const radarGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
  gap: 24,
  alignItems: 'start',
};

const stickyAsideStyle: CSSProperties = {
  position: 'sticky',
  top: 80,
  alignSelf: 'start',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  maxHeight: 'calc(100vh - 100px)',
  overflowY: 'auto',
  paddingRight: 2,
};

const detailLeftCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 20,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const selectionBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  borderRadius: 999,
  background: '#E8EAF6',
  color: '#050A44',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  alignSelf: 'flex-start',
};

const detailTitleStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
  lineHeight: 1.3,
};

const proxyDefStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.55,
};

const howWeReadStyle: CSSProperties = {
  fontSize: 12,
  fontStyle: 'italic',
  color: NAVY_55,
  lineHeight: 1.5,
  padding: '10px 12px',
  background: NAVY_06,
  borderRadius: 8,
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

const placeholderCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px dashed ${NAVY_12}`,
  borderRadius: 14,
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  color: NAVY_55,
  fontSize: 13,
  lineHeight: 1.55,
};

interface Selection {
  categoryId: InvestmentCategoryId;
  marketId: string;
}

export default function InvestmentRadar() {
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const [selection, setSelection] = useState<Selection>({
    categoryId: 'hcp-training',
    marketId: 'it',
  });

  const visibleMarketIds = showAllMarkets
    ? [...PRIMARY_MARKETS, ...SECONDARY_MARKETS]
    : [...PRIMARY_MARKETS];
  const visibleMarkets = visibleMarketIds
    .map((id) => markets.find((m) => m.id === id))
    .filter((m): m is (typeof markets)[number] => Boolean(m));

  const cellLookup = useMemo(() => {
    const map = new Map<string, InvestmentCell>();
    investmentRadar.forEach((cat) => {
      cat.cells.forEach((c) => map.set(`${cat.id}|${c.marketId}`, c));
    });
    return map;
  }, []);

  const selectedCategory = investmentRadar.find((c) => c.id === selection.categoryId)!;
  const selectedCell = cellLookup.get(`${selection.categoryId}|${selection.marketId}`);

  // Bar chart data: spend across all populated markets for the selected category.
  const spendData = selectedCategory.cells.map((c) => {
    const m = markets.find((mk) => mk.id === c.marketId);
    return {
      marketLabel: m ? `${m.flag} ${m.name.slice(0, 3).toUpperCase()}` : c.marketId,
      marketName: m?.name ?? c.marketId,
      spend: c.spendEur,
    };
  });

  const isItalyHcp = selection.categoryId === 'hcp-training' && selection.marketId === 'it';

  const selectedMarket = markets.find((m) => m.id === selection.marketId);

  return (
    <div style={pageStyle}>
      <div>
        <PageHeader
          title="Investment Radar"
          subtitle="Where are we investing, and where does the investment appear to be associated with follow-through?"
        />
        <div style={{ ...positioningRowStyle, marginTop: 6 }}>
          Proxy KPIs only. We do not claim promotional responsiveness data.
        </div>
      </div>

      <div style={radarGridStyle}>
        {/* LEFT: matrix */}
        <section style={matrixCardStyle}>
          <div style={matrixHeaderRowStyle}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>
                Investment matrix · spend and proxy KPI
              </div>
              <div style={{ fontSize: 12, color: NAVY_55, marginTop: 2 }}>
                Click a cell to inspect. Detail updates on the right.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAllMarkets((v) => !v)}
              style={moreToggleStyle}
            >
              {showAllMarkets ? '← 4 markets' : '+ 4 more markets'}
            </button>
          </div>

          <div style={tableWrapStyle}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={{ ...colHeaderStyle, textAlign: 'left', minWidth: 180, padding: '8px 12px' }}>
                    Category
                  </th>
                  {visibleMarkets.map((m) => (
                    <th key={m.id} style={colHeaderStyle}>
                      <span aria-hidden>{m.flag}</span> {m.name.slice(0, 3).toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investmentRadar.map((cat) => (
                  <tr key={cat.id}>
                    <th style={rowHeaderStyle}>{cat.name}</th>
                    {visibleMarkets.map((m) => {
                      const cell = cellLookup.get(`${cat.id}|${m.id}`);
                      const selected =
                        selection.categoryId === cat.id && selection.marketId === m.id;
                      if (!cell) {
                        return (
                          <td key={m.id} style={cellBaseStyle}>
                            <div style={emptyCellStyle}>Not in pilot scope</div>
                          </td>
                        );
                      }
                      return (
                        <td key={m.id} style={cellBaseStyle}>
                          <button
                            type="button"
                            onClick={() => setSelection({ categoryId: cat.id, marketId: m.id })}
                            style={{
                              ...cellInnerStyle(cell.tone, selected, true),
                              width: '100%',
                              font: 'inherit',
                              textAlign: 'center',
                            }}
                            aria-pressed={selected}
                          >
                            <div style={cellSpendStyle}>
                              €{(cell.spendEur / 1000).toFixed(2)}M
                            </div>
                            <div style={cellKpiStyle(cell.tone)}>{cell.proxyKpiValue}</div>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RIGHT: sticky detail aside */}
        <aside style={stickyAsideStyle}>
          <div style={detailLeftCardStyle}>
            <span style={selectionBadgeStyle}>
              Selected · {selectedCategory.name}
            </span>
            <h3 style={{ ...detailTitleStyle, margin: 0 }}>
              {selectedMarket?.flag} {selectedMarket?.name}
            </h3>

            {selectedCell && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div
                  style={{
                    padding: '10px 12px',
                    background: NAVY_06,
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: NAVY_55,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Spend
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: NAVY,
                      fontVariantNumeric: 'tabular-nums',
                      marginTop: 2,
                    }}
                  >
                    €{(selectedCell.spendEur / 1000).toFixed(2)}M
                  </div>
                </div>
                <div
                  style={{
                    padding: '10px 12px',
                    background: TONE_BG[selectedCell.tone],
                    border: `1px solid ${selectedCell.tone === 'on-track' ? NAVY_12 : 'rgba(225,29,72,0.18)'}`,
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: NAVY_55,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {selectedCell.proxyKpi}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: TONE_KPI_TEXT[selectedCell.tone],
                      fontVariantNumeric: 'tabular-nums',
                      marginTop: 2,
                    }}
                  >
                    {selectedCell.proxyKpiValue}
                  </div>
                </div>
              </div>
            )}

            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: NAVY_55,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Proxy KPI definition
              </div>
              <p style={proxyDefStyle}>{selectedCategory.proxyKpiDefinition}</p>
            </div>

            <p style={howWeReadStyle}>
              Proxy KPI indicates execution discipline, not commercial outcome.
            </p>

            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: NAVY_55,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Spend across markets
              </div>
              <div style={{ width: '100%', height: 110 }}>
                <ResponsiveContainer>
                  <BarChart data={spendData} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
                    <CartesianGrid stroke="rgba(5,10,68,0.06)" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="marketLabel"
                      tick={{ fill: NAVY_55, fontSize: 9 }}
                      tickLine={false}
                      axisLine={{ stroke: NAVY_12 }}
                    />
                    <YAxis
                      tick={{ fill: NAVY_55, fontSize: 9 }}
                      tickLine={false}
                      axisLine={{ stroke: NAVY_12 }}
                    />
                    <Tooltip
                      contentStyle={tooltipBoxStyle as any}
                      itemStyle={{ color: '#ffffff' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                      formatter={(v: any) => [`€${(Number(v) / 1000).toFixed(2)}M`, 'Spend']}
                    />
                    <Bar dataKey="spend" fill={BLUE} radius={[3, 3, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {isItalyHcp ? (
            <RecommendationCard
              situation={italyHcpTrainingRecommendation.situation}
              recommendation={italyHcpTrainingRecommendation.recommendation}
              reasoning={italyHcpTrainingRecommendation.reasoning}
              confidence={italyHcpTrainingRecommendation.confidence}
              confidenceRationale={italyHcpTrainingRecommendation.confidenceRationale}
              conditions={italyHcpTrainingRecommendation.conditions}
              nextActions={italyHcpTrainingRecommendation.nextActions}
              sources={italyHcpTrainingRecommendation.sources}
              accent="teal"
              collapsible
            />
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
                Italy HCP training is the active demo scenario. Select that cell to see the full recommendation.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
