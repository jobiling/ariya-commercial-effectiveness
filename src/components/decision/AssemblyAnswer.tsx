import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Database,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfidenceBadge } from './ConfidenceBadge';
import { useTypewriter } from '../../hooks/useTypewriter';
import { sourceConfidence } from '../../data/scenario';
import type { AriyaExchange } from '../../data/scenario';

// ───────────────────────────────────────────────────────────────────────────
// Tokens
// ───────────────────────────────────────────────────────────────────────────

const NAVY = '#050A44';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';

// Sources that show the BookOpen icon (editorial / qualitative) instead of the
// default Database icon (quantitative data layer).
const EDITORIAL_SOURCE_NAMES = new Set(['Market context', 'Market research and brand materials']);

function iconForSource(name: string) {
  return EDITORIAL_SOURCE_NAMES.has(name) ? BookOpen : Database;
}

// ───────────────────────────────────────────────────────────────────────────
// Source → refresh date lookup
// ───────────────────────────────────────────────────────────────────────────
//
// The labels used in AriyaExchange.response.sources are slightly different
// from the full DataSource names in sourceConfidence (e.g. "Finance" vs
// "Finance and spend", "HCP segmentation" vs "Segmentation and targeting",
// "Market context" vs "Market research and brand materials"). This map
// keeps the two surfaces in sync without forcing the names to match.

const SOURCE_NAME_ALIASES: Record<string, string> = {
  'Finance': 'Finance and spend',
  'HCP segmentation': 'Segmentation and targeting',
  'Market context': 'Market research and brand materials',
};

function refreshDateFor(sourceLabel: string): string | undefined {
  const aliased = SOURCE_NAME_ALIASES[sourceLabel] ?? sourceLabel;
  const hit = sourceConfidence.find(
    (s) => s.name === aliased || s.name === sourceLabel,
  );
  return hit?.lastRefresh;
}

// ───────────────────────────────────────────────────────────────────────────
// Styles
// ───────────────────────────────────────────────────────────────────────────

const wrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  padding: '4px 2px',
};

const cardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: '18px 20px',
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const blueEyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: BLUE,
  marginBottom: 10,
};

const greyEyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 10,
};

const sourceChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
};

const sourceChipsRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const chainListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const chainRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '200px 1fr',
  alignItems: 'center',
  gap: 14,
};

const chainSourcePillStyle: CSSProperties = {
  ...sourceChipStyle,
  fontSize: 11,
  padding: '5px 10px',
  justifySelf: 'start',
};

const chainSentenceWrapStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minWidth: 0,
};

const chainConnectorStyle: CSSProperties = {
  width: 18,
  height: 1,
  background: NAVY_12,
  flexShrink: 0,
};

const chainSentenceStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: NAVY_70,
  lineHeight: 1.5,
  margin: 0,
};

const recommendedActionStyle: CSSProperties = {
  fontSize: 19,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.35,
  margin: 0,
  minHeight: '1.35em',
};

const scenarioParagraphStyle: CSSProperties = {
  fontSize: 14,
  color: NAVY_70,
  lineHeight: 1.6,
  margin: '12px 0 0',
};

const confidenceRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
};

const confidenceRationaleStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
};

const conditionRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '5px 0',
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
};

const nextActionRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '24px 1fr auto',
  alignItems: 'center',
  gap: 12,
  padding: '6px 0',
};

const nextActionNumberStyle = (priority: boolean): CSSProperties => ({
  width: 24,
  height: 24,
  borderRadius: 999,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontWeight: 700,
  background: priority ? BLUE : '#ffffff',
  color: priority ? '#ffffff' : NAVY_55,
  border: priority ? `1px solid ${BLUE}` : `1px solid rgba(5,10,68,0.18)`,
});

const nextActionTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: NAVY,
  lineHeight: 1.4,
};

const nextActionMetaStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  marginTop: 2,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const citationListStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px 16px',
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const citationRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const citationLabelStyle: CSSProperties = {
  ...sourceChipStyle,
  fontSize: 12,
  alignSelf: 'flex-start',
};

const citationDateStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  paddingLeft: 6,
};

const footerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  marginTop: 4,
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
};

const quietBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 40,
  padding: '0 8px',
  background: 'transparent',
  border: 'none',
  color: BLUE,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// ───────────────────────────────────────────────────────────────────────────
// Props
// ───────────────────────────────────────────────────────────────────────────

