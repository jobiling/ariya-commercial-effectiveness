import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { decisionLog as seed } from '../data/scenario';
import type { DecisionLogEntry } from '../data/scenario';

interface DecisionLogContextValue {
  entries: DecisionLogEntry[];
  // Id of the most recently appended entry, for the LAVENDER flash highlight.
  recentlyAddedId: string | null;
  addEntry: (entry: Omit<DecisionLogEntry, 'id'>) => string;
  markReviewed: (id: string) => void;
  // Called by the Decision Log page to dismiss the flash highlight.
  clearRecentlyAdded: () => void;
}

const DecisionLogContext = createContext<DecisionLogContextValue | null>(null);

function nextId(existing: readonly DecisionLogEntry[]): string {
  // Find the highest numeric suffix on ids of the form 'd-NNN'. Default to 1.
  let max = 0;
  for (const e of existing) {
    const match = /^d-(\d+)$/.exec(e.id);
    if (match) {
      const n = Number(match[1]);
      if (n > max) max = n;
    }
  }
  return `d-${String(max + 1).padStart(3, '0')}`;
}

export function DecisionLogProvider({ children }: { children: ReactNode }) {
  // Seed the in-memory log with the four scripted entries from scenario.ts.
  const [entries, setEntries] = useState<DecisionLogEntry[]>(() => [...seed]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const addEntry = useCallback(
    (entry: Omit<DecisionLogEntry, 'id'>): string => {
      const id = nextId(entries);
      const next: DecisionLogEntry = { id, ...entry };
      setEntries((prev) => [next, ...prev]); // newest first
      setRecentlyAddedId(id);
      // Auto-clear the flash after 6 seconds.
      setTimeout(() => {
        setRecentlyAddedId((curr) => (curr === id ? null : curr));
      }, 6000);
      return id;
    },
    [entries],
  );

  const markReviewed = useCallback((id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Verified' as const } : e)),
    );
  }, []);

  const clearRecentlyAdded = useCallback(() => setRecentlyAddedId(null), []);

  const value = useMemo<DecisionLogContextValue>(
    () => ({ entries, recentlyAddedId, addEntry, markReviewed, clearRecentlyAdded }),
    [entries, recentlyAddedId, addEntry, markReviewed, clearRecentlyAdded],
  );

  return <DecisionLogContext.Provider value={value}>{children}</DecisionLogContext.Provider>;
}

export function useDecisionLog(): DecisionLogContextValue {
  const ctx = useContext(DecisionLogContext);
  if (!ctx) throw new Error('useDecisionLog must be used within <DecisionLogProvider>');
  return ctx;
}
