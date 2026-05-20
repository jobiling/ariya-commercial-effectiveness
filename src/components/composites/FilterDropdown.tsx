import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { ChevronDown, ChevronUp, Check, Square } from 'lucide-react';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';

export interface FilterOption {
  value: string;
  label: string;
  // Optional leading glyph (emoji flag, etc).
  glyph?: string;
  // Optional right-side count.
  count?: number;
}

export interface FilterDropdownProps {
  label: string;
  options: readonly FilterOption[];
  selected: ReadonlySet<string>;
  onApply: (next: Set<string>) => void;
  // Width of the panel in px. Default 280.
  panelWidth?: number;
  // Show a search input above the option list.
  searchable?: boolean;
  searchPlaceholder?: string;
  // Optional cap on visible options before scrolling. Default 8.
  visibleRows?: number;
}

const wrapStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-block',
};

const triggerBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  height: 36,
  padding: '0 14px',
  borderRadius: 999,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'border-color 120ms ease, box-shadow 120ms ease',
};

const triggerActiveStyle: CSSProperties = {
  borderColor: NAVY,
  boxShadow: `0 0 0 3px rgba(5,10,68,0.06)`,
};

const triggerWithSelectionStyle: CSSProperties = {
  borderColor: NAVY,
};

const countBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 18,
  minWidth: 18,
  padding: '0 5px',
  borderRadius: 999,
  background: NAVY,
  color: '#ffffff',
  fontSize: 10,
  fontWeight: 800,
  fontVariantNumeric: 'tabular-nums',
};

const panelStyle = (width: number): CSSProperties => ({
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  width,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 12,
  boxShadow: '0 12px 28px rgba(5,10,68,0.16), 0 2px 6px rgba(5,10,68,0.06)',
  zIndex: 40,
  padding: '12px 0 0',
  display: 'flex',
  flexDirection: 'column',
});

const searchWrapStyle: CSSProperties = {
  padding: '0 12px 8px',
};

const searchInputStyle: CSSProperties = {
  width: '100%',
  height: 34,
  padding: '0 12px',
  borderRadius: 8,
  border: `1px solid ${NAVY_12}`,
  background: '#ffffff',
  color: NAVY,
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
};

const listStyle = (maxHeightRows: number): CSSProperties => ({
  overflowY: 'auto',
  maxHeight: maxHeightRows * 40,
  padding: '0 4px 4px',
});

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 10px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 13,
  color: NAVY,
  background: 'transparent',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'inherit',
};

const rowHoverStyle: CSSProperties = {
  background: NAVY_06,
};

const checkboxStyle = (checked: boolean): CSSProperties => ({
  width: 18,
  height: 18,
  borderRadius: 5,
  border: `1.5px solid ${checked ? NAVY : NAVY_12}`,
  background: checked ? NAVY : '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'background 120ms ease, border-color 120ms ease',
});

const labelTextStyle: CSSProperties = {
  flex: 1,
  fontSize: 13,
  color: NAVY,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const optionCountStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 600,
};

const footerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  borderTop: `1px solid ${NAVY_12}`,
  background: '#ffffff',
  borderBottomLeftRadius: 12,
  borderBottomRightRadius: 12,
};

const clearBtnStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: NAVY_70,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'underline',
  textUnderlineOffset: 2,
  fontFamily: 'inherit',
  padding: 0,
};

const applyBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 32,
  padding: '0 16px',
  borderRadius: 999,
  background: NAVY,
  border: 'none',
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const emptyStyle: CSSProperties = {
  padding: '14px 12px',
  fontSize: 12,
  color: NAVY_55,
  textAlign: 'center',
  fontStyle: 'italic',
};

export function FilterDropdown({
  label,
  options,
  selected,
  onApply,
  panelWidth = 280,
  searchable = true,
  searchPlaceholder,
  visibleRows = 8,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [staged, setStaged] = useState<Set<string>>(new Set(selected));
  const [query, setQuery] = useState('');
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // When the parent's selected set changes from outside, mirror it into staged.
  useEffect(() => {
    setStaged(new Set(selected));
  }, [selected]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setStaged(new Set(selected)); // revert
        setOpen(false);
      }
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStaged(new Set(selected));
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, selected]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (value: string) => {
    setStaged((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const apply = () => {
    onApply(new Set(staged));
    setOpen(false);
    setQuery('');
  };

  const clear = () => {
    setStaged(new Set());
  };

  const triggerLabel = (() => {
    if (selected.size === 0) return label;
    if (selected.size === 1) {
      const opt = options.find((o) => o.value === Array.from(selected)[0]);
      return `${label} · ${opt?.label ?? '1'}`;
    }
    return label;
  })();

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  return (
    <div ref={wrapRef} style={wrapStyle}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          ...triggerBaseStyle,
          ...(open ? triggerActiveStyle : null),
          ...(!open && selected.size > 0 ? triggerWithSelectionStyle : null),
        }}
      >
        <span>{triggerLabel}</span>
        {selected.size > 1 && <span style={countBadgeStyle}>{selected.size}</span>}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div style={panelStyle(panelWidth)} role="listbox" aria-label={label}>
          {searchable && (
            <div style={searchWrapStyle}>
              <input
                type="text"
                placeholder={searchPlaceholder ?? `Filter ${label.toLowerCase()}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={searchInputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = BLUE;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = NAVY_12;
                }}
                autoFocus
              />
            </div>
          )}

          <div style={listStyle(visibleRows)}>
            {filteredOptions.length === 0 ? (
              <div style={emptyStyle}>No matches</div>
            ) : (
              filteredOptions.map((o) => {
                const checked = staged.has(o.value);
                const isHovered = hoveredValue === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => toggle(o.value)}
                    onMouseEnter={() => setHoveredValue(o.value)}
                    onMouseLeave={() => setHoveredValue(null)}
                    style={{ ...rowStyle, ...(isHovered ? rowHoverStyle : null) }}
                    role="option"
                    aria-selected={checked}
                  >
                    <span style={checkboxStyle(checked)} aria-hidden>
                      {checked ? (
                        <Check size={13} color="#ffffff" strokeWidth={3} />
                      ) : (
                        <Square size={0} />
                      )}
                    </span>
                    <span style={labelTextStyle}>
                      {o.glyph && <span aria-hidden>{o.glyph}</span>}
                      <span>{o.label}</span>
                    </span>
                    {typeof o.count === 'number' && (
                      <span style={optionCountStyle}>{o.count}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div style={footerStyle}>
            <button type="button" onClick={clear} style={clearBtnStyle}>
              Clear
            </button>
            <button type="button" onClick={apply} style={applyBtnStyle}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
