import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sunrise, UserRound } from 'lucide-react';
import { LogDecisionModal, dateFromToday } from '../components/decision';
import type { LogDecisionDraft } from '../components/decision';
import { morningBriefing } from '../data/scenario';
import type { BriefingItem, BriefingSection } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';
const AMBER = '#F59E0B';
const AMBER_BG = '#FFFBEB';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  paddingBottom: 64,
  maxWidth: 820,
};

// ── Memo masthead ──
const mastheadStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 20,
  paddingBottom: 18,
  borderBottom: `2px solid ${NAVY}`,
};

const eyebrowRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: BLUE,
};

const titleStyle: CSSProperties = {
  fontSize: 26,
  fontWeight: 800,
  color: NAVY,
  margin: '8px 0 0',
  letterSpacing: '-0.01em',
};

const standfirstStyle: CSSProperties = {
  fontSize: 15,
  color: NAVY_70,
  lineHeight: 1.55,
  margin: '8px 0 0',
  maxWidth: 620,
};

const dateBadgeStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: NAVY_55,
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'tabular-nums',
  paddingTop: 4,
};

// ── Section ──
const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const sectionHeadRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 12,
};

const sectionNumberStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: BLUE,
  fontVariantNumeric: 'tabular-nums',
  width: 22,
  flexShrink: 0,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};

const sectionBlurbStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_55,
  margin: 0,
};

const itemListStyle: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingLeft: 34,
};

const itemRowStyle = (watch: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '12px 14px',
  borderRadius: 10,
  background: watch ? AMBER_BG : '#ffffff',
  border: `1px solid ${watch ? 'rgba(245,158,11,0.28)' : NAVY_12}`,
});

const bulletStyle = (watch: boolean): CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: 999,
  marginTop: 7,
  flexShrink: 0,
  background: watch ? AMBER : BLUE,
});

const itemTextStyle: CSSProperties = {
  fontSize: 14,
  color: NAVY,
  lineHeight: 1.5,
  flex: 1,
  minWidth: 0,
};

const ownerChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '3px 9px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY_70,
  fontSize: 11,
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

const dueChipStyle = (overdue: boolean): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 9px',
  borderRadius: 999,
  background: overdue ? '#FEF2F2' : NAVY_06,
  color: overdue ? '#B91C1C' : NAVY_70,
  fontSize: 11,
  fontWeight: 700,
  whiteSpace: 'nowrap',
});

const lowConfChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 9px',
  borderRadius: 999,
  background: AMBER_BG,
  color: '#92400E',
  fontSize: 11,
  fontWeight: 700,
  border: '1px solid rgba(245,158,11,0.35)',
  whiteSpace: 'nowrap',
};

const openLinkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  background: 'transparent',
  border: 'none',
  color: BLUE,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  padding: 0,
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const metaRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  marginTop: 8,
};

// ── Footer log affordance ──
const footerCardStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '16px 18px',
  borderRadius: 12,
  background: NAVY,
  flexWrap: 'wrap',
};

const logBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  height: 38,
  padding: '0 18px',
  borderRadius: 999,
  background: '#ffffff',
  border: 'none',
  color: NAVY,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

function BriefingItemRow({ item, onOpen }: { item: BriefingItem; onOpen: (to: string) => void }) {
  const watch = item.confidence === 'Low';
  const due = morningBriefing.dueLabels[item.text];
  const hasMeta = Boolean(item.owner || due || watch || item.to);
  return (
    <li style={itemRowStyle(watch)}>
      <span style={bulletStyle(watch)} aria-hidden />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={itemTextStyle}>{item.text}</div>
        {hasMeta && (
          <div style={metaRowStyle}>
            {item.owner && (
              <span style={ownerChipStyle}>
                <UserRound size={11} strokeWidth={2.25} />
                {item.owner}
              </span>
            )}
            {due && <span style={dueChipStyle(due.toLowerCase().includes('overdue'))}>{due}</span>}
            {watch && <span style={lowConfChipStyle}>Low confidence</span>}
            {item.to && (
              <button type="button" style={openLinkStyle} onClick={() => onOpen(item.to!)}>
                Open
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export default function MorningBriefing() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const logDraft: LogDecisionDraft = {
    decision: 'Fix follow-up cadence on the Germany high-potential Xeomin injector cohort.',
    owner: 'Germany NSM',
    marketAndBrand: 'Germany · Xeomin',
    evidenceUsed: [
      'Germany 60-day follow-up 44% vs the agreed 65% cadence',
      '52 high-potential injectors below cadence in Germany (of 71 across DACH: Germany 52, Austria 14, Switzerland 5)',
    ],
    assumptions: [
      'High-potential trained injector list confirmed by Germany commercial operations',
      'Germany NSM owns the 60-day follow-up cadence',
    ],
    expectedImpact: 'Directional commercial recovery within 60 days, measured via Veeva follow-up rate and Xeomin Germany run-rate.',
    followUpDate: dateFromToday(60),
    triggerForReassessment: 'Germany follow-up rate below 55% at 30 days',
    status: 'Active',
    source: 'Manual',
  };

  return (
    <div style={pageStyle}>
      <header style={mastheadStyle}>
        <div>
          <div style={eyebrowRowStyle}>
            <Sunrise size={13} strokeWidth={2.25} />
            Morning Briefing
          </div>
          <h1 style={titleStyle}>Morning Briefing · {morningBriefing.dateLabel}</h1>
          <p style={standfirstStyle}>{morningBriefing.standfirst}</p>
        </div>
        <span style={dateBadgeStyle}>Illustrative data · v0.1</span>
      </header>

      {morningBriefing.sections.map((section: BriefingSection, i) => (
        <section key={section.id} style={sectionStyle}>
          <div style={sectionHeadRowStyle}>
            <span style={sectionNumberStyle}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 style={sectionTitleStyle}>{section.title}</h2>
              <p style={sectionBlurbStyle}>{section.blurb}</p>
            </div>
          </div>
          <ul style={itemListStyle}>
            {section.items.map((item, j) => (
              <BriefingItemRow key={j} item={item} onOpen={(to) => navigate(to)} />
            ))}
          </ul>
        </section>
      ))}

      <div style={footerCardStyle}>
        <div style={{ color: '#ffffff' }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Turn the briefing into a decision</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
            Log the Germany follow-up sprint with owner, trigger, and a 60-day review.
          </div>
        </div>
        <button type="button" style={logBtnStyle} onClick={() => setModalOpen(true)}>
          Log this decision
        </button>
      </div>

      <LogDecisionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        draft={logDraft}
        onLogged={() => navigate('/decision-log?from=morning-briefing')}
      />
    </div>
  );
}
