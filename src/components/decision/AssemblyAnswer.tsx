import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Database,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfidenceBadge } from './ConfidenceBadge';
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

// Sources that show the BookOpen icon (editorial / qualitative) instead of
// the default Database icon (quantitative data layer).
const EDITORIAL_SOURCE_NAMES = new Set(['Market context', 'Market research and brand materials']);

function iconForSource(name: string) {
  return EDITORIAL_SOURCE_NAMES.has(name) ? BookOpen : Database;
}

// ───────────────────────────────────────────────────────────────────────────
// Styles
// ───────────────────────────────────────────────────────────────────────────
//
// One continuous white card with a 4 px BLUE left stripe (mirrors the
// red-stripe pattern on Europe Overview's hero block). Inner sections
// are padded blocks separated by NAVY_06 hairlines — no nested card
// borders or shadows. Future follow-up answers in the same conversation
// can reuse the same wrapper, so a multi-turn thread reads as a single
// growing block instead of a stack of disconnected cards.

const wrapStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderLeft: `4px solid ${BLUE}`,
  borderRadius: 12,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  overflow: 'hidden',
};

const sectionStyle: CSSProperties = {
  padding: '20px 22px',
};

const sectionTopDividerStyle: CSSProperties = {
  borderTop: `1px solid ${NAVY_06}`,
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
  marginBottom: 12,
};

// Recommended action ─────────────────────────────────────────────

const recommendedActionStyle: CSSProperties = {
  fontSize: 19,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.35,
  margin: 0,
};

const scenarioParagraphStyle: CSSProperties = {
  fontSize: 14,
  color: NAVY_70,
  lineHeight: 1.6,
  margin: '12px 0 0',
};

// Source by source (reasoning chain) ─────────────────────────────

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
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '5px 10px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY,
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
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

// Confidence ─────────────────────────────────────────────────────

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

// Conditions ─────────────────────────────────────────────────────

const conditionRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '5px 0',
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
};

// Next actions ───────────────────────────────────────────────────

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

// Footer ─────────────────────────────────────────────────────────

const footerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
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

// Stagger / reveal timing ────────────────────────────────────────
const CHAIN_STAGGER_S = 0.12;             // 120 ms between source-by-source rows
const STEP_FADE_DURATION_S = 0.24;        // single fade-in duration
const STEP_GAP_S = 0.10;                  // small pause between sections

// ───────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────

export function AssemblyAnswer({ exchange, onLogDecision, onNavigate }: AssemblyAnswerProps) {
  const r = exchange.response;
  const chain = r.reasoningChain ?? [];
  const hasChain = chain.length > 0;

  // Cascading delays. Each section waits for the previous to land. Total
  // reveal ~1.5-2 s — long enough to read as "the answer is assembling",
  // short enough to never feel slow.
  const tAction = 0;
  const tScenario = tAction + STEP_FADE_DURATION_S;
  const tChain = tScenario + (r.scenarioView ? STEP_FADE_DURATION_S : 0) + STEP_GAP_S;
  const chainDuration = hasChain
    ? chain.length * CHAIN_STAGGER_S + STEP_FADE_DURATION_S
    : STEP_FADE_DURATION_S;
  const tConfidence = tChain + chainDuration + STEP_GAP_S;
  const tConditions = tConfidence + STEP_FADE_DURATION_S;
  const tNextActions = tConditions + STEP_FADE_DURATION_S;
  const tFooter = tNextActions + STEP_FADE_DURATION_S;

  return (
    <article style={wrapStyle} aria-label="Ariya's assembled answer">
      {/* 1 · Recommended action ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tAction }}
        style={sectionStyle}
        aria-label="Ariya recommends"
      >
        <div style={blueEyebrowStyle}>Ariya recommends</div>
        <h2 style={recommendedActionStyle}>{r.recommendedAction}</h2>

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

      {/* 2 · Source by source ────────────────────────────────────── */}
      {hasChain ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tChain }}
          style={{ ...sectionStyle, ...sectionTopDividerStyle }}
          aria-label="Source by source"
        >
          <div style={greyEyebrowStyle}>Source by source</div>
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
        // Fallback: when no reasoningChain, render the prose reasoning under
        // the same Source by source eyebrow so the surface stays consistent.
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tChain }}
          style={{ ...sectionStyle, ...sectionTopDividerStyle }}
        >
          <div style={greyEyebrowStyle}>Source by source</div>
          <p style={{ ...chainSentenceStyle, fontSize: 14 }}>{r.reasoning}</p>
        </motion.section>
      )}

      {/* 3 · Confidence ──────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tConfidence }}
        style={{ ...sectionStyle, ...sectionTopDividerStyle }}
      >
        <div style={greyEyebrowStyle}>Confidence</div>
        <div style={confidenceRowStyle}>
          <ConfidenceBadge level={r.confidence} rationale={r.confidenceRationale} />
          <span style={confidenceRationaleStyle}>{r.confidenceRationale}</span>
        </div>
      </motion.section>

      {/* 4 · Required conditions ─────────────────────────────────── */}
      {r.requiredConditions.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tConditions }}
          style={{ ...sectionStyle, ...sectionTopDividerStyle }}
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

      {/* 5 · Recommended next actions ────────────────────────────── */}
      {r.recommendedNextActions.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tNextActions }}
          style={{ ...sectionStyle, ...sectionTopDividerStyle }}
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

      {/* 6 · Footer actions ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: STEP_FADE_DURATION_S, ease: 'easeOut', delay: tFooter }}
        style={{ ...sectionStyle, ...sectionTopDividerStyle, ...footerStyle }}
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
    </article>
  );
}
