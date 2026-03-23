import { useMemo } from 'react';
import { Activity, AlertCircle, BarChart3, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { MetricCard } from '../components/MetricCard';
import { PedagogicalInsightBadge } from '../components/PedagogicalInsightBadge';
import { getSelectedStudyCase, useStudyScopeStore } from '../state/studyScope';

function shortDate(timestamp: string) {
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return timestamp.slice(0, 6);
  }
  return new Date(parsed).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).replace(' ', ' ');
}

type ActivityState = NonNullable<ReturnType<typeof getSelectedStudyCase>>['activity'];

function buildTimeline(activity: ActivityState) {
  const entries = activity.entries ?? [];
  const daily = new Map<string, { dateValue: number; access: number; feedback: number; revision: number }>();

  if (entries.length > 0) {
    entries.forEach((entry) => {
      const parsed = Date.parse(entry.timestamp);
      if (Number.isNaN(parsed)) {
        return;
      }

      const label = shortDate(entry.timestamp);
      const current = daily.get(label) ?? { dateValue: parsed, access: 0, feedback: 0, revision: 0 };
      const text = `${entry.component} ${entry.event} ${entry.context} ${entry.description}`.toLowerCase();

      if (/course module viewed|status of the submission has been viewed|course viewed|user list viewed|submission viewed/.test(text)) current.access += 1;
      if (/feedback viewed|graded|feedback/.test(text)) current.feedback += 1;
      if (/comment created|online text|submission created|submitted submission|file has been uploaded/.test(text)) current.revision += 1;

      daily.set(label, current);
    });

    return Array.from(daily.entries())
      .sort((left, right) => left[1].dateValue - right[1].dateValue)
      .slice(-8)
      .map(([date, counts]) => ({
        date,
        access: counts.access,
        feedback: counts.feedback,
        revision: counts.revision,
      }));
  }

  activity.trace.forEach((entry) => {
    const label = shortDate(entry.timestamp);
    const parsed = Date.parse(entry.timestamp);
    const current = daily.get(label) ?? { dateValue: Number.isNaN(parsed) ? 0 : parsed, access: 0, feedback: 0, revision: 0 };
    const text = `${entry.event} ${entry.context} ${entry.detail}`.toLowerCase();

    if (/viewed|opened|reopened|access|submission/.test(text)) current.access += 1;
    if (/feedback|graded/.test(text)) current.feedback += 1;
    if (/revision|comment|uploaded|submitted/.test(text)) current.revision += 1;

    daily.set(label, current);
  });

  let access = 0;
  let feedback = 0;
  let revision = 0;

  return Array.from(daily.entries())
    .sort((left, right) => left[1].dateValue - right[1].dateValue)
    .slice(-8)
    .map(([date, counts]) => {
      access += counts.access;
      feedback += counts.feedback;
      revision += counts.revision;
      return { date, access, feedback, revision };
    });
}

function buildHeatmap(activity: ActivityState) {
  const entries = activity.entries ?? [];
  const datedCounts = new Map<string, number>();

  if (entries.length > 0) {
    entries.forEach((entry) => {
      const parsed = Date.parse(entry.timestamp);
      if (Number.isNaN(parsed)) {
        return;
      }
      const key = new Date(parsed).toISOString().slice(0, 10);
      datedCounts.set(key, (datedCounts.get(key) ?? 0) + 1);
    });
  } else {
    activity.trace.forEach((entry) => {
      const parsed = Date.parse(entry.timestamp);
      if (Number.isNaN(parsed)) {
        return;
      }
      const key = new Date(parsed).toISOString().slice(0, 10);
      datedCounts.set(key, (datedCounts.get(key) ?? 0) + 1);
    });
  }

  const lastSource = entries.length > 0
    ? entries[entries.length - 1]?.timestamp
    : activity.trace[activity.trace.length - 1]?.timestamp;
  const lastDate = lastSource ? Date.parse(lastSource) : Date.now();
  const days = Array.from({ length: 30 }, (_, index) => {
    const day = new Date(lastDate - (29 - index) * 86400000).toISOString().slice(0, 10);
    return datedCounts.get(day) ?? 0;
  });
  const max = Math.max(1, ...days);
  return days.map((count) => count / max);
}

