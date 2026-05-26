import type { CSSProperties } from 'react';
import { Eye } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';

const NAVY = '#050A44';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_06 = 'rgba(5,10,68,0.06)';

// Amber palette — quieter than the red used for at-risk priority callouts,
// distinct from the teal that previously marked decision-anchor cards and
// from the cool blue used for the Dig Deeper panel. The card should read
// as a watch item without raising an alarm.
const AMBER_BORDER = '#FDE68A';
const AMBER_TEXT = '#92400E';

type StatTone = 'on-track' | 'watch' | 'at-risk';

const TONE_DOT: Record<StatTone, string> = {
  'on-track': '#16A34A',
  watch: '#F59E0B',
  'at-risk': '#E11D48',
};

export interface BlindSpotCardProps {
  eyebrow: string;
  headline: string;
  body: string;
  recommendation: string;
  confidence: 'Low' | 'Medium' | 'High';
  confidenceRationale: string;
  sources: readonly string[];
  watchpointMetrics: readonly { label: string; value: string; tone: StatTone }[];
}

// ───────────────────────────────────────────────────────────────────────────
// Styles
// ───────────────────────────────────────────────────────────────────────────

const wrapStyle: CSSProperties = {
  background: '#FAFAFC',
  border: `1px solid ${AMBER_BORDER}`,
  borderLeft: `4px solid ${AMBER_BORDER}`,
  borderRadius: 12,
  padding: '22px 24px',
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  // gap is handled per-element with marginTop so the spec's
  // per-element top margins translate cleanly.
};

const eyebrowRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: AMBER_TEXT,
};

const headlineStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.4,
  margin: '8px 0 0',
};

const bodyStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: NAVY_70,
  lineHeight: 1.55,
  margin: '12px 0 0',
  maxWidth: 900,
};

const metricsRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px 24px',
  marginTop: 16,
};

const metricBlockStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 200,
};

const metricLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: NAVY_55,
  lineHeight: 1.35,
};

const metricValueRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const metricValueStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: NAVY,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.1,
};

const metricDotStyle = (color: string): CSSProperties => ({
  width: 7,
  height: 7,
  borderRadius: 999,
  background: color,
  flexShrink: 0,
});

const recommendationRowStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: NAVY,
  lineHeight: 1.55,
  margin: '16px 0 0',
};

const recommendationLeadStyle: CSSProperties = {
  fontWeight: 700,
  color: NAVY,
};

const confidenceRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginTop: 12,
  flexWrap: 'wrap',
};

const confidenceRationaleStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
};

const sourcesRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginTop: 12,
};

const sourceChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY_70,
  fontSize: 11,
  fontWeight: 600,
};

// ───────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────

export function BlindSpotCard({
  eyebrow,
  headline,
  body,
  recommendation,
  confidence,
  confidenceRationale,
  sources,
  watchpointMetrics,
}: BlindSpotCardProps) {
  // Split the recommendation copy so the lead phrase ("No action recommended
  // yet.") renders in bold inline with the rest of the sentence. The split
  // is at the first period followed by a space.
  const firstStop = recommendation.indexOf('. ');
  const lead = firstStop > -1 ? recommendation.slice(0, firstStop + 1) : recommendation;
  const rest = firstStop > -1 ? recommendation.slice(firstStop + 1) : '';

  return (
    <aside style={wrapStyle} aria-label={`${eyebrow}: ${headline}`}>
      <div style={eyebrowRowStyle}>
        <Eye size={14} strokeWidth={2} color={AMBER_TEXT} aria-hidden />
        {eyebrow}
      </div>

      <h2 style={headlineStyle}>{headline}</h2>
      <p style={bodyStyle}>{body}</p>

      <div style={metricsRowStyle}>
        {watchpointMetrics.map((m) => (
          <div key={m.label} style={metricBlockStyle}>
            <span style={metricLabelStyle}>{m.label}</span>
            <span style={metricValueRowStyle}>
              <span style={metricDotStyle(TONE_DOT[m.tone])} aria-hidden />
              <span style={metricValueStyle}>{m.value}</span>
            </span>
          </div>
        ))}
      </div>

      <p style={recommendationRowStyle}>
        <span style={recommendationLeadStyle}>{lead}</span>
        {rest && ' '}
        {rest}
      </p>

      <div style={confidenceRowStyle}>
        <ConfidenceBadge level={confidence} rationale={confidenceRationale} />
        <span style={confidenceRationaleStyle}>{confidenceRationale}</span>
      </div>

      <div style={sourcesRowStyle}>
        {sources.map((s) => (
          <span key={s} style={sourceChipStyle}>{s}</span>
        ))}
      </div>
    </aside>
  );
}
