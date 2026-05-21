import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Flag,
  Info,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { LogDecisionModal, RecommendationCard, dateFromToday } from '../components/decision';
import type { LogDecisionDraft } from '../components/decision';
import { investmentRadar, markets, scenarioPlanner } from '../data/scenario';

// ───────────────────────────────────────────────────────────────────────────
// Tokens
// ───────────────────────────────────────────────────────────────────────────

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const NAVY_04 = 'rgba(5,10,68,0.04)';
const BLUE = '#0055BB';
const BLUE_TINT = '#EAF1FB';
const TEAL = '#0F766E';
const RED = '#E11D48';
const GREEN = '#16A34A';
const AMBER_BG = '#FEF3C7';
const AMBER_BORDER = '#F59E0B';
const AMBER_TEXT = '#92400E';

// ───────────────────────────────────────────────────────────────────────────
// Domain rules: which selectors are active in the demo scenario
// ───────────────────────────────────────────────────────────────────────────

const FROM_COUNTRY_ID = 'de';
const FROM_CATEGORY_ID = 'marketing-campaigns';
const TO_COUNTRY_ID = 'it';
const TO_CATEGORY_ID = 'hcp-training';

const FROM_COUNTRY_LABEL = 'Germany';
const TO_COUNTRY_LABEL = 'Italy';

// Lookup helper: find the spend (in € thousands) for a (categoryId, marketId)
// pair from the InvestmentRadar dataset.
function lookupSpendK(categoryId: string, marketId: string): number | null {
  const cat = investmentRadar.find((c) => c.id === categoryId);
  if (!cat) return null;
  const cell = cat.cells.find((c) => c.marketId === marketId);
  return cell ? cell.spendEur : null;
}

function lookupKpi(
  categoryId: string,
  marketId: string,
): { proxyKpi: string; proxyKpiValue: string } | null {
  const cat = investmentRadar.find((c) => c.id === categoryId);
  if (!cat) return null;
  const cell = cat.cells.find((c) => c.marketId === marketId);
  return cell ? { proxyKpi: cell.proxyKpi, proxyKpiValue: cell.proxyKpiValue } : null;
}

function categoryName(categoryId: string): string {
  return investmentRadar.find((c) => c.id === categoryId)?.name ?? categoryId;
}

// Format € thousands as €X.XXM (millions) for display.
function fmtEur(thousands: number): string {
  const millions = thousands / 1000;
  return `€${millions.toFixed(2)}M`;
}

// ───────────────────────────────────────────────────────────────────────────
// Confidence-band model (unchanged from previous iteration)
// ───────────────────────────────────────────────────────────────────────────

const CONDITION_KEYS = [
  'Italy follow-up coverage improves within 60 days',
  'Germany reduction limited to lower-response activities',
] as const;

const DEFAULT_REALLOCATION = scenarioPlanner.defaultReallocationPct;
const FOLLOWUP_BASELINE = 41;
const FOLLOWUP_AT_DEFAULT = 60;
const FOLLOWUP_CAP = 75;

function achievableFollowup(reallocationPct: number): number {
  const linearRise = (FOLLOWUP_AT_DEFAULT - FOLLOWUP_BASELINE) / DEFAULT_REALLOCATION;
  const raw = FOLLOWUP_BASELINE + reallocationPct * linearRise;
  return Math.min(FOLLOWUP_CAP, raw);
}

function buildBandData(
  reallocationPct: number,
  conditionsChecked: Record<string, boolean>,
) {
  const followup = achievableFollowup(reallocationPct);
  const impactMultiplier =
    (followup - FOLLOWUP_BASELINE) / (FOLLOWUP_AT_DEFAULT - FOLLOWUP_BASELINE);

  const condEffects = scenarioPlanner.conditionEffects as Record<string, { widenBandBy: number }>;
  let conditionWiden = 0;
  for (const key of CONDITION_KEYS) {
    if (conditionsChecked[key] === false) {
      conditionWiden += condEffects[key]?.widenBandBy ?? 0;
    }
  }

  return scenarioPlanner.outcomes.base.map((b, idx) => {
    const conservative = scenarioPlanner.outcomes.conservative[idx].value;
    const best = scenarioPlanner.outcomes.best[idx].value;

    const dynamicBase = 100 + (b.value - 100) * impactMultiplier;
    const upperSpread = (best - b.value) * impactMultiplier + conditionWiden;
    const lowerSpread = (b.value - conservative) * impactMultiplier + conditionWiden;

    return {
      month: idx,
      monthLabel: `M${idx}`,
      base: parseFloat(dynamicBase.toFixed(2)),
      lower: parseFloat((dynamicBase - lowerSpread).toFixed(2)),
      upper: parseFloat((dynamicBase + upperSpread).toFixed(2)),
    };
  });
}

