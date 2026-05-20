export interface Market {
  id: string;
  name: string;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM' | 'GLOBAL';
}

export const MARKETS: readonly Market[] = [
  { id: 'global', name: 'Global', region: 'GLOBAL' },
  { id: 'us', name: 'United States', region: 'NA' },
  { id: 'eu5', name: 'EU5', region: 'EU' },
  { id: 'jp', name: 'Japan', region: 'APAC' },
  { id: 'br', name: 'Brazil', region: 'LATAM' },
] as const;
