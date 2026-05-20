export interface TourStep {
  id: string;
  target: string; // CSS selector or data-tour id
  title: string;
  body: string;
}

export const TOUR_STEPS: readonly TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="header"]',
    title: 'Welcome to Ariya',
    body: 'Commercial Effectiveness, end-to-end — signals, decisions, and execution in one place.',
  },
  {
    id: 'war-room',
    target: '[data-tour="nav-war-room"]',
    title: 'The War Room',
    body: 'Live signals and open decisions, prioritized by impact.',
  },
  {
    id: 'weekly-brief',
    target: '[data-tour="nav-weekly-brief"]',
    title: 'Weekly Brief',
    body: 'An editorial summary of what changed — generated from the underlying data.',
  },
  {
    id: 'reset',
    target: '[data-tour="reset"]',
    title: 'Reset the demo',
    body: 'Wipes local state and reloads. Useful between walkthroughs.',
  },
] as const;
