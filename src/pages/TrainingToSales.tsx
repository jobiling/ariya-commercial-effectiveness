import type { CSSProperties } from 'react';
import { Info } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../components/layout/PageHeader';
import { AriyaNote, ConfidenceBadge } from '../components/decision';
import { SourceTag } from '../components/composites';
import { trainingToSales } from '../data/scenario';

const NAVY = '#050A44';
const NAVY_55 = 'rgba(5,10,68,0.55)';
const NAVY_70 = 'rgba(5,10,68,0.70)';
const NAVY_12 = 'rgba(5,10,68,0.12)';
const NAVY_06 = 'rgba(5,10,68,0.06)';
const BLUE = '#0055BB';
const GREEN = '#16A34A';

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  paddingBottom: 56,
};

const cardStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${NAVY_12}`,
  borderRadius: 14,
  padding: 22,
  boxShadow: '0 1px 2px rgba(5,10,68,0.04)',
};

const chartTitleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
  marginBottom: 4,
};

const chartTitleStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};

const chartSubtitleStyle: CSSProperties = {
  fontSize: 13,
  color: NAVY_55,
  marginTop: 2,
};

const legendRowStyle: CSSProperties = {
  display: 'flex',
  gap: 18,
  flexWrap: 'wrap',
  fontSize: 12,
  fontWeight: 600,
  color: NAVY_70,
};

const legendItemStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
};

const tooltipBoxStyle: CSSProperties = {
  background: NAVY,
  color: '#ffffff',
  padding: '8px 10px',
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1.5,
  boxShadow: '0 8px 24px rgba(5,10,68,0.18)',
};

const readoutStyle: CSSProperties = {
  marginTop: 16,
  paddingTop: 16,
  borderTop: `1px solid ${NAVY_12}`,
  fontSize: 14,
  color: NAVY_70,
  lineHeight: 1.6,
};

const methodCardStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  padding: 18,
  borderRadius: 12,
  background: NAVY_06,
  border: `1px solid ${NAVY_12}`,
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: NAVY_55,
  marginBottom: 8,
};

function monthLabel(m: number) {
  if (m === 0) return '0';
  return m > 0 ? `+${m}` : `${m}`;
}

function ChartTooltip(props: any) {
  const active = props.active as boolean | undefined;
  const payload = props.payload as { value: number; dataKey: string }[] | undefined;
  const label = props.label as number | undefined;
  if (!active || !payload || !payload.length) return null;
  const followed = payload.find((p) => p.dataKey === 'trainedAndFollowedUp')?.value;
  const under = payload.find((p) => p.dataKey === 'trainedButUnderFollowed')?.value;
  return (
    <div style={tooltipBoxStyle}>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>Month {monthLabel(label ?? 0)}</div>
      <div style={{ opacity: 0.9 }}>Followed up: index {followed}</div>
      <div style={{ opacity: 0.9 }}>Under-followed: index {under}</div>
    </div>
  );
}

export default function TrainingToSales() {
  const t = trainingToSales;
  const data = t.series.map((p) => ({ ...p, label: monthLabel(p.month) }));

  return (
    <div style={pageStyle}>
      <PageHeader
        title="Training-to-Sales Signal"
        subtitle="Do trained injector cohorts show a different later order pattern, directionally?"
      />

      <AriyaNote
        eyebrow="How to read this page"
        body="This is a training-to-sales signal, allocated to cohorts by territory catchment. It is directional management insight, not individual-HCP attribution and not a causal claim."
      />

      <section style={cardStyle}>
        <div style={chartTitleRowStyle}>
          <div>
            <h2 style={chartTitleStyle}>{t.market} · trained injector cohorts, indexed to training month</h2>
            <p style={chartSubtitleStyle}>{t.subtitle}</p>
          </div>
          <div style={legendRowStyle}>
            <span style={legendItemStyle}>
              <span style={{ width: 16, height: 3, borderRadius: 2, background: GREEN }} />
              Trained and followed up
            </span>
            <span style={legendItemStyle}>
              <span style={{ width: 16, height: 3, borderRadius: 2, background: 'rgba(5,10,68,0.45)' }} />
              Trained but under-followed
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: 320, marginTop: 14 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 16, right: 24, bottom: 24, left: 0 }}>
              <CartesianGrid stroke="rgba(5,10,68,0.08)" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: NAVY_55, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: NAVY_12 }}
                label={{ value: 'Months from training', position: 'bottom', offset: 8, fill: NAVY_55, fontSize: 12 }}
              />
              <YAxis
                domain={[97, 110]}
                tick={{ fill: NAVY_55, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: NAVY_12 }}
                label={{ value: 'Indexed (100 = training month)', angle: -90, position: 'insideLeft', offset: 16, fill: NAVY_55, fontSize: 12 }}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: NAVY_12 }} />
              <ReferenceLine
                x="0"
                stroke={BLUE}
                strokeDasharray="4 4"
                label={{ value: t.trainingMonthLabel, position: 'top', fill: BLUE, fontSize: 11, fontWeight: 700 }}
              />
              <Line
                type="monotone"
                dataKey="trainedButUnderFollowed"
                stroke="rgba(5,10,68,0.45)"
                strokeWidth={2}
                dot={{ r: 2.5, fill: 'rgba(5,10,68,0.45)' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="trainedAndFollowedUp"
                stroke={GREEN}
                strokeWidth={2.5}
                dot={{ r: 3, fill: GREEN }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p style={readoutStyle}>
          By month +6, the followed-up cohort sits at index{' '}
          <strong style={{ color: NAVY, fontWeight: 700 }}>{t.readout.followedUpIndex}</strong> against{' '}
          <strong style={{ color: NAVY, fontWeight: 700 }}>{t.readout.underFollowedIndex}</strong> for the
          under-followed cohort. That{' '}
          <strong style={{ color: NAVY, fontWeight: 700 }}>{t.readout.gapPoints}-point</strong> gap is the
          directional signal: the followed-up cohort is directionally aligned with stronger order movement.
          The signal is consistent with the Germany follow-up sprint thesis, not a proof of it.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <section style={cardStyle}>
          <div style={sectionLabelStyle}>Method and confidence</div>
          <div style={methodCardStyle}>
            <Info size={18} strokeWidth={2} color={NAVY_55} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 13, color: NAVY_70, lineHeight: 1.6 }}>{t.methodNote}</p>
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <ConfidenceBadge
              level={t.confidence}
              rationale="Cohort-level allocation by territory catchment is reliable. The link from follow-up to orders is directional, not causal."
            />
            <span style={{ fontSize: 12, color: NAVY_55 }}>
              Directional association under explicit assumptions.
            </span>
          </div>
        </section>

        <section style={cardStyle}>
          <div style={sectionLabelStyle}>Caveats</div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {t.caveats.map((c, i) => (
              <li key={i} style={{ fontSize: 13, color: NAVY_70, lineHeight: 1.55 }}>{c}</li>
            ))}
          </ul>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {t.sources.map((s) => (
              <SourceTag key={s} label={s} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
