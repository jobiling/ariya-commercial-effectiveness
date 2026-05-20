import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { usePersistedState } from './usePersistedState';

export type ScenarioId = 'base' | 'bull' | 'bear';

export interface ScenarioState {
  scenario: ScenarioId;
  market: string;
}

interface ScenarioContextValue extends ScenarioState {
  setScenario: (id: ScenarioId) => void;
  setMarket: (m: string) => void;
}

const STORAGE_KEY = 'ariya.ce.scenario';

const DEFAULT_STATE: ScenarioState = {
  scenario: 'base',
  market: 'global',
};

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = usePersistedState<ScenarioState>(STORAGE_KEY, DEFAULT_STATE);

  const value = useMemo<ScenarioContextValue>(
    () => ({
      ...state,
      setScenario: (scenario) => setState((s) => ({ ...s, scenario })),
      setMarket: (market) => setState((s) => ({ ...s, market })),
    }),
    [state, setState],
  );

  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>;
}

export function useScenario(): ScenarioContextValue {
  const ctx = useContext(ScenarioContext);
  if (!ctx) throw new Error('useScenario must be used within <ScenarioProvider>');
  return ctx;
}
