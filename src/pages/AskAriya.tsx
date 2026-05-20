import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Radio, Compass, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import {
  LogDecisionModal,
  RecommendationCard,
  dateFromToday,
} from '../components/decision';
import type { LogDecisionDraft } from '../components/decision';
import { askAriya } from '../data/scenario';
import type { AriyaExchange } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const CANVAS = '#F7F8FC';
const BLUE = '#0055BB';
const LAVENDER = '#E8EAF6';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  paddingBottom: 80,
};

// ─── Top input card ─────────────────────────────────────────────────────────

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

// ─── Section headers ────────────────────────────────────────────────────────

const sectionTitleStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};

const sectionSubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  marginTop: 2,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

// ─── Featured suggestion card ───────────────────────────────────────────────

const featuredGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 12,
};

const featuredCardStyle: CSSProperties = {
  position: 'relative',
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderLeft: `3px solid ${BLUE}`,
  borderRadius: 12,
  padding: '14px 14px 14px 16px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  width: '100%',
  transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
};

const iconBadgeStyle: CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 8,
  background: LAVENDER,
  color: BLUE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const featuredBodyStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const featuredQuestionStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.4,
  margin: 0,
};

const featuredLinkedStyle: CSSProperties = {
  fontSize: 11,
  color: NAVY_55,
  fontWeight: 500,
  lineHeight: 1.4,
};

const featuredArrowStyle: CSSProperties = {
  color: BLUE,
  flexShrink: 0,
  marginTop: 2,
};

// ─── Grouped category column ────────────────────────────────────────────────

const groupedGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 16,
  marginTop: 10,
};

const categoryWrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const categoryHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const categoryIconBoxStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  background: NAVY_06,
  color: NAVY_70,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const categoryTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};

const categorySublabelStyle: CSSProperties = {
  fontSize: 11,
  color: NAVY_55,
  fontWeight: 500,
};

const subCardBaseStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 10,
  padding: '12px 12px 10px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  width: '100%',
  transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
};

const subCardSelectedStyle: CSSProperties = {
  borderColor: BLUE,
  boxShadow: `0 0 0 3px rgba(0,85,187,0.08)`,
};

const subCardIconStyle: CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 6,
  background: LAVENDER,
  color: BLUE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const subCardQuestionStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: NAVY,
  lineHeight: 1.4,
  margin: 0,
  flex: 1,
};

const scaffoldedBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  padding: '2px 8px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY_70,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.02em',
  marginTop: 6,
};

const subCardBodyStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

// ─── Conversation ────────────────────────────────────────────────────────────

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
  margin: '4px 0 8px',
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

// ─── Suggestion catalog (Featured + Grouped) ────────────────────────────────
// Maps the 6 scripted askAriya entries into the new visual taxonomy. The fields
// `linkedTo` and `group` are presentation-only metadata for this page.

interface SuggestionMeta {
  exchangeId: string;
  linkedTo: string;
}

const FEATURED_SUGGESTIONS: SuggestionMeta[] = [
  {
    exchangeId: 'reallocate-de-it',
    linkedTo: 'linked to: Italy / Germany Xeomin reallocation (open decision · this week)',
  },
  {
    exchangeId: 'germany-net-impact',
    linkedTo: 'linked to: Germany hold decision (under review · May 14)',
  },
  {
    exchangeId: 'losing-most-value',
    linkedTo: 'linked to: Italy follow-up signal (47 HCPs · at risk)',
  },
];

interface CategorySpec {
  id: string;
  title: string;
  sublabel: string;
  icon: ReactNode;
  questionIds: string[];
  defaultSelectedId?: string;
}

const CATEGORIES: CategorySpec[] = [
  {
    id: 'open-decisions',
    title: 'Open decisions awaiting input',
    sublabel: '1 brief open',
    icon: <AlertTriangle size={14} strokeWidth={2.2} />,
    questionIds: ['italy-nsm-30d'],
    defaultSelectedId: 'italy-nsm-30d',
  },
  {
    id: 'signals',
    title: "This week's signals",
    sublabel: '3 new this week',
    icon: <Radio size={14} strokeWidth={2.2} />,
    questionIds: ['right-hcps-italy'],
  },
  {
    id: 'strategic',
    title: 'Stage-relevant strategic questions',
    sublabel: 'Europe Q2 planning · pre-cycle',
    icon: <Compass size={14} strokeWidth={2.2} />,
    questionIds: ['best-incremental'],
  },
];

// ─── Question matching for free-text input ──────────────────────────────────

