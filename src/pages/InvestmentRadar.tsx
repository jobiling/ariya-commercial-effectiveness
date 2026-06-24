import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TriangleAlert } from 'lucide-react';
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
import { AriyaNote, RecommendationCard } from '../components/decision';
import {
  investmentRadar,
  germanyHcpTrainingRecommendation,
  proxyFramingNote,
  strategicChainLink,
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

const DACH_MARKETS = ['de', 'ch', 'at'] as const;

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  paddingBottom: 48,
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

// Spend-granularity toggle (graceful degradation for coarse client ledgers).
const granToggleWrapStyle: CSSProperties = {
  display: 'inline-flex',
  background: NAVY_06,
  borderRadius: 999,
  padding: 3,
  gap: 2,
  flexShrink: 0,
};

const granBtnStyle = (active: boolean): CSSProperties => ({
  border: 'none',
  borderRadius: 999,
  padding: '5px 11px',
  fontSize: 11,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  background: active ? '#ffffff' : 'transparent',
  color: active ? NAVY : NAVY_55,
  boxShadow: active ? '0 1px 2px rgba(5,10,68,0.10)' : 'none',
});

const incompleteBannerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '12px 14px',
  marginBottom: 14,
  borderRadius: 10,
  background: '#FFFBEB',
  border: '1px solid rgba(245,158,11,0.4)',
  color: '#92400E',
  fontSize: 12.5,
  lineHeight: 1.5,
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

// Graceful degradation: when a client ledger does not ventilate spend cleanly
// across the four categories, the matrix rolls them up to two broad buckets the
// data can support. Spend sums; the proxy KPI is suppressed (it needs
// category-level spend), and a "categorisation incomplete" banner is shown.
const ROLLUP_BUCKETS = [
  { id: 'execution', name: 'HCP and field execution', from: ['hcp-training', 'field-activity'] },
  { id: 'demand', name: 'Demand generation', from: ['marketing', 'events-kol'] },
] as const;

const TONE_RANK: Record<string, number> = { 'on-track': 0, watch: 1, 'at-risk': 2, urgent: 3 };

export default function InvestmentRadar() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<Selection>({
    categoryId: 'hcp-training',
    marketId: 'de',
  });
  // 'full' = clean ledger (4 categories). 'coarse' = ledger does not separate
  // categories cleanly, so roll up to 2 buckets.
  const [granularity, setGranularity] = useState<'full' | 'coarse'>('full');
  const [rolledSel, setRolledSel] = useState<{ bucketId: string; marketId: string }>({
    bucketId: 'execution',
    marketId: 'de',
  });

  const visibleMarkets = DACH_MARKETS
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

  const isGermanyHcp = selection.categoryId === 'hcp-training' && selection.marketId === 'de';

  const selectedMarket = markets.find((m) => m.id === selection.marketId);

  // Rolled-up buckets for the coarse-ledger mode. Spend sums across the
  // underlying categories; tone carries the worst underlying signal so an
  // at-risk category still surfaces even when categorisation is incomplete.
  const rolledRows = ROLLUP_BUCKETS.map((b) => ({
    id: b.id,
    name: b.name,
    sourceNames: b.from
      .map((catId) => investmentRadar.find((c) => c.id === catId)?.name)
      .filter(Boolean) as string[],
    cells: visibleMarkets.map((m) => {
      const underlying = b.from
        .map((catId) => cellLookup.get(`${catId}|${m.id}`))
        .filter((c): c is InvestmentCell => Boolean(c));
      const spendEur = underlying.reduce((s, c) => s + c.spendEur, 0);
      const tone = underlying.reduce<InvestmentCell['tone']>(
        (worst, c) => (TONE_RANK[c.tone] > TONE_RANK[worst] ? c.tone : worst),
        'on-track',
      );
      return { marketId: m.id, spendEur, tone, count: underlying.length };
    }),
  }));
  const selectedBucket = rolledRows.find((b) => b.id === rolledSel.bucketId) ?? rolledRows[0];
  const selectedBucketCell = selectedBucket.cells.find((c) => c.marketId === rolledSel.marketId);
  const rolledMarket = markets.find((m) => m.id === rolledSel.marketId);

  return (
    <div style={pageStyle}>
      <div>
        <PageHeader
          title="Investment Radar"
          subtitle="Where are we investing, and where does the investment appear to be associated with follow-through?"
        />
      </div>

      {/* Page-level "How to read this page" framing. Stays visible
          regardless of which cell is selected. */}
      <AriyaNote
        eyebrow={proxyFramingNote.eyebrow}
        body={proxyFramingNote.body}
      />

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
            <div role="tablist" aria-label="Spend categorisation granularity" style={granToggleWrapStyle}>
              <button
                type="button"
                role="tab"
                aria-selected={granularity === 'full'}
                onClick={() => setGranularity('full')}
                style={granBtnStyle(granularity === 'full')}
              >
                Full categories
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={granularity === 'coarse'}
                onClick={() => setGranularity('coarse')}
                style={granBtnStyle(granularity === 'coarse')}
              >
                Coarse ledger
              </button>
            </div>
          </div>

          {granularity === 'coarse' && (
            <div style={incompleteBannerStyle}>
              <TriangleAlert size={14} strokeWidth={2.25} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong style={{ fontWeight: 800 }}>Spend categorisation incomplete.</strong>{' '}
                This ledger does not separate the four categories cleanly, so spend is rolled up to two
                broad buckets it can support. Spend totals hold; category-level proxy KPIs need finer data.
              </div>
            </div>
          )}

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
                {granularity === 'full'
                  ? investmentRadar.map((cat) => (
                      <tr key={cat.id}>
                        <th style={rowHeaderStyle}>{cat.name}</th>
                        {visibleMarkets.map((m) => {
                          const cell = cellLookup.get(`${cat.id}|${m.id}`);
                          const selected =
                            selection.categoryId === cat.id && selection.marketId === m.id;
                          if (!cell) {
                            return <td key={m.id} style={cellBaseStyle} />;
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
                    ))
                  : rolledRows.map((b) => (
                      <tr key={b.id}>
                        <th style={rowHeaderStyle}>{b.name}</th>
                        {b.cells.map((cell) => {
                          const selected =
                            rolledSel.bucketId === b.id && rolledSel.marketId === cell.marketId;
                          return (
                            <td key={cell.marketId} style={cellBaseStyle}>
                              <button
                                type="button"
                                onClick={() => setRolledSel({ bucketId: b.id, marketId: cell.marketId })}
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
                                <div style={{ fontSize: 10, fontStyle: 'italic', color: NAVY_55 }}>
                                  rolled up
                                </div>
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
          {granularity === 'coarse' ? (
            <div style={detailLeftCardStyle}>
              <span style={selectionBadgeStyle}>Reduced granularity · {selectedBucket.name}</span>
              <h3 style={{ ...detailTitleStyle, margin: 0 }}>
                {rolledMarket?.flag} {rolledMarket?.name}
              </h3>
              <div style={{ padding: '10px 12px', background: NAVY_06, borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: NAVY_55, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Rolled-up spend
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
                  €{((selectedBucketCell?.spendEur ?? 0) / 1000).toFixed(2)}M
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: NAVY_55, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Rolls up
                </div>
                <p style={proxyDefStyle}>{selectedBucket.sourceNames.join(' + ')}.</p>
              </div>
              <p style={{ ...proxyDefStyle, fontStyle: 'italic' }}>
                Proxy KPIs and the category-level recommendation need spend separated by category.
                Switch to Full categories where the ledger supports it.
              </p>
            </div>
          ) : (
          <>
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

          {isGermanyHcp ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <RecommendationCard
                eyebrow={germanyHcpTrainingRecommendation.eyebrow}
                meta={germanyHcpTrainingRecommendation.headerMeta}
                contextLabel="Selected · Germany · HCP training and follow-up"
                chainLink={strategicChainLink}
                recommendation={germanyHcpTrainingRecommendation.recommendation}
                whyBullets={germanyHcpTrainingRecommendation.whyBullets}
                confidence={germanyHcpTrainingRecommendation.confidence}
                confidenceRationale={germanyHcpTrainingRecommendation.confidenceRationale}
                conditions={germanyHcpTrainingRecommendation.conditions}
                nextActions={germanyHcpTrainingRecommendation.nextActions}
                nextActionsMeta={germanyHcpTrainingRecommendation.nextActionsMeta}
                sources={germanyHcpTrainingRecommendation.sources}
                footerMeta={germanyHcpTrainingRecommendation.footerMeta}
                variant="compact"
                collapsible
              />
              {/* Investment Radar bridges to the question that pressure-tests
                  THIS surface's specific argument ("execution, not selection"),
                  not the hero recommendation. Each diagnostic surface gets its
                  own challenge-question route. */}
              <button
                type="button"
                onClick={() => navigate('/ask-ariya?q=germany-selection-alternative')}
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
                Ask Ariya: why follow-up and not selection?
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
                Germany HCP training and follow-up is the active demo scenario. Select that cell to see the full recommendation.
              </p>
            </div>
          )}
          </>
          )}
        </aside>
      </div>
    </div>
  );
}
