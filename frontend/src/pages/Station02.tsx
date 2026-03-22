import type { ElementType } from 'react';
import { ArrowRight, Database, FileSpreadsheet, GraduationCap, FileText, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { PedagogicalInsightBadge } from '../components/PedagogicalInsightBadge';
import { StatusChip, Button } from '../components/Atoms';
import { getSelectedStudyCase, useStudyScopeStore } from '../state/studyScope';

interface SourceNodeProps {
  icon: ElementType;
  name: string;
  count: string;
  status: string;
  pedagogicalLabel: string;
}

export function Station02() {
  const navigate = useNavigate();
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });

  return (
    <PipelineLayout
      verifiedEnabled={Boolean(selectedCase)}
      unavailableTitle="Verified Case Unavailable"
      unavailableMessage="Import a verified workbook case before opening the data-integration station."
      rightPanel={
        selectedCase ? (
          <PedagogicalInsightBadge
            urgency="positive"
            label="Data Triangulation Status"
            observation={`The active case for ${selectedCase.meta.studentName} joins workbook metadata, Moodle logs, writing samples, and communication evidence under one learner identity.`}
            implication={`The current workbook is internally aligned across user ID ${selectedCase.meta.userId}, course ${selectedCase.meta.courseId}, and the imported activity period.`}
            action="Proceed to the submission-pattern station once these four evidence streams look complete."
            citation="Siemens (2013) - Learning Analytics: The Emergence of a Discipline"
          />
        ) : undefined
      }
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={2} title="Forensic Data Integration" />

        <GlassCard elevation="high" className="p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-4">
              <div className="rounded-3xl border border-[var(--lav-border)] bg-[var(--bg-deep)] p-6 md:p-8 h-full flex flex-col items-center justify-center text-center shadow-[0_0_40px_var(--lav-glow)]">
                <div className="w-24 h-24 rounded-full border border-[var(--lav)] bg-[var(--bg-base)] flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-[var(--lav)] border-dashed animate-[spin_20s_linear_infinite] opacity-30" />
                  <Database size={34} className="text-[var(--lav)]" />
                </div>
                <h3 className="font-editorial text-xl text-[var(--text-primary)] font-medium">Case Evidence Hub</h3>
                <p className="font-forensic text-xs text-[var(--teal)] mt-2">
                  {selectedCase ? '1 VALIDATED STUDENT CASE' : 'NO VERIFIED CASE'}
                </p>
                <p className="font-body text-sm text-[var(--text-sec)] leading-relaxed mt-4">
                  The four evidence streams below are synchronized under one learner identity so the next analytical stations can read the same verified case.
                </p>
              </div>
            </div>

            <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <SourceNode
                icon={FileSpreadsheet}
                name="Workbook Metadata"
                count={selectedCase ? `1 file / ${selectedCase.meta.totalAssignmentsSubmitted} submissions` : 'No imported file'}
                status={selectedCase ? 'SYNCED' : 'WAITING'}
                pedagogicalLabel="Summary and assignment sheets anchor the learner identity, course metadata, and grading status."
              />
              <SourceNode
                icon={GraduationCap}
                name="Moodle Logs"
                count={selectedCase ? `${selectedCase.meta.activityLogEntries} entries` : 'No log entries'}
                status={selectedCase ? 'SYNCED' : 'WAITING'}
                pedagogicalLabel="Behavioral indicators from Moodle activity logs trace access, submission, and viewing behaviour over time."
              />
              <SourceNode
                icon={FileText}
                name="Writing Samples"
                count={selectedCase ? `${selectedCase.writing.artifacts.length} archived texts` : 'No writing texts'}
                status={selectedCase ? 'SYNCED' : 'WAITING'}
                pedagogicalLabel="Drafts, revised comments, and final submissions are available for writing analysis."
              />
              <SourceNode
                icon={MessageCircle}
                name="Chat + Feedback"
                count={selectedCase ? `${selectedCase.meta.chatMessages} messages` : 'No messages'}
                status={selectedCase ? 'SYNCED' : 'WAITING'}
                pedagogicalLabel="Teacher-student exchanges and instructor comments capture help-seeking and feedback timing."
              />
            </div>
          </div>
        </GlassCard>

        <Button className="w-full py-6 text-lg justify-center shadow-[0_0_30px_var(--lav-glow)] mb-8" onClick={() => navigate('/pipeline/3')}>
          Proceed to Analytics <ArrowRight className="ml-2" />
        </Button>

        <StationFooter prevPath="/pipeline/1" nextPath="/pipeline/3" />
      </div>
    </PipelineLayout>
  );
}

function SourceNode({ icon: Icon, name, count, status, pedagogicalLabel }: SourceNodeProps) {
  const isPending = status !== 'SYNCED';

  return (
    <div className={`flex flex-col items-center p-4 bg-[var(--bg-card)] border ${isPending ? 'border-[var(--gold-dim)]' : 'border-[var(--border)]'} rounded-xl w-full min-w-0 text-center group cursor-help relative`}>
      <Icon size={24} className={`mb-3 ${isPending ? 'text-[var(--gold)]' : 'text-[var(--text-primary)]'}`} />
      <h4 className="font-navigation text-sm font-medium text-[var(--text-primary)] break-words">{name}</h4>
      <p className="font-forensic text-xs text-[var(--text-sec)] mt-1 mb-3 break-words">{count}</p>
      <StatusChip variant={isPending ? 'gold' : 'teal'}>{status}</StatusChip>

      <div className="absolute top-full mt-2 w-56 max-w-[90vw] p-2 bg-[var(--bg-high)] border border-[var(--border)] rounded text-xs font-body text-[var(--text-sec)] opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
        <div className="mb-2 text-[var(--lav)] italic border-b border-[var(--border)] pb-2">{pedagogicalLabel}</div>
        <div>Deduplication: {isPending ? 'Waiting for import' : '100%'}</div>
        <div>Last sync: {isPending ? 'No verified workbook imported yet' : 'verified workbook import'}</div>
      </div>
    </div>
  );
}
