import { Fragment, type CSSProperties } from 'react';
import { ChevronRight, Check, Flag, AlertTriangle, Clock } from 'lucide-react';
import type { Status } from '../../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const CANVAS = '#F7F8FC';
const GREEN = '#16A34A';
const AMBER = '#F59E0B';

interface NodeStatusStyle {
  border: string;
  iconBg: string;
  iconColor: string;
  Icon: typeof Check;
  pillText: string;
}

const NODE_STYLES: Record<Status, NodeStatusStyle> = {
  'Verified': {
    border: NAVY_12,
    iconBg: '#D1FAE5',
    iconColor: GREEN,
    Icon: Check,
    pillText: 'Verified',
  },
  'On Track': {
    border: NAVY_12,
    iconBg: '#D1FAE5',
    iconColor: GREEN,
    Icon: Check,
    pillText: 'On Track',
  },
  'Watch': {
    border: '#FCD34D',
    iconBg: '#FEF3C7',
    iconColor: AMBER,
    Icon: AlertTriangle,
    pillText: 'Watch',
  },
  'At Risk': {
    border: AMBER,
    iconBg: '#FEF3C7',
    iconColor: AMBER,
    Icon: AlertTriangle,
    pillText: 'At Risk',
  },
  'Decision Taken': {
    border: NAVY_12,
    iconBg: '#D1FAE5',
    iconColor: GREEN,
    Icon: Check,
    pillText: 'Decision Taken',
  },
  'Pending': {
    border: NAVY_12,
    iconBg: NAVY_06,
    iconColor: NAVY_55,
    Icon: Clock,
    pillText: 'Pending',
  },
  'Active': {
    border: NAVY_12,
    iconBg: '#E0E7FF',
    iconColor: '#3730A3',
    Icon: Clock,
    pillText: 'Active',
  },
};

const containerStyle: CSSProperties = {
  background: CANVAS,
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 16,
  display: 'flex',
  alignItems: 'stretch',
  gap: 6,
  flexWrap: 'wrap',
};

const nodeStyle = (
  status: Status,
  isEndpoint: boolean,
): CSSProperties => {
  const s = NODE_STYLES[status];
  return {
    position: 'relative',
    flex: 1,
    minWidth: 140,
    background: '#ffffff',
    border: `${isEndpoint ? 2 : 1}px solid ${isEndpoint ? s.border : NAVY_12}`,
    borderRadius: 10,
    padding: '14px 14px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  };
};

const endpointLabelStyle = (status: Status): CSSProperties => {
  const s = NODE_STYLES[status];
  return {
    position: 'absolute',
    top: -10,
    left: 12,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 999,
    background: s.border,
    color: status === 'At Risk' || status === 'Watch' ? '#7C2D12' : '#ffffff',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  };
};

const iconBadgeStyle = (status: Status): CSSProperties => ({
  width: 26,
  height: 26,
  borderRadius: 999,
  background: NODE_STYLES[status].iconBg,
  color: NODE_STYLES[status].iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const nodeLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.3,
};

const statusPillStyle = (status: Status): CSSProperties => {
  const s = NODE_STYLES[status];
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 999,
    background: s.iconBg,
    color: s.iconColor,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.04em',
    alignSelf: 'flex-start',
  };
};

const chevronCellStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: NAVY_70,
  width: 14,
  flexShrink: 0,
};

export interface CriticalPathNode {
  node: string;
  status: Status;
}

export interface CriticalPathChainProps {
  nodes: readonly CriticalPathNode[];
  // If set, marks this node index as the endpoint (gets the colored border + "Endpoint" flag).
  endpointIndex?: number;
}

export function CriticalPathChain({ nodes, endpointIndex }: CriticalPathChainProps) {
  // Default: highlight the first node whose status is At Risk or Watch.
  const inferredEndpoint =
    endpointIndex ?? nodes.findIndex((n) => n.status === 'At Risk' || n.status === 'Watch');

  return (
    <div style={containerStyle} role="list" aria-label="Operational chain">
      {nodes.map((n, idx) => {
        const s = NODE_STYLES[n.status];
        const NodeIcon = s.Icon;
        const isEndpoint = idx === inferredEndpoint;
        return (
          <Fragment key={n.node}>
            <div
              style={nodeStyle(n.status, isEndpoint)}
              role="listitem"
              aria-label={`${n.node} · ${n.status}`}
            >
              {isEndpoint && (
                <span style={endpointLabelStyle(n.status)}>
                  <Flag size={9} strokeWidth={3} /> Endpoint
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={iconBadgeStyle(n.status)} aria-hidden>
                  <NodeIcon size={14} strokeWidth={2.5} />
                </div>
                <div style={nodeLabelStyle}>{n.node}</div>
              </div>
              <span style={statusPillStyle(n.status)}>{s.pillText}</span>
            </div>
            {idx < nodes.length - 1 && (
              <div style={chevronCellStyle} aria-hidden>
                <ChevronRight size={18} />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
