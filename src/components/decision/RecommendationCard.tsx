import { useState, type CSSProperties, type ReactNode } from 'react';
import { Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';

const NAVY = '#050A44';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';
const TEAL = '#0F766E';

type Confidence = 'Low' | 'Medium' | 'High';

export interface RecommendationAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface NextAction {
  action: string;
  owner: string;
  timeframe: string;
}

export interface RecommendationCardProps {
  situation: string;
  recommendation: string;
  reasoning: string;
  // Optional extra paragraph rendered between reasoning and conditions.
  // Used by Ask Ariya for the "Scenario view" framing.
  scenarioView?: string;
  confidence: Confidence;
  confidenceRationale: string;
  conditions: readonly string[];
  nextActions: readonly NextAction[];
  sources: readonly string[];
  variant?: 'full' | 'compact';
  actions?: readonly RecommendationAction[];
  accent?: 'teal';
  eyebrow?: string;
  // Override the default "Conditions to verify" section header.
  // Ask Ariya uses "Required conditions".
  conditionsLabel?: string;
  // Override the default "Recommended next actions" section header.
  nextActionsLabel?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  // Custom node rendered for the recommendation headline. Used by the chat surface
  // to inject a typewriter-streamed headline instead of plain text.
  recommendationNode?: ReactNode;
}

const cardBaseStyle: CSSProperties = {
  position: 'relative',
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 28,
  boxShadow: '0 6px 18px rgba(5,10,68,0.10), 0 1px 2px rgba(5,10,68,0.04)',
  overflow: 'hidden',
};

const tealStripeStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: 6,
  background: TEAL,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: BLUE,
};

const eyebrowRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 12,
};

const toggleBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 26,
  padding: '0 10px',
  background: NAVY_06,
  border: 'none',
  borderRadius: 999,
  color: NAVY_70,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.02em',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const recommendationHeadlineStyle: CSSProperties = {
  fontSize: 19,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.35,
  margin: 0,
};

const situationStyle: CSSProperties = {
  marginTop: 14,
  fontSize: 14,
  fontWeight: 500,
  color: NAVY_70,
  lineHeight: 1.5,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const reasoningStyle: CSSProperties = {
  marginTop: 12,
  fontSize: 14,
  fontWeight: 400,
  color: NAVY_70,
  lineHeight: 1.55,
};

const confidenceRowStyle: CSSProperties = {
  marginTop: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
};

const confidenceRationaleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  lineHeight: 1.5,
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 10,
};

const sectionStyle: CSSProperties = {
  marginTop: 20,
  paddingTop: 18,
  borderTop: `1px solid ${NAVY_12}`,
};

const conditionRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '6px 0',
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
};

const actionRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: 6,
  padding: '8px 0',
  fontSize: 13,
  lineHeight: 1.5,
  borderBottom: `1px solid ${NAVY_06}`,
};

const dotSepStyle: CSSProperties = {
  color: NAVY_55,
  fontWeight: 700,
  margin: '0 2px',
};

const sourceRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginTop: 10,
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

const footerStyle: CSSProperties = {
  marginTop: 22,
  paddingTop: 18,
  borderTop: `1px solid ${NAVY_12}`,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  alignItems: 'center',
};

const primaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 36,
  padding: '0 14px',
  borderRadius: 10,
  background: BLUE,
  border: `1px solid ${BLUE}`,
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 150ms ease',
};

const quietBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 36,
  padding: '0 6px',
  background: 'transparent',
  border: 'none',
  color: BLUE,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <div style={sectionLabelStyle}>{label}</div>
      {children}
    </section>
  );
}

export function RecommendationCard({
  situation,
  recommendation,
  reasoning,
  scenarioView,
  confidence,
  confidenceRationale,
  conditions,
  nextActions,
  sources,
  variant = 'full',
  actions = [],
  accent,
  eyebrow = 'Ariya recommends',
  conditionsLabel = 'Conditions to verify',
  nextActionsLabel = 'Recommended next actions',
  collapsible = false,
  defaultCollapsed = false,
  recommendationNode,
}: RecommendationCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const cardStyle = accent === 'teal'
    ? { ...cardBaseStyle, paddingLeft: 32 }
    : cardBaseStyle;

  const isFull = variant === 'full';
  const showBody = !collapsed;

  return (
    <article style={cardStyle}>
      {accent === 'teal' && <span style={tealStripeStyle} aria-hidden />}

      <div style={eyebrowRowStyle}>
        <span style={eyebrowStyle}>{eyebrow}</span>
        {collapsible && (
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            style={toggleBtnStyle}
          >
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            {collapsed ? 'Show details' : 'Hide details'}
          </button>
        )}
      </div>
      <h2 style={recommendationHeadlineStyle}>{recommendationNode ?? recommendation}</h2>

      {isFull && situation && showBody && <p style={situationStyle}>{situation}</p>}
      {isFull && reasoning && showBody && <p style={reasoningStyle}>{reasoning}</p>}
      {isFull && scenarioView && showBody && (
        <p style={reasoningStyle}>
          <strong style={{ color: NAVY, fontWeight: 700 }}>Scenario view: </strong>
          {scenarioView}
        </p>
      )}

      <div style={confidenceRowStyle}>
        <ConfidenceBadge level={confidence} rationale={confidenceRationale} />
        {showBody && <span style={confidenceRationaleStyle}>{confidenceRationale}</span>}
      </div>

      {showBody && conditions.length > 0 && (
        <Section label={conditionsLabel}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {conditions.map((c, i) => (
              <li key={i} style={conditionRowStyle}>
                <Circle size={14} strokeWidth={1.5} color={NAVY_12} style={{ marginTop: 3, flexShrink: 0 }} />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {showBody && nextActions.length > 0 && (
        <Section label={nextActionsLabel}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {nextActions.map((a, i) => (
              <li
                key={i}
                style={{
                  ...actionRowStyle,
                  borderBottom: i === nextActions.length - 1 ? 'none' : actionRowStyle.borderBottom,
                }}
              >
                <span style={{ color: NAVY, fontWeight: 700 }}>{a.action}</span>
                <span style={dotSepStyle}>·</span>
                <span style={{ color: NAVY_70 }}>{a.owner}</span>
                <span style={dotSepStyle}>·</span>
                <span style={{ color: NAVY_55 }}>{a.timeframe}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {showBody && sources.length > 0 && (
        <Section label="Sources">
          <div style={sourceRowStyle}>
            {sources.map((s, i) => (
              <span key={i} style={sourceChipStyle}>{s}</span>
            ))}
          </div>
        </Section>
      )}

      {actions.length > 0 && (
        <div style={footerStyle}>
          {actions.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={a.onClick}
              style={a.primary ? primaryBtnStyle : quietBtnStyle}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