export function Station03() {
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });

  const timelineData = useMemo(() => (selectedCase ? buildTimeline(selectedCase.activity) : []), [selectedCase]);
  const heatmapIntensities = useMemo(() => (selectedCase ? buildHeatmap(selectedCase.activity) : []), [selectedCase]);
  const maxTimelineValue = Math.max(1, ...timelineData.flatMap((point) => [point.access, point.feedback, point.revision]));
  const clusterName = selectedCase?.clusterName ?? 'Unclassified';
  const risk = (selectedCase?.riskLevel ?? 'monitor').toUpperCase();
  const accentColors = {
    lav: 'var(--lav)',
    teal: 'var(--teal)',
    gold: 'var(--gold)',
    red: 'var(--red)',
  } as const;

  return (
    <PipelineLayout
      verifiedEnabled={Boolean(selectedCase)}
      unavailableTitle="Verified Submission Patterns Unavailable"
      unavailableMessage="Import a verified workbook case before opening the submission-pattern station."
      rightPanel={
        selectedCase ? (
          <PedagogicalInsightBadge
            urgency="monitor"
            label="Pattern Analysis"
            observation={`Activity in ${selectedCase.meta.studentName}'s workbook intensifies around feedback and revision events across the imported period.`}
            implication="This case responds to feedback in short cycles. The pattern points to productive revision behaviour rather than last-minute panic."
            action="Preserve the short feedback cadence and attach one structural target to each revision round."
            citation="Hyland (2005) - Metadiscourse: Exploring Interaction in Writing"
          />
        ) : undefined
      }
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={3} title="Submission Pattern Analytics" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            value="1 Case"
            label="Case Study Focus"
            interpretation={`Analysis is restricted to ${selectedCase?.meta.studentName ?? 'the active learner'} and the verified workbook trace.`}
            accent="lav"
            icon={Users}
          />
          <MetricCard
            value={selectedCase?.activity.estimatedActiveMinutes ?? 0}
            label="Estimated Active Time (min)"
            interpretation="Estimated from gaps between logged Moodle events rather than a single platform timer."
            accent="teal"
            icon={Activity}
            trend={`${selectedCase?.activity.activeSessions ?? 0} sessions`}
            trendDirection="up"
          />
          <MetricCard
            value={selectedCase?.meta.introGrade ?? 'N/A'}
            label="Intro Draft Score"
            interpretation="Only the graded task shown in the workbook is used as the current scoring anchor here."
            accent="gold"
            icon={BarChart3}
          />
          <MetricCard
            value={risk}
            label="Current Review Priority"
            interpretation={`Current profile is ${clusterName}; review priority remains tied to workbook evidence rather than a standalone engine judgment.`}
            accent="red"
            icon={AlertCircle}
            trend={selectedCase?.student.triggered_rule_ids || 'No matched rules'}
            trendDirection="neutral"
          />
        </div>

        <GlassCard elevation="high" className="p-6 mb-8 w-full min-h-[340px] md:min-h-[400px]" pedagogicalLabel="Longitudinal tracking identifies reactive versus strategic regulation across the case timeline.">
          <h3 className="font-navigation text-lg font-medium text-[var(--text-primary)] mb-6">Longitudinal Engagement Trajectory</h3>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
            <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorD1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--lav)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--lav)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorD2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--teal)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorD3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="var(--text-sec)" fontSize={12} fontFamily="var(--font-forensic)" />
              <YAxis tickLine={false} axisLine={false} stroke="var(--text-sec)" fontSize={12} fontFamily="var(--font-forensic)" domain={[0, maxTimelineValue]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--bg-high)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'var(--font-body)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
                labelStyle={{ fontFamily: 'var(--font-navigation)', color: 'var(--text-sec)', marginBottom: '8px' }}
              />
              <Area type="monotone" dataKey="access" stroke="var(--lav)" fillOpacity={1} fill="url(#colorD1)" name="Platform Access" />
              <Area type="monotone" dataKey="feedback" stroke="var(--teal)" fillOpacity={1} fill="url(#colorD2)" name="Feedback Loop" />
              <Area type="monotone" dataKey="revision" stroke="var(--gold)" fillOpacity={1} fill="url(#colorD3)" name="Revision Depth" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <div className="mb-8">
          <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)] mb-4">Activity Intensity Heatmap (Final 30 Days)</h3>
          <GlassCard className="flex gap-1 overflow-x-auto pb-2 border-b border-[var(--border)] snap-x p-2" pedagogicalLabel="Intensity of engagement traces cognitive investment and effort persistence over the closing month of the course.">
            {heatmapIntensities.map((intensity, index) => {
              const colorClass = intensity > 0.8 ? 'bg-[var(--teal)]' : intensity > 0.5 ? 'bg-[var(--lav-dim)]' : intensity > 0.2 ? 'bg-[var(--bg-high)]' : 'bg-[var(--bg-raised)]';
              return (
                <div
                  key={index}
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-sm snap-start shrink-0 ${colorClass}`}
                  title={`Day ${index + 1}: ${Math.floor(intensity * 100)} relative activity units`}
                />
              );
            })}
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)]">Clicks and Participation</h3>
              <span className="font-forensic text-xs text-[var(--lav)]">{selectedCase?.activity.totalEvents ?? 0} total logged events</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCase?.activity.clickSignals.map((signal) => (
                <GlassCard
                  key={signal.label}
                  className="p-4 border-l-2"
                  style={{ borderLeftColor: accentColors[signal.accent] }}
                  pedagogicalLabel={signal.note}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-navigation text-xs uppercase tracking-widest text-[var(--text-sec)]">{signal.label}</span>
                    <span className="font-forensic text-xl" style={{ color: accentColors[signal.accent] }}>{signal.value}</span>
                  </div>
                  <p className="mt-3 font-body text-xs text-[var(--text-sec)] leading-relaxed">{signal.note}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)]">Estimated Sessions</h3>
            <span className="font-forensic text-xs text-[var(--gold)] break-words text-right">{selectedCase?.activity.sessionGapRule ?? 'No session rule available'}</span>
            </div>
            {selectedCase?.activity.highlightedSessions.map((session) => (
              <GlassCard key={`${session.start}-${session.end}`} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-navigation text-sm text-[var(--text-primary)]">{session.start}</p>
                    <p className="font-forensic text-[11px] text-[var(--text-muted)]">to {session.end}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-forensic text-lg text-[var(--teal)]">{session.minutes} min</p>
                    <p className="font-forensic text-[11px] text-[var(--text-muted)]">{session.events} events</p>
                  </div>
                </div>
                <p className="mt-3 font-body text-xs text-[var(--text-sec)] leading-relaxed">{session.focus}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)]">Chronological Trace</h3>
            <span className="font-forensic text-xs text-[var(--teal)]">Open → feedback → revision → final submission</span>
          </div>
          <div className="space-y-3">
            {selectedCase?.activity.trace.map((entry, index) => (
              <GlassCard key={`${entry.timestamp}-${entry.event}`} className="p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 shrink-0 rounded-full border border-[var(--lav-border)] bg-[var(--bg-deep)] flex items-center justify-center font-forensic text-[10px] text-[var(--lav)]">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-navigation text-sm text-[var(--text-primary)] break-words">{entry.event}</p>
                      <p className="font-body text-xs text-[var(--text-sec)] mt-1 leading-relaxed break-words">{entry.context}</p>
                      <p className="font-body text-xs text-[var(--text-muted)] mt-2 leading-relaxed break-words">{entry.detail}</p>
                    </div>
                  </div>
                  <span className="font-forensic text-[11px] text-[var(--gold)] md:shrink-0 break-words">{entry.timestamp}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <StationFooter prevPath="/pipeline/2" nextPath="/pipeline/4" />
      </div>
    </PipelineLayout>
  );
}
