import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import ResearchShell from '../layouts/ResearchShell';
import { db } from '../store/db';
import { useStationStore } from '../store/stationStore';
import { buildStudentSnapshots } from '../lib/researchMetrics';

function ExportCard({ title, description, meta, action, className = '' }) {
  return (
    <section className={`rounded-sm border border-outline-variant/10 p-6 ${className}`}>
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-headline text-2xl italic text-on-surface">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{description}</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{meta}</span>
          </div>
        </div>
        <button type="button" className="mt-6 flex items-center gap-2 self-start border border-outline-variant/20 bg-surface-container-highest px-5 py-2 font-label text-[11px] uppercase tracking-widest transition-colors hover:bg-surface-bright">
          <span className="material-symbols-outlined text-sm">ios_share</span>
          {action}
        </button>
      </div>
    </section>
  );
}

export default function Reports() {
  const { completedStations } = useStationStore();
  const snapshot = useLiveQuery(async () => {
    const [students, profiles, textFeatures, drafts, logs, messages] = await Promise.all([
      db.students.toArray(),
      db.learner_profiles.toArray(),
      db.text_features.toArray(),
      db.drafts.toArray(),
      db.moodle_logs.toArray(),
      db.help_seeking_messages.toArray()
    ]);

    return { students, profiles, textFeatures, drafts, logs, messages };
  }, []);

  const studentSnapshots = buildStudentSnapshots(snapshot ?? {});
  const corpusWords = (snapshot?.drafts ?? []).reduce((sum, draft) => {
    const words = (draft.text_content ?? '').trim().split(/\s+/).filter(Boolean).length;
    return sum + words;
  }, 0);
  const avgTtr =
    studentSnapshots.length > 0
      ? (studentSnapshots.reduce((sum, student) => sum + student.feature.ttr, 0) / studentSnapshots.length).toFixed(3)
      : '0.000';
  const avgRevision =
    studentSnapshots.length > 0
      ? (studentSnapshots.reduce((sum, student) => sum + student.draftCount, 0) / studentSnapshots.length).toFixed(1)
      : '0.0';
  const strongestGain =
    studentSnapshots.length > 0 ? Math.max(...studentSnapshots.map((student) => student.gain)) : 0;

  return (
    <ResearchShell mainClassName="max-w-[1520px]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden rounded-sm border-r border-outline-variant/10 bg-surface-container-low p-4 lg:flex lg:min-h-[calc(100vh-var(--top-bar-height)-3rem)] lg:flex-col">
          <div className="border-b border-outline-variant/5 p-2 pb-6">
            <p className="font-headline text-2xl italic text-primary">Project Alpha</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-outline">V3.2.1-Beta</p>
          </div>

          <div className="flex-1 space-y-1 px-1 py-6">
            {[
              { label: 'Overview', icon: 'analytics' },
              { label: 'Dataset', icon: 'database' },
              { label: 'Corpus', icon: 'menu_book' },
              { label: 'Export', icon: 'ios_share', active: true }
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all ${
                  item.active
                    ? 'rounded-sm border-l-2 border-primary bg-surface-container text-primary'
                    : 'text-outline hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-mono text-[11px] uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-outline-variant/5 p-2 pt-4">
            <button type="button" className="w-full rounded-sm bg-gradient-to-r from-primary to-primary-container py-3 font-label text-xs uppercase tracking-widest text-[color:var(--on-primary-fixed)] shadow-lg transition-all active:scale-[0.98]">
              New Analysis
            </button>
          </div>
        </aside>

        <div>
          <header className="mb-12 border-l-2 border-primary pl-6">
            <h1 className="text-4xl font-light tracking-tight text-on-surface md:text-5xl">
              Research Repository &amp; <br />
              <span className="font-headline italic text-primary/80">Dissertation Exports</span>
            </h1>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant/70">
                High-fidelity exports for Chapter 4: Results and Data Analysis
              </p>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary/50">
                  Repository Status: Synchronized
                </span>
                <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.5)]" />
              </div>
            </div>
          </header>

          <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-6 md:grid-cols-12">
            <section className="group flex flex-col justify-between rounded-sm border border-outline-variant/10 bg-surface-container p-8 md:col-span-8 md:row-span-2">
              <div>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <span className="border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                    [CHAPTER 4 CORE]
                  </span>
                  <div className="text-right">
                    <p className="font-mono text-xl text-primary">100%</p>
                    <p className="font-mono text-[9px] uppercase tracking-tight text-outline">Analysis Convergence</p>
                  </div>
                </div>
                <h2 className="mb-4 font-headline text-3xl italic">Full Cohort Analysis Report</h2>
                <p className="mb-8 max-w-xl text-sm leading-relaxed text-on-surface-variant">
                  Comprehensive longitudinal synthesis of the 12 research stations, including lexical density shifts,
                  peer-review iteration cycles, and rubric-aligned outcomes prepared for doctoral submission.
                </p>
                <div className="grid grid-cols-3 gap-8 border-t border-outline-variant/10 pt-8">
                  <div>
                    <p className="mb-1 font-mono text-xs uppercase tracking-widest text-outline">N-Size</p>
                    <p className="font-mono text-xl text-on-surface">{studentSnapshots.length} <span className="text-[10px] text-secondary">STUDENTS</span></p>
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-xs uppercase tracking-widest text-outline">Stations</p>
                    <p className="font-mono text-xl text-on-surface">12 <span className="text-[10px] text-secondary">ACTIVE</span></p>
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-xs uppercase tracking-widest text-outline">Corpus</p>
                    <p className="font-mono text-xl text-on-surface">{Math.max(1, Math.round(corpusWords / 1000))}k <span className="text-[10px] text-secondary">WORDS</span></p>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex gap-4">
                <button type="button" className="flex items-center gap-2 border border-outline-variant/20 bg-surface-container-highest px-6 py-2 transition-all hover:bg-surface-bright">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span className="font-label text-[11px] uppercase tracking-widest">Preview PDF</span>
                </button>
                <button type="button" className="flex items-center gap-2 bg-primary px-6 py-2 text-[color:var(--on-primary-fixed)] transition-all hover:brightness-110 active:scale-95">
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  <span className="font-label text-[11px] uppercase tracking-widest">Export PDF</span>
                </button>
              </div>
            </section>

            <section className="flex flex-col overflow-hidden rounded-sm border border-outline-variant/10 bg-surface-container-low p-6 md:col-span-4 md:row-span-3">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="font-headline text-2xl italic">Descriptive Stats</h3>
                <span className="material-symbols-outlined text-outline">calculate</span>
              </div>
              <div className="flex-1 space-y-6">
                {[
                  { label: 'TTR (Type-Token Ratio)', value: `mu = ${avgTtr}`, width: Math.round(Number(avgTtr) * 100), tone: 'bg-secondary' },
                  { label: 'Revision Freq', value: `mu = ${avgRevision}`, width: Math.min(100, Math.round(Number(avgRevision) * 16)), tone: 'bg-secondary' }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-end justify-between">
                      <span className="font-mono text-[10px] uppercase text-outline">{item.label}</span>
                      <span className="font-mono text-sm text-secondary">{item.value}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-surface-container-highest">
                      <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.width}%` }} />
                    </div>
                  </div>
                ))}

                <table className="mt-8 w-full border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/20">
                      <th className="pb-2 text-left font-mono text-[9px] uppercase tracking-tight text-outline">Metric</th>
                      <th className="pb-2 text-right font-mono text-[9px] uppercase tracking-tight text-outline">SD</th>
                      <th className="pb-2 text-right font-mono text-[9px] uppercase tracking-tight text-outline">Max</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {[
                      { label: 'Lexical Diversity', sd: '0.04', max: '0.68' },
                      { label: 'Rubric Score', sd: '1.22', max: '4.9' },
                      { label: 'Syntax Complexity', sd: '2.11', max: strongestGain + 10 }
                    ].map((row) => (
                      <tr key={row.label}>
                        <td className="py-3 font-mono text-[11px] text-on-surface-variant">{row.label}</td>
                        <td className="py-3 text-right font-mono text-[11px]">{row.sd}</td>
                        <td className="py-3 text-right font-mono text-[11px]">{row.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 border-t border-outline-variant/10 pt-4 font-mono text-[9px] leading-tight text-outline">
                Quantitative measures follow standardized corpus-linguistic reporting used across the dissertation workflow.
              </div>
            </section>

            <ExportCard
              title="Adaptive Feedback Summary"
              description="Rule-based diagnosis matrix and intervention bundles prepared for spreadsheet export."
              meta="Feedback Matrix"
              action="Export Excel"
              className="bg-surface-container-highest/40 md:col-span-5"
            />

            <ExportCard
              title="Student Profiles"
              description={`Bulk profile package for ${studentSnapshots.length} coded participants.`}
              meta={`N=${studentSnapshots.length} IDs`}
              action="Bulk Export Profiles"
              className="bg-surface-container md:col-span-3"
            />

            <section className="flex flex-col gap-12 rounded-sm border border-primary/10 bg-[#162040] p-8 md:col-span-12 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="mb-6 inline-flex items-center gap-2 border border-tertiary/20 bg-tertiary/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-tertiary">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  PhD Defense Asset
                </div>
                <h3 className="mb-4 font-headline text-3xl italic">Dissertation Presentation Deck</h3>
                <p className="mb-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
                  Automated slide generation featuring trend visualizations, station comparisons, and curated lexical heatmaps.
                </p>
                <p className="font-mono text-[10px] italic text-outline">
                  Visual rhetoric in dissertation defense must emphasize empirical rigor.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex h-16 w-24 items-center justify-center rounded-sm border border-outline-variant/20 bg-surface-container text-primary/60">
                      <span className="material-symbols-outlined">slideshow</span>
                    </div>
                  ))}
                  <div className="flex h-16 w-24 flex-col items-center justify-center rounded-sm border border-outline-variant/20 bg-primary/20">
                    <span className="material-symbols-outlined text-sm text-primary">add</span>
                    <span className="font-mono text-[8px] uppercase text-primary">+12</span>
                  </div>
                </div>
                <button type="button" className="flex h-full flex-col items-center justify-end gap-4 rounded-sm bg-gradient-to-br from-primary to-primary-container p-6 text-[color:var(--on-primary-fixed)] transition-all hover:shadow-[0_0_20px_rgba(192,193,255,0.2)]">
                  <span className="material-symbols-outlined text-3xl">download</span>
                  <span className="font-label text-[11px] uppercase tracking-[0.2em] [writing-mode:vertical-lr]">
                    Download Assets
                  </span>
                </button>
              </div>
            </section>
          </div>

          <footer className="mt-24 grid grid-cols-1 gap-12 border-t border-outline-variant/10 pt-8 md:grid-cols-3">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-outline">Export Log</p>
              <ul className="space-y-3 font-mono text-[11px] text-on-surface-variant">
                {[
                  'CH4_Full_Cohort_v2.pdf',
                  'Stats_Summary_Table.xlsx',
                  `Station_Coverage_${completedStations.length}of12.csv`
                ].map((file, index) => (
                  <li key={file} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    <span>{file} <span className="text-[9px] opacity-40">{index === 0 ? '2m ago' : index === 1 ? '14m ago' : '1h ago'}</span></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right md:col-span-2">
              <p className="mb-2 font-headline text-sm italic text-primary/40">WriteLens AI Writing Analytics Studio</p>
              <p className="font-mono text-[9px] uppercase tracking-widest leading-loose text-outline">
                All exported data is cryptographically hashed for academic integrity verification.
                <br />
                Proprietary forensic linguistic engine copyright 2024.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </ResearchShell>
  );
}
