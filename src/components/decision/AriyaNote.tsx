import type { CSSProperties } from 'react';
import { Sparkles } from 'lucide-react';

const NAVY = '#050A44';
const BLUE = '#0055BB';

// ───────────────────────────────────────────────────────────────────────────
// AriyaNote
//
// Short editorial note from Ariya, rendered as a full-width tinted strip
// near the top of a page. Sets reading mode: signals that the surface is
// one input into the assembly chain that produces a decision elsewhere,
// not a standalone dashboard.
//
// Informational only. No CTA, no chevron, no right-side icon. Tonal
// weight comes from the colour (cool light blue) and the explicit
// Ariya branding (Sparkles + "Ariya note" blue eyebrow).
//
// Built for reuse: other pages may eventually need a top-of-page Ariya
// note. v1 ships used only on Market Performance.
// ───────────────────────────────────────────────────────────────────────────

export interface AriyaNoteProps {
  // Default 'Ariya note'.
  eyebrow?: string;
  body: string;
}

const wrapStyle: CSSProperties = {
  background: '#F0F6FF',
  border: `1px solid #BFDBFE`,
  borderRadius: 12,
  padding: '16px 20px',
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

const bodyStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: NAVY,
  lineHeight: 1.55,
  margin: 0,
  maxWidth: 980,
};

export function AriyaNote({ eyebrow = 'Ariya note', body }: AriyaNoteProps) {
  return (
    <aside style={wrapStyle} role="note" aria-label={eyebrow}>
      <span style={eyebrowRowStyle}>
        <Sparkles size={16} strokeWidth={2} color={BLUE} aria-hidden />
        {eyebrow}
      </span>
      <p style={bodyStyle}>{body}</p>
    </aside>
  );
}
