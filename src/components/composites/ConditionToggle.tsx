import type { CSSProperties } from 'react';
import { Circle, CheckSquare } from 'lucide-react';

const NAVY = '#050A44';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '10px 12px',
  background: 'transparent',
  border: 'none',
  borderRadius: 8,
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 120ms ease',
};

const rowHoverStyle: CSSProperties = {
  background: NAVY_06,
};

const labelStyle = (checked: boolean): CSSProperties => ({
  fontSize: 13,
  color: checked ? NAVY : NAVY_70,
  lineHeight: 1.45,
  fontWeight: checked ? 600 : 500,
});

export interface ConditionToggleProps {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

export function ConditionToggle({ label, checked, onChange }: ConditionToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={rowStyle}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, rowHoverStyle)}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      aria-pressed={checked}
    >
      {checked ? (
        <CheckSquare size={18} strokeWidth={2.2} color={NAVY} style={{ flexShrink: 0, marginTop: 1 }} />
      ) : (
        <Circle size={18} strokeWidth={1.5} color={NAVY_12} style={{ flexShrink: 0, marginTop: 1 }} />
      )}
      <span style={labelStyle(checked)}>{label}</span>
    </button>
  );
}
