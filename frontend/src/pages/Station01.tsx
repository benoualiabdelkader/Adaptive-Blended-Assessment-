import { FileText, CheckCircle2, Users } from 'lucide-react';
import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { PedagogicalInsightBadge } from '../components/PedagogicalInsightBadge';
import { StatusChip } from '../components/Atoms';
import { getSelectedStudyCase, useStudyScopeStore } from '../state/studyScope';

export function Station01() {
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });
  const rubricCriteria = selectedCase?.rubric.criteria ?? [];
  const latestArtifact = selectedCase?.writing.artifacts[selectedCase.writing.artifacts.length - 1] ?? null;
  const accentCycle: Array<'lav' | 'teal' | 'gold' | 'red'> = ['lav', 'teal', 'gold', 'lav'];
  const accentColors = {
    lav: 'var(--lav)',
    teal: 'var(--teal)',
    gold: 'var(--gold)',
    red: 'var(--red)',
  } as const;

  return (
    <PipelineLayout
      verifiedEnabled={Boolean(selectedCase)}
      unavailableTitle="Verified Writing Task Unavailable"
      unavailableMessage="Import a verified workbook case before opening the writing-task context station."
      rightPanel={
        selectedCase ? (
          <PedagogicalInsightBadge
            urgency="monitor"
            label="Task Context Analysis"
            observation={`${selectedCase.meta.studentName} completed ${selectedCase.meta.totalAssignmentsSubmitted} tracked submissions across the monitored period and repeatedly returned to the task after feedback.`}
            implication="The issue is not task avoidance. The main need is stronger modelling of claims, evidence, and academic phrasing inside the current task structure."
            action="Keep the assignment design stable and use the next feedback round to make argument structure more explicit."
            citation="Weigle (2002) - Assessing Writing"
          />
        ) : undefined
      }
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={1} title="Writing Task Context" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)]">Rubric Criteria</h3>
              <StatusChip variant="gold">{selectedCase?.rubric.totalMaxPoints ?? 0} POINTS MAX</StatusChip>
            </div>
            {rubricCriteria.map((criterion, index) => {
              const accent = accentCycle[index % accentCycle.length];

              return (
                <GlassCard
                  key={criterion.criterion}
                  className="p-4 space-y-3 border-l-2 hover:bg-[var(--bg-raised)] transition-colors"
                  style={{ borderLeftColor: accentColors[accent] }}
                  pedagogicalLabel={`Rubric criterion from the Moodle grading sheet. Maximum ${criterion.maxPoints} points.`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-navigation font-medium text-[var(--text-primary)]">{criterion.criterion}</span>
                    <span className="font-forensic text-xs" style={{ color: accentColors[accent] }}>{criterion.maxPoints} pts</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="rounded border border-[var(--border)] bg-[var(--bg-deep)] p-2">
                      <span className="font-navigation text-[9px] uppercase tracking-widest text-[var(--text-muted)]">0</span>
                      <p className="font-body text-[var(--text-sec)] mt-1 leading-relaxed">{criterion.fail}</p>
                    </div>
                    <div className="rounded border border-[var(--border)] bg-[var(--bg-deep)] p-2">
                      <span className="font-navigation text-[9px] uppercase tracking-widest text-[var(--text-muted)]">1</span>
                      <p className="font-body text-[var(--text-sec)] mt-1 leading-relaxed">{criterion.partial}</p>
                    </div>
                    <div className="rounded border border-[var(--border)] bg-[var(--bg-deep)] p-2">
                      <span className="font-navigation text-[9px] uppercase tracking-widest text-[var(--text-muted)]">2</span>
                      <p className="font-body text-[var(--text-sec)] mt-1 leading-relaxed">{criterion.full}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <GlassCard elevation="high" accent="lav" className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="text-[var(--lav)]" size={20} />
              <h3 className="font-navigation font-medium text-[var(--text-primary)]">Latest Verified Writing Evidence</h3>
            </div>
            <blockquote className="border-l-4 border-[var(--border-bright)] pl-6 py-2 mb-6">
              <p className="font-editorial text-lg text-[var(--text-primary)] leading-relaxed italic">
                &quot;{latestArtifact?.text ?? selectedCase?.student.sample_text ?? 'No writing sample is available in the imported workbook.'}&quot;
              </p>
            </blockquote>
            <div className="flex gap-2 flex-wrap">
              <StatusChip variant="lav">{latestArtifact?.title ?? 'CASE WORKBOOK'}</StatusChip>
              <StatusChip variant="teal">{selectedCase?.meta.finalWordCount ?? 0} WORD FINAL</StatusChip>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)]">Key Metrics</h3>

            <GlassCard className="p-5 flex items-center justify-between group hover:border-[var(--teal)] transition-colors">
              <div>
                <p className="font-body text-xs text-[var(--text-sec)] mb-1">Assignments Submitted</p>
                <div className="font-forensic text-4xl text-[var(--teal)]">{selectedCase?.meta.totalAssignmentsSubmitted ?? 0}</div>
              </div>
              <CheckCircle2 size={32} className="text-[var(--teal-dim)] group-hover:text-[var(--teal)] transition-colors" />
            </GlassCard>

            <GlassCard className="p-5" pedagogicalLabel="Early task access and rubric consultation signal forethought regulation.">
              <div className="flex justify-between items-center mb-4">
                <p className="font-body text-xs text-[var(--gold)] font-medium">Planning Snapshot</p>
                <Users size={16} className="text-[var(--gold)]" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-forensic">
                  <span className="text-[var(--text-sec)]">First Access Delay</span>
                  <span className="text-[var(--teal)]">{selectedCase?.student.first_access_delay_minutes ?? 0}m</span>
                </div>
                <div className="flex justify-between text-[10px] font-forensic">
                  <span className="text-[var(--text-sec)]">Rubric Views</span>
                  <span className="text-[var(--teal)]">{selectedCase?.student.rubric_views ?? 0} consultations</span>
                </div>
                <div className="flex justify-between text-[10px] font-forensic">
                  <span className="text-[var(--text-sec)]">Rubric Structure</span>
                  <span className="text-[var(--teal)]">{rubricCriteria.length} criteria / {selectedCase?.rubric.totalMaxPoints ?? 0} points</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex justify-between items-center mb-4">
                <p className="font-body text-xs text-[var(--text-sec)]">Validated Case File</p>
                <Users size={16} className="text-[var(--lav)]" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--lav-dim)] border border-[var(--lav-border)] flex items-center justify-center font-navigation text-sm text-[var(--lav)]">
                  {(selectedCase?.meta.studentName ?? 'NA').split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-navigation text-sm text-[var(--text-primary)]">{selectedCase?.meta.studentName}</p>
                  <p className="font-body text-xs text-[var(--text-sec)]">User ID {selectedCase?.meta.userId}</p>
                </div>
              </div>
              <div className="font-body text-xs text-[var(--text-sec)] mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[var(--teal)]">1 workbook-backed case synced</span>
                <StatusChip variant={selectedCase?.riskLevel === 'critical' ? 'red' : selectedCase?.riskLevel === 'monitor' ? 'gold' : 'teal'}>
                  {(selectedCase?.riskLevel ?? 'low').toUpperCase()}
                </StatusChip>
              </div>
            </GlassCard>
          </div>
        </div>

        <StationFooter nextPath="/pipeline/2" />
      </div>
    </PipelineLayout>
  );
}
