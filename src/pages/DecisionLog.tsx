import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Check, ChevronDown, ChevronUp, Clock, RotateCcw } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterDropdown } from '../components/composites';
import type { FilterOption } from '../components/composites';
import { useDecisionLog } from '../context/DecisionLogContext';
import type { Status } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const LAVENDER = '#E8EAF6';

// Statuses that actually make sense on a decision log entry. The execution-related
// statuses (Watch, At Risk) belong to Execution Signals, not here. We keep them in
// the type for compatibility but map them to a sensible decision-log status if seen.
const STATUS_COLORS: Record<Status, { bg: string; fg: string }> = {
  'Active': { bg: '#E0E7FF', fg: '#3730A3' },
  'On Track': { bg: '#D1FAE5', fg: '#065F46' },
  'Verified': { bg: '#DCFCE7', fg: '#14532D' },
  'Decision Taken': { bg: '#D1FAE5', fg: '#065F46' },
  'Pending': { bg: NAVY_06, fg: NAVY_70 },
  // The two below should not appear on a decision; mapped defensively to Active styling.
  'Watch': { bg: '#E0E7FF', fg: '#3730A3' },
  'At Risk': { bg: '#E0E7FF', fg: '#3730A3' },
};

const STATUS_DISPLAY: Partial<Record<Status, string>> = {
  // Defensive remap: an old "At Risk" or "Watch" decision shows as "Active".
  'Watch': 'Active',
  'At Risk': 'Active',
};

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  paddingBottom: 48,
};

const cardStyle = (highlighted: boolean, expanded: boolean): CSSProperties => ({
  background: highlighted ? LAVENDER : '#ffffff',
  border: `1px solid ${highlighted ? '#C7D2FE' : NAVY_12}`,
  borderRadius: 12,
  padding: 0,
  boxShadow: expanded
    ? '0 6px 18px rgba(5,10,68,0.10), 0 1px 2px rgba(5,10,68,0.04)'
    : '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  flexDirection: 'column',
  transition: 'background 800ms ease, border-color 800ms ease, box-shadow 200ms ease',
  overflow: 'hidden',
});

const summaryStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 18,
};

const dateRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap',
  fontSize: 12,
  color: NAVY_55,
};

const decisionStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.4,
  margin: 0,
};

const metaRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  fontSize: 12,
  color: NAVY_70,
};

const statusPillStyle = (status: Status): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: 999,
  background: STATUS_COLORS[status].bg,
  color: STATUS_COLORS[status].fg,
  fontSize: 11,
  fontWeight: 700,
});

const toggleRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0 18px 12px',
};

const toggleBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  background: 'transparent',
  border: 'none',
  color: NAVY_70,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  padding: '4px 8px',
  borderRadius: 6,
};

const detailsWrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: '4px 18px 20px',
  borderTop: `1px solid ${NAVY_06}`,
  paddingTop: 16,
};

const calloutBaseStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '12px 14px',
  borderRadius: 10,
  fontSize: 13,
  lineHeight: 1.5,
};

const assumptionCalloutStyle: CSSProperties = {
  ...calloutBaseStyle,
  background: '#EEF2FF',
  border: '1px solid #C7D2FE',
  borderLeft: '3px solid #6366F1',
  color: NAVY,
};

const revisitCalloutStyle: CSSProperties = {
  ...calloutBaseStyle,
  background: '#F5F3FF',
  border: '1px solid #DDD6FE',
  borderLeft: '3px solid #8B5CF6',
  color: NAVY,
};

const calloutLabelStyle: CSSProperties = {
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: NAVY,
  marginRight: 6,
};

const subSectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 6,
};

const evidenceChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY_70,
  fontSize: 11,
  fontWeight: 600,
};

const alternativeCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 8,
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const alternativeTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.4,
};

const alternativeRejectedStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_70,
  lineHeight: 1.5,
};

const rejectedLabelStyle: CSSProperties = {
  display: 'inline-block',
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#9F1239',
  background: '#FEE2E2',
  padding: '2px 7px',
  borderRadius: 4,
  marginRight: 8,
};

const actionRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: 6,
  padding: '8px 0',
  fontSize: 13,
  lineHeight: 1.5,
  borderBottom: `1px solid ${NAVY_06}`,
};

const actionLastRowStyle: CSSProperties = {
  ...actionRowStyle,
  borderBottom: 'none',
};

const dotSepStyle: CSSProperties = {
  color: NAVY_55,
  fontWeight: 700,
  margin: '0 2px',
};

const filterRowWrapStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
};

const filterCountStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
};

const markReviewedBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 30,
  padding: '0 14px',
  borderRadius: 8,
  background: '#065F46',
  border: 'none',
  color: '#ffffff',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  alignSelf: 'flex-start',
};

const markReviewedDoneStyle: CSSProperties = {
  ...markReviewedBtnStyle,
  background: '#DCFCE7',
  color: '#14532D',
  cursor: 'default',
};

// Only the statuses that make sense on a decision log entry. Execution-related
// statuses (Watch, At Risk) belong on Execution Signals, not here.
const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'On Track', label: 'On Track' },
  { value: 'Decision Taken', label: 'Decision Taken' },
  { value: 'Verified', label: 'Verified' },
  { value: 'Pending', label: 'Pending' },
];

