import { useState, type CSSProperties, type ReactNode } from 'react';
import { Check, ChevronDown, ChevronUp, Clock, Database, Shield } from 'lucide-react';

const NAVY = '#050A44';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_25 = 'rgba(5,10,68,0.25)';
const NAVY_18 = 'rgba(5,10,68,0.18)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';
const BLUE_SOFT = '#DCE6F8';
const BLUE_TINT_BG = '#EAF1FB';
const CONFIDENCE_BG = '#F4F5FA';

type Confidence = 'Low' | 'Medium' | 'High';

export interface RecommendationAction {
  label: string;
  onClick: () => void;
  // Back-compat: `primary` still maps to the filled blue button.
  primary?: boolean;
  // New: explicit tone override. If set, takes precedence over `primary`.
  // Default tone for non-primary actions is now "outline" (white card with border).
  tone?: 'primary' | 'outline' | 'quiet';
}

export interface NextAction {
  action: string;
  owner: string;
  timeframe: string;
  // Optional. When true, renders a PRIORITY pill on the right of the step row
  // and fills the numbered circle in blue.
  priority?: boolean;
}

export interface WhyBullet {
  // Bold lead-in (e.g. "Italy upside is conditional.")
  lead: string;
  // The body that follows the lead-in on the same paragraph.
  body: string;
}

export interface RecommendationCardProps {
  // --- Header --------------------------------------------------------------
  eyebrow?: string;             // default: 'Ariya recommends'
  meta?: string;                // optional right-side text in the eyebrow row
  pill?: string;                // optional navy badge under the eyebrow
  recommendation: string;
  recommendationNode?: ReactNode;

  // --- WHY column ----------------------------------------------------------
  // Preferred structured form. If omitted, the legacy `situation`, `reasoning`
  // and `scenarioView` strings render as stacked paragraphs.
  whyBullets?: readonly WhyBullet[];
  situation?: string;
  reasoning?: string;
  scenarioView?: string;

  // --- Confidence box (right of WHY) ---------------------------------------
  confidence: Confidence;
  confidenceRationale: string;
  // Defaults to e.g. "Medium · directional".
  confidenceLabel?: string;

  // --- Next actions card ---------------------------------------------------
  nextActions: readonly NextAction[];
  nextActionsLabel?: string;    // default: 'Next actions'
  nextActionsMeta?: string;     // optional right-side text on the header row

  // --- Conditions card -----------------------------------------------------
  conditions: readonly string[];
  conditionsLabel?: string;     // default: 'Conditions to hold'
  conditionsMeta?: string;      // default: '{n} required'

  // --- Sources card --------------------------------------------------------
  sources: readonly string[];
  sourcesLabel?: string;        // default: 'Sources used'

  // --- Footer --------------------------------------------------------------
  actions?: readonly RecommendationAction[];
  // Right-aligned subtle text, e.g. 'Reversible · revisit at 60 days'.
  footerMeta?: string;

  // --- Utility / legacy ----------------------------------------------------
  variant?: 'full' | 'compact';
  // Kept for back-compat. The new layout does not render a colored stripe.
  accent?: 'teal';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

// One continuous white card. Header, Next actions, Conditions+Sources, and
// the footer all live inside the same bordered surface. Internal sections
// are separated by 1 px NAVY_06 hairlines (`sectionDividerStyle` added as
// borderTop on every section after the first). No nested tiles, no inner
// borders, no inner shadows.
const wrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  padding: 0,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  overflow: 'hidden',
};

// Per-section padding. The first section (header) uses this as-is; every
// section after it adds `sectionTopDividerStyle` for the hairline.
const cardStyle: CSSProperties = {
  padding: '22px 24px',
};

const sectionTopDividerStyle: CSSProperties = {
  borderTop: `1px solid ${NAVY_06}`,
};

// --- Header row ------------------------------------------------------------

const eyebrowRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 14,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: BLUE,
};

const eyebrowRightStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 12,
};

const metaStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
};

const toggleBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '7px 14px',
  background: NAVY_06,
  border: 'none',
  borderRadius: 999,
  color: NAVY_70,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.02em',
  lineHeight: 1,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// --- Pill ------------------------------------------------------------------

const pillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 14px',
  background: NAVY,
  color: '#ffffff',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

// --- Headline & divider ----------------------------------------------------

const headlineStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: NAVY,
  lineHeight: 1.25,
  margin: '14px 0 0 0',
  letterSpacing: '-0.005em',
};

const dividerStyle: CSSProperties = {
  height: 1,
  background: NAVY_06,
  border: 'none',
  margin: '20px 0',
};

// --- WHY / Confidence grid -------------------------------------------------

const whyGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.4fr 1fr',
  gap: 28,
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 12,
};

const whyListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const whyBulletRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  fontSize: 14,
  color: NAVY_70,
  lineHeight: 1.55,
};

const whyBulletDotStyle: CSSProperties = {
  marginTop: 7,
  width: 6,
  height: 6,
  borderRadius: 999,
  background: BLUE,
  flexShrink: 0,
};

