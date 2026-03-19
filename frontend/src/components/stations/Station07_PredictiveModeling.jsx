import React, { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStationStore } from '../../store/stationStore';
import { db } from '../../store/db';
import { buildPredictiveModelingData } from '../../lib/researchDerivedData';

export default function Station07_PredictiveModeling() {
  const setInterpretation = useStationStore((state) => state.setInterpretation);
  const snapshot = useLiveQuery(async () => {
    const [students, drafts, textFeatures, logs, messages, profiles] = await Promise.all([
      db.students.toArray(),
      db.drafts.toArray(),
      db.text_features.toArray(),
      db.moodle_logs.toArray(),
      db.help_seeking_messages.toArray(),
      db.learner_profiles.toArray()
    ]);

    return { students, drafts, textFeatures, logs, messages, profiles };
  }, []);

  const analytics = buildPredictiveModelingData(snapshot ?? {});

  useEffect(() => {
    if (!analytics) {
      return;
    }

    setInterpretation({
      notes: `Random-forest style scoring is now fed from actual cohort behavior. The dominant predictor is ${analytics.featureData[0]?.name || 'N/A'} at ${analytics.featureData[0]?.val || 0}% importance.`,
      findings: [
        `Model accuracy: ${analytics.model.crossValidationAccuracy}`,
        `Predicted success probability for ${analytics.primary.studentCode}: ${Math.round(analytics.prediction.probability * 100)}%`,
        `Dataset footprint used in analysis: ${analytics.datasetSize} observed nodes`
      ],
      references: [
        { author: 'Breiman (2001)', title: 'Random Forests' },
        { author: 'McNamara (2013)', title: 'Automated writing evaluation' }
      ]
    });
  }, [analytics, setInterpretation]);

  if (!analytics) {
    return null;
  }

  return (
    <div className="animate-in fade-in space-y-12 duration-700">
      <header className="mb-4">
        <div className="mb-3 inline-flex items-center gap-3">
          <span className="h-px w-10 bg-primary shadow-[0_0_8px_rgba(192,193,255,0.6)]" />
          <span className="data-label font-bold text-primary">Research Phase: Predictive</span>
        </div>
        <h1 className="editorial-header text-3xl leading-tight">Predictive Modelling</h1>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
          Feature ranking is now driven by stored logs, messages, and inferred rubric performance rather than static demo bars. This gives the station a repeatable cohort-based ranking each time the database changes.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="group col-span-12 flex min-h-[500px] min-w-0 flex-col rounded-sm bg-surface-container p-6 lg:col-span-8 lg:p-10">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="mb-1 font-headline text-3xl italic text-primary">Feature Importance Analysis</h3>
              <p className="data-label !font-bold !text-slate-500">Ensemble Method: Cohort-weighted random forest approximation</p>
            </div>
            <div className="flex flex-col items-end rounded-sm border border-outline-variant/10 bg-surface-container-highest px-4 py-2">
              <span className="data-label mb-1 !text-[8px] !text-secondary">Model Accuracy</span>
              <span className="forensic-mono text-sm font-bold text-secondary">{analytics.model.crossValidationAccuracy}</span>
            </div>
          </div>

          <div className="min-w-0 h-[clamp(18rem,36vh,26rem)] min-h-[18rem]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={288} initialDimension={{ width: 720, height: 320 }}>
              <BarChart data={analytics.featureData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide domain={[0, 40]} />
                <YAxis dataKey="name" type="category" stroke="#908fa0" fontSize={10} width={120} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#181f32', border: '1px solid #464554', borderRadius: '4px' }}
                  itemStyle={{ fontSize: '10px' }}
                />
                <Bar dataKey="val" radius={[0, 4, 4, 0]}>
                  {analytics.featureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isPrimary ? '#c0c1ff' : '#2d3449'} fillOpacity={entry.isPrimary ? 1 : 0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-outline-variant/10 pt-8">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c0c1ff] shadow-[0_0_8px_rgba(192,193,255,0.4)]" />
              <span className="data-label !font-bold !text-slate-500">Primary Variable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border border-white/5 bg-[#2d3449]" />
              <span className="data-label !font-bold !text-slate-500">Latent Features</span>
            </div>
            <div className="text-sm italic text-on-surface-variant opacity-60 sm:ml-auto">
              Total Dataset: n={analytics.datasetSize} observed nodes
            </div>
          </div>
        </section>

        <aside className="col-span-12 space-y-8 lg:col-span-4">
          <div className="rounded-sm bg-surface-container-low p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              <h4 className="data-label !font-bold !text-primary">Forensic Insight</h4>
            </div>
            <p className="text-[13px] italic leading-relaxed text-on-surface-variant">
              "The highest-ranked signal is <strong className="not-italic text-on-surface">{analytics.featureData[0]?.name}</strong>, showing that performance prediction now reflects observed cohort behavior instead of a fixed demo ordering."
            </p>
          </div>

          <div className="border-l-2 border-primary/20 bg-surface-container-lowest p-8">
            <h4 className="data-label mb-8 !font-bold !text-slate-500">Literature Mapping</h4>
            <div className="space-y-8">
              <div className="relative pl-6">
                <div className="absolute left-[-2px] top-0 h-full w-[2px] bg-primary" />
                <p className="mb-2 font-headline text-lg italic text-on-surface">"The edit is the signal."</p>
                <span className="data-label !font-bold !text-primary">Breiman (2001)</span>
                <p className="mt-3 text-[11px] leading-relaxed text-outline">Feature ranking is used here as an interpretable view over the behavioral model rather than a black-box endpoint.</p>
              </div>
              <div className="relative pl-6 opacity-70">
                <div className="absolute left-[-2px] top-0 h-full w-[2px] bg-outline-variant" />
                <span className="data-label !font-bold !text-slate-500">Live Cohort Context</span>
                <p className="mt-2 text-[11px] leading-relaxed text-outline">Primary subject: {analytics.primary.studentCode}. Predicted success probability: {Math.round(analytics.prediction.probability * 100)}%.</p>
              </div>
            </div>
          </div>

          <div className="rounded-sm bg-surface-container p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="data-label !font-bold !text-slate-500">Confidence Interval</span>
              <span className="forensic-mono font-bold text-secondary">95% CI</span>
            </div>
            <div className="flex h-14 items-end justify-center gap-[2px] overflow-hidden px-4">
              {[0.2, 0.4, 0.7, 1.0, 0.7, 0.4, 0.2].map((height, index) => (
                <div key={index} className={`flex-1 ${index === 3 ? 'bg-secondary' : 'bg-secondary/20'}`} style={{ height: `${height * 100}%` }} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <span className="forensic-mono phosphor-glow text-2xl font-light tracking-widest text-on-surface">
                p = {analytics.prediction.probability.toFixed(2)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
