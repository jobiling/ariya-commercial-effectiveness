import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { usePersistedState } from './usePersistedState';

export interface TourState {
  active: boolean;
  stepIndex: number;
  completed: boolean;
}

interface TourContextValue extends TourState {
  start: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  reset: () => void;
}

const STORAGE_KEY = 'ariya.ce.tour';

const DEFAULT_STATE: TourState = {
  active: false,
  stepIndex: 0,
  completed: false,
};

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const [state, setState] = usePersistedState<TourState>(STORAGE_KEY, DEFAULT_STATE);

  const start = useCallback(
    () => setState({ active: true, stepIndex: 0, completed: false }),
    [setState],
  );
  const next = useCallback(
    () => setState((s) => ({ ...s, stepIndex: s.stepIndex + 1 })),
    [setState],
  );
  const prev = useCallback(
    () => setState((s) => ({ ...s, stepIndex: Math.max(0, s.stepIndex - 1) })),
    [setState],
  );
  const stop = useCallback(
    () => setState((s) => ({ ...s, active: false, completed: true })),
    [setState],
  );
  const reset = useCallback(() => setState(DEFAULT_STATE), [setState]);

  const value = useMemo<TourContextValue>(
    () => ({ ...state, start, next, prev, stop, reset }),
    [state, start, next, prev, stop, reset],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within <TourProvider>');
  return ctx;
}
