import React, { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useStationStore } from '../../store/stationStore';
import { db } from '../../store/db';
import { buildTextAnalyticsData } from '../../lib/researchDerivedData';

export default function Station04_TextAnalytics() {
  const setInterpretation = useStationStore((state) => state.setInterpretation);
  const snapshot = useLiveQuery(async () => {
    const [students, drafts, textFeatures, logs, messages, profiles, ruleDefinitions] = await Promise.all([
      db.students.toArray(),
      db.drafts.toArray(),
      db.text_features.toArray(),
      db.moodle_logs.toArray(),
      db.help_seeking_messages.toArray(),
      db.learner_profiles.toArray(),
      db.rule_definitions.toArray()
    ]);

    return { students, drafts, textFeatures, logs, messages, profiles, ruleDefinitions };
  }, []);

  const analytics = buildTextAnalyticsData(snapshot ?? {});

  useEffect(() => {
    if (!analytics) {
      return;
    }

    setInterpretation({
      notes: `${analytics.primary.studentCode} now uses live NLP-derived features from stored drafts. TTR deviation is ${analytics.sigma}, while ${analytics.anomalyCount} stylometric flags remain active against current thresholds.`,
      findings: [
        `Lexical range: ${analytics.radarData[0].A}% vs cohort ${analytics.radarData[0].B}%`,
        `Grammar control: ${analytics.radarData[2].A}% with confidence ${analytics.confidence}%`,
        `Cohesion markers flag: ${analytics.anomalies.find((item) => item.label === 'Cohesion Markers')?.value ?? 'N/A'}`
      ],
      references: [
        { author: 'Holmes (2019)', title: 'Stylometric synthesis in academic writing' },
        { author: 'Hyland (2015)', title: 'Metadiscourse: Exploring interaction in writing' }
      ]
    });
  }, [analytics, setInterpretation]);

  if (!analytics) {
    return null;
  }

  const methodologicalAnchor = analytics.primary.profileLabel || 'Cohort comparison active';

  return (
    <div className="animate-in fade-in space-y-12 duration-700">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <div className="data-label mb-2 flex items-center gap-2 text-primary">
            <span className="h-1.5 w-1.5 animate-pulse bg-primary shadow-[0_0_8px_rgba(192,193,255,0.6)]" />
            STATION 04 / Text Analytics
          </div>
          <h1 className="editorial-header mb-2 text-3xl phosphor-glow">Stylometric Fingerprint</h1>
          <div className="flex items-center gap-4">
            <span className="data-label rounded-sm bg-secondary/10 px-2 py-0.5 !text-secondary">ACTIVE SESSION</span>
            <span className="data-label !tracking-widest !text-outline">Subject Identifier: {analytics.primary.studentCode}</span>
          </div>
        </div>
        <div className="hidden text-right md:block">
          <p className="data-label mb-1 !text-slate-500">Methodological Anchor</p>
          <p className="font-headline text-xl italic text-primary">{methodologicalAnchor}</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="group col-span-12 flex h-[600px] flex-col overflow-hidden rounded-sm bg-surface-container p-8 lg:col-span-8">
          <div className="absolute left-0 top-0 h-full w-1 bg-primary/20 transition-colors group-hover:bg-primary/40" />
          <div className="mb-12 flex items-start justify-between">
            <div>
              <h3 className="font-headline text-2xl italic text-on-surface">Multidimensional Stylometric Variance</h3>
              <p className="data-label mt-1 !lowercase !text-on-surface-variant italic">Direct comparison of live lexical markers against cohort baselines.</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-secondary opacity-60" />
                <span className="data-label !text-outline">Cohort Avg</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                <span className="data-label !font-bold !text-primary">{analytics.primary.studentCode}</span>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 pb-8">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} initialDimension={{ width: 720, height: 420 }}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.radarData}>
                <PolarGrid stroke="#464554" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#908fa0', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181f32', border: '1px solid #464554', borderRadius: '4px' }}
                  itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Radar name="Cohort Avg" dataKey="B" stroke="#4fdbc8" fill="#4fdbc8" fillOpacity={0.1} strokeDasharray="4 4" />
                <Radar name={analytics.primary.studentCode} dataKey="A" stroke="#c0c1ff" fill="#c0c1ff" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-8 border-t border-outline-variant/10 pt-8">
            <div className="text-center">
              <p className="data-label mb-1 !text-slate-500">Deviation Sigma</p>
              <p className="forensic-mono text-2xl font-bold text-on-surface">{analytics.sigma}</p>
            </div>
            <div className="text-center">
              <p className="data-label mb-1 !text-slate-500">Confidence</p>
              <p className="forensic-mono text-2xl font-bold text-secondary">{analytics.confidence}%</p>
            </div>
            <div className="text-center">
              <p className="data-label mb-1 !text-slate-500">Anomalies</p>
              <p className="forensic-mono text-2xl font-bold text-[color:var(--error)]">{String(analytics.anomalyCount).padStart(2, '0')} DETECTED</p>
            </div>
          </div>
        </section>

        <div className="col-span-12 space-y-8 lg:col-span-4">
          <section className="rounded-sm border-l-2 border-[color:var(--error)] bg-surface-container-high p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[color:var(--error)]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <h4 className="data-label !font-bold !text-[color:var(--error)]">Critical Indicators</h4>
            </div>
            <ul className="space-y-5">
              {analytics.anomalies.map((item) => (
                <li key={item.label} className="flex items-center justify-between">
                  <span className="font-body text-sm text-on-surface">{item.label}</span>
                  <span className={`data-label rounded-sm px-2 py-0.5 !text-[9px] !font-bold ${
                    item.value === 'TRIGGERED' || item.value === 'HIGH'
                      ? 'bg-[color:var(--error)] text-[color:var(--error)]'
                      : item.value === 'LOW'
                        ? 'bg-tertiary text-[color:var(--on-primary-fixed)]'
                        : 'bg-primary text-[color:var(--on-primary-fixed)]'
                  }`}>
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative rounded-sm bg-surface-container-lowest p-8">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="editorial-header !text-lg text-primary">Marginalia</h4>
              <span className="data-label !text-slate-500">Ref: LIVE_NLP</span>
            </div>
            <div className="space-y-6 text-sm italic leading-relaxed text-on-surface-variant">
              <p>
                "{analytics.primary.studentCode} shows lexical variance of {analytics.radarData[0].A}% with grammar control at {analytics.radarData[2].A}%. These values are now computed from stored draft text rather than demo placeholders."
              </p>
              <p className="data-label border-l border-primary/40 pl-4 !font-bold !not-italic !text-secondary">
                SUGGESTED INTERVENTION: Route semantic and cohesion issues into the next diagnostic cycle.
              </p>
            </div>
          </section>

          <section className="rounded-sm border-t border-outline-variant/10 bg-surface-container p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-sm text-primary">database</span>
              <h4 className="data-label !text-slate-500">Live Telemetry Stream</h4>
            </div>
            <div className="space-y-3 font-mono text-primary/60 uppercase">
              <div className="flex justify-between">
                <span>TTR_THRESHOLD</span>
                <span className="text-secondary">{analytics.thresholdMap.ttr_low || '< 0.35'}</span>
              </div>
              <div className="flex justify-between">
                <span>COHESION_THRESHOLD</span>
                <span className="text-on-surface-variant">{analytics.thresholdMap.cohesion_markers_low || '< 3'}</span>
              </div>
              <div className="flex justify-between">
                <span>S01_OFFSET</span>
                <span className="text-tertiary">{analytics.sigma}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
