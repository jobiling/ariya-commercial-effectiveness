import type { CSSProperties } from 'react';

const NAVY = '#050A44';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const BLUE = '#0055BB';
const GREEN = '#16A34A';
const AMBER = '#F59E0B';
const RED = '#E11D48';

type Tone = 'navy' | 'blue' | 'on-track' | 'watch' | 'at-risk';

const TONE_COLOR: Record<Tone, string> = {
  navy: NAVY,
  blue: BLUE,
  'on-track': GREEN,
  watch: AMBER,
  'at-risk': RED,
};

export interface DonutProps {
  value: number;          // 0..100
  size?: number;          // px diameter, default 76
  stroke?: number;        // ring thickness in px, default 8
  tone?: Tone;            // ring color
  label?: string;         // optional small label below value
  showPct?: boolean;      // append "%" to value, default true
}

export function Donut({
  value,
  size = 76,
  stroke = 8,
  tone = 'navy',
  label,
  showPct = true,
}: DonutProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;
  const center = size / 2;
  const ringColor = TONE_COLOR[tone];

  const wrapStyle: CSSProperties = {
    position: 'relative',
    width: size,
    height: size,
    flexShrink: 0,
  };

  const valueStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontVariantNumeric: 'tabular-nums',
    color: NAVY,
  };

  const valueNumStyle: CSSProperties = {
    fontSize: size >= 70 ? 18 : 14,
    fontWeight: 800,
    lineHeight: 1,
  };

  const labelStyle: CSSProperties = {
    marginTop: 2,
    fontSize: 10,
    color: NAVY_55,
    fontWeight: 600,
    textAlign: 'center',
  };

  return (
    <div style={wrapStyle} role="img" aria-label={`${clamped.toFixed(0)}${showPct ? ' percent' : ''}${label ? ` ${label}` : ''}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={NAVY_12}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={ringColor}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          // Start the arc at 12 o'clock and go clockwise.
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div style={valueStyle}>
        <span style={valueNumStyle}>
          {Math.round(clamped)}
          {showPct && <span style={{ fontSize: size >= 70 ? 11 : 9, fontWeight: 700, marginLeft: 1 }}>%</span>}
        </span>
        {label && <span style={labelStyle}>{label}</span>}
      </div>
    </div>
  );
}
