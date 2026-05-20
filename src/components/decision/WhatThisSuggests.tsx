import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const NAVY = '#050A44';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const BLUE = '#0055BB';
const TEAL = '#0F766E';

const wrapStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '14px 18px',
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderLeft: `3px solid ${TEAL}`,
  borderRadius: 10,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const textStyle: CSSProperties = {
  fontSize: 14,
  color: NAVY_70,
  lineHeight: 1.5,
};

const labelStyle: CSSProperties = {
  color: NAVY,
  fontWeight: 700,
  marginRight: 6,
};

const linkStyle: CSSProperties = {
  flexShrink: 0,
  color: BLUE,
  fontSize: 13,
  fontWeight: 700,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

export interface WhatThisSuggestsProps {
  text: string;
  to: string;
  linkLabel: string;
}

export function WhatThisSuggests({ text, to, linkLabel }: WhatThisSuggestsProps) {
  return (
    <aside style={wrapStyle} role="note">
      <p style={textStyle}>
        <span style={labelStyle}>What this suggests:</span>
        {text}
      </p>
      <Link to={to} style={linkStyle}>
        {linkLabel} →
      </Link>
    </aside>
  );
}
