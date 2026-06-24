import { NavLink } from 'react-router-dom';
import type { CSSProperties } from 'react';
import {
  Activity,
  Bell,
  Compass,
  Eye,
  LineChart,
  Sunrise,
  TrendingUp,
  Target,
  Users,
  GitBranch,
  Sparkles,
  BookOpen,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

// Presentation grouping only. Routes, icons, labels, and item order are
// unchanged. Headers are labels, not links.
const CE_NAV_GROUPS = [
  {
    header: 'Cockpit',
    items: [
      { to: '/', label: 'GM Home', icon: Compass },
      { to: '/morning-briefing', label: 'Morning Briefing', icon: Sunrise },
    ],
  },
  {
    header: 'Performance',
    items: [
      { to: '/market-performance', label: 'Market Performance', icon: TrendingUp },
      { to: '/investment-radar', label: 'Investment Radar', icon: Target },
    ],
  },
  {
    header: 'Execution',
    items: [
      { to: '/execution-signals', label: 'Veeva Execution Screening', icon: Activity },
      { to: '/customer-account-focus', label: 'Customer and Account Focus', icon: Users },
      { to: '/training-to-sales', label: 'Training Activation Signal', icon: LineChart },
    ],
  },
  {
    header: 'Decision support',
    items: [
      { to: '/scenario-planner', label: 'Scenario Planner', icon: GitBranch },
      { to: '/ask-ariya', label: 'Ask Ariya', icon: Sparkles },
    ],
  },
  {
    header: 'Monitoring',
    items: [
      { to: '/alerts', label: 'Alerts and Notifications', icon: Bell },
      { to: '/otx-watchlist', label: 'OTx Watchlist', icon: Eye },
    ],
  },
  {
    header: 'Governance',
    items: [
      { to: '/decision-log', label: 'Decision Log', icon: BookOpen },
      { to: '/source-confidence', label: 'Source Confidence', icon: ShieldCheck },
    ],
  },
] as const;

const sidebarStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: 240,
  background: 'var(--color-ariya-navy)',
  color: '#fff',
  padding: '20px 12px 16px',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 30,
  overflow: 'hidden',
};

const brandWrapStyle: CSSProperties = {
  padding: '4px 8px 4px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 6,
  marginBottom: 12,
};

const brandImgStyle: CSSProperties = {
  width: 124,
  height: 'auto',
  display: 'block',
  filter: 'brightness(0) invert(1)',
};

const brandSubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.55)',
  fontWeight: 500,
  letterSpacing: '0.01em',
};

const navStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
};

// Section header · reuses the sidebar eyebrow treatment. Labels only, not
// clickable. 18px of space above each header except the first.
const groupHeaderStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'rgba(255,255,255,0.45)',
  padding: '0 14px',
  marginTop: 10,
  marginBottom: 2,
};

const groupHeaderFirstStyle: CSSProperties = {
  ...groupHeaderStyle,
  marginTop: 0,
};

const linkBaseStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '7px 14px',
  borderRadius: 10,
  color: 'rgba(255,255,255,0.82)',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
  transition: 'background 120ms ease, color 120ms ease',
};

const linkActiveStyle: CSSProperties = {
  background: '#FFFFFF',
  color: '#050A44',
  fontWeight: 600,
  boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
};

const footerStyle: CSSProperties = {
  borderTop: '1px solid rgba(255,255,255,0.08)',
  paddingTop: 12,
  marginTop: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const resetBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 14px',
  borderRadius: 10,
  background: 'transparent',
  border: 'none',
  color: 'rgba(255,255,255,0.7)',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
};

const AUTH_KEYS_TO_PRESERVE: readonly string[] = ['ariya.auth.session'];

function resetDemo() {
  if (typeof window === 'undefined') return;
  const preserved: Record<string, string | null> = {};
  for (const key of AUTH_KEYS_TO_PRESERVE) {
    preserved[key] = window.localStorage.getItem(key);
  }
  window.localStorage.clear();
  for (const [key, value] of Object.entries(preserved)) {
    if (value != null) window.localStorage.setItem(key, value);
  }
  window.location.assign('/');
}

export function Sidebar() {
  return (
    <aside style={sidebarStyle}>
      <div style={brandWrapStyle}>
        <img src="/ariya-logo.png" alt="Ariya by phamax" style={brandImgStyle} />
        <div style={brandSubtitleStyle}>Commercial Effectiveness</div>
      </div>

      <nav style={navStyle}>
        {CE_NAV_GROUPS.map((group, groupIdx) => (
          <div key={group.header}>
            <div style={groupIdx === 0 ? groupHeaderFirstStyle : groupHeaderStyle} aria-hidden>
              {group.header}
            </div>
            {group.items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  ...linkBaseStyle,
                  ...(isActive ? linkActiveStyle : null),
                })}
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div style={footerStyle}>
        {/* Pilot proposal nav item hidden for the DACH re-skin (Stage 1). */}
        <button type="button" onClick={resetDemo} style={resetBtnStyle}>
          <RefreshCw size={15} />
          Reset demo
        </button>
      </div>
    </aside>
  );
}
