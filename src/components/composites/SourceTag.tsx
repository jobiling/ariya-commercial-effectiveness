import type { CSSProperties } from 'react';
import { Database } from 'lucide-react';

const NAVY_55 = 'rgba(5,10,68,0.55)';

const wrapStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  color: NAVY_55,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.01em',
};

export interface SourceTagProps {
  label: string;
  withIcon?: boolean;
}

export function SourceTag({ label, withIcon = true }: SourceTagProps) {
  return (
    <span style={wrapStyle}>
      {withIcon && <Database size={11} strokeWidth={2} aria-hidden />}
      {label}
    </span>
  );
}
