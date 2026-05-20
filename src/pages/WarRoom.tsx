import type { CSSProperties } from 'react';
import { SIGNALS, type RagStatus } from '../data/signals';
import { DECISIONS } from '../data/decisions';

const pageStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 16,
};

const cardStyle: CSSProperties = { padding: 20 };

const cardTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-ariya-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 12,
};

const RAG_COLORS: Record<RagStatus, { bg: string; fg: string }> = {
  red: { bg: '#fee2e2', fg: 'var(--color-rag-red)' },
  amber: { bg: '#fef3c7', fg: '#92400e' },
  green: { bg: '#dcfce7', fg: '#166534' },
};

function ragPillStyle(status: RagStatus): CSSProperties {
  return { background: RAG_COLORS[status].bg, color: RAG_COLORS[status].fg };
}

const rowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '10px 0',
  borderTop: '1px solid var(--color-ariya-line)',
};

export default function WarRoom() {
  return (
    <div style={pageStyle}>
      <section className="ariya-card" style={cardStyle}>
        <div style={cardTitleStyle}>Live signals</div>
        {SIGNALS.map((s) => (
          <div key={s.id} style={rowStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="ariya-pill" style={ragPillStyle(s.status)}>
                {s.status.toUpperCase()}
              </span>
              <span style={{ fontWeight: 600 }}>{s.title}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-ariya-muted)' }}>
              {s.source} · {new Date(s.detectedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </section>

      <section className="ariya-card" style={cardStyle}>
        <div style={cardTitleStyle}>Open decisions</div>
        {DECISIONS.map((d) => (
          <div key={d.id} style={rowStyle}>
            <div style={{ fontWeight: 600 }}>{d.question}</div>
            <div style={{ fontSize: 12, color: 'var(--color-ariya-muted)' }}>
              {d.owner} · Due {d.dueBy} · {d.status}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
