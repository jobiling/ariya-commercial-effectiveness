export type RagStatus = 'red' | 'amber' | 'green';

export interface Signal {
  id: string;
  title: string;
  source: string;
  market: string;
  status: RagStatus;
  detectedAt: string; // ISO
  summary: string;
}

export const SIGNALS: readonly Signal[] = [
  {
    id: 'sig-001',
    title: 'Competitor launches new indication in EU5',
    source: 'EMA · Press release',
    market: 'eu5',
    status: 'red',
    detectedAt: '2026-05-19T08:14:00Z',
    summary: 'Approval triggers re-pricing risk in 3 markets within 90 days.',
  },
  {
    id: 'sig-002',
    title: 'Payer formulary change pending in US',
    source: 'Payer intelligence',
    market: 'us',
    status: 'amber',
    detectedAt: '2026-05-18T15:02:00Z',
    summary: 'PBM consolidating tier-2 access — monitor impact on rebates.',
  },
  {
    id: 'sig-003',
    title: 'Field share-of-voice up 12% in target HCP segment',
    source: 'CRM · Veeva',
    market: 'global',
    status: 'green',
    detectedAt: '2026-05-17T11:30:00Z',
    summary: 'Sustained over 4-week rolling window. Sustain investment in segment.',
  },
] as const;
