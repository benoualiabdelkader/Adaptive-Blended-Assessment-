import React from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import ResearchShell from '../layouts/ResearchShell';
import { db } from '../store/db';
import { useStationStore } from '../store/stationStore';
import { buildDashboardSummary, buildStudentSnapshots, getProfileBadge } from '../lib/researchMetrics';

function MetricCard({ label, value, accent, meta, icon }) {
  return (
    <div className={`rounded-sm border border-outline-variant/10 bg-surface-container p-5 border-l-2 ${accent}`}>
      <div className="mb-2 flex items-start justify-between">
        <span className="material-symbols-outlined text-lg text-on-surface/60">{icon}</span>
        <span className="font-mono text-[10px] text-outline">{meta}</span>
      </div>
      <p className="mb-1 font-label text-xs uppercase tracking-widest text-outline">{label}</p>
      <p className="font-mono text-3xl font-bold text-on-surface">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { completedStations, stats, interpretation } = useStationStore();
  const MotionDiv = motion.div;
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
  const summary = buildDashboardSummary(studentSnapshots, snapshot?.drafts ?? [], completedStations, stats);
  const atRiskStudents = [...studentSnapshots].sort((a, b) => b.riskScore - a.riskScore).slice(0, 3);
  const strongestStudents = [...studentSnapshots].sort((a, b) => b.gain - a.gain).slice(0, 2);
  const spotlightStudents = [
    ...new Map(
      atRiskStudents
        .concat(strongestStudents)
        .map((student) => [`${student.id}-${student.studentCode}`, student])
    ).values()
  ].slice(0, 4);

  const sidePanel = (
    <div className="space-y-8">
      <div className="border-b border-outline-variant/10 pb-6">
        <h2 className="font-label text-[11px] uppercase tracking-widest text-primary">Interpretation</h2>
        <p className="text-xs text-outline">Forensic Detail</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="border-b border-primary/20 py-1 font-label text-xs uppercase tracking-tight text-primary">
            Research Notes
          </span>
          <span className="material-symbols-outlined text-sm text-outline">description</span>
        </div>
        <p className="text-sm italic leading-relaxed text-on-surface/75">
          {interpretation.notes || 'Cohort signals are stabilizing as the writing cycle advances through the current intervention loop.'}
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="border-b border-outline-variant/20 py-1 font-label text-xs uppercase tracking-tight text-on-surface-variant">
            Key Findings
          </span>
          <span className="material-symbols-outlined text-sm text-outline">insights</span>
        </div>
        <div className="space-y-3">
          {(interpretation.findings?.length ? interpretation.findings : [
            `${summary.atRiskCount} students currently require targeted action.`,
            `${summary.completionPercent}% of the analytic pipeline is complete.`,
            `${summary.corpusWords.toLocaleString()} words are archived in the working corpus.`
          ]).map((finding, index) => (
            <div key={`${finding}-${index}`} className="flex gap-3 text-sm text-on-surface/80">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{finding}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="border-b border-outline-variant/20 py-1 font-label text-xs uppercase tracking-tight text-on-surface-variant">
            Priority Students
          </span>
          <span className="material-symbols-outlined text-sm text-outline">warning</span>
        </div>
        <div className="space-y-3">
          {atRiskStudents.map((student, index) => (
            <div key={`${student.id}-${student.studentCode}-${index}`} className="rounded-sm border border-outline-variant/15 bg-surface-container p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-label text-xs font-bold text-on-surface">{student.studentCode}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-outline">{student.profile}</p>
                </div>
                <span className="rounded-sm bg-[color:var(--error)]/10 px-2 py-1 font-label text-[11px] uppercase tracking-tight text-[color:var(--error)]">
                  {student.riskLabel}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full bg-[color:var(--error)]" style={{ width: `${student.riskScore}%` }} />
              </div>
              <p className="mt-2 text-[10px] text-outline">Expected growth pressure: {student.gain}% delta</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2 border-t border-outline-variant/10 pt-6">
        <button type="button" className="w-full rounded-sm border border-outline-variant/15 bg-surface-container p-3 text-left font-label text-xs uppercase tracking-widest transition-colors hover:bg-surface-container-high">
          Issue Global Feedback
        </button>
        <button type="button" className="w-full rounded-sm border border-outline-variant/15 bg-surface-container p-3 text-left font-label text-xs uppercase tracking-widest transition-colors hover:bg-surface-container-high">
          Re-run Station 07
        </button>
        <button type="button" className="w-full rounded-sm border border-primary/25 bg-primary/5 p-3 text-left font-label text-[10px] uppercase tracking-widest text-primary transition-colors hover:bg-primary/10">
          Export Preliminary Data
        </button>
      </section>
    </div>
  );

  return (
    <ResearchShell sidePanel={sidePanel}>
      <section className="mb-10">
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="mb-2 font-headline text-2xl text-on-surface md:text-3xl">
            Welcome back, Dr. Aris. Your research study is active.
          </h1>
          <div className="flex items-center gap-2 font-label text-xs uppercase tracking-[0.2em] text-secondary/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            System status optimal. Data synchronization complete.
          </div>
        </MotionDiv>
      </section>

      <section className="glass-panel relative mb-8 overflow-hidden rounded-lg p-6">
        <div className="absolute right-0 top-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-6xl">menu_book</span>
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <p className="mb-2 font-label text-xs uppercase tracking-[0.2em] text-primary">Active Dissertation Study</p>
            <h2 className="mb-4 max-w-3xl font-headline text-xl leading-tight text-on-surface md:text-2xl">
              Adaptive blended assessment through learning analytics and artificial intelligence to enhance academic writing performance.
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <p className="mb-1 font-label text-[11px] uppercase tracking-widest text-outline">Institution</p>
                <p className="text-sm font-medium">Belhadj Bouchaib University</p>
              </div>
              <div>
                <p className="mb-1 font-label text-[11px] uppercase tracking-widest text-outline">Module</p>
                <p className="text-sm font-medium">Academic Writing III</p>
              </div>
              <div>
                <p className="mb-1 font-label text-[11px] uppercase tracking-widest text-outline">Academic Year</p>
                <p className="font-mono text-sm font-medium">2025-2026</p>
              </div>
            </div>
          </div>

          <div className="w-full rounded border border-outline-variant/20 bg-surface-container-high p-4 md:w-auto">
            <p className="mb-2 text-center font-label text-xs uppercase tracking-widest text-outline">Analysis Progress</p>
            <div className="relative mx-auto mb-2 h-16 w-16">
              <svg className="h-16 w-16" viewBox="0 0 36 36">
                <path
                  className="fill-none stroke-surface-container-highest"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  strokeWidth="2.5"
                />
                <path
                  className="fill-none stroke-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  strokeDasharray={`${summary.completionPercent}, 100`}
                  strokeLinecap="square"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono text-sm">
                {summary.completionPercent}%
              </div>
            </div>
            <p className="text-center font-label text-xs">{summary.completedCount} / 12 Stations</p>
          </div>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Students" value={summary.totalStudents} meta="+2 this week" accent="border-primary" icon="groups" />
        <MetricCard label="Avg Writing Score" value={`${summary.avgWritingScore}/5.0`} meta="Target: 3.5" accent="border-secondary" icon="edit_note" />
        <MetricCard label="Engagement Rate" value={`${summary.engagementRate}%`} meta={`${stats.highEngagementPct}% high engagement`} accent="border-primary-container" icon="query_stats" />
        <MetricCard label="At-Risk Count" value={String(summary.atRiskCount).padStart(2, '0')} meta="Action required" accent="border-[color:var(--error)]" icon="warning" />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="glass-panel rounded-lg border border-outline-variant/10 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-label text-xs font-bold uppercase tracking-widest">Cohort Score Distribution</h3>
            <span className="font-mono text-xs text-outline">N={summary.totalStudents} Students</span>
          </div>
          <div className="space-y-4">
            {summary.distribution.map((item) => {
              const width = summary.totalStudents > 0 ? Math.max(8, Math.round((item.count / summary.totalStudents) * 100)) : 0;
              return (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="w-20 font-mono text-xs text-outline">{item.label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                    <div className={`h-full ${item.color}`} style={{ width: `${width}%` }} />
                  </div>
                  <span className="w-8 font-mono text-xs">{String(item.count).padStart(2, '0')}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel rounded-lg border border-outline-variant/10 p-6">
          <h3 className="mb-6 font-label text-xs font-bold uppercase tracking-widest">Study Progress</h3>
          <div className="relative space-y-8 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-px before:bg-outline-variant/30 before:content-['']">
            {[
              { title: 'Data Collected', detail: `${snapshot?.drafts?.length ?? 0} draft artifacts archived`, done: true },
              { title: 'Analysis Running', detail: `Stations 1-${summary.completedCount} processed`, done: true },
              { title: 'Feedback Cycle 2/3', detail: `${summary.atRiskCount} targeted cases queued`, active: true },
              { title: 'Final Report Generation', detail: 'Scheduled after pipeline completion', muted: true }
            ].map((step) => (
              <div key={step.title} className={step.muted ? 'opacity-40' : ''}>
                <div className={`absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-4 border-surface ${
                  step.active ? 'bg-primary ring-2 ring-primary/20' : step.done ? 'bg-secondary' : 'bg-surface-container-highest'
                }`}
                />
                <p className={`text-xs font-bold ${step.active ? 'text-primary' : 'text-on-surface'}`}>{step.title}</p>
                <p className="text-xs text-outline">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="grid grid-cols-1 gap-4 md:col-span-2 sm:grid-cols-3">
          {[
            { label: 'Open Pipeline', detail: 'Jump to Station 01', icon: 'rocket_launch', to: '/pipeline', accent: 'text-primary' },
            { label: 'View Students', detail: 'Cohort performance', icon: 'person_search', to: '/students', accent: 'text-secondary' },
            { label: 'Open Reports', detail: 'Dissertation exports', icon: 'cloud_download', to: '/reports', accent: 'text-tertiary' }
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group rounded border border-outline-variant/10 bg-surface-container p-5 transition-all hover:bg-surface-container-high"
            >
              <span className={`material-symbols-outlined mb-3 block ${item.accent}`}>{item.icon}</span>
              <p className="font-label text-xs font-bold uppercase tracking-widest">{item.label}</p>
              <p className="mt-1 text-xs text-outline">{item.detail}</p>
            </Link>
          ))}
        </div>

        <div className="rounded border border-outline-variant/10 bg-surface-container-lowest p-4">
          <h3 className="mb-4 flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">history</span>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              `Batch analysis reached Station ${summary.completedCount}.`,
              `Top gain: ${strongestStudents[0]?.studentCode ?? 'S01'} improved by ${strongestStudents[0]?.gain ?? 0} points.`,
              `${summary.atRiskCount} students are marked for monitoring.`,
              `${summary.corpusWords.toLocaleString()} corpus words indexed.`
            ].map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-3">
                <div className={`h-1.5 w-1.5 rounded-full ${index % 2 === 0 ? 'bg-secondary' : 'bg-primary'}`} />
                <div className="flex-1">
                  <p className="text-xs text-on-surface">{item}</p>
                  <p className="font-mono text-[11px] text-outline">{index === 0 ? '09:42 AM' : index === 1 ? '08:15 AM' : 'Yesterday'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {spotlightStudents.map((student, index) => (
          <div key={`${student.id}-${student.studentCode}-${index}`} className="rounded-sm border border-outline-variant/10 bg-surface-container-low p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-label text-xs uppercase tracking-widest text-outline">{student.studentCode}</p>
                <h3 className="font-headline text-2xl italic text-on-surface">{student.name}</h3>
              </div>
              <span className={`rounded-sm px-2 py-1 font-label text-[11px] uppercase tracking-tight ${getProfileBadge(student.profile)}`}>
                {student.profile}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-label text-[11px] uppercase tracking-widest text-outline">Post</p>
                <p className="font-mono text-xl text-on-surface">{student.postScore}%</p>
              </div>
              <div>
                <p className="font-label text-[11px] uppercase tracking-widest text-outline">Gain</p>
                <p className="font-mono text-xl text-secondary">+{student.gain}</p>
              </div>
              <div>
                <p className="font-label text-[11px] uppercase tracking-widest text-outline">Engagement</p>
                <p className="font-mono text-xl text-primary">{student.engagement}%</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </ResearchShell>
  );
}
