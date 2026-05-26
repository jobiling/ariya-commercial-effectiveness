import { useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ChevronUp, Clock, Database, Shield, Sparkles } from 'lucide-react';

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
  // Optional alternative to `pill`. Renders a quiet 11px/800 uppercase
  // NAVY_55 context label in the same slot (e.g. "Selected · Italy · HCP
  // training and education"). Names what is selected, not what to do.
  // Use this on diagnostic surfaces where a verdict-style pill would
  // pre-empt a debate the page deliberately keeps open.
  contextLabel?: string;
  // Optional italic chain-link line rendered directly under contextLabel
  // (or under pill, if pill is set). Links a diagnostic-altitude card to
  // the strategic recommendation it descends from. The chevron is BLUE,
  // the rest of the line is 11px/500 NAVY_55 italic.
  chainLink?: { label: string; to: string };
  recommendation: string;
  recommendationNode?: ReactNode;
  // Optional brief paragraph rendered between the headline and the Dig
  // deeper panel. Distinct from the longer detail surfaced by whyBullets
  // further down in the body.
  summary?: string;

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

  // --- Dig deeper end section ---------------------------------------------
  // Optional "explore further" block rendered as the LAST section of the
  // card, fused with the footer's primary action(s). The three (or more)
  // CTAs are different paths to dig deeper into the recommendation (e.g.
  // Ask Ariya for the assembled chain, Scenario Planner to model
  // alternatives, Source Confidence to trace evidence). When `digDeeper`
  // is present, the legacy footer (actions + footerMeta) merges into this
  // section and the standalone footer is suppressed.
  digDeeper?: {
    eyebrow: string;       // default "Dig deeper"
    copy: string;
    ctas: readonly { label: string; to: string }[];
  };

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
  // When true, strips the outer wrapper's border / background / shadow /
  // radius so the card can be embedded inside a parent container without
  // looking like a nested card-in-card. Internal section hairlines and
  // padding stay intact.
  seamless?: boolean;
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

// Quiet context label that names what's selected (not what to do). Sits
// in the pill's former position on diagnostic surfaces.
const contextLabelStyle: CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

// Italic chain-link line. Renders directly below the pill / contextLabel
// and points back to the strategic recommendation this card descends from.
const chainLinkRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 6,
  fontSize: 11,
  fontWeight: 500,
  fontStyle: 'italic',
  color: NAVY_55,
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'inherit',
  textAlign: 'left',
};

// --- Headline & divider ----------------------------------------------------

const headlineStyle: CSSProperties = {
  // Sized to match the priority headline ("Italy Xeomin share is slipping…")
  // that sits in the same hero block. The recommendation is no louder than
  // the issue it answers.
  fontSize: 17,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.4,
  margin: '12px 0 0 0',
};

// New optional `summary` paragraph — a brief intro that sits between the
// headline and the Dig deeper panel. Distinct from the longer reasoning
// surfaced via whyBullets further down.
const summaryParagraphStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 400,
  color: NAVY_70,
  lineHeight: 1.6,
  margin: '8px 0 0 0',
  maxWidth: 820,
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

// --- Dig deeper panel -----------------------------------------------------
//
// Light-blue-tinted box rendered INSIDE the header section, between the
// summary paragraph and the WHY/Confidence row. Always visible (regardless
// of the collapsible toggle) — it carries the primary commit action plus
// the explore CTAs, so the user must be able to reach Log this decision
// without expanding the reasoning details.
//
// Top of the panel: "Dig deeper" blue eyebrow + one-line copy.
// Below: two columns separated by a vertical hairline. Left = three or
// more outline CTAs (explore paths). Right = primary action + footer meta.
// The two columns stack on narrow widths.

const digDeeperBoxStyle: CSSProperties = {
  background: '#EAF1FB',
  border: `1px solid #C7D2FE`,
  borderRadius: 12,
  padding: '18px 20px',
  marginTop: 16,
};

const endTopStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 16,
};

const endEyebrowRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: BLUE,
};

const endCopyStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: NAVY,
  lineHeight: 1.5,
  margin: 0,
};

const endActionsRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 20,
  flexWrap: 'wrap',
};

const endExploreColStyle: CSSProperties = {
  flex: '1 1 60%',
  minWidth: 280,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const endExploreCtasStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

const endCommitColStyle: CSSProperties = {
  flex: '0 1 auto',
  minWidth: 180,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 8,
  paddingLeft: 20,
  borderLeft: `1px solid ${NAVY_06}`,
};

const endExploreOutlineBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 36,
  padding: '0 14px',
  borderRadius: 10,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};

