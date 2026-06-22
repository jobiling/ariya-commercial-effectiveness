import { useState, type CSSProperties } from 'react';
import { Bell, Mail, MessageSquare, Monitor } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { alerts, markets } from '../data/scenario';
import type { AlertChannelId, AlertStatus, SignalTone } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 26,
  paddingBottom: 56,
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 12,
};

const cardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 20,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const CHANNEL_ICON: Record<AlertChannelId, typeof Bell> = {
  'in-system': Monitor,
  email: Mail,
  teams: MessageSquare,
};

const CHANNEL_LABEL: Record<AlertChannelId, string> = {
  'in-system': 'In-system',
  email: 'Email',
  teams: 'Teams',
};

// ── Channel config ──
const channelGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 14,
};

const channelCardStyle = (on: boolean): CSSProperties => ({
  ...cardStyle,
  borderColor: on ? 'rgba(0,85,187,0.35)' : NAVY_12,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

const channelHeadStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const channelIconWrapStyle = (on: boolean): CSSProperties => ({
  width: 34,
  height: 34,
  borderRadius: 9,
  background: on ? '#EAF1FB' : NAVY_06,
  color: on ? BLUE : NAVY_55,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

// Toggle switch
const switchStyle = (on: boolean): CSSProperties => ({
  width: 40,
  height: 22,
  borderRadius: 999,
  background: on ? BLUE : 'rgba(5,10,68,0.18)',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  flexShrink: 0,
  transition: 'background 140ms ease',
  marginLeft: 'auto',
});

const knobStyle = (on: boolean): CSSProperties => ({
  position: 'absolute',
  top: 2,
  left: on ? 20 : 2,
  width: 18,
  height: 18,
  borderRadius: 999,
  background: '#ffffff',
  transition: 'left 140ms ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
});

// ── Rules ──
const STATUS_PILL: Record<AlertStatus, { bg: string; fg: string }> = {
  Triggered: { bg: '#FEF2F2', fg: '#B91C1C' },
  Armed: { bg: '#EAF1FB', fg: BLUE },
  Snoozed: { bg: NAVY_06, fg: NAVY_55 },
};

const ruleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '14px 16px',
  borderBottom: `1px solid ${NAVY_06}`,
  flexWrap: 'wrap',
};

const chipStyle: CSSProperties = {
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

const statusPillStyle = (s: AlertStatus): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '3px 10px',
  borderRadius: 999,
  background: STATUS_PILL[s].bg,
  color: STATUS_PILL[s].fg,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap',
});

// ── Feed ──
const TONE_BORDER: Record<SignalTone, string> = {
  'on-track': '#16A34A',
  watch: '#F59E0B',
  'at-risk': '#E11D48',
  urgent: '#E11D48',
};

const feedItemStyle = (tone: SignalTone): CSSProperties => ({
  ...cardStyle,
  borderLeft: `4px solid ${TONE_BORDER[tone]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const lowConfChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 9px',
  borderRadius: 999,
  background: '#FFFBEB',
  color: '#92400E',
  fontSize: 11,
  fontWeight: 700,
  border: '1px solid rgba(245,158,11,0.35)',
  whiteSpace: 'nowrap',
};

function ChannelChips({ channels }: { channels: readonly AlertChannelId[] }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {channels.map((c) => {
        const Icon = CHANNEL_ICON[c];
        return (
          <span key={c} style={chipStyle}>
            <Icon size={11} strokeWidth={2.25} />
            {CHANNEL_LABEL[c]}
          </span>
        );
      })}
    </div>
  );
}

export default function Alerts() {
  // Local toggle state, seeded from the data. Illustrative only.
  const [channelOn, setChannelOn] = useState<Record<AlertChannelId, boolean>>(() =>
    alerts.channels.reduce(
      (acc, c) => ({ ...acc, [c.id]: c.on }),
      {} as Record<AlertChannelId, boolean>,
    ),
  );

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Alerts and Notifications"
        subtitle="What should reach you, where, and when. Ariya watches while you are elsewhere."
      />

      {/* Channels */}
      <section>
        <div style={sectionLabelStyle}>Channels</div>
        <div style={channelGridStyle}>
          {alerts.channels.map((c) => {
            const Icon = CHANNEL_ICON[c.id];
            const on = channelOn[c.id];
            return (
              <div key={c.id} style={channelCardStyle(on)}>
                <div style={channelHeadStyle}>
                  <span style={channelIconWrapStyle(on)}>
                    <Icon size={17} strokeWidth={2} />
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{c.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={`Toggle ${c.label}`}
                    style={switchStyle(on)}
                    onClick={() => setChannelOn((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                  >
                    <span style={knobStyle(on)} />
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: NAVY_70, lineHeight: 1.5 }}>{c.description}</p>
                <span style={{ fontSize: 11, fontWeight: 700, color: on ? BLUE : NAVY_55 }}>
                  {on ? 'On' : 'Off'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rules */}
      <section>
        <div style={sectionLabelStyle}>Rules</div>
        <div style={{ ...cardStyle, padding: 0 }}>
          {alerts.rules.map((r, i) => (
            <div
              key={r.id}
              style={{ ...ruleRowStyle, borderBottom: i === alerts.rules.length - 1 ? 'none' : ruleRowStyle.borderBottom }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{r.condition}</div>
              </div>
              <ChannelChips channels={r.channels} />
              <span style={statusPillStyle(r.status)}>{r.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent feed */}
      <section>
        <div style={sectionLabelStyle}>Recent alerts</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alerts.feed.map((f) => {
            const market = markets.find((m) => m.id === f.marketId);
            return (
              <article key={f.id} style={feedItemStyle(f.tone)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Bell size={14} strokeWidth={2.25} color={TONE_BORDER[f.tone]} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{f.title}</span>
                  </div>
                  <span style={{ fontSize: 12, color: NAVY_55, fontVariantNumeric: 'tabular-nums' }}>
                    {market?.flag} {market?.name} · {f.timestamp}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: NAVY_70, lineHeight: 1.55 }}>{f.body}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <ChannelChips channels={f.channels} />
                  {f.confidence === 'Low' && <span style={lowConfChipStyle}>Low confidence</span>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
