import type { CSSProperties } from 'react';
import { Play } from 'lucide-react';
import { useDemoMode } from '../../context/DemoModeContext';

const headerStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 240,
  right: 0,
  height: 64,
  background: 'var(--color-ariya-surface)',
  borderBottom: '1px solid var(--color-ariya-line)',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  zIndex: 20,
};

const spacerStyle: CSSProperties = { flex: 1 };

const demoToggleBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 32,
  padding: '0 12px',
  borderRadius: 999,
  border: '1px solid var(--color-ariya-line)',
  background: 'var(--color-ariya-surface)',
  color: 'var(--color-ariya-muted)',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
};

const demoToggleActiveStyle: CSSProperties = {
  background: '#0055BB',
  borderColor: '#0055BB',
  color: '#ffffff',
};

export function Header() {
  const { demoMode, toggleDemoMode } = useDemoMode();

  return (
    <header style={headerStyle} data-tour="header">
      <div style={spacerStyle} />

      <button
        type="button"
        onClick={toggleDemoMode}
        aria-pressed={demoMode}
        style={{
          ...demoToggleBaseStyle,
          ...(demoMode ? demoToggleActiveStyle : null),
        }}
        data-tour="demo-mode"
      >
        <Play size={12} />
        {demoMode ? 'Demo Mode · On' : 'Demo Mode'}
      </button>
    </header>
  );
}