// ───────────────────────────────────────────────────────────────────────────
// Page layout styles
// ───────────────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  paddingBottom: 48,
};

const headerStripeStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
};

const directionalChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 999,
  background: '#ECFEFF',
  border: `1px solid #A5F3FC`,
  color: TEAL,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const cardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 22,
  boxShadow: `0 1px 2px ${NAVY_04}`,
};

// Header hierarchy on the page:
//   Level 1: page title (gradient, handled by PageHeader)
//   Level 2: section / card title — navy bold sentence case
//   Level 3: sub-label inside a card — grey small-caps eyebrow
//   Special: "Ariya recommends · Scenario answer" stays as a blue eyebrow
//   because it marks the AI's voice, not a section title.
const sectionTitleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 16,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.35,
  margin: 0,
};

const sectionSubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  lineHeight: 1.4,
  margin: '2px 0 0',
};

// ───────────────────────────────────────────────────────────────────────────
// Scenario card: selector row
// ───────────────────────────────────────────────────────────────────────────

const selectorRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexWrap: 'wrap',
};

const selectorRowLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: NAVY_55,
  padding: '0 4px',
};

const selectorBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  height: 38,
  padding: '0 12px',
  borderRadius: 10,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  boxShadow: `0 1px 2px ${NAVY_04}`,
  transition: 'background 120ms ease, border-color 120ms ease',
};

const selectorMenuStyle: CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  minWidth: '100%',
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 12,
  boxShadow: '0 12px 28px rgba(5,10,68,0.16), 0 2px 6px rgba(5,10,68,0.06)',
  zIndex: 40,
  padding: 6,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  maxHeight: 360,
  overflowY: 'auto',
};

const menuItemBase: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 13,
  color: NAVY_70,
  transition: 'background 120ms ease',
  userSelect: 'none',
};

const menuItemValueStyle: CSSProperties = {
  marginLeft: 'auto',
  fontVariantNumeric: 'tabular-nums',
  color: NAVY_55,
  fontSize: 12,
  fontWeight: 600,
};

// ───────────────────────────────────────────────────────────────────────────
// Slider
// ───────────────────────────────────────────────────────────────────────────

const sliderRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
};

const sliderLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: NAVY_70,
};

const sliderValueStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: NAVY,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
};

const rangeInputStyle: CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  width: '100%',
  height: 6,
  borderRadius: 999,
  outline: 'none',
  cursor: 'pointer',
};

const sliderTicksStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 11,
  color: NAVY_55,
  fontVariantNumeric: 'tabular-nums',
  marginTop: 6,
};

// ───────────────────────────────────────────────────────────────────────────
// Summary tiles
// ───────────────────────────────────────────────────────────────────────────

const summaryGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 12,
  marginTop: 4,
};

const summaryTileBase: CSSProperties = {
  background: '#F7F8FC',
  border: `1px solid ${NAVY_06}`,
  borderRadius: 12,
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const summaryEyebrowStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const summaryAmountRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  fontSize: 16,
  fontWeight: 800,
  color: NAVY,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.15,
};

const summarySubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_70,
  lineHeight: 1.4,
};

// ───────────────────────────────────────────────────────────────────────────
// Conditions & Assumptions (collapsible)
// ───────────────────────────────────────────────────────────────────────────

const condAssumpGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1.2fr',
  gap: 32,
};

const subLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 10,
};

const condRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '6px 0',
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
};

