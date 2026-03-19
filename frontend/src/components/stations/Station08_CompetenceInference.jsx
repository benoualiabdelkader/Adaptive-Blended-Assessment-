import React, { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useStationStore } from '../../store/stationStore';
import { db } from '../../store/db';
import { buildCompetenceInferenceData } from '../../lib/researchDerivedData';

export default function Station08_CompetenceInference() {
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

  const analytics = buildCompetenceInferenceData(snapshot ?? {});

  useEffect(() => {
    if (!analytics) {
      return;
    }

    const strongest = [...analytics.rails].sort((a, b) => b.delta - a.delta)[0];
    setInterpretation({
      notes: `Bayesian updating now runs over stored draft evidence for ${analytics.primary.studentCode}. The strongest posterior lift is ${strongest?.label || 'N/A'} (${strongest?.delta || 0} points).`,
      findings: [
        `Posterior confidence: ${analytics.confidence}%`,
        `KL-style gain proxy: ${analytics.gainBits} bits`,
        `Active temporal node: ${analytics.latestDraftLabel}`
      ],
      references: [
        { author: 'Murphy (2022)', title: 'Probabilistic models for latent academic growth' },
        { author: 'Baker (2011)', title: 'Bayesian knowledge tracing in AWE' }
      ]
    });
  }, [analytics, setInterpretation]);

  if (!analytics) {
    return null;
  }

  return (
    <div className="animate-in fade-in space-y-12 duration-700">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="data-label mb-2 flex items-center gap-2 text-primary">
            <span className="h-1.5 w-1.5 animate-pulse bg-primary shadow-[0_0_8px_rgba(192,193,255,0.6)]" />
            STATION 08 / Competence Inference
          </div>
          <h1 className="editorial-header text-3xl phosphor-glow">Bayesian Synthesis</h1>
          <p className="data-label mt-2 !text-outline">Probabilistic Knowledge Tracing • {analytics.primary.studentCode}</p>
        </div>
        <div className="flex gap-4">
          <div className="border-b-2 border-primary/20 bg-surface-container-high px-4 py-2">
            <span className="data-label mb-1 block !text-[9px] !text-outline">Subject Entity</span>
            <span className="forensic-mono text-xs font-bold uppercase tracking-widest text-primary">[ {analytics.primary.studentCode} ]</span>
          </div>
          <div className="border-b-2 border-secondary/20 bg-surface-container-high px-4 py-2">
            <span className="data-label mb-1 block !text-[9px] !text-outline">Temporal Node</span>
            <span className="forensic-mono text-xs font-bold uppercase tracking-widest text-secondary">[ {analytics.latestDraftLabel} ]</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="group relative col-span-12 overflow-hidden bg-surface-container-low p-10 lg:col-span-8">
          <div className="mb-10 flex items-center justify-between">
            <h3 className="font-headline text-2xl italic text-on-surface">Forensic Competence Map</h3>
            <div className="data-label flex items-center gap-6 !text-[9px] !font-bold">
              <span className="flex items-center gap-2 opacity-60">
                <span className="h-2.5 w-2.5 border border-outline/30 bg-outline/20" />
                Prior: Draft 1
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.4)]" />
                Posterior: {analytics.latestDraftLabel}
              </span>
            </div>
          </div>

          <div className="relative h-96 min-h-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260} initialDimension={{ width: 680, height: 360 }}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.radarData}>
                <PolarGrid stroke="#464554" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#908fa0', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181f32', border: '1px solid #464554', borderRadius: '4px' }}
                  itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Radar name="Prior: Draft 1" dataKey="prior" stroke="#908fa0" fill="#908fa0" fillOpacity={0.1} strokeDasharray="4 4" />
                <Radar name={`Posterior: ${analytics.latestDraftLabel}`} dataKey="posterior" stroke="#4fdbc8" fill="#4fdbc8" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>

            <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-default items-center gap-2 border border-secondary bg-surface px-3 py-1.5 shadow-[0_0_20px_rgba(79,219,200,0.15)] transition-transform hover:scale-105">
              <span className="data-label !text-[9px] font-bold text-secondary">Bayesian Prior Shift</span>
              <span className="material-symbols-outlined animate-pulse text-xs text-secondary">trending_up</span>
            </div>
          </div>
        </section>

        <aside className="col-span-12 space-y-8 lg:col-span-4">
          <section className="group relative overflow-hidden rounded-sm border-l-2 border-primary bg-surface-container-high p-8">
            <div className="absolute -bottom-4 -right-4 opacity-5 transition-opacity group-hover:opacity-10">
              <span className="material-symbols-outlined text-8xl font-thin">functions</span>
            </div>
            <h4 className="data-label mb-6 !text-[10px] !font-bold !text-outline">Probability Inference Engine</h4>
            <div className="forensic-mono mb-4 text-base text-primary/90 phosphor-glow">
              P(C | E) = <span className="border-b border-primary/30">P(E | C) P(C)</span><br />
              <span className="ml-16 opacity-30">P(E)</span>
            </div>
            <p className="text-[11px] italic leading-relaxed text-outline-variant">
              "Calculating the probability of competence given evidence from live linguistic and behavioral markers."
            </p>
          </section>

          <section className="space-y-6 rounded-sm bg-surface-container p-8">
            {analytics.rails.map((rail) => (
              <div key={rail.label} className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className={`data-label !text-[10px] !font-bold ${rail.delta > 0 ? 'text-primary' : 'text-outline/80'}`}>{rail.label}</span>
                  <span className={`forensic-mono text-xs font-bold ${rail.delta > 0 ? 'text-secondary' : 'text-outline'}`}>
                    {rail.delta >= 0 ? '+' : ''}{rail.delta}%
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-low">
                  <div className={`${rail.delta > 0 ? 'bg-primary' : 'bg-secondary'} h-full shadow-[0_0_8px_rgba(192,193,255,0.2)]`} style={{ width: `${rail.val}%` }} />
                </div>
              </div>
            ))}
          </section>

          <div className="flex items-center justify-between rounded-sm bg-surface-container-low p-6">
            <span className="data-label !font-bold !text-outline">KL-Divergence Gain</span>
            <span className="forensic-mono phosphor-glow text-xl font-bold text-primary">{analytics.gainBits} Bits</span>
          </div>
        </aside>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {[
          {
            icon: 'insights',
            title: 'Confidence Interval',
            desc: `Current posterior probability shows ${analytics.confidence}% average confidence across the active competencies.`,
            color: 'text-secondary'
          },
          {
            icon: 'bolt',
            title: 'Trigger Event',
            desc: `${analytics.latestDraftLabel} contributes the current evidence update, combining lexical, grammar, discourse, and argument signals.`,
            color: 'text-primary'
          },
          {
            icon: 'history',
            title: 'Historical Baseline',
            desc: `${analytics.primary.studentCode} baseline was reconstructed from Draft 1 and is now compared against the latest posterior state.`,
            color: 'text-outline'
          }
        ].map((item) => (
          <div key={item.title} className="group rounded-sm bg-surface-container p-8 transition-all hover:bg-surface-container-high">
            <span className={`material-symbols-outlined mb-4 text-2xl ${item.color}`} style={{ fontVariationSettings: item.icon === 'insights' ? "'FILL' 1" : '' }}>{item.icon}</span>
            <h5 className="mb-3 font-headline text-xl italic text-on-surface">{item.title}</h5>
            <p className="text-xs leading-relaxed text-on-surface-variant opacity-70 transition-opacity group-hover:opacity-100">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
