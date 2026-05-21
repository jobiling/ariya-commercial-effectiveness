import type { CSSProperties, ReactNode } from 'react';
import {
  Target,
  Database,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';
const TEAL = '#0F766E';
const LAVENDER = '#E8EAF6';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  paddingBottom: 80,
};

// ─── Hero block ──────────────────────────────────────────────────────────────

const heroCardStyle: CSSProperties = {
  position: 'relative',
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 16,
  padding: '32px 36px 28px',
  boxShadow: '0 6px 18px rgba(5,10,68,0.06), 0 1px 2px rgba(5,10,68,0.04)',
  overflow: 'hidden',
};

const heroStripeStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: 6,
  background: `linear-gradient(180deg, ${BLUE} 0%, ${TEAL} 100%)`,
};

const heroEyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: BLUE,
};

const heroQuoteStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.35,
  margin: '12px 0 0',
  maxWidth: 780,
};

const heroBodyStyle: CSSProperties = {
  fontSize: 14,
  color: NAVY_70,
  lineHeight: 1.6,
  margin: '12px 0 0',
  maxWidth: 760,
};

// ─── Framework grid ──────────────────────────────────────────────────────────

const sectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 14,
};

const frameworkGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 16,
};

const frameworkCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 22,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
};

const frameworkIconStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  background: LAVENDER,
  color: BLUE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const frameworkBodyStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const frameworkEyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY_55,
};

const frameworkTitleStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
  lineHeight: 1.4,
};

const frameworkBodyTextStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.55,
  margin: 0,
};

// ─── Outputs sub-list (only for the Outputs card so it spans full width) ────

const outputsCardStyle: CSSProperties = {
  ...frameworkCardStyle,
  gridColumn: '1 / -1',
  background: '#FAFBFF',
  borderColor: 'rgba(0,85,187,0.18)',
};

const outputsListStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 10,
  marginTop: 4,
};

const outputItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  padding: '8px 10px',
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 8,
  fontSize: 12,
  color: NAVY,
  lineHeight: 1.4,
  fontWeight: 500,
};

// ─── Trust block ─────────────────────────────────────────────────────────────

const trustCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 24,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const trustHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 14,
};

const trustTitleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};

const trustRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '10px 0',
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.55,
  borderBottom: `1px solid ${NAVY_06}`,
};

const trustRowLastStyle: CSSProperties = {
  ...trustRowStyle,
  borderBottom: 'none',
};

// ─── Data ────────────────────────────────────────────────────────────────────

interface FrameworkElement {
  eyebrow: string;
  title: string;
  body: ReactNode;
  icon: ReactNode;
}

const FRAMEWORK_ELEMENTS: FrameworkElement[] = [
  {
    eyebrow: 'Scope',
    title: 'Two markets, one priority brand',
    body: (
      <>
        Italy and Germany on Xeomin. We start with a question your leadership team is already
        looking at — the post-training reallocation between the two markets — so the pilot earns
        its keep against a live decision, not a synthetic one.
      </>
    ),
    icon: <Target size={20} strokeWidth={2.2} />,
  },
  {
    eyebrow: 'Data set',
    title: 'Six layers, working with what you already have',
    body: (
      <>
        Market performance, CRM activity, HCP training and investment, segmentation and targeting,
        and finance data <em>where feasible</em>. Selected extracts to start, so the pilot is not
        held up by full system integration.
      </>
    ),
    icon: <Database size={20} strokeWidth={2.2} />,
  },
  {
    eyebrow: 'Users',
    title: 'Your leadership team and the chain below',
    body: (
      <>
        Europe leadership, BU heads, national sales managers, and selected first-line managers.
        The same decision layer, framed for each role, so leadership and the field see the same
        signal at the same time.
      </>
    ),
    icon: <Users size={20} strokeWidth={2.2} />,
  },
  {
    eyebrow: 'Duration',
    title: 'Six weeks, with a clear decision at the end',
    body: (
      <>
        Long enough to validate proxy KPIs against a real scenario and produce decision briefs
        your team can act on. Short enough to give you a clean go / no-go on whether to take it
        further.
      </>
    ),
    icon: <Calendar size={20} strokeWidth={2.2} />,
  },
];

