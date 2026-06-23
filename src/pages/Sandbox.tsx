import type { CSSProperties } from 'react';
import {
  RecommendationCard,
  ConfidenceBadge,
  WhatThisSuggests,
} from '../components/decision';
import { overview, germanyHcpTrainingRecommendation } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_12 = 'rgba(5,10,68,0.12)';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  paddingBottom: 48,
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 12,
};

const sandboxNote: CSSProperties = {
  padding: '12px 16px',
  background: '#FFFBEB',
  border: '1px solid #FCD34D',
  borderRadius: 10,
  color: '#92400E',
  fontSize: 13,
  lineHeight: 1.5,
};

const dividerStyle: CSSProperties = {
  borderTop: `1px solid ${NAVY_12}`,
  paddingTop: 24,
};

const inlineRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  alignItems: 'center',
};

export default function Sandbox() {
  return (
    <div style={pageStyle}>
      <header>
        <h1 className="text-gradient text-[28px] font-bold leading-tight mb-2">
          Decision Layer · Sandbox
        </h1>
        <p style={{ fontSize: 14, color: NAVY_55, lineHeight: 1.5 }}>
          Visual harness for the Stage 1 primitives. Delete this route once Stages 2 to 6 land.
        </p>
      </header>

      <div style={sandboxNote}>
        This page is internal. It is not part of the demo flow. Hover the confidence pill below to test the tooltip.
      </div>

      <section>
        <div style={sectionLabelStyle}>ConfidenceBadge</div>
        <div style={inlineRowStyle}>
          <ConfidenceBadge level="High" rationale="Operational actions are within existing accountability and timeframes." />
          <ConfidenceBadge level="Medium" rationale="Account-level linkage and market-level confounders require validation." />
          <ConfidenceBadge level="Low" rationale="No 2026 quantitative tracker for IT plastic surgery channel." />
        </div>
      </section>

      <section style={dividerStyle}>
        <div style={sectionLabelStyle}>WhatThisSuggests</div>
        <WhatThisSuggests
          text="Germany and Austria show different break points. Investment Radar isolates which categories carry which problem."
          to="/investment-radar"
          linkLabel="Open Investment Radar"
        />
      </section>

      <section style={dividerStyle}>
        <div style={sectionLabelStyle}>RecommendationCard · Full · Teal accent (anchor variant)</div>
        <RecommendationCard
          situation={overview.recommendation.situation}
          recommendation={overview.recommendation.recommendation}
          reasoning={overview.recommendation.reasoning}
          confidence={overview.recommendation.confidence}
          confidenceRationale={overview.recommendation.confidenceRationale}
          conditions={overview.recommendation.conditions}
          nextActions={overview.recommendation.nextActions}
          sources={overview.recommendation.sources}
          accent="teal"
          actions={[
            { label: 'Log this decision →', onClick: () => alert('Would open Log Decision modal'), primary: true },
            { label: 'Open in Scenario Planner →', onClick: () => alert('Would route to /scenario-planner') },
          ]}
        />
      </section>

      <section style={dividerStyle}>
        <div style={sectionLabelStyle}>RecommendationCard · Full · No accent (default)</div>
        <RecommendationCard
          situation={germanyHcpTrainingRecommendation.situation}
          recommendation={germanyHcpTrainingRecommendation.recommendation}
          reasoning={germanyHcpTrainingRecommendation.reasoning}
          confidence={germanyHcpTrainingRecommendation.confidence}
          confidenceRationale={germanyHcpTrainingRecommendation.confidenceRationale}
          conditions={germanyHcpTrainingRecommendation.conditions}
          nextActions={germanyHcpTrainingRecommendation.nextActions}
          sources={germanyHcpTrainingRecommendation.sources}
          actions={[
            { label: 'Log this decision →', onClick: () => alert('Would open Log Decision modal'), primary: true },
          ]}
        />
      </section>

      <section style={dividerStyle}>
        <div style={sectionLabelStyle}>RecommendationCard · Compact (no situation, no reasoning)</div>
        <RecommendationCard
          situation={germanyHcpTrainingRecommendation.situation}
          recommendation={germanyHcpTrainingRecommendation.recommendation}
          reasoning={germanyHcpTrainingRecommendation.reasoning}
          confidence={germanyHcpTrainingRecommendation.confidence}
          confidenceRationale={germanyHcpTrainingRecommendation.confidenceRationale}
          conditions={germanyHcpTrainingRecommendation.conditions}
          nextActions={germanyHcpTrainingRecommendation.nextActions}
          sources={germanyHcpTrainingRecommendation.sources}
          variant="compact"
        />
      </section>

      <footer style={{ ...dividerStyle, color: NAVY_55, fontSize: 12 }}>
        Reminder for review: eyebrow color (BLUE), recommendation headline weight (700, 19px),
        unchecked circle icons (never green ticks), navy bold next-action verbs separated by middle dots,
        teal stripe on the anchor variant only. Status terms must read in Title Case. Tooltip should appear
        above the confidence pill on hover. Card shadow is heavier than any chart container will be.
        <span style={{ display: 'block', marginTop: 8, color: NAVY }}>
          Background context: this primitive is the visual anchor of Europe Overview, Investment Radar,
          Customer and Account Focus, and Scenario Planner.
        </span>
      </footer>
    </div>
  );
}
