import { useEffect, useState } from 'react';

/**
 * Persist a value to localStorage under a namespaced key.
 * Reads on init, writes on every change. Falls back to `initial` on parse error.
 */
export function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // quota / serialization failure — ignore silently
    }
  }, [key, value]);

  return [value, setValue] as const;
}
