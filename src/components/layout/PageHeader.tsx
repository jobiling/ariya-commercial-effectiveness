import type { CSSProperties } from 'react';

const NAVY_55 = 'rgba(5,10,68,0.55)';

const subtitleStyle: CSSProperties = {
  fontSize: 14,
  color: NAVY_55,
  maxWidth: 760,
  lineHeight: 1.5,
};

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header>
      <h1 className="text-gradient text-[28px] font-bold leading-tight mb-2">{title}</h1>
      <p style={subtitleStyle} className="text-sm">
        {subtitle}
      </p>
    </header>
  );
}