const endCommitPrimaryBtnStyle: CSSProperties = {
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
  whiteSpace: 'nowrap',
};

const endMetaStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  textAlign: 'right',
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
  contextLabel,
  chainLink,
  recommendation,
  recommendationNode,
  summary,
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
  // dig deeper bridge
  digDeeper,
  // footer
  actions = [],
  footerMeta,
  // utility / legacy
  variant = 'full',
  collapsible = false,
  defaultCollapsed = false,
  seamless = false,
}: RecommendationCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const showBody = !collapsed;
  const isFull = variant === 'full';
  const navigate = useNavigate();

  // When `seamless`, drop the outer card chrome so the component sits
  // flush inside its parent container.
  const resolvedWrapperStyle: CSSProperties = seamless
    ? {
        ...wrapperStyle,
        background: 'transparent',
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        overflow: 'visible',
      }
    : wrapperStyle;

  const hasWhyBullets = !!(whyBullets && whyBullets.length > 0);
  const hasWhyText = !!(situation || reasoning || scenarioView);
  // Compact variant deliberately drops the legacy paragraph-style situation
  // and reasoning text but keeps structured whyBullets + the Confidence box
  // so the operational headline still earns the right to be acted on.
  const showWhy = (isFull && (hasWhyBullets || hasWhyText)) || (!isFull && hasWhyBullets);

  const hasNextActions = nextActions.length > 0;
  const hasConditions = conditions.length > 0;
  const hasSources = sources.length > 0;
  const hasFooter = actions.length > 0 || !!footerMeta;

  const resolvedConfidenceLabel = confidenceLabel ?? `${confidence} · directional`;
  const resolvedConditionsMeta =
    conditionsMeta ?? `${conditions.length} required`;

  return (
    <div style={resolvedWrapperStyle}>
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

        {/* Quiet context label + optional chain link. These take the pill's
            slot on diagnostic surfaces where naming the selection is more
            honest than asserting a verdict. */}
        {(contextLabel || chainLink) && (
          <div>
            {contextLabel && <span style={contextLabelStyle}>{contextLabel}</span>}
            {chainLink && (
              <button
                type="button"
                onClick={() => navigate(chainLink.to)}
                style={chainLinkRowStyle}
              >
                {chainLink.label}
                <ArrowRight size={12} strokeWidth={2.5} color={BLUE} aria-hidden />
              </button>
            )}
          </div>
        )}

        <h2 style={headlineStyle}>{recommendationNode ?? recommendation}</h2>

        {summary && showBody && (
          <p style={summaryParagraphStyle}>{summary}</p>
        )}

        {/* Dig deeper panel — gated on showBody so it folds away with the
            rest of the reasoning when the user clicks "Hide details".
            When the card is expanded, this sits inside the header before
            the WHY two-col and carries the primary commit action. */}
        {digDeeper && showBody && (
          <div style={digDeeperBoxStyle} aria-label={digDeeper.eyebrow}>
            <div style={endTopStyle}>
              <span style={endEyebrowRowStyle}>
                <Sparkles size={14} strokeWidth={2} color={BLUE} aria-hidden />
                {digDeeper.eyebrow}
              </span>
              <p style={endCopyStyle}>{digDeeper.copy}</p>
            </div>
            <div style={endActionsRowStyle}>
              <div style={endExploreColStyle}>
                <div style={endExploreCtasStyle}>
                  {digDeeper.ctas.map((cta, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => navigate(cta.to)}
                      style={endExploreOutlineBtnStyle}
                    >
                      {cta.label}
                      <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
                    </button>
                  ))}
                </div>
              </div>
              {(actions.length > 0 || footerMeta) && (
                <div style={endCommitColStyle}>
                  {actions.map((a, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={a.onClick}
                      style={endCommitPrimaryBtnStyle}
                    >
                      {a.label}
                    </button>
                  ))}
                  {footerMeta && <span style={endMetaStyle}>{footerMeta}</span>}
                </div>
              )}
            </div>
          </div>
        )}

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
                ) : isFull ? (
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
                ) : null}
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

      {/* ─── Legacy footer (only when no digDeeper) ──────────────── */}
      {/* When digDeeper is present, the dig deeper panel inside the header
          section already carries the primary commit action + footer meta —
          no separate footer renders here. */}
      {showBody && !digDeeper && hasFooter && (
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