export interface AssemblyAnswerProps {
  exchange: AriyaExchange;
  onLogDecision: (exchange: AriyaExchange) => void;
  onNavigate: (route: string) => void;
}

// ───────────────────────────────────────────────────────────────────────────
// Stagger / reveal timing
// ───────────────────────────────────────────────────────────────────────────

const SOURCE_STAGGER_S = 0.08;                  // 80ms between source chips
const CHAIN_STAGGER_S = 0.20;                   // 200ms between reasoning rows
const STEP_FADE_DURATION_S = 0.28;
const STEP_GAP_S = 0.10;                        // small pause between steps

// ───────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────

export function AssemblyAnswer({ exchange, onLogDecision, onNavigate }: AssemblyAnswerProps) {
  const r = exchange.response;
  const chain = r.reasoningChain ?? [];
  const hasChain = chain.length > 0;

  // Cascading "step delay" — each step waits for the previous to land before
  // fading in. Computed so the total reveal sits around 2.5-3.5s end to end.
  const tSources = 0;
  const tSourcesDone = tSources + r.sources.length * SOURCE_STAGGER_S + STEP_FADE_DURATION_S;
  const tChain = hasChain ? tSourcesDone + STEP_GAP_S : tSourcesDone;
  const tChainDone = hasChain
    ? tChain + chain.length * CHAIN_STAGGER_S + STEP_FADE_DURATION_S
    : tChain;
  const tAction = tChainDone + STEP_GAP_S;
  // After the action headline finishes its typewriter, the remaining sections
  // can begin. We approximate the typewriter duration as 25ms per char.
  const typewriterMs = Math.max(400, r.recommendedAction.length * 25);
  const tActionDone = tAction + typewriterMs / 1000;
  const tScenario = tActionDone + STEP_GAP_S;
  const tConfidence = tScenario + STEP_FADE_DURATION_S;
  const tConditions = tConfidence + STEP_FADE_DURATION_S;
  const tNextActions = tConditions + STEP_FADE_DURATION_S;
  const tCitations = tNextActions + STEP_FADE_DURATION_S;
  const tFooter = tCitations + STEP_FADE_DURATION_S;

  // Only kick off the typewriter once the chain has finished revealing.
  const [actionTypewriterEnabled, setActionTypewriterEnabled] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setActionTypewriterEnabled(true), tAction * 1000);
    return () => window.clearTimeout(id);
  }, [tAction]);
  const { text: actionText } = useTypewriter(r.recommendedAction, {
    enabled: actionTypewriterEnabled,
    speed: 25,
  });

  // Map source-name → DataSource refresh date once.
  const citations = useMemo(
    () =>
      r.sources.map((name) => ({
        name,
        refresh: refreshDateFor(name),
      })),
    [r.sources],
  );

  return (
    <div style={wrapStyle}>
      {/* 1 · Sources strip ────────────────────────────────────────── */}
      <section style={cardStyle} aria-label="Sources Ariya pulled from">
        <div style={blueEyebrowStyle}>Pulling from</div>
        <ul style={sourceChipsRowStyle}>
          {r.sources.map((name, idx) => {
            const Icon = iconForSource(name);
            return (
              <motion.li
                key={name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: STEP_FADE_DURATION_S,
                  ease: 'easeOut',
                  delay: tSources + idx * SOURCE_STAGGER_S,
                }}
                style={sourceChipStyle}
              >
                <Icon size={13} strokeWidth={2} color={NAVY_70} aria-hidden />
                {name}
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* 2 · Reasoning chain ─────────────────────────────────────── */}
      {hasChain ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tChain }}
          style={cardStyle}
          aria-label="Reasoning chain"
        >
          <div style={greyEyebrowStyle}>Inside the black box</div>
          <ul style={chainListStyle}>
            {chain.map((row, idx) => {
              const Icon = iconForSource(row.source);
              return (
                <motion.li
                  key={`${row.source}-${idx}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: STEP_FADE_DURATION_S,
                    ease: 'easeOut',
                    delay: tChain + idx * CHAIN_STAGGER_S,
                  }}
                  style={chainRowStyle}
                >
                  <span style={chainSourcePillStyle}>
                    <Icon size={11} strokeWidth={2} color={NAVY_70} aria-hidden />
                    {row.source}
                  </span>
                  <span style={chainSentenceWrapStyle}>
                    <span style={chainConnectorStyle} aria-hidden />
                    <p style={chainSentenceStyle}>{row.text}</p>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </motion.section>
      ) : (
        // Fallback: render the existing reasoning paragraph when no chain.
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tChain }}
          style={cardStyle}
        >
          <div style={greyEyebrowStyle}>Reasoning</div>
          <p style={{ ...chainSentenceStyle, fontSize: 14 }}>{r.reasoning}</p>
        </motion.section>
      )}

      {/* 3 · Recommended action (typewriter) ─────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tAction }}
        style={cardStyle}
        aria-label="Ariya recommends"
      >
        <div style={blueEyebrowStyle}>Ariya recommends</div>
        <h2 style={recommendedActionStyle}>{actionTypewriterEnabled ? actionText : ''}</h2>

        {r.scenarioView && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tScenario }}
            style={scenarioParagraphStyle}
          >
            <strong style={{ color: NAVY, fontWeight: 700 }}>Scenario view: </strong>
            {r.scenarioView}
          </motion.p>
        )}
      </motion.section>

      {/* 4 · Confidence ──────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tConfidence }}
        style={cardStyle}
      >
        <div style={greyEyebrowStyle}>Confidence</div>
        <div style={confidenceRowStyle}>
          <ConfidenceBadge level={r.confidence} rationale={r.confidenceRationale} />
          <span style={confidenceRationaleStyle}>{r.confidenceRationale}</span>
        </div>
      </motion.section>

      {/* 5 · Required conditions ─────────────────────────────────── */}
      {r.requiredConditions.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tConditions }}
          style={cardStyle}
        >
          <div style={greyEyebrowStyle}>Required conditions</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {r.requiredConditions.map((c, i) => (
              <li key={i} style={conditionRowStyle}>
                <Check
                  size={14}
                  color={BLUE}
                  strokeWidth={2.75}
                  style={{ marginTop: 3, flexShrink: 0 }}
                  aria-hidden
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* 6 · Recommended next actions ────────────────────────────── */}
      {r.recommendedNextActions.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tNextActions }}
          style={cardStyle}
        >
          <div style={greyEyebrowStyle}>Recommended next actions</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {r.recommendedNextActions.map((a, i) => (
              <li key={i} style={nextActionRowStyle}>
                <span style={nextActionNumberStyle(!!a.priority)} aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <div style={nextActionTitleStyle}>{a.action}</div>
                  <div style={nextActionMetaStyle}>
                    <span>{a.owner}</span>
                    <span style={{ color: 'rgba(5,10,68,0.25)' }}>·</span>
                    <Clock size={11} aria-hidden />
                    <span>{a.timeframe}</span>
                  </div>
                </div>
                <span />
              </li>
            ))}
          </ol>
        </motion.section>
      )}

      {/* 7 · Sources, restated as citations ──────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tCitations }}
        style={cardStyle}
        aria-label="Source citations"
      >
        <div style={greyEyebrowStyle}>Sources, with last refresh</div>
        <ul style={citationListStyle}>
          {citations.map(({ name, refresh }) => {
            const Icon = iconForSource(name);
            return (
              <li key={name} style={citationRowStyle}>
                <span style={citationLabelStyle}>
                  <Icon size={13} strokeWidth={2} color={NAVY_70} aria-hidden />
                  {name}
                </span>
                <span style={citationDateStyle}>{refresh ?? 'Refresh cadence not yet logged'}</span>
              </li>
            );
          })}
        </ul>
      </motion.section>

      {/* 8 · Footer actions ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tFooter }}
        style={footerStyle}
      >
        <button type="button" onClick={() => onLogDecision(exchange)} style={primaryBtnStyle}>
          Log this decision <ArrowRight size={14} strokeWidth={2.5} />
        </button>
        {(r.linksTo ?? []).map((l) => (
          <button
            key={l.route}
            type="button"
            onClick={() => onNavigate(l.route)}
            style={quietBtnStyle}
          >
            {l.label} →
          </button>
        ))}
        {/* Source Confidence link is always present, even if linksTo doesn't list it. */}
        {!(r.linksTo ?? []).some((l) => l.route === '/source-confidence') && (
          <button
            type="button"
            onClick={() => onNavigate('/source-confidence')}
            style={quietBtnStyle}
          >
            Open Source Confidence →
          </button>
        )}
      </motion.div>
    </div>
  );
}
