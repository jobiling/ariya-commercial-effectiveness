import type { CSSProperties } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Donut } from '../components/composites';
import { sourceConfidence } from '../data/scenario';
import type { Confidence, ManualValidationStatus } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  paddingBottom: 48,
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 18,
};

const cardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 22,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const headerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
};

const headerTextStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const sourceNameStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
  lineHeight: 1.35,
};

const ownerStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
};

const lastRefreshStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
};

const validationPillStyles: Record<ManualValidationStatus, CSSProperties> = {
  'Validated': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 999,
    background: '#DCFCE7',
    color: '#14532D',
    fontSize: 11,
    fontWeight: 700,
  },
  'Spot-checked': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 999,
    background: '#FEF3C7',
    color: '#92400E',
    fontSize: 11,
    fontWeight: 700,
  },
  'Not yet validated': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 999,
    background: NAVY_06,
    color: NAVY_70,
    fontSize: 11,
    fontWeight: 700,
  },
};

const subLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 6,
};

const gapsListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.55,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const recRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '8px 0',
  borderBottom: `1px solid ${NAVY_06}`,
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.4,
};

const recLastRowStyle: CSSProperties = {
  ...recRowStyle,
  borderBottom: 'none',
};

const CONFIDENCE_PILL: Record<Confidence, CSSProperties> = {
  High: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 9px',
    borderRadius: 999,
    background: '#D1FAE5',
    color: '#065F46',
    fontSize: 11,
    fontWeight: 700,
  },
  Medium: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 9px',
    borderRadius: 999,
    background: '#FEF3C7',
    color: '#92400E',
    fontSize: 11,
    fontWeight: 700,
  },
  Low: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 9px',
    borderRadius: 999,
    background: '#FEE2E2',
    color: '#7F1D1D',
    fontSize: 11,
    fontWeight: 700,
  },
};

const caveatStyle: CSSProperties = {
  fontSize: 12,
  fontStyle: 'italic',
  color: NAVY_55,
  lineHeight: 1.5,
};

function completenessToTone(pct: number) {
  if (pct >= 90) return 'on-track' as const;
  if (pct >= 80) return 'watch' as const;
  return 'at-risk' as const;
}

export default function SourceConfidence() {
  return (
    <div style={pageStyle}>
      <PageHeader
        title="Source Confidence"
        subtitle="Recommendations depend on data quality and proxy strength."
      />

      <div>
        <div style={{ ...sectionLabelStyle, marginBottom: 10 }}>
          Data sources behind the demo scenario
        </div>
        <div style={gridStyle}>
          {sourceConfidence.map((s) => {
            const tone = completenessToTone(s.completenessPct);
            const validation = s.manualValidationStatus;
            return (
              <article key={s.id} style={cardStyle}>
                <div style={headerRowStyle}>
                  <Donut
                    value={s.completenessPct}
                    size={76}
                    stroke={8}
                    tone={tone}
                    label="Complete"
                  />
                  <div style={headerTextStyle}>
                    <h3 style={sourceNameStyle}>{s.name}</h3>
                    <span style={ownerStyle}>
                      <strong style={{ color: NAVY, fontWeight: 700 }}>Owner:</strong> {s.owner}
                    </span>
                    <span style={lastRefreshStyle}>{s.lastRefresh}</span>
                    <span style={{ ...validationPillStyles[validation], marginTop: 6 }}>
                      {validation}
                    </span>
                  </div>
                </div>

                {s.knownGaps.length > 0 && (
                  <div>
                    <div style={subLabelStyle}>Known gaps</div>
                    <ul style={gapsListStyle}>
                      {s.knownGaps.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {s.confidencePerRecommendation.length > 0 && (
                  <div>
                    <div style={subLabelStyle}>Confidence per recommendation</div>
                    <div>
                      {s.confidencePerRecommendation.map((r, i, arr) => (
                        <div
                          key={i}
                          style={i === arr.length - 1 ? recLastRowStyle : recRowStyle}
                        >
                          <span>{r.recommendation}</span>
                          <span style={CONFIDENCE_PILL[r.confidence]}>{r.confidence}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {s.caveats.length > 0 && (
                  <div>
                    <div style={subLabelStyle}>Caveats</div>
                    <ul style={{ ...gapsListStyle, paddingLeft: 0, listStyle: 'none' }}>
                      {s.caveats.map((c, i) => (
                        <li key={i} style={caveatStyle}>· {c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

    </div>
  );
}
