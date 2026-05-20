import { useState, type CSSProperties } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';

const toggleBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
  padding: '8px 0',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  textAlign: 'left',
};

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const countStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  fontVariantNumeric: 'tabular-nums',
};

const listStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '6px 0 0',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const itemStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '10px 12px',
  background: NAVY_06,
  border: `1px solid ${NAVY_12}`,
  borderRadius: 8,
};

const itemTextStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
};

const itemSourceStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  padding: '2px 8px',
  borderRadius: 999,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY_55,
  fontSize: 11,
  fontWeight: 600,
};

export interface AssumptionRow {
  text: string;
  source: string;
}

export interface AssumptionListProps {
  items: readonly AssumptionRow[];
  defaultOpen?: boolean;
  label?: string;
}

export function AssumptionList({
  items,
  defaultOpen = false,
  label = 'Assumptions',
}: AssumptionListProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={toggleBtnStyle}
        aria-expanded={open}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={labelStyle}>{label}</span>
          <span style={countStyle}>· {items.length}</span>
        </div>
        {open ? <ChevronUp size={14} color={NAVY} /> : <ChevronDown size={14} color={NAVY} />}
      </button>
      {open && (
        <ul style={listStyle}>
          {items.map((item, i) => (
            <li key={i} style={itemStyle}>
              <span style={itemTextStyle}>{item.text}</span>
              <span style={itemSourceStyle}>{item.source}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