const whyLeadStyle: CSSProperties = {
  fontWeight: 700,
  color: NAVY,
};

const whyParagraphStyle: CSSProperties = {
  margin: '0 0 12px 0',
  fontSize: 14,
  color: NAVY_70,
  lineHeight: 1.55,
};

const confidenceBoxStyle: CSSProperties = {
  background: CONFIDENCE_BG,
  borderRadius: 12,
  padding: 18,
  alignSelf: 'start',
};

const confidenceBarStyle: CSSProperties = {
  display: 'flex',
  gap: 4,
  marginBottom: 10,
};

const confidenceLabelStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: NAVY,
  marginBottom: 8,
};

const confidenceRationaleStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
  margin: 0,
};

// --- Subcard headers (Next actions / Conditions / Sources) ----------------

const cardHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 18,
};

const cardHeaderTitleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: NAVY,
};

const cardHeaderMetaStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
};

// --- Next actions ----------------------------------------------------------

const stepListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const stepRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: 14,
};

const stepCircleBaseStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 999,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 700,
  flexShrink: 0,
};

const stepCircleFilledStyle: CSSProperties = {
  ...stepCircleBaseStyle,
  background: BLUE,
  color: '#ffffff',
};

const stepCircleOutlineStyle: CSSProperties = {
  ...stepCircleBaseStyle,
  background: '#ffffff',
  border: `1px solid ${NAVY_18}`,
  color: NAVY_55,
};

const stepTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: NAVY,
  lineHeight: 1.4,
};

const stepMetaStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 4,
  flexWrap: 'wrap',
};

const stepMetaDotStyle: CSSProperties = {
  color: NAVY_25,
};

const priorityPillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  background: BLUE_TINT_BG,
  color: BLUE,
  borderRadius: 999,
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

// --- Conditions + sources bottom grid -------------------------------------
//
// Two columns inside the same single card, separated by a vertical hairline
// applied as `borderRight` on the first column.

const bottomGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 0,
};

// Inner column for the bottom grid. Each column owns its own padding.
const bottomColStyle: CSSProperties = {
  padding: '22px 24px',
};

const bottomColLeftStyle: CSSProperties = {
  ...bottomColStyle,
  borderRight: `1px solid ${NAVY_06}`,
};

const listTwoColStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px 16px',
};

const conditionRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.45,
};

const sourceRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.4,
};

// --- Footer ----------------------------------------------------------------

const footerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '16px 24px',
};

const footerActionsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 10,
};

const footerMetaStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
};

const primaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 40,
  padding: '0 18px',
  borderRadius: 10,
  background: BLUE,
  border: `1px solid ${BLUE}`,
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 150ms ease',
};

const outlineBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 40,
  padding: '0 16px',
  borderRadius: 10,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const quietBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 40,
  padding: '0 10px',
  background: 'transparent',
  border: 'none',
  color: NAVY_70,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ConfidenceBar({ level }: { level: Confidence }) {
  const filled = level === 'High' ? 5 : level === 'Medium' ? 3 : 2;
  return (
    <div style={confidenceBarStyle} aria-label={`Confidence: ${level}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            height: 5,
            flex: 1,
            borderRadius: 3,
            background: i < filled ? BLUE : BLUE_SOFT,
          }}
        />
      ))}
    </div>
  );
}

function resolveTone(a: RecommendationAction): 'primary' | 'outline' | 'quiet' {
  if (a.tone) return a.tone;
  if (a.primary) return 'primary';
  return 'outline';
}

function actionStyleFor(tone: 'primary' | 'outline' | 'quiet'): CSSProperties {
  if (tone === 'primary') return primaryBtnStyle;
  if (tone === 'outline') return outlineBtnStyle;
  return quietBtnStyle;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RecommendationCard({
  // header
  eyebrow = 'Ariya recommends',
  meta,
  pill,
  recommendation,
  recommendationNode,
  // why
  whyBullets,
  situation,
  reasoning,
  scenarioView,
  // confidence
  confidence,
  confidenceRationale,
  confidenceLabel,
  // next actions
  nextActions,
  nextActionsLabel = 'Next actions',
  nextActionsMeta,
  // conditions
  conditions,
  conditionsLabel = 'Conditions to hold',
  conditionsMeta,
  // sources
  sources,
  sourcesLabel = 'Sources used',
  // footer
  actions = [],
  footerMeta,
  // utility / legacy
  variant = 'full',
  collapsible = false,
  defaultCollapsed = false,
}: RecommendationCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const showBody = !collapsed;
  const isFull = variant === 'full';

  const hasWhyBullets = !!(whyBullets && whyBullets.length > 0);
  const hasWhyText = !!(situation || reasoning || scenarioView);
  const showWhy = isFull && (hasWhyBullets || hasWhyText);

  const hasNextActions = nextActions.length > 0;
  const hasConditions = conditions.length > 0;
  const hasSources = sources.length > 0;
  const hasFooter = actions.length > 0 || !!footerMeta;

  const resolvedConfidenceLabel = confidenceLabel ?? `${confidence} · directional`;
  const resolvedConditionsMeta =
    conditionsMeta ?? `${conditions.length} required`;

  return (
    <div style={wrapperStyle}>
      {/* ─── Header card ──────────────────────────────────────────── */}
      <article style={cardStyle}>
        <div style={eyebrowRowStyle}>
          <span style={eyebrowStyle}>{eyebrow}</span>
          <div style={eyebrowRightStyle}>
            {meta && <span style={metaStyle}>{meta}</span>}
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
        </div>

        {pill && (
          <span style={pillStyle}>
            <Shield size={13} aria-hidden />
            {pill}
          </span>
        )}

        <h2 style={headlineStyle}>{recommendationNode ?? recommendation}</h2>

        {showWhy && showBody && (
          <>
            <hr style={dividerStyle} />
            <div style={whyGridStyle}>
              <div>
                <div style={sectionLabelStyle}>Why</div>
                {hasWhyBullets ? (
                  <ul style={whyListStyle}>
                    {whyBullets!.map((b, i) => (
                      <li key={i} style={whyBulletRowStyle}>
                        <span style={whyBulletDotStyle} aria-hidden />
                        <span>
                          <span style={whyLeadStyle}>{b.lead} </span>
                          {b.body}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    {situation && <p style={whyParagraphStyle}>{situation}</p>}
                    {reasoning && <p style={whyParagraphStyle}>{reasoning}</p>}
                    {scenarioView && (
                      <p style={whyParagraphStyle}>
                        <strong style={whyLeadStyle}>Scenario view: </strong>
                        {scenarioView}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div style={confidenceBoxStyle}>
                <div style={sectionLabelStyle}>Confidence</div>
                <ConfidenceBar level={confidence} />
                <div style={confidenceLabelStyle}>{resolvedConfidenceLabel}</div>
                <p style={confidenceRationaleStyle}>{confidenceRationale}</p>
              </div>
            </div>
          </>
        )}
      </article>

      {/* ─── Next actions section ────────────────────────────────── */}
      {showBody && hasNextActions && (
        <article style={{ ...cardStyle, ...sectionTopDividerStyle }}>
          <div style={cardHeaderStyle}>
            <span style={cardHeaderTitleStyle}>{nextActionsLabel}</span>
            {nextActionsMeta && (
              <span style={cardHeaderMetaStyle}>{nextActionsMeta}</span>
            )}
          </div>
          <ol style={stepListStyle}>
            {nextActions.map((a, i) => (
              <li key={i} style={stepRowStyle}>
                <span
                  style={a.priority ? stepCircleFilledStyle : stepCircleOutlineStyle}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div>
                  <div style={stepTitleStyle}>{a.action}</div>
                  <div style={stepMetaStyle}>
                    <span>{a.owner}</span>
                    <span style={stepMetaDotStyle}>·</span>
                    <Clock size={11} aria-hidden />
                    <span>{a.timeframe}</span>
                  </div>
                </div>
                {a.priority ? (
                  <span style={priorityPillStyle}>Priority</span>
                ) : (
                  <span aria-hidden />
                )}
              </li>
            ))}
          </ol>
        </article>
      )}

      {/* ─── Conditions + Sources bottom row ─────────────────────── */}
      {showBody && (hasConditions || hasSources) && (
        <div style={{ ...bottomGridStyle, ...sectionTopDividerStyle }}>
          {hasConditions && (
            <article style={hasSources ? bottomColLeftStyle : bottomColStyle}>
              <div style={cardHeaderStyle}>
                <span style={cardHeaderTitleStyle}>{conditionsLabel}</span>
                <span style={cardHeaderMetaStyle}>{resolvedConditionsMeta}</span>
              </div>
              <ul style={listTwoColStyle}>
                {conditions.map((c, i) => (
                  <li key={i} style={conditionRowStyle}>
                    <Check
                      size={14}
                      color={BLUE}
                      strokeWidth={2.75}
                      style={{ marginTop: 2, flexShrink: 0 }}
                      aria-hidden
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}
          {hasSources && (
            <article style={bottomColStyle}>
              <div style={cardHeaderStyle}>
                <span style={cardHeaderTitleStyle}>{sourcesLabel}</span>
                <span style={cardHeaderMetaStyle}>{sources.length}</span>
              </div>
              <ul style={listTwoColStyle}>
                {sources.map((s, i) => (
                  <li key={i} style={sourceRowStyle}>
                    <Database
                      size={13}
                      color={NAVY_55}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      )}

      {/* ─── Footer actions (inside the single card) ─────────────── */}
      {showBody && hasFooter && (
        <div style={{ ...footerStyle, ...sectionTopDividerStyle }}>
          <div style={footerActionsStyle}>
            {actions.map((a, i) => {
              const tone = resolveTone(a);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={a.onClick}
                  style={actionStyleFor(tone)}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
          {footerMeta && <span style={footerMetaStyle}>{footerMeta}</span>}
        </div>
      )}
    </div>
  );
}
