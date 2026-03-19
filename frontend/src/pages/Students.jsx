import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import ResearchShell from '../layouts/ResearchShell';
import { db } from '../store/db';
import { buildStudentSnapshots, getProfileBadge, getRiskBadge } from '../lib/researchMetrics';

const FILTER_PROFILES = ['All Profiles', 'Strategic', 'Efficient', 'Struggling', 'At-Risk'];

function StudentDetailPanel({ student }) {
  if (!student) {
    return null;
  }

  const radarPath = `M50 ${100 - student.bayesianEstimate * 0.7}
    L${60 + student.postScore * 0.28} ${34 + student.engagement * 0.16}
    L${58 + student.gain * 1.1} ${68 + student.draftCount * 1.5}
    L${42 - Math.max(0, (60 - student.resourceAccess) * 0.18)} ${70 + student.timeOnTask * 0.03}
    L${28 - Math.max(0, (55 - student.loginRate) * 0.12)} ${34 + student.riskScore * 0.16} Z`;

  return (
    <div className="space-y-0">
      <div className="border-b border-outline-variant/10 p-1 pb-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl italic text-on-surface">{student.studentCode}</span>
            <span className="font-label text-[10px] uppercase tracking-widest text-outline">Profile: {student.id}</span>
          </div>
          <span className="rounded-sm bg-secondary/10 px-2 py-1 font-label text-[9px] uppercase tracking-tight text-secondary">
            {student.status}
          </span>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-tertiary">bolt</span>
          <span className="font-label text-xs font-bold text-on-surface">{student.profile}</span>
        </div>
        <p className="font-label text-[10px] uppercase text-outline">Last active: {student.lastActive}</p>
      </div>

      <div className="border-b border-outline-variant/10 py-6">
        <h3 className="mb-4 font-label text-[10px] uppercase tracking-widest text-outline">Moodle Behavior Matrix</h3>
        <div className="space-y-3">
          {[
            { label: 'Logins', value: student.loginRate, tone: 'bg-primary' },
            { label: 'Revisions', value: student.postScore, tone: 'bg-secondary' },
            { label: 'Time on Task', value: Math.min(100, Math.round(student.timeOnTask / 2)), tone: 'bg-tertiary' },
            { label: 'Resource Access', value: student.resourceAccess, tone: 'bg-primary/50' }
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between font-label text-[9px] uppercase tracking-tight text-on-surface/70">
                <span>{item.label}</span>
                <span className="font-mono">{item.value}%</span>
              </div>
              <div className="h-1 w-full bg-surface-container-highest">
                <div className={`h-full ${item.tone}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
          <div className="grid h-8 grid-cols-6 gap-1 pt-4">
            <div className="bg-primary/20" />
            <div className="bg-primary/40" />
            <div className="bg-primary/10" />
            <div className="bg-secondary/60" />
            <div className="bg-tertiary/40" />
            <div className="bg-[color:var(--error)]/30" />
          </div>
          <p className="text-center font-label text-[9px] uppercase text-outline">Forensic Temporal Map</p>
        </div>
      </div>

      <div className="border-b border-outline-variant/10 bg-surface-container-lowest/30 py-6">
        <h3 className="mb-6 font-label text-[10px] uppercase tracking-widest text-outline">Performance Radar (5D)</h3>
        <div className="relative flex aspect-square w-full items-center justify-center rounded-full border border-outline-variant/5">
          <svg className="h-48 w-48 drop-shadow-[0_0_15px_rgba(192,193,255,0.1)]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
            <line x1="50" x2="50" y1="5" y2="95" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
            <line x1="5" x2="95" y1="50" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
            <path d={radarPath} fill="rgba(192, 193, 255, 0.2)" stroke="#c0c1ff" strokeWidth="1.5" />
          </svg>
          <div className="absolute top-2 font-label text-[8px] uppercase tracking-tight text-on-surface">Grammar</div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 font-label text-[8px] uppercase tracking-tight text-on-surface">Lexical</div>
          <div className="absolute bottom-2 font-label text-[8px] uppercase tracking-tight text-on-surface">Organization</div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 font-label text-[8px] uppercase tracking-tight text-on-surface">Argument</div>
        </div>
      </div>

      <div className="py-6">
        <h3 className="mb-4 font-label text-[10px] uppercase tracking-widest text-outline">AI Bayesian Estimate</h3>
        <div className="rounded-sm border border-primary/10 bg-surface-container p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-label text-[10px] uppercase text-outline">Lexical Competence</span>
            <span className="font-mono text-xl font-bold text-primary">{student.bayesianEstimate}%</span>
          </div>
          <div className="space-y-1">
            <div className="relative h-1 w-full bg-surface-container-highest">
              <div className="absolute left-0 top-0 h-full bg-primary/40 blur-[2px]" style={{ width: `${Math.min(100, student.bayesianEstimate + 8)}%` }} />
              <div className="absolute left-0 top-0 h-full bg-primary" style={{ width: `${student.bayesianEstimate}%` }} />
            </div>
            <p className="text-right font-label text-[8px] uppercase text-outline">
              Confidence: {student.revisionIndex.toFixed(2)}
            </p>
          </div>
        </div>
        <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 border border-outline-variant/30 py-3 font-label text-[11px] uppercase tracking-widest transition-colors hover:bg-surface-container-highest">
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          Full Analysis Report
        </button>
      </div>
    </div>
  );
}

export default function Students() {
  const [profileFilter, setProfileFilter] = useState('All Profiles');
  const [engagementFilter, setEngagementFilter] = useState('All Levels');
  const [query, setQuery] = useState('');
  const [selectedStudentKey, setSelectedStudentKey] = useState(null);

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

  const rows = buildStudentSnapshots(snapshot ?? {});
  const filteredRows = rows.filter((student) => {
    const matchesProfile = profileFilter === 'All Profiles' || student.profile === profileFilter;
    const matchesQuery =
      !query ||
      student.studentCode.toLowerCase().includes(query.toLowerCase()) ||
      student.name.toLowerCase().includes(query.toLowerCase());

    const matchesEngagement =
      engagementFilter === 'All Levels' ||
      (engagementFilter === 'High' && student.engagement >= 75) ||
      (engagementFilter === 'Medium' && student.engagement >= 50 && student.engagement < 75) ||
      (engagementFilter === 'Low' && student.engagement < 50);

    return matchesProfile && matchesQuery && matchesEngagement;
  });

  const getStudentKey = (student) => `${student.id}-${student.studentCode}`;
  const activeSelectedStudentKey =
    selectedStudentKey && filteredRows.some((student) => getStudentKey(student) === selectedStudentKey)
      ? selectedStudentKey
      : (filteredRows[0] ? getStudentKey(filteredRows[0]) : null);
  const selectedStudent =
    filteredRows.find((student) => getStudentKey(student) === activeSelectedStudentKey) ?? filteredRows[0] ?? null;
  const priorityAlerts = [...rows].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  return (
    <ResearchShell sidePanel={<StudentDetailPanel student={selectedStudent} />} mainClassName="max-w-[1500px]">
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-headline text-4xl italic text-on-surface">Researcher Registry</h1>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-outline">
            Dataset: Spring 2024 Writing Cohort (N={rows.length})
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="flex items-center gap-2 border border-outline-variant/10 bg-surface-container-high px-4 py-2 font-label text-[11px] uppercase tracking-widest transition-colors hover:bg-surface-container-highest">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Dataset
          </button>
          <button type="button" className="bg-gradient-to-r from-primary to-primary-container px-6 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[color:var(--on-primary-fixed)]">
            Add New Subject
          </button>
        </div>
      </div>

      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[color:var(--error)]" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <h2 className="font-label text-xs font-bold uppercase tracking-widest text-[color:var(--error)]">
            Students Requiring Immediate Attention
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {priorityAlerts.map((student, index) => (
            <button
              key={`${getStudentKey(student)}-${index}`}
              type="button"
              onClick={() => setSelectedStudentKey(getStudentKey(student))}
              className="cursor-pointer border-l-2 border-[color:var(--error)] bg-surface-container-low p-4 text-left transition-colors hover:bg-surface-container"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="font-label text-lg font-bold text-on-surface">{student.studentCode}</span>
                <span className={`px-1.5 py-0.5 font-label text-[10px] ${getRiskBadge(student.riskLabel)}`}>
                  {student.riskLabel}
                </span>
              </div>
              <div className="mb-4 space-y-1">
                <p className="font-label text-[10px] uppercase text-outline">Learner Profile</p>
                <p className="text-xs text-on-surface">{student.profile}</p>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full bg-[color:var(--error)]" style={{ width: `${student.riskScore}%` }} />
              </div>
              <p className="mt-1 text-[9px] text-outline">Engagement: {student.engagement}%</p>
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-sm border border-outline-variant/10 bg-surface-container">
        <div className="flex flex-wrap items-center gap-6 border-b border-outline-variant/10 bg-surface-container-low px-6 py-4">
          <div className="flex items-center gap-3">
            <label className="font-label text-[10px] uppercase tracking-widest text-outline">Profile</label>
            <select
              value={profileFilter}
              onChange={(event) => setProfileFilter(event.target.value)}
              className="border-none bg-surface px-3 py-1 text-xs font-label focus:ring-1 focus:ring-primary"
            >
              {FILTER_PROFILES.map((profile) => (
                <option key={profile}>{profile}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="font-label text-[10px] uppercase tracking-widest text-outline">Engagement</label>
            <select
              value={engagementFilter}
              onChange={(event) => setEngagementFilter(event.target.value)}
              className="border-none bg-surface px-3 py-1 text-xs font-label focus:ring-1 focus:ring-primary"
            >
              {['All Levels', 'High', 'Medium', 'Low'].map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto relative">
            <span className="material-symbols-outlined absolute left-2 top-1.5 text-sm text-outline">search</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ID..."
              className="w-52 border-none bg-surface py-1.5 pl-8 text-xs font-label focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-high/50 font-label text-[10px] uppercase tracking-widest text-outline">
                <th className="px-6 py-4 font-medium">Student ID</th>
                <th className="px-4 py-4 font-medium">Learner Profile</th>
                <th className="px-4 py-4 font-medium">Pre</th>
                <th className="px-4 py-4 font-medium">Post</th>
                <th className="px-4 py-4 font-medium">Gain</th>
                <th className="px-4 py-4 font-medium">Engage</th>
                <th className="px-4 py-4 font-medium">Drafts</th>
                <th className="px-4 py-4 font-medium">Feedback</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.slice(0, 12).map((student, index) => (
                <tr
                  key={`${getStudentKey(student)}-${index}`}
                  className={`group cursor-pointer border-b border-outline-variant/5 transition-colors hover:bg-surface-container-highest ${
                    getStudentKey(selectedStudent || { id: '', studentCode: '' }) === getStudentKey(student) ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedStudentKey(getStudentKey(student))}
                >
                  <td className="px-6 py-4 font-bold text-on-surface">{student.studentCode}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-sm px-2 py-0.5 ${getProfileBadge(student.profile)}`}>
                      {student.profile}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono">{student.preScore}%</td>
                  <td className="px-4 py-4 font-mono">{student.postScore}%</td>
                  <td className="px-4 py-4 font-mono text-secondary">+{student.gain}%</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((index) => (
                        <div
                          key={`${getStudentKey(student)}-bar-${index}`}
                          className={`h-3 w-1.5 ${student.engagement >= 75 - index * 20 ? 'bg-secondary' : 'bg-outline-variant/30'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono">{student.draftCount}</td>
                  <td className="px-4 py-4">
                    <span className={`material-symbols-outlined text-sm ${student.feedbackSeen ? 'text-secondary' : 'text-outline-variant'}`}>
                      {student.feedbackSeen ? 'check_circle' : 'cancel'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[10px] uppercase tracking-widest text-outline">{student.status}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="material-symbols-outlined text-outline transition-colors group-hover:text-primary">
                      chevron_right
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-outline-variant/10 px-6 py-4">
          <p className="font-label text-[10px] uppercase text-outline">
            Showing {Math.min(12, filteredRows.length)} of {rows.length} Results
          </p>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={`flex h-8 w-8 items-center justify-center border font-label text-xs ${
                  page === 1
                    ? 'border-primary bg-primary text-[color:var(--on-primary-fixed)]'
                    : 'border-outline-variant/20 hover:bg-surface-container-high'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </section>
    </ResearchShell>
  );
}
