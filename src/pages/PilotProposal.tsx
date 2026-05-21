import type { CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Database,
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight,
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
  maxWidth: 760,
};

const heroBodyStyle: CSSProperties = {
  fontSize: 14,
  color: NAVY_70,
  lineHeight: 1.6,
  margin: '12px 0 0',
  maxWidth: 720,
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

// ─── Closing CTA ─────────────────────────────────────────────────────────────

const ctaCardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: '24px 28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  flexWrap: 'wrap',
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const ctaTextStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
  minWidth: 280,
};

const ctaEyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: BLUE,
};

const ctaHeadlineStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
  lineHeight: 1.4,
};

const ctaBodyStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_70,
  lineHeight: 1.5,
  margin: 0,
};

const ctaPrimaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 40,
  padding: '0 20px',
  borderRadius: 10,
  background: BLUE,
  border: `1px solid ${BLUE}`,
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};

const ctaSecondaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 40,
  padding: '0 18px',
  borderRadius: 10,
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  color: NAVY,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
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
    title: 'Selected CRM-active markets · Xeomin first',
    body: (
      <>
        Start with the markets where CRM data is already in good shape, and one or two priority
        brands. Xeomin is the natural opening brand given the open injection-training scenario.
      </>
    ),
    icon: <Target size={20} strokeWidth={2.2} />,
  },
  {
    eyebrow: 'Source set',
    title: 'Six pragmatic data layers',
    body: (
      <>
        Market performance, CRM activity, HCP training and investment data, segmentation and
        targeting, and finance or spend data <em>where feasible</em>. No promotional-responsiveness
        claim is required to deliver value.
      </>
    ),
    icon: <Database size={20} strokeWidth={2.2} />,
  },
  {
    eyebrow: 'Users',
    title: 'Europe leadership and the chain below',
    body: (
      <>
        Europe leadership, BU heads, national sales managers, and selected first-line managers.
        Same decision layer, role-specific framing.
      </>
    ),
    icon: <Users size={20} strokeWidth={2.2} />,
  },
  {
    eyebrow: 'Duration',
    title: 'Six-week pilot',
    body: (
      <>
        Long enough to validate the proxy-KPI model and produce real decision briefs.
        Short enough to keep buying momentum.
      </>
    ),
    icon: <Calendar size={20} strokeWidth={2.2} />,
  },
];

const OUTPUTS = [
  'Working pilot instance',
  'Validated proxy KPI model',
  'Example decision briefs',
  'Scenario planning prototype',
  'User feedback report',
  'Scale recommendation',
];

const TRUST_POINTS = [
  {
    label: 'Selected extracts, not full integration',
    body: 'Start with available data extracts rather than waiting on a full CRM and finance integration.',
  },
  {
    label: 'Proxy KPIs only, with caveats surfaced',
    body: 'No claim of promotional responsiveness. Proxy KPIs (call frequency, follow-up timing, target coverage) carry the diagnostic load.',
  },
  {
    label: 'Directional scenario planning',
    body: 'Scenario outputs include confidence bands, central assumptions, and a defensible recommendation. Not a forecast.',
  },
  {
    label: 'Pilot decides scale',
    body: 'The pilot establishes whether the data can support meaningful decision recommendations. Full Europe rollout is a separate decision.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PilotProposal() {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Pilot Proposal"
        subtitle="A six-week pilot that turns the prototype into a validated decision layer for Europe Commercial Effectiveness."
      />

      <section style={heroCardStyle}>
        <span style={heroStripeStyle} aria-hidden />
        <div style={heroEyebrowStyle}>Why this pilot, why now</div>
        <h2 style={heroQuoteStyle}>
          The prototype creates belief. The pilot creates the buying path.
        </h2>
        <p style={heroBodyStyle}>
          Europe leadership now has a credible commercial effectiveness decision layer in front of
          them. The pilot tests whether the available Merz data can support meaningful decision
          recommendations against a real scenario, with real users, in six weeks. It is scoped to
          succeed, not to prove everything at once.
        </p>
      </section>

      <section>
        <div style={sectionLabelStyle}>Pilot framework</div>
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
              <span style={frameworkEyebrowStyle}>Outputs</span>
              <h3 style={frameworkTitleStyle}>What lands in Dan&rsquo;s inbox at week six</h3>
              <p style={frameworkBodyTextStyle}>
                Concrete artefacts the leadership team can use immediately, plus a recommendation
                on whether to scale.
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

      <section style={ctaCardStyle}>
        <div style={ctaTextStyle}>
          <span style={ctaEyebrowStyle}>Next step</span>
          <h3 style={ctaHeadlineStyle}>
            Confirm pilot scope with Dan and lock the source set.
          </h3>
          <p style={ctaBodyStyle}>
            Two follow-on conversations: pilot scope and data access. Both can happen this quarter
            and the pilot can start within four weeks of go-ahead.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/source-confidence')}
            style={ctaSecondaryBtnStyle}
          >
            Review source confidence
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={ctaPrimaryBtnStyle}
          >
            Back to Europe Overview
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </section>
    </div>
  );
}
