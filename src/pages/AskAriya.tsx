import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import {
  AssemblyAnswer,
  LogDecisionModal,
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

const HERO_EXCHANGE_ID = 'black-box-italy';

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

// Hero suggestion card ─────────────────────────────────────────

const heroCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: '22px 24px 20px',
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
};

const heroEyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: BLUE,
};

const heroQuestionStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  color: NAVY,
  lineHeight: 1.4,
  margin: 0,
};

const heroFooterStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const heroLinkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  color: BLUE,
  fontSize: 13,
  fontWeight: 700,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  fontFamily: 'inherit',
};

// Follow-ups grid ──────────────────────────────────────────────

const followUpsLabelStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_55,
  fontWeight: 600,
  marginBottom: 10,
};

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
  const keyPhrases: { id: string; phrases: string[] }[] = [
    { id: 'black-box-italy', phrases: ['black box', 'training black box', 'italy black', 'xeomin italy'] },
    { id: 'reallocate-de-it', phrases: ['reallocate', 'shift', 'germany budget', 'italy activation', '10%'] },
    { id: 'losing-most-value', phrases: ['losing', 'most value', 'commercial value', 'biggest drag'] },
    { id: 'best-incremental', phrases: ['incremental', 'opportunity', 'invest more'] },
    { id: 'right-hcps-italy', phrases: ['right hcp', 'selection', 'italian', 'training'] },
    { id: 'italy-nsm-30d', phrases: ['italy nsm', '30 days', 'next 30'] },
    { id: 'germany-net-impact', phrases: ['germany net', 'pressure', 'highest spend'] },
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const heroExchange = useMemo(
    () => askAriya.find((a) => a.id === HERO_EXCHANGE_ID),
    [],
  );
  const followUps = useMemo(
    () => askAriya.filter((a) => a.id !== HERO_EXCHANGE_ID),
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
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
    if (qId) {
      const ex = askAriya.find((a) => a.id === qId);
      if (ex) {
        send('', ex);
        const next = new URLSearchParams(searchParams);
        next.delete('q');
        setSearchParams(next, { replace: true });
        return;
      }
    }
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

      {/* Empty state: hero card + follow-ups grid */}
      {showEmptyState && heroExchange && (
        <>
          <button
            type="button"
            onClick={() => send('', heroExchange)}
            style={heroCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(5,10,68,0.08)';
              e.currentTarget.style.borderColor = 'rgba(0,85,187,0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(5,10,68,0.04)';
              e.currentTarget.style.borderColor = NAVY_12;
            }}
          >
            <span style={heroEyebrowStyle}>Suggested question</span>
            <h2 style={heroQuestionStyle}>{heroExchange.question}</h2>
            <div style={heroFooterStyle}>
              <span style={heroLinkStyle}>
                Ask this <ArrowRight size={14} strokeWidth={2.5} />
              </span>
            </div>
          </button>

          <section>
            <div style={followUpsLabelStyle}>Or ask</div>
            <div style={followUpsGridStyle}>
              {followUps.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => send('', ex)}
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
                  <span style={{ flex: 1, minWidth: 0 }}>{ex.question}</span>
                  <ArrowRight size={14} color={BLUE} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
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
                <AssemblyAnswer
                  exchange={m.exchange}
                  onLogDecision={openLogModal}
                  onNavigate={navigate}
                />
              ) : (
                <div>
                  <p style={fallbackNoteStyle}>
                    Ariya has prepared assembled answers for these questions today. Ask one of them, or rephrase yours to align.
                  </p>
                  <div style={followUpsGridStyle}>
                    {(heroExchange ? [heroExchange, ...followUps] : followUps).slice(0, 4).map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => send('', ex)}
                        style={followUpCardStyle}
                      >
                        <span style={{ flex: 1, minWidth: 0 }}>{ex.question}</span>
                        <ArrowRight size={14} color={BLUE} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      </button>
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
