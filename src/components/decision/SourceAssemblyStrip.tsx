import type { CSSProperties } from 'react';
import { ArrowRight, BookOpen, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const NAVY = '#050A44';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';

// Two icons are supported via a small string key on the data — keeps
// scenario.ts free of React imports.
const ICONS = {
  Database,
  BookOpen,
} as const;

export type SourceAssemblyIcon = keyof typeof ICONS;

export interface SourceAssemblyItem {
  id: string;
  label: string;
  icon: SourceAssemblyIcon;
}

export interface SourceAssemblyStripProps {
  // Optional override for the "Assembled from" eyebrow.
  eyebrow?: string;
  // Optional override for the bottom sentence.
  reconcileSentence?: string;
  items: readonly SourceAssemblyItem[];
}

const cardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: '20px 24px',
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const eyebrowStyle: CSSProperties = {
  // Blue eyebrow — one of the accent-moment exceptions per CLAUDE.md.
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: BLUE,
  marginBottom: 12,
};

const chipsRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 14,
};

const chipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 999,
  background: NAVY_06,
  color: NAVY,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
};

const reconcileRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  fontWeight: 500,
  color: NAVY,
  lineHeight: 1.4,
};

export function SourceAssemblyStrip({
  eyebrow = 'Assembled from',
  reconcileSentence = 'Reconciled into one decision below.',
  items,
}: SourceAssemblyStripProps) {
  return (
    <section style={cardStyle} aria-label="Sources assembled into the recommendation">
      <div style={eyebrowStyle}>{eyebrow}</div>

      <ul style={{ ...chipsRowStyle, listStyle: 'none', padding: 0, margin: '0 0 14px 0' }}>
        {items.map((item, idx) => {
          const Icon = ICONS[item.icon] ?? Database;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut', delay: idx * 0.06 }}
              style={chipStyle}
            >
              <Icon size={13} strokeWidth={2} color={NAVY_70} aria-hidden />
              {item.label}
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.24,
          ease: 'easeOut',
          // After the last chip lands (items.length * 60ms) + 120ms.
          delay: items.length * 0.06 + 0.12,
        }}
        style={reconcileRowStyle}
      >
        <ArrowRight size={16} color={NAVY_55} strokeWidth={2} aria-hidden />
        <span>{reconcileSentence}</span>
      </motion.div>
    </section>
  );
}
