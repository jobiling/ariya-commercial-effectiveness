import type { CSSProperties } from 'react';

const cardStyle: CSSProperties = {
  padding: 24,
  maxWidth: 760,
};

const headlineStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 8,
};

const datelineStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--color-ariya-muted)',
  marginBottom: 20,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const bodyStyle: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: 'var(--color-ariya-ink)',
};

export default function WeeklyBrief() {
  return (
    <article className="ariya-card ariya-fade-in" style={cardStyle}>
      <div style={datelineStyle}>Week of 18 May 2026</div>
      <h1 style={headlineStyle}>Access risk rises in EU5; US PBM shift bears watching</h1>
      <p style={bodyStyle}>
        Competitive approval in EU5 is the most material development of the week, with a
        90-day window before re-pricing pressure begins. In parallel, an emerging US PBM
        consolidation puts tier-2 access at risk — modest impact today, but worth a
        proactive rebate review. Field share-of-voice remains a bright spot.
      </p>
    </article>
  );
}
