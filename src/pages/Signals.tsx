import type { CSSProperties } from 'react';
import { SIGNALS } from '../data/signals';

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-ariya-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderBottom: '1px solid var(--color-ariya-line)',
};

const tdStyle: CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid var(--color-ariya-line)',
  verticalAlign: 'top',
};

export default function Signals() {
  return (
    <section className="ariya-card" style={{ overflow: 'hidden' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Signal</th>
            <th style={thStyle}>Source</th>
            <th style={thStyle}>Detected</th>
          </tr>
        </thead>
        <tbody>
          {SIGNALS.map((s) => (
            <tr key={s.id}>
              <td style={tdStyle}>{s.status.toUpperCase()}</td>
              <td style={tdStyle}>
                <div style={{ fontWeight: 600 }}>{s.title}</div>
                <div style={{ color: 'var(--color-ariya-muted)', fontSize: 12 }}>
                  {s.summary}
                </div>
              </td>
              <td style={tdStyle}>{s.source}</td>
              <td style={tdStyle}>{new Date(s.detectedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
