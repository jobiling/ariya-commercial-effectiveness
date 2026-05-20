import type { CSSProperties, ReactNode } from 'react';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const RED = '#E11D48';
const GREEN = '#16A34A';
const BLUE = '#0055BB';

const TONE_ACCENT: Record<'red' | 'green' | 'navy', string> = {
  red: RED,
  green: GREEN,
  navy: NAVY,
};

const cardStyle = (tone: 'red' | 'green' | 'navy'): CSSProperties => ({
  position: 'relative',
  background: '#ffffff',
  border: `1px solid ${tone === 'red' ? 'rgba(225,29,72,0.25)' : NAVY_12}`,
  borderLeft: `4px solid ${TONE_ACCENT[tone]}`,
  borderRadius: 12,
  padding: '18px 22px 18px 22px',
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  columnGap: 24,
  rowGap: 4,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
});

const eyebrowStyle = (tone: 'red' | 'green' | 'navy'): CSSProperties => ({
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: TONE_ACCENT[tone],
  gridColumn: '1 / 2',
});

const dotPulseStyle = (color: string): CSSProperties => ({
  display: 'inline-block',
  width: 7,
  height: 7,
  borderRadius: 999,
  background: color,
  marginRight: 8,
  verticalAlign: 'middle',
});

const headlineStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.4,
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  gridColumn: '1 / 2',
};

const metaStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  marginTop: 4,
  gridColumn: '1 / 2',
};

const ctaStyle: CSSProperties = {
  gridColumn: '2 / 3',
  gridRow: '1 / 4',
  alignSelf: 'center',
  background: 'transparent',
  border: 'none',
  color: BLUE,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontFamily: 'inherit',
  padding: '4px 0',
};

const subheadlineStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: NAVY_70,
  marginTop: 2,
  lineHeight: 1.45,
  gridColumn: '1 / 2',
};

export interface NewsCalloutProps {
  tone?: 'red' | 'green' | 'navy';
  eyebrow: string;
  headline: string;
  subheadline?: string;
  meta?: string;
  ctaLabel: string;
  onCta: () => void;
  rightSlot?: ReactNode;
}

export function NewsCallout({
  tone = 'red',
  eyebrow,
  headline,
  subheadline,
  meta,
  ctaLabel,
  onCta,
  rightSlot,
}: NewsCalloutProps) {
  return (
    <div style={cardStyle(tone)} role="region" aria-label={eyebrow}>
      <div style={eyebrowStyle(tone)}>
        <span style={dotPulseStyle(TONE_ACCENT[tone])} />
        {eyebrow}
      </div>
      <h2 style={headlineStyle}>{headline}</h2>
      {subheadline && <p style={subheadlineStyle}>{subheadline}</p>}
      {meta && <div style={metaStyle}>{meta}</div>}
      {rightSlot ?? (
        <button type="button" onClick={onCta} style={ctaStyle}>
          {ctaLabel} →
        </button>
      )}
    </div>
  );
}
