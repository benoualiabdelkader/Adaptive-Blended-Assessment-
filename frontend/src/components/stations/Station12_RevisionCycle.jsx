import React, { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStationStore } from '../../store/stationStore';
import { db } from '../../store/db';
import { buildRevisionCycleData } from '../../lib/researchDerivedData';

export default function Station12_RevisionCycle() {
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

  const analytics = buildRevisionCycleData(snapshot ?? {});

  useEffect(() => {
    if (!analytics) {
      return;
    }

    setInterpretation({
      notes: `Revision Cycle is now built from real stored drafts for ${analytics.primary.studentCode}. Average longitudinal gain is ${analytics.avgGain}, with ${analytics.diffSummaries.length} text-diff transitions available.`,
      findings: [
        `Improvement percentile: ${analytics.improvementPercent}%`,
        `Students above rubric 3.0: ${analytics.improvedCount}`,
        `At-risk no-growth count: ${analytics.atRiskCount}`
      ],
      references: [
        { author: 'Hyland (2015)', title: 'Metadiscourse: Exploring Interaction in Writing' },
        { author: 'Zimmerman (2008)', title: 'Investigating self-regulation and motivation' }
      ]
    });
  }, [analytics, setInterpretation]);

  if (!analytics) {
    return null;
  }

  const growthCharts = [
    { title: 'Grammar Accuracy', dataKey: 'grammar' },
    { title: 'Cohesion Markers', dataKey: 'cohesion' },
    { title: 'Argumentation Score', dataKey: 'argumentation' },
    { title: 'Overall Rubric', dataKey: 'overall' }
  ];

  const firstScore = analytics.chartData[0]?.overall || 0;
  const latestScore = analytics.chartData[analytics.chartData.length - 1]?.overall || 0;

  return (
    <div className="animate-in fade-in space-y-12 duration-700">
      <header className="mb-12 flex flex-col items-start justify-between gap-10 border-b border-outline-variant/10 pb-12 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h1 className="editorial-header mb-4 text-3xl phosphor-glow">Student Revision Cycle</h1>
          <div className="data-label flex items-center gap-3 font-bold text-primary">
            <span className="opacity-60">Viewing Spectrum:</span>
            <button type="button" className="flex items-center gap-2 border-b border-primary/40 pb-1 transition-colors hover:text-white">
              {analytics.primary.studentCode} Longitudinal Trace <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 rounded-sm border border-outline-variant/10 bg-surface-container-low p-6 shadow-2xl">
          <div className="flex flex-col items-center">
            <span className="data-label mb-3 !font-bold !text-outline">Draft 1</span>
            <div className="forensic-mono flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-surface-container-highest text-sm italic text-primary shadow-inner">
              {(firstScore / 20).toFixed(1)}
            </div>
          </div>
          <div className="flex flex-col items-center pt-5">
            <span className="forensic-mono flex items-center gap-2 font-bold text-secondary">--(+{analytics.avgGain})--&gt;</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="data-label mb-3 !font-bold !text-outline">Latest</span>
            <div className="forensic-mono flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-[color:var(--on-primary-fixed)] shadow-[0_0_25px_rgba(192,193,255,0.4)] ring-4 ring-primary/10">
              {(latestScore / 20).toFixed(1)}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {growthCharts.map((chart) => (
              <div key={chart.dataKey} className="group flex h-[280px] flex-col rounded-sm bg-surface-container p-6 transition-all hover:bg-surface-container-high">
                <h3 className="data-label mb-6 !font-bold !text-outline transition-colors group-hover:text-primary">{chart.title}</h3>
                <div className="min-h-0 min-w-0 flex-1">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200} initialDimension={{ width: 480, height: 240 }}>
                    <LineChart data={analytics.chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#464554" vertical={false} opacity={0.1} />
                      <XAxis dataKey="name" stroke="#908fa0" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#908fa0" fontSize={10} tickLine={false} axisLine={false} hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#181f32', border: '1px solid #464554', borderRadius: '4px' }}
                        itemStyle={{ fontSize: '10px' }}
                      />
                      <Line
                        type="monotone"
                        dataKey={chart.dataKey}
                        stroke="#c0c1ff"
                        strokeWidth={2}
                        dot={{ fill: '#c0c1ff', r: 3 }}
                        activeDot={{ r: 5, stroke: '#c0c1ff', strokeWidth: 2, fill: '#181f32' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          <section className="relative overflow-hidden rounded-sm bg-surface-container-low p-8 shadow-lg">
            <div className="absolute left-0 top-0 h-full w-1 bg-secondary shadow-[0_0_15px_rgba(79,219,200,0.4)]" />
            <h3 className="data-label mb-8 font-bold text-primary">Cohort Longitudinal Summary</h3>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="space-y-2">
                <p className="data-label !font-bold !text-outline opacity-60">Avg Score Gain</p>
                <p className="forensic-mono text-3xl font-bold text-secondary">+{analytics.avgGain}</p>
              </div>
              <div className="space-y-2">
                <p className="data-label !font-bold !text-outline opacity-60">Improvement</p>
                <p className="forensic-mono text-3xl font-bold text-secondary">{analytics.improvementPercent}%</p>
              </div>
              <div className="space-y-2">
                <p className="data-label !font-bold !text-outline opacity-60">Improved ≥ 3.0</p>
                <p className="forensic-mono text-3xl font-light italic text-on-surface">{analytics.improvedCount}</p>
              </div>
              <div className="space-y-2">
                <p className="data-label !font-bold !text-outline opacity-60">Bayesian Conf.</p>
                <p className="forensic-mono text-3xl font-bold text-tertiary">{analytics.bayesianConfidence}%</p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-outline-variant/10 pt-8">
              <div className="flex items-center gap-6">
                <span className="inline-block bg-error/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-error">
                  {analytics.atRiskCount} AT-RISK STUDENTS
                </span>
                <p className="text-xs italic leading-relaxed text-outline opacity-70">No measurable improvement identified in the latest revision cycle for this group.</p>
              </div>
              <span className="material-symbols-outlined cursor-pointer p-2 text-outline transition-colors hover:text-primary">info</span>
            </div>
          </section>
        </div>

        <div className="space-y-10 lg:col-span-4">
          <section className="group relative rounded-sm border-l-4 border-secondary bg-surface-container p-8 shadow-xl">
            <div className="absolute right-0 top-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-6xl">update</span>
            </div>
            <h3 className="data-label mb-8 flex items-center gap-3 font-bold !text-outline">
              <span className="material-symbols-outlined text-base text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
              Bayesian Update Indicator
            </h3>
            <div className="space-y-8">
              {analytics.chartData.map((row, index) => {
                const probability = Math.min(0.95, 0.3 + row.overall / 120);
                return (
                  <div key={row.name} className="group/row">
                    <div className="forensic-mono mb-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold uppercase tracking-widest text-outline opacity-60">{row.name}: P(improvement)</span>
                      <span className={index === analytics.chartData.length - 1 ? 'font-bold text-secondary' : 'text-outline'}>
                        {probability.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                      <div className={`${index === analytics.chartData.length - 1 ? 'bg-secondary' : 'bg-secondary/60'} h-full shadow-[0_0_8px_rgba(79,219,200,0.3)]`} style={{ width: `${Math.round(probability * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-sm border border-outline-variant/10 bg-primary/5 p-8 shadow-2xl">
            <div className="mb-8 flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
              <h3 className="data-label !font-bold !text-primary">Forensic Research Notes</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="data-label !font-bold !text-outline opacity-60">Synthesis Finding</p>
                <p className="font-headline text-lg italic leading-relaxed text-on-surface">
                  "{analytics.primary.studentCode} now exposes {analytics.diffSummaries.length} measurable revision transitions in the stored draft history."
                </p>
              </div>
              <div className="space-y-3">
                <p className="data-label !font-bold !text-outline opacity-60">Text Diff Highlights</p>
                <div className="space-y-3">
                  {analytics.diffSummaries.map((diff) => (
                    <div key={`${diff.from}-${diff.to}`} className="rounded-sm border border-primary/20 bg-primary/5 p-4">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-primary">D{diff.from} → D{diff.to}</p>
                      <p className="mt-2 text-sm italic leading-relaxed text-on-surface-variant">{diff.summary}</p>
                      {diff.delta && (
                        <p className="mt-2 text-xs text-outline">
                          Words Δ {diff.delta.wordCountDelta}, cohesion +{diff.delta.addedCohesion}, evidence +{diff.delta.addedEvidence}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
