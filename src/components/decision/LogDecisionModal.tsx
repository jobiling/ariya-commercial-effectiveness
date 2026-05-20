import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { X } from 'lucide-react';
import { useDecisionLog } from '../../context/DecisionLogContext';
import type { DecisionLogEntry } from '../../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(5,10,68,0.50)',
  zIndex: 100,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '60px 24px 24px',
  overflowY: 'auto',
};

const modalStyle: CSSProperties = {
  width: '100%',
  maxWidth: 640,
  background: '#ffffff',
  borderRadius: 14,
  boxShadow: '0 24px 60px rgba(5,10,68,0.32)',
  overflow: 'hidden',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: '20px 24px 12px',
  gap: 16,
  borderBottom: `1px solid ${NAVY_12}`,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: BLUE,
};

const titleStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: NAVY,
  margin: '4px 0 0',
  lineHeight: 1.4,
};

const closeBtnStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: NAVY_70,
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  flexShrink: 0,
};

const bodyStyle: CSSProperties = {
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  maxHeight: 'calc(100vh - 240px)',
  overflowY: 'auto',
};

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const fieldLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: `1px solid ${NAVY_12}`,
  background: '#ffffff',
  color: NAVY,
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 64,
  lineHeight: 1.45,
};

const tagRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  padding: '8px 10px',
  background: NAVY_06,
  border: `1px solid ${NAVY_12}`,
  borderRadius: 8,
};

const tagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 9px',
  borderRadius: 999,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY_70,
  fontSize: 11,
  fontWeight: 600,
};

const twoColStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 24px',
  borderTop: `1px solid ${NAVY_12}`,
  background: NAVY_06,
};

const primaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 36,
  padding: '0 16px',
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
  background: 'transparent',
  border: 'none',
  color: NAVY_70,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// Compute a date N days from today, formatted as "Mon DD, YYYY".
function dateFromToday(daysOut: number): string {
  const today = new Date('2026-05-20'); // demo date per CLAUDE.md
  today.setDate(today.getDate() + daysOut);
  return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export interface LogDecisionDraft {
  decision: string;
  owner: string;
  marketAndBrand: string;
  evidenceUsed: readonly string[];
  assumptions: readonly string[];
  expectedImpact: string;
  followUpDate: string;
  triggerForReassessment: string;
  status: DecisionLogEntry['status'];
  source: DecisionLogEntry['source'];
}

export interface LogDecisionModalProps {
  open: boolean;
  onClose: () => void;
  draft: LogDecisionDraft;
  // Called after the entry is appended. Receives the new entry id.
  onLogged?: (id: string) => void;
}

export function LogDecisionModal({ open, onClose, draft, onLogged }: LogDecisionModalProps) {
  const [decision, setDecision] = useState(draft.decision);
  const [owner, setOwner] = useState(draft.owner);
  const [marketAndBrand, setMarketAndBrand] = useState(draft.marketAndBrand);
  const [expectedImpact, setExpectedImpact] = useState(draft.expectedImpact);
  const [followUpDate, setFollowUpDate] = useState(draft.followUpDate);
  const [triggerForReassessment, setTriggerForReassessment] = useState(draft.triggerForReassessment);
  const { addEntry } = useDecisionLog();

  // Re-sync staged form state when the draft prop changes (e.g. user opens for a different scenario).
  useEffect(() => {
    if (open) {
      setDecision(draft.decision);
      setOwner(draft.owner);
      setMarketAndBrand(draft.marketAndBrand);
      setExpectedImpact(draft.expectedImpact);
      setFollowUpDate(draft.followUpDate);
      setTriggerForReassessment(draft.triggerForReassessment);
    }
  }, [open, draft]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const todayFormatted = useMemo(
    () => new Date('2026-05-20').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    [],
  );

  if (!open) return null;

  const handleSubmit = () => {
    const id = addEntry({
      date: todayFormatted,
      decision,
      owner,
      marketAndBrand,
      evidenceUsed: [...draft.evidenceUsed],
      assumptions: [...draft.assumptions],
      expectedImpact,
      actionsAssigned: [],
      followUpDate,
      triggerForReassessment,
      status: draft.status,
      source: draft.source,
    });
    onClose();
    onLogged?.(id);
  };

  return (
    <div
      style={backdropStyle}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Log this decision"
    >
      <div style={modalStyle} onMouseDown={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>Log this decision</div>
            <h2 style={titleStyle}>{draft.decision}</h2>
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div style={bodyStyle}>
          <div style={fieldStyle}>
            <label style={fieldLabelStyle}>Decision</label>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              style={textareaStyle}
              rows={3}
            />
          </div>

          <div style={twoColStyle}>
            <div style={fieldStyle}>
              <label style={fieldLabelStyle}>Owner</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label style={fieldLabelStyle}>Market and brand</label>
              <input
                type="text"
                value={marketAndBrand}
                onChange={(e) => setMarketAndBrand(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={fieldLabelStyle}>Expected impact</label>
            <textarea
              value={expectedImpact}
              onChange={(e) => setExpectedImpact(e.target.value)}
              style={textareaStyle}
              rows={2}
            />
          </div>

          {draft.evidenceUsed.length > 0 && (
            <div style={fieldStyle}>
              <label style={fieldLabelStyle}>Evidence used</label>
              <div style={tagRowStyle}>
                {draft.evidenceUsed.map((e, i) => (
                  <span key={i} style={tagStyle}>{e}</span>
                ))}
              </div>
            </div>
          )}

          {draft.assumptions.length > 0 && (
            <div style={fieldStyle}>
              <label style={fieldLabelStyle}>Assumptions</label>
              <div style={tagRowStyle}>
                {draft.assumptions.map((a, i) => (
                  <span key={i} style={tagStyle}>{a}</span>
                ))}
              </div>
            </div>
          )}

          <div style={twoColStyle}>
            <div style={fieldStyle}>
              <label style={fieldLabelStyle}>Follow-up date</label>
              <input
                type="text"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label style={fieldLabelStyle}>Status at logging</label>
              <input type="text" value={draft.status} readOnly style={{ ...inputStyle, background: NAVY_06 }} />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={fieldLabelStyle}>Trigger for reassessment</label>
            <textarea
              value={triggerForReassessment}
              onChange={(e) => setTriggerForReassessment(e.target.value)}
              style={textareaStyle}
              rows={2}
            />
          </div>
        </div>

        <div style={footerStyle}>
          <button type="button" onClick={onClose} style={quietBtnStyle}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} style={primaryBtnStyle}>
            Log decision →
          </button>
        </div>
      </div>
    </div>
  );
}

// Re-export a helper so callers can build draft fields without duplicating the date helper.
export { dateFromToday };
