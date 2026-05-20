import { useEffect, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useDemoMode } from '../../context/DemoModeContext';
import { demoSteps } from '../../data/scenario';

const NAVY = '#050A44';
const NAVY_2 = '#0B1646';

const overlayStyle: CSSProperties = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  width: 340,
  background: NAVY,
  color: '#ffffff',
  borderRadius: 14,
  padding: '16px 18px 14px',
  zIndex: 90,
  boxShadow: '0 18px 40px rgba(5,10,68,0.32), 0 4px 8px rgba(5,10,68,0.18)',
  fontFamily: 'inherit',
};

const eyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
};

const stepLabelStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  marginTop: 8,
  lineHeight: 1.35,
};

const hintStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 400,
  color: 'rgba(255,255,255,0.85)',
  marginTop: 6,
  lineHeight: 1.5,
};

const footerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 14,
  gap: 8,
  flexWrap: 'wrap',
};

const quietBtnStyle = (disabled: boolean): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  background: 'transparent',
  border: 'none',
  color: disabled ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.85)',
  fontSize: 12,
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'inherit',
  padding: '4px 6px',
});

const primaryBtnStyle = (disabled: boolean): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 30,
  padding: '0 14px',
  borderRadius: 999,
  background: disabled ? 'rgba(255,255,255,0.20)' : '#ffffff',
  border: 'none',
  color: disabled ? 'rgba(255,255,255,0.55)' : NAVY,
  fontSize: 12,
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'inherit',
});

const exitBtnStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'rgba(255,255,255,0.55)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 4,
  borderRadius: 6,
  fontFamily: 'inherit',
};

const progressBarStyle: CSSProperties = {
  marginTop: 12,
  height: 3,
  borderRadius: 999,
  background: NAVY_2,
  overflow: 'hidden',
};

const progressFillStyle = (pct: number): CSSProperties => ({
  height: '100%',
  width: `${pct}%`,
  background: '#ffffff',
  borderRadius: 999,
  transition: 'width 200ms ease',
});

export function DemoOverlay() {
  const { demoMode, setDemoMode, currentStep, next, back, setStepCap } = useDemoMode();
  const navigate = useNavigate();
  const location = useLocation();

  const total = demoSteps.length;
  const clampedIdx = Math.max(0, Math.min(total - 1, currentStep));
  const step = demoSteps[clampedIdx];

  // Keep the context's stepCap in sync with the actual demoSteps length.
  useEffect(() => {
    setStepCap(total - 1);
  }, [total, setStepCap]);

  // Navigate when currentStep changes while in demo mode.
  useEffect(() => {
    if (!demoMode) return;
    if (location.pathname !== step.route) {
      navigate(step.route);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode, currentStep]);

  if (!demoMode) return null;

  const atStart = clampedIdx === 0;
  const atEnd = clampedIdx === total - 1;

  const handleNext = () => {
    if (atEnd) return;
    next();
  };

  const handleBack = () => {
    if (atStart) return;
    back();
  };

  const handleExit = () => {
    setDemoMode(false);
  };

  const progressPct = ((clampedIdx + 1) / total) * 100;

  return (
    <div style={overlayStyle} role="dialog" aria-label="Demo mode tour">
      <div style={eyebrowStyle}>
        <span>Demo mode · Step {clampedIdx + 1} of {total}</span>
        <button
          type="button"
          onClick={handleExit}
          style={exitBtnStyle}
          aria-label="Exit demo mode"
          title="Exit demo"
        >
          <X size={14} />
        </button>
      </div>
      <div style={stepLabelStyle}>{step.label}</div>
      <p style={hintStyle}>{step.hint}</p>
      <div style={progressBarStyle} aria-hidden>
        <div style={progressFillStyle(progressPct)} />
      </div>
      <div style={footerStyle}>
        <button
          type="button"
          onClick={handleBack}
          disabled={atStart}
          style={quietBtnStyle(atStart)}
        >
          <ArrowLeft size={12} strokeWidth={2.5} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={handleExit}
            style={quietBtnStyle(false)}
          >
            Exit demo
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={atEnd}
            style={primaryBtnStyle(atEnd)}
          >
            {atEnd ? 'Done' : 'Next'} <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