const OUTPUTS = [
  'A working Ariya instance, tuned to your data',
  'Proxy KPIs validated for your markets',
  'Decision briefs on the Italy / Germany reallocation',
  'A scenario planner tuned to your assumptions',
  'A feedback summary from your team',
  'A recommendation, owned by you, on what to do next',
];

const TRUST_POINTS = [
  {
    label: 'We work with extracts, not full integration',
    body: 'Selected data extracts mean you can start now rather than wait on a complete CRM and finance integration. The pilot proves the model on what is already accessible.',
  },
  {
    label: 'Proxy KPIs, with caveats surfaced',
    body: 'We do not claim promotional responsiveness. The diagnostic load is carried by proxy KPIs (call frequency, follow-up timing, target coverage). Every recommendation states its confidence and its assumptions.',
  },
  {
    label: 'Scenarios are directional, not forecasts',
    body: 'Scenario outputs include a confidence band, a central assumption, and the conditions required to hold. Every recommendation is reversible.',
  },
  {
    label: 'You decide what comes next',
    body: 'The pilot tells you whether the available data supports decisions you trust. A wider Europe rollout is a separate decision, taken by your team on the evidence the pilot produces.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PilotProposal() {

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Pilot proposal"
        subtitle="A focused six-week engagement to validate Ariya as a commercial effectiveness decision layer for Europe leadership."
      />

      <section style={heroCardStyle}>
        <span style={heroStripeStyle} aria-hidden />
        <div style={heroEyebrowStyle}>The proposal in one line</div>
        <h2 style={heroQuoteStyle}>
          Turn the commercial data you already have into shared, evidence-based decisions across
          your European markets &mdash; in six weeks, against a live question.
        </h2>
        <p style={heroBodyStyle}>
          Commercial decisions across Europe today rely on different signals in different markets.
          This pilot puts those signals into one decision layer for your leadership team and tests
          it against a real situation you are already working on, so the outcome at week six is a
          concrete answer, not a demo.
        </p>
      </section>

      <section>
        <div style={sectionLabelStyle}>What we propose</div>
        <div style={frameworkGridStyle}>
          {FRAMEWORK_ELEMENTS.map((el) => (
            <article key={el.eyebrow} style={frameworkCardStyle}>
              <div style={frameworkIconStyle}>{el.icon}</div>
              <div style={frameworkBodyStyle}>
                <span style={frameworkEyebrowStyle}>{el.eyebrow}</span>
                <h3 style={frameworkTitleStyle}>{el.title}</h3>
                <p style={frameworkBodyTextStyle}>{el.body}</p>
              </div>
            </article>
          ))}

          <article style={outputsCardStyle}>
            <div style={frameworkIconStyle}>
              <CheckCircle2 size={20} strokeWidth={2.2} />
            </div>
            <div style={frameworkBodyStyle}>
              <span style={frameworkEyebrowStyle}>What you have at week six</span>
              <h3 style={frameworkTitleStyle}>Concrete artefacts your leadership can use</h3>
              <p style={frameworkBodyTextStyle}>
                A working pilot environment tuned to your data, decision briefs on the live
                scenario, and a clear recommendation on whether and how to take it further.
              </p>
              <div style={outputsListStyle}>
                {OUTPUTS.map((o) => (
                  <span key={o} style={outputItemStyle}>
                    <CheckCircle2 size={13} color={TEAL} strokeWidth={2.4} style={{ marginTop: 1, flexShrink: 0 }} />
                    {o}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section style={trustCardStyle}>
        <div style={trustHeaderStyle}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#ECFDF5',
              color: TEAL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={16} strokeWidth={2.2} />
          </span>
          <h3 style={trustTitleStyle}>How the pilot stays honest</h3>
        </div>
        <div>
          {TRUST_POINTS.map((p, i) => (
            <div
              key={p.label}
              style={i === TRUST_POINTS.length - 1 ? trustRowLastStyle : trustRowStyle}
            >
              <CheckCircle2
                size={16}
                color={TEAL}
                strokeWidth={2.4}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <span>
                <strong style={{ color: NAVY, fontWeight: 700 }}>{p.label}.</strong>{' '}
                {p.body}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
