import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const RED = '#E11D48';
const BLUE = '#0055BB';
const CANVAS = '#F7F8FC';

const containerStyle: CSSProperties = {
  background: CANVAS,
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const dominantRowStyle: CSSProperties = {
  position: 'relative',
  background: '#FEF2F2',
  border: '1px solid rgba(225,29,72,0.25)',
  borderLeft: `4px solid ${RED}`,
  borderRadius: 12,
  padding: '18px 22px',
  display: 'flex',
  gap: 18,
  alignItems: 'flex-start',
};

const indexBadgeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: NAVY_55,
  width: 22,
  flexShrink: 0,
  marginTop: 4,
};

const dominantBodyStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const dominantHeadlineStyle: CSSProperties = {
  fontSize: 19,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.35,
  margin: 0,
};

const evidenceStyle: CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
};

const dominantActionsStyle: CSSProperties = {
  marginTop: 14,
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const primaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 34,
  padding: '0 14px',
  borderRadius: 10,
  background: BLUE,
  border: `1px solid ${BLUE}`,
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const outlineBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 34,
  padding: '0 14px',
  borderRadius: 10,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const compactRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 18,
  padding: '14px 18px',
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 12,
  width: '100%',
  fontFamily: 'inherit',
};

const compactBodyStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  paddingTop: 2,
};

const compactHeadlineStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: NAVY,
  margin: 0,
  lineHeight: 1.4,
};

const compactEvidenceStyle: CSSProperties = {
  marginTop: 2,
  fontSize: 12,
  color: NAVY_55,
  lineHeight: 1.45,
};

const compactTagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 9px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY_70,
  fontSize: 11,
  fontWeight: 600,
  marginRight: 8,
};

const compactActionsStyle: CSSProperties = {
  display: 'flex',
  gap: 6,
  flexShrink: 0,
  alignItems: 'center',
};

const compactPrimaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 30,
  padding: '0 12px',
  borderRadius: 8,
  background: BLUE,
  border: `1px solid ${BLUE}`,
  color: '#ffffff',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};

const compactOutlineBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 30,
  padding: '0 12px',
  borderRadius: 8,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};

export interface HeroPriorityItem {
  id: string;
  flag?: string;
  marketName: string;
  headline: string;
  evidence: string;
  route: string;
}

export interface HeroPriorityListProps {
  items: readonly HeroPriorityItem[];
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  onPrimary?: (item: HeroPriorityItem) => void;
  onSecondary?: (item: HeroPriorityItem) => void;
  // Customise the primary CTA label per item so item 01 can say "Open Italy detail"
  // while item 02 says "Open Germany detail", etc.
  primaryLabelFor?: (item: HeroPriorityItem) => string;
}

export function HeroPriorityList({
  items,
  primaryCtaLabel = 'Open market detail',
  secondaryCtaLabel = 'Add to brief',
  onPrimary,
  onSecondary,
  primaryLabelFor,
}: HeroPriorityListProps) {
  const navigate = useNavigate();
  const [first, ...rest] = items;
  if (!first) return null;

  const handlePrimary = (item: HeroPriorityItem) =>
    onPrimary ? onPrimary(item) : navigate(item.route);
  const labelFor = (item: HeroPriorityItem) =>
    primaryLabelFor ? primaryLabelFor(item) : primaryCtaLabel;

  return (
    <div style={containerStyle}>
      <div style={dominantRowStyle}>
        <div style={indexBadgeStyle}>01</div>
        <div style={dominantBodyStyle}>
          <span style={compactTagStyle}>
            {first.flag} {first.marketName}
          </span>
          <h3 style={dominantHeadlineStyle}>{first.headline}</h3>
          <p style={evidenceStyle}>{first.evidence}</p>
          <div style={dominantActionsStyle}>
            <button type="button" style={primaryBtnStyle} onClick={() => handlePrimary(first)}>
              {labelFor(first)} →
            </button>
            <button
              type="button"
              style={outlineBtnStyle}
              onClick={() => onSecondary?.(first)}
            >
              {secondaryCtaLabel}
            </button>
          </div>
        </div>
      </div>

      {rest.map((item, idx) => (
        <div key={item.id} style={compactRowStyle}>
          <div style={indexBadgeStyle}>{String(idx + 2).padStart(2, '0')}</div>
          <div style={compactBodyStyle}>
            <span style={compactTagStyle}>
              {item.flag} {item.marketName}
            </span>
            <h3 style={compactHeadlineStyle}>{item.headline}</h3>
            <p style={compactEvidenceStyle}>{item.evidence}</p>
          </div>
          <div style={compactActionsStyle}>
            <button
              type="button"
              style={compactPrimaryBtnStyle}
              onClick={() => handlePrimary(item)}
            >
              {labelFor(item)} →
            </button>
            <button
              type="button"
              style={compactOutlineBtnStyle}
              onClick={() => onSecondary?.(item)}
            >
              {secondaryCtaLabel}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
