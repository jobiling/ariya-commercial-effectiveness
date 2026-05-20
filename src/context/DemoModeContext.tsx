import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface DemoModeContextValue {
  demoMode: boolean;
  setDemoMode: (on: boolean) => void;
  toggleDemoMode: () => void;
  currentStep: number;
  setCurrentStep: (n: number) => void;
  next: () => void;
  back: () => void;
  // Cap on the step index used by the overlay (length - 1 of demoSteps).
  // The overlay component clamps with its own array length, but we keep the cap in context
  // for the navigation helpers to remain self-contained.
  stepCap: number;
  setStepCap: (n: number) => void;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoModeRaw] = useState(false);
  const [currentStep, setCurrentStepRaw] = useState(0);
  const [stepCap, setStepCap] = useState(7); // 8 steps · zero-indexed cap

  const setDemoMode = useCallback((on: boolean) => {
    setDemoModeRaw(on);
    if (on) setCurrentStepRaw(0);
  }, []);

  const toggleDemoMode = useCallback(() => {
    setDemoModeRaw((v) => {
      const next = !v;
      if (next) setCurrentStepRaw(0);
      return next;
    });
  }, []);

  const setCurrentStep = useCallback((n: number) => {
    setCurrentStepRaw(Math.max(0, Math.min(stepCap, n)));
  }, [stepCap]);

  const next = useCallback(() => {
    setCurrentStepRaw((s) => Math.min(stepCap, s + 1));
  }, [stepCap]);

  const back = useCallback(() => {
    setCurrentStepRaw((s) => Math.max(0, s - 1));
  }, []);

  const value = useMemo<DemoModeContextValue>(
    () => ({
      demoMode,
      setDemoMode,
      toggleDemoMode,
      currentStep,
      setCurrentStep,
      next,
      back,
      stepCap,
      setStepCap,
    }),
    [demoMode, setDemoMode, toggleDemoMode, currentStep, setCurrentStep, next, back, stepCap],
  );

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode(): DemoModeContextValue {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error('useDemoMode must be used within <DemoModeProvider>');
  return ctx;
}