const checkboxStyle: CSSProperties = {
  width: 16,
  height: 16,
  borderRadius: 4,
  border: `1.5px solid ${NAVY_12}`,
  background: '#ffffff',
  flexShrink: 0,
  marginTop: 2,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const checkboxCheckedStyle: CSSProperties = {
  ...checkboxStyle,
  background: BLUE,
  borderColor: BLUE,
};

const assumpRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  padding: '5px 0',
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
};

const assumpBulletStyle: CSSProperties = {
  marginTop: 9,
  width: 4,
  height: 4,
  borderRadius: 999,
  background: NAVY_55,
  flexShrink: 0,
};

const assumpLabelStyle: CSSProperties = {
  fontWeight: 700,
  color: NAVY,
};

const collapseBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 8,
  background: NAVY_06,
  border: 'none',
  color: NAVY_70,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// ───────────────────────────────────────────────────────────────────────────
// Dependency chain (3 steps)
// ───────────────────────────────────────────────────────────────────────────

const chainRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr auto 1fr',
  alignItems: 'stretch',
  gap: 12,
};

const chainNodeBase: CSSProperties = {
  background: '#F7F8FC',
  border: `1px solid ${NAVY_06}`,
  borderRadius: 12,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  position: 'relative',
};

const chainNodeFocusStyle: CSSProperties = {
  ...chainNodeBase,
  background: AMBER_BG,
  border: `1.5px solid ${AMBER_BORDER}`,
};

const chainStepEyebrowStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const chainStepEyebrowFocusStyle: CSSProperties = {
  ...chainStepEyebrowStyle,
  color: AMBER_TEXT,
};

const chainStepTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.35,
};

const chainFocusPillStyle: CSSProperties = {
  position: 'absolute',
  top: -10,
  left: 14,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  background: NAVY,
  color: '#ffffff',
  borderRadius: 999,
  fontSize: 9.5,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const chainFocusNoteStyle: CSSProperties = {
  fontSize: 12,
  color: AMBER_TEXT,
  lineHeight: 1.5,
  fontStyle: 'italic',
  marginTop: 4,
};

const chainArrowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  color: NAVY_55,
};

// ───────────────────────────────────────────────────────────────────────────
// Chart
// ───────────────────────────────────────────────────────────────────────────

const tooltipBoxStyle: CSSProperties = {
  background: NAVY,
  color: '#ffffff',
  padding: '8px 10px',
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1.4,
  boxShadow: '0 8px 24px rgba(5,10,68,0.18)',
};

// ───────────────────────────────────────────────────────────────────────────
// Selector component
// ───────────────────────────────────────────────────────────────────────────

interface SelectorOption {
  id: string;
  label: string;
  flag?: string;
  value?: string;       // right-aligned subtle text (e.g. €2.84M)
  selectable: boolean;
}

interface SelectorProps {
  selectedId: string;
  options: SelectorOption[];
  // Width hint; the menu always grows to fit.
  buttonMinWidth?: number;
  ariaLabel: string;
}

