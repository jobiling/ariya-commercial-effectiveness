import type { CSSProperties } from 'react';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';

export interface SegmentedControlOption {
  value: string;
  label: string;
  disabled?: boolean;
  // Small right-side tag, e.g. "Preview".
  badge?: string;
}

export interface SegmentedControlProps {
  options: readonly SegmentedControlOption[];
  value: string;
  onChange: (next: string) => void;
}

const wrapStyle: CSSProperties = {
  display: 'inline-flex',
  padding: 4,
  borderRadius: 999,
  background: NAVY_06,
  border: `1px solid ${NAVY_12}`,
  gap: 4,
  flexWrap: 'wrap',
};

const pillBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 16px',
  borderRadius: 999,
  background: 'transparent',
  border: 'none',
  color: NAVY_70,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 150ms ease, color 150ms ease',
};

const pillActiveStyle: CSSProperties = {
  background: NAVY,
  color: '#ffffff',
  boxShadow: '0 1px 2px rgba(5,10,68,0.18)',
};

const pillDisabledStyle: CSSProperties = {
  color: NAVY_55,
  cursor: 'not-allowed',
  opacity: 0.7,
};

const badgeStyle = (active: boolean): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 6px',
  borderRadius: 999,
  background: active ? 'rgba(255,255,255,0.18)' : '#EEF2FF',
  color: active ? '#ffffff' : '#3730A3',
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
});

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div style={wrapStyle} role="tablist">
      {options.map((opt) => {
        const active = opt.value === value;
        const disabled = !!opt.disabled;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => !disabled && onChange(opt.value)}
            style={{
              ...pillBaseStyle,
              ...(active ? pillActiveStyle : null),
              ...(disabled ? pillDisabledStyle : null),
            }}
          >
            <span>{opt.label}</span>
            {opt.badge && <span style={badgeStyle(active)}>{opt.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