function matchQuestion(input: string): AriyaExchange | undefined {
  const q = input.trim().toLowerCase();
  if (!q) return undefined;
  let hit = askAriya.find((a) => a.question.toLowerCase().includes(q));
  if (hit) return hit;
  const keyPhrases: { id: string; phrases: string[] }[] = [
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

// ─── Chat response ──────────────────────────────────────────────────────────

interface ChatResponseProps {
  exchange: AriyaExchange;
  onLogDecision: (exchange: AriyaExchange) => void;
}

function ChatResponse({ exchange, onLogDecision }: ChatResponseProps) {
  const navigate = useNavigate();
  return (
    <RecommendationCard
      situation=""
      recommendation={exchange.response.recommendedAction}
      reasoning={exchange.response.reasoning}
      scenarioView={exchange.response.scenarioView}
      confidence={exchange.response.confidence}
      confidenceRationale={exchange.response.confidenceRationale}
      conditions={exchange.response.requiredConditions}
      nextActions={exchange.response.recommendedNextActions}
      sources={exchange.response.sources}
      conditionsLabel="Required conditions"
      accent="teal"
      actions={[
        {
          label: 'Log this decision →',
          onClick: () => onLogDecision(exchange),
          primary: true,
        },
        ...(exchange.response.linksTo ?? []).map((l) => ({
          label: `${l.label} →`,
          onClick: () => navigate(l.route),
        })),
      ]}
    />
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

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

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const exchange = matchQuestion(trimmed);
    const id = `msg-${Date.now()}`;
    setMessages((prev) => [...prev, { id, question: trimmed, exchange }]);
    setDraft('');
  };

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length]);

  useEffect(() => {
    const q = searchParams.get('question');
    if (q && messages.length === 0) {
      send(decodeURIComponent(q));
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
    // ⌘/Ctrl + Enter submits.
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send(draft);
    }
  };

  // Featured cards data, resolved against askAriya.
  const featuredCards = useMemo(() => {
    return FEATURED_SUGGESTIONS.map((s) => {
      const ex = askAriya.find((a) => a.id === s.exchangeId);
      return ex ? { ex, linkedTo: s.linkedTo } : null;
    }).filter(Boolean) as { ex: AriyaExchange; linkedTo: string }[];
  }, []);

  const categoryCards = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.questionIds
        .map((id) => askAriya.find((a) => a.id === id))
        .filter((ex): ex is AriyaExchange => Boolean(ex)),
    }));
  }, []);

  const showEmptyState = messages.length === 0;
  const canSubmit = draft.trim().length > 0;

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Ask Ariya"
        subtitle="Ask about commercial performance, investment, or scenarios."
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
            ⌘/Ctrl + Enter to submit · Tip: try one of the suggested questions below for a fully structured answer.
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

      {/* Empty state: featured + grouped suggestions */}
      {showEmptyState && (
        <>
          <section>
            <h2 style={sectionTitleStyle}>
              Based on this week's open decisions and active signals, you might ask:
            </h2>
            <p style={sectionSubtitleStyle}>
              Suggestions refresh as the launch context changes. Reviewed by phamax expert · May 19, 2026
            </p>
            <div style={{ ...featuredGridStyle, marginTop: 14 }}>
              {featuredCards.map(({ ex, linkedTo }) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => send(ex.question)}
                  style={featuredCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(5,10,68,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={iconBadgeStyle} aria-hidden>
                    <Sparkles size={14} strokeWidth={2.2} />
                  </span>
                  <div style={featuredBodyStyle}>
                    <p style={featuredQuestionStyle}>{ex.question}</p>
                    <span style={featuredLinkedStyle}>{linkedTo}</span>
                  </div>
                  <ArrowRight size={16} style={featuredArrowStyle} strokeWidth={2.5} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <div style={eyebrowStyle}>More questions · grouped by source</div>
            <div style={groupedGridStyle}>
              {categoryCards.map((cat) => (
                <div key={cat.id} style={categoryWrapStyle}>
                  <div style={categoryHeaderStyle}>
                    <span style={categoryIconBoxStyle} aria-hidden>
                      {cat.icon}
                    </span>
                    <div>
                      <h3 style={categoryTitleStyle}>{cat.title}</h3>
                      <span style={categorySublabelStyle}>{cat.sublabel}</span>
                    </div>
                  </div>
                  {cat.items.map((ex) => {
                    const selected = cat.defaultSelectedId === ex.id;
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => send(ex.question)}
                        style={{
                          ...subCardBaseStyle,
                          ...(selected ? subCardSelectedStyle : null),
                        }}
                        onMouseEnter={(e) => {
                          if (!selected) {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,10,68,0.06)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <span style={subCardIconStyle} aria-hidden>
                          <Sparkles size={12} strokeWidth={2.2} />
                        </span>
                        <div style={subCardBodyStyle}>
                          <p style={subCardQuestionStyle}>{ex.question}</p>
                          <span style={scaffoldedBadgeStyle}>Scaffolded</span>
                        </div>
                        <ArrowRight size={14} style={featuredArrowStyle} strokeWidth={2.5} />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Conversation */}
      {!showEmptyState && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {messages.map((m) => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={userBubbleWrapStyle}>
                <div style={userBubbleStyle}>{m.question}</div>
              </div>
              {m.exchange ? (
                <ChatResponse exchange={m.exchange} onLogDecision={openLogModal} />
              ) : (
                <div>
                  <p style={fallbackNoteStyle}>
                    I have prepared answers for these questions today.
                  </p>
                  <div style={featuredGridStyle}>
                    {featuredCards.map(({ ex, linkedTo }) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => send(ex.question)}
                        style={featuredCardStyle}
                      >
                        <span style={iconBadgeStyle} aria-hidden>
                          <Sparkles size={14} strokeWidth={2.2} />
                        </span>
                        <div style={featuredBodyStyle}>
                          <p style={featuredQuestionStyle}>{ex.question}</p>
                          <span style={featuredLinkedStyle}>{linkedTo}</span>
                        </div>
                        <ArrowRight size={16} style={featuredArrowStyle} strokeWidth={2.5} />
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
