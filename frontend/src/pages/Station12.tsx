import { useMemo, useState } from 'react';
import { Columns, Info } from 'lucide-react';
import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { PedagogicalInsightBadge } from '../components/PedagogicalInsightBadge';
import { StatusChip } from '../components/Atoms';
import { getSelectedStudyCase, useStudyScopeStore } from '../state/studyScope';

const kindTone = {
  draft: 'gold',
  feedback: 'red',
  revision: 'lav',
  resource: 'teal',
  final: 'teal',
} as const;

export function Station12() {
  const [showDiff, setShowDiff] = useState(false);
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });

  const beforeArtifact = useMemo(() => {
    if (!selectedCase) return null;
    return selectedCase.writing.artifacts.find((artifact) => artifact.id === selectedCase.writing.comparison.beforeId)
      ?? selectedCase.writing.artifacts[0]
      ?? null;
  }, [selectedCase]);

  const afterArtifact = useMemo(() => {
    if (!selectedCase) return null;
    return selectedCase.writing.artifacts.find((artifact) => artifact.id === selectedCase.writing.comparison.afterId)
      ?? selectedCase.writing.artifacts[selectedCase.writing.artifacts.length - 1]
      ?? null;
  }, [selectedCase]);

  return (
    <PipelineLayout
      verifiedEnabled={Boolean(selectedCase && beforeArtifact && afterArtifact)}
      unavailableTitle="Verified Revision Evidence Unavailable"
      unavailableMessage="Import a verified workbook case with at least two writing artifacts before opening the revision-cycle station."
      rightPanel={
        selectedCase ? (
          <PedagogicalInsightBadge
            urgency="positive"
            label="Teacher Review Note"
            observation={`The revision sequence for ${selectedCase.meta.studentName} shows visible change across drafts, feedback, and re-entry into the task.`}
            implication="The clearest gains are visible in the compared texts and the revision timeline, while vocabulary precision and argument control still need deliberate support."
            action="Use this revision evidence to plan the next teacher response around stronger claim-evidence explanation and tighter academic phrasing."
            citation="Zimmerman (2002) - Self-Regulated Learning & Writing Development"
          />
        ) : undefined
      }
    >
      <div className="max-w-7xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={12} title="Revision Cycle Evidence" subtitle="Layer 12: Workbook-Derived Growth Across Drafts" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="font-navigation text-xl text-[var(--text-primary)]">Longitudinal Trace: {selectedCase?.meta.studentName}</h2>
            </div>
            <div className="flex items-center gap-3 font-forensic text-sm text-[var(--text-sec)]">
              <span>{beforeArtifact?.title ?? 'Earlier text'}: {beforeArtifact?.wordCount ?? 0} words</span>
              <span className="text-[var(--border-bright)]">to</span>
              <span>{afterArtifact?.title ?? 'Later text'}: {afterArtifact?.wordCount ?? 0} words</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowDiff(!showDiff)} className="flex items-center gap-2 px-4 py-2 rounded border border-[var(--border)] font-navigation text-sm text-[var(--text-sec)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)] transition-colors">
              <Columns size={16} /> Text Diff
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded border border-[var(--border)] font-navigation text-sm text-[var(--text-sec)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)] transition-colors">
              <Info size={16} /> Methodology
            </button>
          </div>
        </div>

        {showDiff && beforeArtifact && afterArtifact && (
          <GlassCard className="p-6 mb-8 border-l-4 border-l-[var(--teal)] animate-in slide-in-from-top-4 duration-300">
            <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)] mb-4">Draft Comparison Snapshot</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-body text-sm leading-relaxed">
              <div className="p-4 bg-[var(--bg-deep)] rounded border border-[var(--border)]">
                <div className="flex items-center justify-between gap-3 mb-2 border-b border-[var(--border)] pb-2">
                  <span className="text-xs font-navigation text-[var(--text-muted)] block">{beforeArtifact.title}</span>
                  <StatusChip variant="gold">{beforeArtifact.status}</StatusChip>
                </div>
                <p className="text-[var(--text-sec)] whitespace-pre-line">{beforeArtifact.text}</p>
                {beforeArtifact.teacherComment && (
                  <p className="mt-3 text-xs text-[var(--gold)] leading-relaxed">Teacher focus: {beforeArtifact.teacherComment}</p>
                )}
              </div>
              <div className="p-4 bg-[var(--bg-deep)] rounded border border-[var(--border)]">
                <div className="flex items-center justify-between gap-3 mb-2 border-b border-[var(--border)] pb-2">
                  <span className="text-xs font-navigation text-[var(--text-muted)] block">{afterArtifact.title}</span>
                  <StatusChip variant="teal">{afterArtifact.status}</StatusChip>
                </div>
                <p className="text-[var(--text-primary)] whitespace-pre-line">{afterArtifact.text}</p>
                {afterArtifact.teacherComment && (
                  <p className="mt-3 text-xs text-[var(--teal)] leading-relaxed">Teacher focus: {afterArtifact.teacherComment}</p>
                )}
              </div>
            </div>
          </GlassCard>
        )}

        {beforeArtifact && afterArtifact && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)]">Earlier Evidence</h3>
                <StatusChip variant="gold">{beforeArtifact.date}</StatusChip>
              </div>
              <p className="font-navigation text-base text-[var(--text-primary)]">{beforeArtifact.title}</p>
              <p className="mt-2 font-forensic text-xs text-[var(--text-muted)]">{beforeArtifact.wordCount} words</p>
              <p className="mt-4 font-body text-sm text-[var(--text-sec)] leading-relaxed whitespace-pre-line">{beforeArtifact.text}</p>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)]">Later Evidence</h3>
                <StatusChip variant="teal">{afterArtifact.date}</StatusChip>
              </div>
              <p className="font-navigation text-base text-[var(--text-primary)]">{afterArtifact.title}</p>
              <p className="mt-2 font-forensic text-xs text-[var(--text-muted)]">{afterArtifact.wordCount} words</p>
              <p className="mt-4 font-body text-sm text-[var(--text-sec)] leading-relaxed whitespace-pre-line">{afterArtifact.text}</p>
            </GlassCard>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)]">Analytical Comparison</h3>
            <span className="font-forensic text-xs text-[var(--lav)]">Workbook-derived before/after signals</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-4">
            {selectedCase?.writing.comparison.metrics.map((metric) => (
              <GlassCard key={metric.label} className="p-4">
                <p className="font-navigation text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{metric.label}</p>
                <div className="flex items-end justify-between gap-3 mt-3">
                  <div>
                    <p className="font-forensic text-xs text-[var(--text-sec)]">Before</p>
                    <p className="font-forensic text-xl text-[var(--gold)]">{metric.before}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-forensic text-[10px] text-[var(--text-muted)]">Delta</p>
                    <p className={`font-forensic text-sm ${metric.delta.startsWith('-') ? 'text-[var(--red)]' : 'text-[var(--teal)]'}`}>{metric.delta}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-forensic text-xs text-[var(--text-sec)]">After</p>
                    <p className="font-forensic text-xl text-[var(--lav)]">{metric.after}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          <GlassCard className="p-5">
            <h4 className="font-navigation text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">Interpretive Notes</h4>
            <div className="space-y-2">
              {selectedCase?.writing.comparison.commentary.map((note) => (
                <p key={note} className="font-body text-sm text-[var(--text-sec)] leading-relaxed">{note}</p>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)]">Revision Sequence</h3>
            <span className="font-forensic text-xs text-[var(--gold)]">{selectedCase?.writing.sequence.length ?? 0} tracked steps</span>
          </div>
          <div className="space-y-3">
            {selectedCase?.writing.sequence.map((step, index) => (
              <GlassCard key={`${step.timestamp}-${step.phase}`} className="p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg-deep)] flex items-center justify-center font-forensic text-[10px] text-[var(--text-primary)]">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-navigation text-sm text-[var(--text-primary)]">{step.phase}</p>
                        <StatusChip variant={kindTone[step.kind]}>{step.kind}</StatusChip>
                      </div>
                      <p className="mt-2 font-body text-sm text-[var(--text-sec)] leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                  <span className="font-forensic text-[11px] text-[var(--text-muted)]">{step.timestamp}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <StationFooter prevPath="/pipeline/11" nextPath="/dashboard" />
      </div>
    </PipelineLayout>
  );
}