export default function DecisionLog() {
  const { entries, recentlyAddedId, clearRecentlyAdded, markReviewed } = useDecisionLog();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!recentlyAddedId) return;
    const t = setTimeout(() => clearRecentlyAdded(), 6500);
    return () => clearTimeout(t);
  }, [recentlyAddedId, clearRecentlyAdded]);

  const filteredEntries = useMemo(() => {
    if (statusFilter.size === 0) return entries;
    return entries.filter((e) => {
      const displayed = (STATUS_DISPLAY[e.status] ?? e.status) as string;
      return statusFilter.has(displayed);
    });
  }, [entries, statusFilter]);

  const statusOptionsWithCounts: FilterOption[] = useMemo(
    () =>
      STATUS_FILTER_OPTIONS.map((opt) => ({
        ...opt,
        count: entries.filter((e) => {
          const displayed = (STATUS_DISPLAY[e.status] ?? e.status) as string;
          return displayed === opt.value;
        }).length,
      })),
    [entries],
  );

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Decision Log"
        subtitle="What has been decided, by whom, on what evidence, and when each decision should be revisited."
      />

      <div style={filterRowWrapStyle}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <FilterDropdown
            label="Status"
            options={statusOptionsWithCounts}
            selected={statusFilter}
            onApply={setStatusFilter}
            searchable={false}
          />
          {statusFilter.size > 0 && (
            <button
              type="button"
              onClick={() => setStatusFilter(new Set())}
              style={{
                background: 'transparent',
                border: 'none',
                color: NAVY_70,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
                fontFamily: 'inherit',
                padding: 0,
              }}
            >
              Clear
            </button>
          )}
        </div>
        <div style={filterCountStyle}>
          {filteredEntries.length} of {entries.length} decisions shown · newest first
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredEntries.map((e) => {
          const highlighted = e.id === recentlyAddedId;
          const expanded = expandedId === e.id;
          const displayedStatus = (STATUS_DISPLAY[e.status] ?? e.status) as string;

          return (
            <article key={e.id} style={cardStyle(highlighted, expanded)}>
              <div style={summaryStyle}>
                <div style={dateRowStyle}>
                  <span style={{ fontWeight: 700, color: NAVY }}>{e.date}</span>
                  <span style={statusPillStyle(e.status)}>{displayedStatus}</span>
                </div>
                <h3 style={decisionStyle}>{e.decision}</h3>
                <div style={metaRowStyle}>
                  <span>
                    <strong style={{ color: NAVY, fontWeight: 700 }}>Owner:</strong> {e.owner}
                  </span>
                  <span style={{ color: NAVY_55, fontWeight: 700 }}>·</span>
                  <span>
                    <strong style={{ color: NAVY, fontWeight: 700 }}>Market and brand:</strong>{' '}
                    {e.marketAndBrand}
                  </span>
                  <span style={{ color: NAVY_55, fontWeight: 700 }}>·</span>
                  <span>
                    <strong style={{ color: NAVY, fontWeight: 700 }}>Follow-up:</strong>{' '}
                    {e.followUpDate}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: NAVY_70, lineHeight: 1.5 }}>
                  <strong style={{ color: NAVY, fontWeight: 700 }}>Expected impact:</strong>{' '}
                  {e.expectedImpact}
                </p>
              </div>

              <div style={toggleRowStyle}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : e.id)}
                  style={toggleBtnStyle}
                  aria-expanded={expanded}
                >
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {expanded ? 'Hide details' : 'Show details'}
                </button>
              </div>

              {expanded && (
                <div style={detailsWrapStyle}>
                  {e.alternativesConsidered && e.alternativesConsidered.length > 0 && (
                    <div>
                      <div style={subSectionLabelStyle}>Alternatives considered</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {e.alternativesConsidered.map((alt, i) => (
                          <div key={i} style={alternativeCardStyle}>
                            <div style={alternativeTitleStyle}>{alt.option}</div>
                            <div style={alternativeRejectedStyle}>
                              <span style={rejectedLabelStyle}>Rejected</span>
                              {alt.rejected}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {e.assumptions.length > 0 && (
                    <div>
                      <div style={subSectionLabelStyle}>Assumptions to verify</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {e.assumptions.map((a, i) => (
                          <div key={i} style={assumptionCalloutStyle}>
                            <Clock size={14} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span>
                              <span style={calloutLabelStyle}>Assumption</span>
                              {a}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {e.triggerForReassessment && (
                    <div style={revisitCalloutStyle}>
                      <RotateCcw size={14} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>
                        <span style={calloutLabelStyle}>Revisit if</span>
                        {e.triggerForReassessment}
                      </span>
                    </div>
                  )}

                  {e.evidenceUsed.length > 0 && (
                    <div>
                      <div style={subSectionLabelStyle}>Evidence consulted</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {e.evidenceUsed.map((ev, i) => (
                          <span key={i} style={evidenceChipStyle}>{ev}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {e.actionsAssigned.length > 0 && (
                    <div>
                      <div style={subSectionLabelStyle}>Actions assigned</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {e.actionsAssigned.map((a, i) => (
                          <li
                            key={i}
                            style={i === e.actionsAssigned.length - 1 ? actionLastRowStyle : actionRowStyle}
                          >
                            <span style={{ color: NAVY, fontWeight: 700 }}>{a.action}</span>
                            <span style={dotSepStyle}>·</span>
                            <span style={{ color: NAVY_70 }}>{a.owner}</span>
                            <span style={dotSepStyle}>·</span>
                            <span style={{ color: NAVY_55 }}>Due {a.due}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
                    {e.status === 'Verified' ? (
                      <span style={markReviewedDoneStyle}>
                        <Check size={13} strokeWidth={3} /> Reviewed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markReviewed(e.id)}
                        style={markReviewedBtnStyle}
                      >
                        <Check size={13} strokeWidth={3} /> Mark as reviewed
                      </button>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {filteredEntries.length === 0 && (
          <div
            style={{
              padding: 22,
              textAlign: 'center',
              color: NAVY_55,
              fontSize: 13,
              fontStyle: 'italic',
              background: NAVY_06,
              border: `1px dashed ${NAVY_12}`,
              borderRadius: 10,
            }}
          >
            No decisions match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
