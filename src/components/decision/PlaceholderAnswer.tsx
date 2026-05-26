import type { CSSProperties } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const NAVY = '#050A44';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const BLUE = '#0055BB';

// ───────────────────────────────────────────────────────────────────────────
// PlaceholderAnswer
//
// Rendered on Ask Ariya when a non-hero exchange has `response.placeholder
// === true`. The point is to show that the system recognises the question
// but the full assembled answer has not been drafted yet, and to offer the
// hero question as the connected path forward.
//
// No assembly chain, no typewriter, no source strip. Behsad's framing on
// demo day: "There are 12 more pre-mapped questions, each linked to its
// source. We're drafting the answers next."
// ───────────────────────────────────────────────────────────────────────────

const wrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
};

const cardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: '20px 24px',
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const eyebrowRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: BLUE,
};

const recognisedLineStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: NAVY,
  lineHeight: 1.55,
  margin: '4px 0 0',
};

const helperLineStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.55,
  margin: 0,
};

const linkBtnStyle: CSSProperties = {
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  marginTop: 6,
  padding: '4px 0',
  background: 'transparent',
  border: 'none',
  color: BLUE,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export interface PlaceholderAnswerProps {
  // Called when the user clicks the "Ask the hero question" link inside the
  // placeholder. Wired by AskAriya to send the hero exchange.
  onAskHero: () => void;
  // Optional override for the hero CTA label. Defaults to the spec wording.
  heroCtaLabel?: string;
}

export function PlaceholderAnswer({
  onAskHero,
  heroCtaLabel = 'Ask the hero question',
}: PlaceholderAnswerProps) {
  return (
    <div style={wrapStyle}>
      <article style={cardStyle} aria-label="Question recognised, answer not yet drafted">
        <div style={eyebrowRowStyle}>
          <Sparkles size={14} strokeWidth={2} color={BLUE} aria-hidden />
          Ariya recommends
        </div>
        <p style={recognisedLineStyle}>
          This question is recognised. The full assembled answer will be available in the next iteration.
        </p>
        <p style={helperLineStyle}>In the meantime, the hero question covers the connected decision.</p>
        <button type="button" onClick={onAskHero} style={linkBtnStyle}>
          {heroCtaLabel}
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </article>
    </div>
  );
}