function Selector({ selectedId, options, buttonMinWidth = 130, ariaLabel }: SelectorProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.id === selectedId) ?? options[0];

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        style={{ ...selectorBtnStyle, minWidth: buttonMinWidth }}
      >
        {selected.flag && <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>{selected.flag}</span>}
        <span style={{ flex: 1, textAlign: 'left' }}>{selected.label}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div role="listbox" style={selectorMenuStyle}>
          {options.map((o) => {
            const isSelected = o.id === selectedId;
            const baseStyle: CSSProperties = {
              ...menuItemBase,
              background: isSelected ? BLUE_TINT : 'transparent',
              color: isSelected ? NAVY : o.selectable ? NAVY_70 : 'rgba(5,10,68,0.40)',
              fontWeight: isSelected ? 700 : 500,
              cursor: o.selectable ? 'pointer' : 'not-allowed',
            };
            return (
              <div
                key={o.id}
                role="option"
                aria-selected={isSelected}
                aria-disabled={!o.selectable}
                onClick={() => o.selectable && setOpen(false)}
                onMouseEnter={(e) => {
                  if (o.selectable && !isSelected) e.currentTarget.style.background = NAVY_06;
                }}
                onMouseLeave={(e) => {
                  if (o.selectable && !isSelected) e.currentTarget.style.background = 'transparent';
                }}
                style={baseStyle}
              >
                {o.flag && <span aria-hidden style={{ fontSize: 15, lineHeight: 1 }}>{o.flag}</span>}
                <span>{o.label}</span>
                {o.value && <span style={menuItemValueStyle}>{o.value}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────────

export default function ScenarioPlanner() {
  const navigate = useNavigate();
  const [reallocationPct, setReallocationPct] = useState<number>(DEFAULT_REALLOCATION);
  const [conditions, setConditions] = useState<Record<string, boolean>>({
    [CONDITION_KEYS[0]]: true,
    [CONDITION_KEYS[1]]: true,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [condCollapsed, setCondCollapsed] = useState(false);

  const bandData = useMemo(
    () => buildBandData(reallocationPct, conditions),
    [reallocationPct, conditions],
  );

  const widened = !conditions[CONDITION_KEYS[0]] || !conditions[CONDITION_KEYS[1]];

  const trackPct = (reallocationPct / scenarioPlanner.reallocationRangePct.max) * 100;
  const dynamicRangeStyle: CSSProperties = {
    ...rangeInputStyle,
    background: `linear-gradient(to right, ${NAVY} 0%, ${NAVY} ${trackPct}%, ${NAVY_12} ${trackPct}%, ${NAVY_12} 100%)`,
  };

  // Spend lookups for the selected (locked) From / To combination.
  const fromSpendK = lookupSpendK(FROM_CATEGORY_ID, FROM_COUNTRY_ID) ?? 0;
  const toSpendK = lookupSpendK(TO_CATEGORY_ID, TO_COUNTRY_ID) ?? 0;
  const fromKpi = lookupKpi(FROM_CATEGORY_ID, FROM_COUNTRY_ID);
  const toKpi = lookupKpi(TO_CATEGORY_ID, TO_COUNTRY_ID);

  const reallocAmountK = (fromSpendK * reallocationPct) / 100;
  const fromNewSpendK = fromSpendK - reallocAmountK;
  const toNewSpendK = toSpendK + reallocAmountK;

  // Selector option lists. Only the locked combination is selectable.
  const fromCountryOptions: SelectorOption[] = markets.map((m) => ({
    id: m.id,
    label: m.name,
    flag: m.flag,
    selectable: m.id === FROM_COUNTRY_ID,
  }));
  const toCountryOptions: SelectorOption[] = markets.map((m) => ({
    id: m.id,
    label: m.name,
    flag: m.flag,
    selectable: m.id === TO_COUNTRY_ID,
  }));
  // Category options: show all categories with the from-country's spend.
  const fromCategoryOptions: SelectorOption[] = investmentRadar.map((c) => {
    const k = lookupSpendK(c.id, FROM_COUNTRY_ID);
    return {
      id: c.id,
      label: c.name,
      value: k != null ? fmtEur(k) : '—',
      selectable: c.id === FROM_CATEGORY_ID,
    };
  });
  const toCategoryOptions: SelectorOption[] = investmentRadar.map((c) => {
    const k = lookupSpendK(c.id, TO_COUNTRY_ID);
    return {
      id: c.id,
      label: c.name,
      value: k != null ? fmtEur(k) : '—',
      selectable: c.id === TO_CATEGORY_ID,
    };
  });

  const draft: LogDecisionDraft = {
    decision: scenarioPlanner.recommendation.recommendation,
    owner: 'Europe Leadership',
    marketAndBrand: 'Italy, Germany · Xeomin',
    evidenceUsed: [
      `${reallocationPct}% Germany marketing budget reallocation modelled`,
      'Italy 41% follow-up vs 65% benchmark',
      '47 high-potential trained HCPs without 60-day contact',
    ],
    assumptions: scenarioPlanner.assumptions.map((a) => a.text),
    expectedImpact:
      'Directional commercial recovery within 60 days, measured via CRM follow-up rate and Xeomin Italy run-rate.',
    followUpDate: dateFromToday(60),
    triggerForReassessment:
      'Italy follow-up rate below 55% at 30 days · trained HCP list not confirmed within 5 days',
    status: 'Active',
    source: 'Scenario Planner',
  };

  const openInAskAriya = () => {
    navigate(`/ask-ariya?question=${encodeURIComponent('If we shift 10% of Germany')}`);
  };

  return (
    <div style={pageStyle}>
      <div style={headerStripeStyle}>
        <PageHeader
          title="Scenario planner"
          subtitle="Directional impact under explicit assumptions. Not a forecast."
        />
        <span style={directionalChipStyle}>
          <Info size={12} strokeWidth={2.5} /> Directional · Not a forecast
        </span>
      </div>

      {/* ─── Scenario card ────────────────────────────────────────── */}
      <section style={cardStyle}>
        <div style={sectionTitleRowStyle}>
          <h2 style={sectionTitleStyle}>Scenario</h2>
        </div>

        <div style={selectorRowStyle}>
          <span style={selectorRowLabelStyle}>From</span>
          <Selector
            selectedId={FROM_COUNTRY_ID}
            options={fromCountryOptions}
            ariaLabel="From country"
            buttonMinWidth={140}
          />
          <Selector
            selectedId={FROM_CATEGORY_ID}
            options={fromCategoryOptions}
            ariaLabel="From category"
            buttonMinWidth={220}
          />
          <span style={selectorRowLabelStyle}>toward</span>
          <Selector
            selectedId={TO_COUNTRY_ID}
            options={toCountryOptions}
            ariaLabel="To country"
            buttonMinWidth={120}
          />
          <Selector
            selectedId={TO_CATEGORY_ID}
            options={toCategoryOptions}
            ariaLabel="To category"
            buttonMinWidth={220}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={sliderRowStyle}>
            <label htmlFor="realloc-slider" style={sliderLabelStyle}>
              Share to be reallocated
            </label>
            <span style={sliderValueStyle}>{reallocationPct}%</span>
          </div>
          <input
            id="realloc-slider"
            type="range"
            min={scenarioPlanner.reallocationRangePct.min}
            max={scenarioPlanner.reallocationRangePct.max}
            step={1}
            value={reallocationPct}
            onChange={(e) => setReallocationPct(Number(e.target.value))}
            style={{ ...dynamicRangeStyle, marginTop: 10 }}
            aria-valuemin={scenarioPlanner.reallocationRangePct.min}
            aria-valuemax={scenarioPlanner.reallocationRangePct.max}
            aria-valuenow={reallocationPct}
          />
          <div style={sliderTicksStyle}>
            <span>{scenarioPlanner.reallocationRangePct.min}%</span>
            <span>Default 10%</span>
            <span>{scenarioPlanner.reallocationRangePct.max}%</span>
          </div>
        </div>

        <div style={summaryGridStyle}>
          {/* FROM */}
          <div style={summaryTileBase}>
            <span style={summaryEyebrowStyle}>From book · {FROM_COUNTRY_LABEL.toUpperCase().slice(0, 3)}</span>
            <div style={summaryAmountRowStyle}>
              <span>{fmtEur(fromSpendK)}</span>
              <ArrowRight size={14} color={RED} strokeWidth={2.5} />
              <span style={{ color: RED }}>{fmtEur(fromNewSpendK)}</span>
            </div>
            <div style={summarySubtitleStyle}>
              {categoryName(FROM_CATEGORY_ID)}
              {fromKpi && (
                <>
                  {' · '}
                  KPI {fromKpi.proxyKpiValue}
                </>
              )}
            </div>
          </div>

          {/* REALLOCATING */}
          <div style={summaryTileBase}>
            <span style={summaryEyebrowStyle}>Reallocating</span>
            <div style={summaryAmountRowStyle}>
              <ArrowRight size={14} color={BLUE} strokeWidth={2.5} />
              <span style={{ color: BLUE }}>{fmtEur(reallocAmountK)}</span>
            </div>
            <div style={summarySubtitleStyle}>
              {reallocationPct}% of {FROM_COUNTRY_LABEL.toUpperCase().slice(0, 3)} {categoryName(FROM_CATEGORY_ID).toLowerCase()}
            </div>
          </div>

          {/* TO */}
          <div style={summaryTileBase}>
            <span style={summaryEyebrowStyle}>To book · {TO_COUNTRY_LABEL.toUpperCase().slice(0, 3)}</span>
            <div style={summaryAmountRowStyle}>
              <span>{fmtEur(toSpendK)}</span>
              <ArrowRight size={14} color={GREEN} strokeWidth={2.5} />
              <span style={{ color: GREEN }}>{fmtEur(toNewSpendK)}</span>
            </div>
            <div style={summarySubtitleStyle}>
              {categoryName(TO_CATEGORY_ID)}
              {toKpi && (
                <>
                  {' · '}
                  KPI {toKpi.proxyKpiValue}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Conditions & Assumptions (collapsible) ──────────────── */}
      <section style={cardStyle}>
        <div style={sectionTitleRowStyle}>
          <h2 style={sectionTitleStyle}>Conditions &amp; assumptions</h2>
          <button
            type="button"
            onClick={() => setCondCollapsed((v) => !v)}
            aria-expanded={!condCollapsed}
            aria-label={condCollapsed ? 'Show conditions and assumptions' : 'Hide conditions and assumptions'}
            style={collapseBtnStyle}
          >
            {condCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>

        {!condCollapsed && (
          <div style={condAssumpGridStyle}>
            <div>
              <div style={subLabelStyle}>Conditions to verify</div>
              {CONDITION_KEYS.map((k) => {
                const checked = !!conditions[k];
                return (
                  <div
                    key={k}
                    onClick={() => setConditions((p) => ({ ...p, [k]: !checked }))}
                    style={{ ...condRowStyle, cursor: 'pointer' }}
                    role="checkbox"
                    aria-checked={checked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        setConditions((p) => ({ ...p, [k]: !checked }));
                      }
                    }}
                  >
                    <span style={checked ? checkboxCheckedStyle : checkboxStyle} aria-hidden>
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      )}
                    </span>
                    <span>{k}</span>
                  </div>
                );
              })}
              {widened && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '8px 12px',
                    background: AMBER_BG,
                    border: `1px solid ${AMBER_BORDER}`,
                    borderRadius: 8,
                    color: AMBER_TEXT,
                    fontSize: 12,
                    lineHeight: 1.45,
                    fontWeight: 500,
                  }}
                >
                  Confidence band widened because a required condition is unchecked.
                </div>
              )}
            </div>

            <div>
              <div style={subLabelStyle}>Assumptions in play</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {scenarioPlanner.assumptionsInPlay.map((a) => (
                  <li key={a.source} style={assumpRowStyle}>
                    <span style={assumpBulletStyle} aria-hidden />
                    <span>
                      <span style={assumpLabelStyle}>{a.source}</span>
                      {' · '}
                      {a.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* ─── Dependency: 3-step chain ───────────────────────────── */}
      <section style={cardStyle}>
        <div style={sectionTitleRowStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Dependency</h2>
            <p style={sectionSubtitleStyle}>Where the impact comes from.</p>
          </div>
        </div>
        <div style={chainRowStyle}>
          {scenarioPlanner.operationalChain.map((node, idx) => {
            const isFocus = !!node.focus;
            return (
              <div key={node.node} style={{ display: 'contents' }}>
                <article style={isFocus ? chainNodeFocusStyle : chainNodeBase}>
                  {isFocus && (
                    <span style={chainFocusPillStyle}>
                      <Flag size={10} strokeWidth={2.5} /> Focus of this scenario
                    </span>
                  )}
                  <span style={isFocus ? chainStepEyebrowFocusStyle : chainStepEyebrowStyle}>
                    Step {idx + 1}
                  </span>
                  <div style={chainStepTitleStyle}>{node.node}</div>
                  {isFocus && node.focusNote && (
                    <div style={chainFocusNoteStyle}>{node.focusNote}</div>
                  )}
                </article>
                {idx < scenarioPlanner.operationalChain.length - 1 && (
                  <div style={chainArrowStyle}>
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Chart (full width) ─────────────────────────────────── */}
      <section style={cardStyle}>
        <div style={sectionTitleRowStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Directional net commercial impact · 6-month window</h2>
            <p style={sectionSubtitleStyle}>Directional. Not a forecast.</p>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: NAVY_70, fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 16, height: 2.5, background: BLUE, borderRadius: 2 }} />
              Base
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 10, background: 'rgba(0,85,187,0.18)', borderRadius: 3 }} />
              Confidence band
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: 360, marginTop: 14 }}>
          <ResponsiveContainer>
            <ComposedChart data={bandData} margin={{ top: 12, right: 24, bottom: 36, left: 36 }}>
              <defs>
                <linearGradient id="band-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BLUE} stopOpacity={0.24} />
                  <stop offset="100%" stopColor={BLUE} stopOpacity={0.10} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(5,10,68,0.06)" strokeDasharray="3 3" />
              <XAxis
                dataKey="monthLabel"
                tick={{ fill: NAVY_55, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: NAVY_12 }}
                label={{
                  value: 'Months from now (M0 = today)',
                  position: 'insideBottom',
                  offset: -8,
                  fill: NAVY_55,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
              <YAxis
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tick={{ fill: NAVY_55, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: NAVY_12 }}
                width={64}
                label={{
                  value: 'Italy Xeomin run-rate · 100 = today',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 4,
                  fill: NAVY_55,
                  fontSize: 11,
                  fontWeight: 600,
                  style: { textAnchor: 'middle' },
                }}
              />
              <Tooltip
                contentStyle={tooltipBoxStyle as any}
                itemStyle={{ color: '#ffffff' }}
                labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                formatter={(v: any, name: any) => [
                  typeof v === 'number' ? v.toFixed(2) : v,
                  name === 'upper' ? 'Best' : name === 'lower' ? 'Conservative' : 'Base',
                ]}
              />
              <ReferenceLine y={100} stroke={NAVY_12} strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="url(#band-grad)"
                isAnimationActive
                animationDuration={220}
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="#ffffff"
                isAnimationActive
                animationDuration={220}
              />
              <Line
                type="monotone"
                dataKey="base"
                stroke={BLUE}
                strokeWidth={2.5}
                dot={{ fill: BLUE, r: 3 }}
                isAnimationActive
                animationDuration={220}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 11,
            color: NAVY_55,
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          How to read the Y-axis: values are indexed to today&rsquo;s Italy Xeomin run-rate.
          100 = no change. 103 = a 3% lift versus today. 99 = a 1% decline. The shaded band is
          the directional best–conservative range under the modelled inputs.
        </p>
      </section>

      {/* ─── Ariya recommends ───────────────────────────────────── */}
      <RecommendationCard
        eyebrow={scenarioPlanner.recommendation.eyebrow}
        meta={scenarioPlanner.recommendation.headerMeta}
        pill={scenarioPlanner.recommendation.pill}
        recommendation={scenarioPlanner.recommendation.recommendation}
        whyBullets={scenarioPlanner.recommendation.whyBullets}
        confidence={scenarioPlanner.recommendation.confidence}
        confidenceRationale={scenarioPlanner.recommendation.confidenceRationale}
        conditions={scenarioPlanner.recommendation.conditions}
        nextActions={scenarioPlanner.recommendation.nextActions}
        nextActionsMeta={scenarioPlanner.recommendation.nextActionsMeta}
        sources={scenarioPlanner.recommendation.sources}
        footerMeta={scenarioPlanner.recommendation.footerMeta}
        collapsible
        actions={[
          { label: 'Log this decision →', onClick: () => setModalOpen(true), primary: true },
          { label: 'Open in Ask Ariya', onClick: openInAskAriya },
          { label: 'Trace evidence', onClick: () => navigate('/source-confidence'), tone: 'quiet' },
        ]}
      />

      <LogDecisionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        draft={draft}
        onLogged={() => navigate('/decision-log?from=scenario-planner')}
      />
    </div>
  );
}
