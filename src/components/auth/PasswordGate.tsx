import { useState, type CSSProperties, type FormEvent } from 'react';

// Demo access gate. Not real security: the password is checked client-side and
// a flag is stored in localStorage so it is asked only once per browser. The
// flag is preserved by Reset demo (AUTH_KEYS_TO_PRESERVE in the Sidebar).
const AUTH_KEY = 'ariya.auth.session';
const PASSWORD = 'merzdemo2026';

export function isAuthed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(AUTH_KEY) === 'unlocked';
  } catch {
    return false;
  }
}

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_12 = 'rgba(5,10,68,0.12)';

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'var(--color-ariya-bg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
};

const cardStyle: CSSProperties = {
  width: '100%',
  maxWidth: 380,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 16,
  boxShadow: '0 12px 40px rgba(5,10,68,0.12)',
  padding: '32px 30px 26px',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

const brandRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const logoStyle: CSSProperties = {
  width: 110,
  height: 'auto',
  display: 'block',
};

const subtitleStyle: CSSProperties = {
  fontSize: 12,
  color: NAVY_55,
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: NAVY_55,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
  display: 'block',
};

const inputStyle = (error: boolean): CSSProperties => ({
  width: '100%',
  height: 44,
  padding: '0 14px',
  borderRadius: 10,
  border: `1px solid ${error ? '#E11D48' : NAVY_12}`,
  background: '#ffffff',
  color: NAVY,
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
});

const btnStyle: CSSProperties = {
  width: '100%',
  height: 44,
  borderRadius: 10,
  border: 'none',
  background: NAVY,
  color: '#ffffff',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const errorStyle: CSSProperties = {
  fontSize: 12.5,
  color: '#E11D48',
  fontWeight: 600,
  margin: 0,
};

const footerStyle: CSSProperties = {
  fontSize: 11,
  color: NAVY_55,
  textAlign: 'center',
  marginTop: 2,
};

export function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      try {
        window.localStorage.setItem(AUTH_KEY, 'unlocked');
      } catch {
        // ignore storage failures; still unlock for this session
      }
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div style={overlayStyle}>
      <form style={cardStyle} onSubmit={submit}>
        <div style={brandRowStyle}>
          <img src="/ariya-logo.png" alt="Ariya by phamax" style={logoStyle} />
          <span style={subtitleStyle}>Commercial Effectiveness</span>
        </div>

        <h1 style={headingStyle}>Enter access password</h1>

        <div>
          <label htmlFor="gate-pw" style={labelStyle}>Password</label>
          <input
            id="gate-pw"
            type="password"
            value={value}
            autoFocus
            autoComplete="off"
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(false);
            }}
            style={inputStyle(error)}
            aria-invalid={error}
            placeholder="••••••••"
          />
          {error && <p style={{ ...errorStyle, marginTop: 8 }}>Incorrect password. Please try again.</p>}
        </div>

        <button type="submit" style={btnStyle}>Enter</button>

        <div style={footerStyle}>Illustrative demo · v0.1</div>
      </form>
    </div>
  );
}
