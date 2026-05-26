import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import {
  AssemblyAnswer,
  LogDecisionModal,
  PlaceholderAnswer,
  dateFromToday,
} from '../components/decision';
import type { LogDecisionDraft } from '../components/decision';
import { askAriya } from '../data/scenario';
import type { AriyaExchange } from '../data/scenario';

// ───────────────────────────────────────────────────────────────────────────
// Tokens
// ───────────────────────────────────────────────────────────────────────────

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const CANVAS = '#F7F8FC';
const BLUE = '#0055BB';

const HERO_EXCHANGE_ID = 'italy-60d-checkpoint';

// Tier 1, Tier 2, Tier 3 — the empty state layout
// ───────────────────────────────────────────────────────────────────────────
// The previous hero question (italy-60d-checkpoint) now lives in Tier 1 as
// its first entry, rather than as a standalone above-the-fold card. The
// "hero" framing only matters when other pages link in (Europe Overview's
// Dig deeper still routes to /ask-ariya?q=italy-60d-checkpoint, see the
// useEffect below).

const TIER_1_IDS = [
  'italy-60d-checkpoint',
  'italy-downside-60d',
  'germany-pool-sizing',
  'italy-selection-alternative',
] as const;
const TIER_1_LABEL = 'Pressure-test the recommendation: Italy follow-up sprint';
const TIER_1_SUBTITLE = 'Before you commit, push on the assumptions.';

const TIER_2_IDS = [
  'spain-incremental',
  'germany-may14-update',
  'kol-italy-germany',
] as const;
const TIER_2_LABEL = 'Other open decisions';
const TIER_2_SUBTITLE = 'Three decisions currently live in the Decision Log.';

const TIER_3_IDS = [
  'src-market-slipping',
  'src-crm-followup',
  'src-training-misfit',
  'src-segmentation-coverage',
  'src-finance-misalignment',
  'src-context-signals',
] as const;
const TIER_3_LABEL = 'More questions, by source';
const TIER_3_SUBTITLE = 'Each of the six sources can be interrogated on its own.';

// Maps boundSource id (matches overview.assemblySources) to the source label
// rendered on the left side of each Tier 3 row.
const SOURCE_LABELS: Record<string, string> = {
  'market-perf': 'Market performance',
  'crm': 'CRM activity',
  'training': 'Training participation and spend',
  'segmentation': 'HCP segmentation',
  'finance': 'Finance',
  'market-context': 'Market context',
};

// ───────────────────────────────────────────────────────────────────────────
// Layout
// ───────────────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  paddingBottom: 80,
};

// Top input card ────────────────────────────────────────────────

const inputCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: '18px 20px 14px',
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const inputStyle: CSSProperties = {
  width: '100%',
  minHeight: 96,
  padding: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: NAVY,
  fontSize: 16,
  lineHeight: 1.5,
  fontFamily: 'inherit',
  resize: 'none',
};

const inputFooterStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
};

const inputHintStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  lineHeight: 1.45,
};

const submitBtnBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 36,
  padding: '0 18px',
  borderRadius: 999,
  border: 'none',
  fontSize: 13,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'background 150ms ease',
};

const submitBtnEnabledStyle: CSSProperties = {
  ...submitBtnBaseStyle,
  background: NAVY,
  color: '#ffffff',
};

const submitBtnDisabledStyle: CSSProperties = {
  ...submitBtnBaseStyle,
  background: NAVY_06,
  color: NAVY_55,
  cursor: 'not-allowed',
};

// Follow-ups grid ──────────────────────────────────────────────

const followUpsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 10,
};

const followUpCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 10,
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  width: '100%',
  fontSize: 13,
  fontWeight: 500,
  color: NAVY,
  lineHeight: 1.4,
  transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
};

// Tier sections ────────────────────────────────────────────────

const tierSectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const tierHeaderStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const tierTitleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
  lineHeight: 1.35,
};

const tierSubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  margin: 0,
  lineHeight: 1.4,
};

// Tier 3 rows — source label on the left, question on the right
const tier3ListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const tier3RowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '220px 1fr auto',
  alignItems: 'center',
  gap: 16,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 10,
  padding: '12px 14px',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  width: '100%',
  transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
};

const tier3SourceStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.35,
};

const tier3QuestionStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: NAVY,
  lineHeight: 1.4,
};

// Conversation surface ─────────────────────────────────────────

const userBubbleWrapStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const userBubbleStyle: CSSProperties = {
  maxWidth: '80%',
  background: CANVAS,
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: '10px 14px',
  fontSize: 14,
  lineHeight: 1.5,
  color: NAVY,
  fontWeight: 500,
};

const fallbackNoteStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  fontStyle: 'italic',
  margin: '4px 0 12px',
};

const newConvoBtnStyle: CSSProperties = {
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 32,
  padding: '0 14px',
  background: 'transparent',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 999,
  color: NAVY_70,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// ───────────────────────────────────────────────────────────────────────────
// Free-text matching
// ───────────────────────────────────────────────────────────────────────────

function matchQuestion(input: string): AriyaExchange | undefined {
  const q = input.trim().toLowerCase();
  if (!q) return undefined;
  let hit = askAriya.find((a) => a.question.toLowerCase().includes(q));
  if (hit) return hit;
  // Hero only — broad-match anything that smells like the Italy 60-day
  // checkpoint question. Tier 1-3 exchanges are placeholders in v1; we
  // don't bother free-text matching them.
  const keyPhrases: { id: string; phrases: string[] }[] = [
    {
      id: 'italy-60d-checkpoint',
      phrases: [
        '60-day', '60 day', 'sixty day', 'checkpoint',
        'italy sprint', 'follow-up sprint', 'follow up sprint',
        'black box', 'training black box',
      ],
    },
  ];
  for (const { id, phrases } of keyPhrases) {
    if (phrases.some((p) => q.includes(p))) {
      hit = askAriya.find((a) => a.id === id);
      if (hit) return hit;
    }
  }
  return undefined;
}

// ───────────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────────

// Shared chip used by Tier 1 / Tier 2 grids and by the free-text fallback.
function FollowUpChip({
  exchange,
  onSend,
}: {
  exchange: AriyaExchange;
  onSend: (ex: AriyaExchange) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSend(exchange)}
      style={followUpCardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,10,68,0.06)';
        e.currentTarget.style.borderColor = 'rgba(0,85,187,0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = NAVY_12;
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>{exchange.question}</span>
      <ArrowRight size={14} color={BLUE} strokeWidth={2.5} style={{ flexShrink: 0 }} />
    </button>
  );
}

interface ChatMessage {
  id: string;
  question: string;
  exchange?: AriyaExchange;
}

