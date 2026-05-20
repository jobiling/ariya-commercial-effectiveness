import type { CSSProperties } from 'react';

type Tone = 'on-track' | 'watch' | 'at-risk' | 'urgent';

const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';

const TONE_COLORS: Record<Tone, { dot: string; bg: string; fg: string }> = {
  'on-track': { dot: '#16A34A', bg: '#D1FAE5', fg: '#065F46' },
  watch: { dot: '#F59E0B', bg: '#FEF3C7', fg: '#92400E' },
  'at-risk': { dot: '#E11D48', bg: '#FEE2E2', fg: '#7F1D1D' },
  urgent: { dot: '#E11D48', bg: '#FEE2E2', fg: '#7F1D1D' },
};

const TONE_LABEL: Record<Tone, string> = {
  'on-track': 'On Track',
  watch: 'Watch',
  'at-risk': 'At Risk',
  urgent: 'Urgent',
};

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '3px 9px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '0.02em',
};

const dotStyle = (color: string): CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: 999,
  background: color,
  flexShrink: 0,
});

export interface SignalChipProps {
  tone: Tone;
  label?: string;
  variant?: 'filled' | 'dot-only';
}

export function SignalChip({ tone, label, variant = 'filled' }: SignalChipProps) {
  const colors = TONE_COLORS[tone];
  const displayLabel = label ?? TONE_LABEL[tone];

  if (variant === 'dot-only') {
    return (
      <span style={{ ...baseStyle, background: 'transparent', color: NAVY_70, fontWeight: 600 }}>
        <span style={dotStyle(colors.dot)} />
        {displayLabel}
      </span>
    );
  }

  return (
    <span style={{ ...baseStyle, background: colors.bg, color: colors.fg }}>
      <span style={dotStyle(colors.dot)} />
      {displayLabel}
    </span>
  );
}

// Helper to derive tone from growth-vs-plan, per Stage 2 spec thresholds
export function toneFromGrowth(growthVsPlanPct: number): Tone {
  if (growthVsPlanPct < -1.5) return 'at-risk';
  if (growthVsPlanPct < -0.5) return 'watch';
  return 'on-track';
}

export { NAVY_55 };
