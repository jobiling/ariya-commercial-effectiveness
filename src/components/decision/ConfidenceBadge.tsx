import { useState, type CSSProperties } from 'react';
import { Info } from 'lucide-react';

const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY = '#050A44';

const wrapStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
};

const pillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY_70,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.4,
  cursor: 'default',
};

const tooltipStyle: CSSProperties = {
  position: 'absolute',
  bottom: 'calc(100% + 8px)',
  left: 0,
  zIndex: 40,
  width: 260,
  padding: '10px 12px',
  background: NAVY,
  color: '#ffffff',
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1.45,
  fontWeight: 500,
  boxShadow: '0 8px 24px rgba(5,10,68,0.18)',
  pointerEvents: 'none',
};

const tooltipArrowStyle: CSSProperties = {
  position: 'absolute',
  bottom: -4,
  left: 16,
  width: 8,
  height: 8,
  background: NAVY,
  transform: 'rotate(45deg)',
};

export interface ConfidenceBadgeProps {
  level: 'Low' | 'Medium' | 'High';
  rationale: string;
}

export function ConfidenceBadge({ level, rationale }: ConfidenceBadgeProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      style={wrapStyle}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span style={{ ...pillStyle, border: `1px solid ${NAVY_12}` }} tabIndex={0}>
        Confidence: {level}
        <Info size={13} aria-hidden />
      </span>
      {open && (
        <span role="tooltip" style={tooltipStyle}>
          {rationale}
          <span style={tooltipArrowStyle} />
        </span>
      )}
    </span>
  );
}
