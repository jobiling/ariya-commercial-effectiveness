export type DecisionStatus = 'open' | 'in-review' | 'closed';

export interface Decision {
  id: string;
  question: string;
  owner: string;
  dueBy: string; // ISO
  status: DecisionStatus;
  linkedSignalIds: readonly string[];
}

export const DECISIONS: readonly Decision[] = [
  {
    id: 'dec-001',
    question: 'Defend access in EU5 — re-allocate Q3 budget?',
    owner: 'Commercial Lead, EU',
    dueBy: '2026-06-03',
    status: 'open',
    linkedSignalIds: ['sig-001'],
  },
  {
    id: 'dec-002',
    question: 'Adjust rebate strategy ahead of US PBM consolidation?',
    owner: 'Market Access, US',
    dueBy: '2026-06-10',
    status: 'in-review',
    linkedSignalIds: ['sig-002'],
  },
] as const;