export default function AskAriya() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [logDraft, setLogDraft] = useState<LogDecisionDraft | null>(null);
  // Surfaced when the user arrives via ?q={id} but the id has no matching
  // exchange yet — typically because the matching exchange is scheduled to
  // land in a later stage. We clear the URL param and leave the empty state
  // visible with a small note above the suggestions.
  const [interimNote, setInterimNote] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const heroExchange = useMemo(
    () => askAriya.find((a) => a.id === HERO_EXCHANGE_ID),
    [],
  );
  const tier1 = useMemo(
    () =>
      TIER_1_IDS.map((id) => askAriya.find((a) => a.id === id)).filter(
        (a): a is AriyaExchange => Boolean(a),
      ),
    [],
  );
  const tier2 = useMemo(
    () =>
      TIER_2_IDS.map((id) => askAriya.find((a) => a.id === id)).filter(
        (a): a is AriyaExchange => Boolean(a),
      ),
    [],
  );
  const tier3 = useMemo(
    () =>
      TIER_3_IDS.map((id) => askAriya.find((a) => a.id === id)).filter(
        (a): a is AriyaExchange => Boolean(a),
      ),
    [],
  );

  const send = (text: string, forcedExchange?: AriyaExchange) => {
    const trimmed = text.trim();
    if (!trimmed && !forcedExchange) return;
    const exchange = forcedExchange ?? matchQuestion(trimmed);
    const id = `msg-${Date.now()}`;
    const question = forcedExchange ? forcedExchange.question : trimmed;
    setMessages((prev) => [...prev, { id, question, exchange }]);
    setDraft('');
  };

  useEffect(() => {
    if (messages.length > 0) {
      // Scroll to the top of the page so the user sees the conversation
      // from its start (input box + user bubble + answer flowing down)
      // instead of being dropped at the bottom of a long answer.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [messages.length]);

  // Auto-send via URL params. Supports two shapes:
  //   ?q={exchangeId}  → renders the matching exchange directly (used by the
  //                      "Ask Ariya for the full reasoning" links on other
  //                      pages).
  //   ?question={text} → free-text submission (legacy entry point).
  useEffect(() => {
    if (messages.length > 0) return;
    const qId = searchParams.get('q');
    const qText = searchParams.get('question');
    // ?q={id} — we used to auto-send the matching exchange and skip the
    // empty state. That hijacked the page and put the user at the bottom
    // of a long answer they hadn't asked to see yet. Now we just clear the
    // URL param, leave the empty state visible, and let the user choose
    // when to expand the answer by clicking the question chip themselves.
    // If the id has no match we still surface the interim note so the
    // user knows the system recognised the request.
    if (qId) {
      const next = new URLSearchParams(searchParams);
      next.delete('q');
      setSearchParams(next, { replace: true });
      const ex = askAriya.find((a) => a.id === qId);
      if (!ex) setInterimNote(true);
      return;
    }
    // ?question={text} — legacy free-text entry point still auto-sends.
    if (qText) {
      send(decodeURIComponent(qText));
      const next = new URLSearchParams(searchParams);
      next.delete('question');
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openLogModal = (exchange: AriyaExchange) => {
    const d: LogDecisionDraft = {
      decision: exchange.response.recommendedAction,
      owner: 'Europe Leadership',
      marketAndBrand: 'Italy, Germany · Xeomin',
      evidenceUsed: exchange.response.sources,
      assumptions: exchange.response.requiredConditions,
      expectedImpact:
        'Directional commercial recovery within 60 days, measured via CRM follow-up rate and Xeomin run-rate.',
      followUpDate: dateFromToday(60),
      triggerForReassessment: 'Italy follow-up rate below 55% at 30 days',
      status: 'Active',
      source: 'Ask Ariya',
    };
    setLogDraft(d);
    setModalOpen(true);
  };

  const reset = () => {
    setMessages([]);
    setDraft('');
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send(draft);
    }
  };

  const showEmptyState = messages.length === 0;
  const canSubmit = draft.trim().length > 0;

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Ask Ariya"
        subtitle="Ariya assembles performance, CRM, training, segmentation, finance, and market context into one decision. Ask what's inside the black box."
      />

      {/* Top input card */}
      <div style={inputCardStyle}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about competitors, signals, workstreams, decisions..."
          style={inputStyle}
          rows={3}
        />
        <div style={inputFooterStyle}>
          <p style={inputHintStyle}>
            ⌘/Ctrl + Enter to submit · Try one of the suggested questions below for a fully assembled answer.
          </p>
          <button
            type="button"
            onClick={() => send(draft)}
            disabled={!canSubmit}
            style={canSubmit ? submitBtnEnabledStyle : submitBtnDisabledStyle}
          >
            Ask Ariya <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Empty state: three labelled tiers. The previous standalone hero
          card is gone — italy-60d-checkpoint is now the first entry in
          Tier 1. */}
      {showEmptyState && (
        <>
          {interimNote && (
            <p
              style={{
                fontSize: 13,
                color: NAVY_70,
                fontStyle: 'italic',
                margin: 0,
              }}
              role="status"
            >
              The question you came from is not yet available. Pick one below to continue.
            </p>
          )}

          {/* Tier 1 · Pressure-test */}
          <section style={tierSectionStyle}>
            <div style={tierHeaderStyle}>
              <h3 style={tierTitleStyle}>{TIER_1_LABEL}</h3>
              <p style={tierSubtitleStyle}>{TIER_1_SUBTITLE}</p>
            </div>
            <div style={followUpsGridStyle}>
              {tier1.map((ex) => (
                <FollowUpChip key={ex.id} exchange={ex} onSend={(e) => send('', e)} />
              ))}
            </div>
          </section>

          {/* Tier 2 · Other open decisions */}
          <section style={tierSectionStyle}>
            <div style={tierHeaderStyle}>
              <h3 style={tierTitleStyle}>{TIER_2_LABEL}</h3>
              <p style={tierSubtitleStyle}>{TIER_2_SUBTITLE}</p>
            </div>
            <div style={followUpsGridStyle}>
              {tier2.map((ex) => (
                <FollowUpChip key={ex.id} exchange={ex} onSend={(e) => send('', e)} />
              ))}
            </div>
          </section>

          {/* Tier 3 · More questions, by source */}
          <section style={tierSectionStyle}>
            <div style={tierHeaderStyle}>
              <h3 style={tierTitleStyle}>{TIER_3_LABEL}</h3>
              <p style={tierSubtitleStyle}>{TIER_3_SUBTITLE}</p>
            </div>
            <ul style={tier3ListStyle}>
              {tier3.map((ex) => {
                const sourceLabel =
                  ex.boundSource && SOURCE_LABELS[ex.boundSource]
                    ? SOURCE_LABELS[ex.boundSource]
                    : 'Source';
                return (
                  <li key={ex.id}>
                    <button
                      type="button"
                      onClick={() => send('', ex)}
                      style={tier3RowStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,10,68,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(0,85,187,0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = NAVY_12;
                      }}
                    >
                      <span style={tier3SourceStyle}>{sourceLabel}</span>
                      <span style={tier3QuestionStyle}>{ex.question}</span>
                      <ArrowRight size={14} color={BLUE} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      {/* Conversation */}
      {!showEmptyState && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {messages.map((m) => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={userBubbleWrapStyle}>
                <div style={userBubbleStyle}>{m.question}</div>
              </div>
              {m.exchange ? (
                m.exchange.response.placeholder ? (
                  // Non-hero exchange in v1: copy not yet drafted, render the
                  // recognised-question placeholder with a hook back to the
                  // hero so the demo stays on its rails.
                  <PlaceholderAnswer
                    onAskHero={() => heroExchange && send('', heroExchange)}
                  />
                ) : (
                  <AssemblyAnswer
                    exchange={m.exchange}
                    onLogDecision={openLogModal}
                    onNavigate={navigate}
                  />
                )
              ) : (
                <div>
                  <p style={fallbackNoteStyle}>
                    Ariya has prepared assembled answers for these questions today. Ask one of them, or rephrase yours to align.
                  </p>
                  <div style={followUpsGridStyle}>
                    {(heroExchange ? [heroExchange, ...tier1] : tier1).slice(0, 4).map((ex) => (
                      <FollowUpChip key={ex.id} exchange={ex} onSend={(e) => send('', e)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={reset} style={newConvoBtnStyle}>
            <Sparkles size={12} /> Start a new conversation
          </button>
          <div ref={messagesEndRef} />
        </div>
      )}

      {logDraft && (
        <LogDecisionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          draft={logDraft}
          onLogged={() => navigate('/decision-log?from=ask-ariya')}
        />
      )}
    </div>
  );
}
