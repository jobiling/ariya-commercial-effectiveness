import { useEffect, useRef, useState } from 'react';

interface TypewriterOptions {
  // Milliseconds per character. Default 25.
  speed?: number;
  // Whether to start streaming immediately. Default true.
  enabled?: boolean;
}

interface TypewriterResult {
  text: string;
  done: boolean;
}

/**
 * Reveal the source string one character at a time. When `source` changes the
 * stream restarts from the beginning. Used by Ask Ariya to stream the
 * recommended-action headline at ~25ms per character.
 */
export function useTypewriter(source: string, options: TypewriterOptions = {}): TypewriterResult {
  const { speed = 25, enabled = true } = options;
  const [text, setText] = useState(enabled ? '' : source);
  const [done, setDone] = useState(!enabled);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setText(source);
      setDone(true);
      return;
    }
    indexRef.current = 0;
    setText('');
    setDone(false);
    if (!source) {
      setDone(true);
      return;
    }
    const timer = window.setInterval(() => {
      indexRef.current += 1;
      const next = source.slice(0, indexRef.current);
      setText(next);
      if (indexRef.current >= source.length) {
        window.clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(timer);
  }, [source, speed, enabled]);

  return { text, done };
}
