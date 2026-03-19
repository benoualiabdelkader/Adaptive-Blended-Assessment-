import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useStationStore } from '../../store/stationStore';
import { db } from '../../store/db';
import { buildDiagnosisData } from '../../lib/researchDerivedData';

export default function Station09_PedagogicalDiagnosis() {
  const setInterpretation = useStationStore((state) => state.setInterpretation);
  const [activeRuleIndex, setActiveRuleIndex] = useState(0);
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

  const analytics = buildDiagnosisData(snapshot ?? {});
  const resolvedActiveRuleIndex =
    analytics && analytics.rules[activeRuleIndex]
      ? activeRuleIndex
      : analytics
        ? Math.max(0, analytics.rules.findIndex((rule) => rule.id === analytics.activeRule.id))
        : 0;
  const current = analytics?.rules?.[resolvedActiveRuleIndex] || analytics?.activeRule;

  useEffect(() => {
    if (!analytics || !current) {
      return;
    }

    setInterpretation({
      notes: `The diagnosis layer is now cohort-aware. ${current.name} currently affects ${current.count} students and is surfaced from stored thresholds plus live draft/process traces.`,
      findings: [
        `${analytics.rules.length} rule families evaluated`,
        `Active diagnosis: ${current.name}`,
        `Affected students: ${current.count}`
      ],
      references: [
        { author: 'Ferris (2011)', title: 'Treatment of Error in Second Language Student Writing' },
        { author: 'Hattie & Timperley (2007)', title: 'The Power of Feedback' }
      ]
    });
  }, [analytics, current, setInterpretation]);

  if (!analytics || !current) {
    return null;
  }

  return (
    <div className="animate-in fade-in space-y-12 duration-700">
      <header className="max-w-4xl">
        <div className="mb-3 flex items-center gap-4">
          <span className="data-label font-bold text-primary">Pedagogical Diagnosis Engine</span>
          <div className="h-px flex-1 bg-outline-variant/10" />
          <span className="data-label rounded-sm border border-secondary/20 bg-secondary/10 px-3 py-1 font-bold text-secondary">
            {analytics.rules.reduce((sum, rule) => sum + rule.count, 0)} TOTAL TRIGGERS
          </span>
        </div>
        <h1 className="editorial-header text-3xl phosphor-glow">Forensic Diagnostics</h1>
        <p className="mt-4 max-w-2xl text-sm italic leading-relaxed text-on-surface-variant">
          Translating live analytics into clinical-style writing diagnoses. Each rule is now counted over the real cohort snapshot rather than a static demonstrator dataset.
        </p>
      </header>

      <div className="grid grid-cols-12 items-start gap-8">
        <section
          className={`group relative col-span-12 overflow-hidden rounded-sm border-l-[6px] bg-surface-container p-10 transition-all duration-500 lg:col-span-8 ${
            current.color === 'primary'
              ? 'border-primary shadow-[0_0_40px_rgba(192,193,255,0.05)]'
              : current.color === 'secondary'
                ? 'border-secondary shadow-[0_0_40px_rgba(79,219,200,0.05)]'
                : 'border-tertiary shadow-[0_0_40px_rgba(255,185,95,0.05)]'
          }`}
        >
          <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
            <span className="material-symbols-outlined text-8xl">fact_check</span>
          </div>

          <div className="mb-10 flex items-start justify-between">
            <div>
              <span className={`data-label mb-2 block font-bold ${
                current.color === 'primary' ? 'text-primary' : current.color === 'secondary' ? 'text-secondary' : 'text-tertiary'
              }`}>
                Active Rule Trigger
              </span>
              <h2 className="font-headline text-3xl italic text-on-surface">{current.name}: {current.subtitle}</h2>
            </div>
            <div className="rounded-sm border border-outline-variant/10 bg-surface-container-highest px-4 py-1.5">
              <span className={`forensic-mono text-[10px] font-bold uppercase tracking-widest ${
                current.color === 'primary' ? 'text-primary' : current.color === 'secondary' ? 'text-secondary' : 'text-tertiary'
              }`}>
                RULE_ID: {current.id}
              </span>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="rounded-sm bg-surface-container-low p-8">
              <div className={`mb-6 flex items-center gap-3 ${
                current.color === 'primary' ? 'text-primary' : current.color === 'secondary' ? 'text-secondary' : 'text-tertiary'
              }`}>
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
                <span className="data-label font-bold">Logic Condition (IF)</span>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="forensic-mono mt-0.5 text-sm opacity-40">01</span>
                  <p className="forensic-mono text-[12px] leading-relaxed text-on-surface-variant">
                    Condition: <span className="font-bold text-on-surface">{current.condition}</span>
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="forensic-mono mt-0.5 text-sm opacity-40">02</span>
                  <p className="forensic-mono text-[12px] leading-relaxed text-on-surface-variant">
                    Observation: <span className="font-bold text-on-surface">{current.pattern}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-sm bg-surface-container-low p-8">
              <div className={`mb-6 flex items-center gap-3 ${
                current.color === 'primary' ? 'text-primary' : current.color === 'secondary' ? 'text-secondary' : 'text-tertiary'
              }`}>
                <span className="material-symbols-outlined text-base">terminal</span>
                <span className="data-label font-bold">Intervention (THEN)</span>
              </div>
              <p className="font-body text-[14px] leading-relaxed text-on-surface opacity-90">{current.intervention}</p>
              <p className="mt-6 font-mono text-xs text-secondary">Affects {current.count} students in current cohort snapshot.</p>
            </div>
          </div>

          <div className="border-t border-outline-variant/10 pt-8">
            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined text-3xl text-slate-500 opacity-40">history_edu</span>
              <div className="flex-1">
                <span className="data-label mb-1 block font-bold !text-slate-500">Theoretical Foundation</span>
                <p className="text-[13px] italic leading-relaxed text-on-surface-variant">
                  Basis: <span className="font-bold text-on-surface">{current.basis}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="col-span-12 space-y-8 lg:col-span-4">
          <section className="rounded-sm bg-surface-container p-6">
            <h3 className="data-label mb-6 !font-bold !text-primary">Diagnostic Selector</h3>
            <div className="space-y-3">
              {analytics.rules.map((rule, index) => (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => setActiveRuleIndex(index)}
                  className={`group flex w-full items-center justify-between rounded-sm border p-4 text-left transition-all ${
                    resolvedActiveRuleIndex === index
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant/10 bg-surface-container-low text-outline hover:bg-surface-container-high'
                  }`}
                >
                  <span>
                    <span className="data-label !tracking-tighter !text-inherit !font-bold">{rule.name}</span>
                    <span className="mt-1 block font-mono text-[11px] text-on-surface-variant">{rule.count} students</span>
                  </span>
                  <span className={`material-symbols-outlined text-sm ${resolvedActiveRuleIndex === index ? 'animate-pulse' : 'opacity-20 group-hover:opacity-100'}`}>
                    {resolvedActiveRuleIndex === index ? 'check_circle' : 'arrow_forward_ios'}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="rounded-sm border border-primary/10 bg-primary/5 p-8">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="data-label !font-bold !text-primary">AI Diagnosis Sync</span>
            </div>
            <p className="font-headline text-[15px] italic leading-relaxed text-on-surface opacity-90">
              "The diagnosis layer now cross-references stored draft features, process traces, and threshold definitions before surfacing intervention priorities."
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
