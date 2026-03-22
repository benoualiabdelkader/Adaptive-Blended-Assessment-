import { Activity, ShieldAlert } from 'lucide-react';
import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { PedagogicalInsightBadge } from '../components/PedagogicalInsightBadge';
import { getSelectedStudyCase, useStudyScopeStore } from '../state/studyScope';

interface Intervention {
  student: string;
  archetype: string;
  priority: 'Immediate' | 'Planned';
  type: string;
  timeline: string;
  completed: number;
  total: number;
}

function buildInterventions(studyCase: NonNullable<ReturnType<typeof getSelectedStudyCase>>): Intervention[] {
  const interventions: Intervention[] = [];

  if (studyCase.student.argumentation < 3.5) {
    interventions.push({
      student: studyCase.meta.studentName,
      archetype: studyCase.clusterName,
      priority: 'Immediate',
      type: 'Model claim-evidence-explanation with one guided revision example',
      timeline: 'Next feedback cycle',
      completed: 0,
      total: 2,
    });
  }

  if (studyCase.student.cohesion < 3.6 || studyCase.student.grammar_accuracy < 3.4) {
    interventions.push({
      student: studyCase.meta.studentName,
      archetype: studyCase.clusterName,
      priority: 'Planned',
      type: 'Use a short scaffold for transitions, sentence control, and academic phrasing',
      timeline: 'Next 1-2 writing tasks',
      completed: Math.min(1, studyCase.student.revision_frequency),
      total: 2,
    });
  }

  if (studyCase.student.help_seeking_messages >= 4) {
    interventions.push({
      student: studyCase.meta.studentName,
      archetype: studyCase.clusterName,
      priority: 'Planned',
      type: 'Keep a brief clarification channel open to support adaptive help-seeking',
      timeline: 'Current module',
      completed: 1,
      total: 2,
    });
  }

  return interventions;
}

export function Station11() {
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });
  const interventions = selectedCase ? buildInterventions(selectedCase) : [];
  const immediateActions = interventions.filter((intervention) => intervention.priority === 'Immediate');
  const plannedActions = interventions.filter((intervention) => intervention.priority === 'Planned');

  return (
    <PipelineLayout
      verifiedEnabled={Boolean(selectedCase)}
      unavailableTitle="Verified Intervention Planning Unavailable"
      unavailableMessage="Import a verified workbook case before opening the intervention-planning station."
      rightPanel={
        selectedCase ? (
          <PedagogicalInsightBadge
            urgency="monitor"
            label="Teacher Action Planning"
            observation={`The workbook evidence for ${selectedCase.meta.studentName} points to an engaged learner who still needs directed support in writing quality.`}
            implication="This station organizes possible instructional actions for the teacher. It does not calculate a live retention probability or assign a final intervention tier."
            action="Use the planning cards below to decide the next classroom action, follow-up point, and review window."
            citation="Tinto (1987) - Leaving College & Student Mortality"
          />
        ) : undefined
      }
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={11} title="Intervention Planning" subtitle="Layer 10: Teacher-Led Instructional Action" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GlassCard className="p-4">
            <div className="font-navigation text-[10px] uppercase tracking-widest text-[var(--text-sec)] mb-1">Immediate Actions</div>
            <div className="font-forensic text-lg text-[var(--red)]">{immediateActions.length}</div>
            <div className="font-body text-xs text-[var(--text-sec)] mt-1">High-priority teacher moves that should shape the next revision or feedback cycle.</div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="font-navigation text-[10px] uppercase tracking-widest text-[var(--text-sec)] mb-1">Planned Actions</div>
            <div className="font-forensic text-lg text-[var(--gold)]">{plannedActions.length}</div>
            <div className="font-body text-xs text-[var(--text-sec)] mt-1">Follow-up steps to schedule across the current module and the next writing tasks.</div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="font-navigation text-[10px] uppercase tracking-widest text-[var(--text-sec)] mb-1">Teacher Role</div>
            <div className="font-forensic text-lg text-[var(--lav)]">Planning</div>
            <div className="font-body text-xs text-[var(--text-sec)] mt-1">These cards organize possible classroom moves. The final intervention choice still belongs to the teacher.</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--red)] mb-4 flex items-center gap-2">
              <ShieldAlert size={16} /> Immediate Attention
            </h3>
            {immediateActions.length > 0 ? (
              immediateActions.map((intervention) => (
                <InterventionCard key={`${intervention.priority}-${intervention.type}`} data={intervention} />
              ))
            ) : (
              <EmptyTier message="No immediate high-priority action is required at the current checkpoint." />
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--gold)] mb-4 flex items-center gap-2">
              <Activity size={16} /> Planned Follow-Up
            </h3>
            {plannedActions.length > 0 ? (
              plannedActions.map((intervention) => (
                <InterventionCard key={`${intervention.priority}-${intervention.type}`} data={intervention} />
              ))
            ) : (
              <EmptyTier message="No planned follow-up action is active." />
            )}
          </div>
        </div>

        <StationFooter prevPath="/pipeline/10" nextPath="/pipeline/12" />
      </div>
    </PipelineLayout>
  );
}

function EmptyTier({ message }: { message: string }) {
  return (
    <GlassCard className="p-5 border border-dashed border-[var(--border)]">
      <p className="font-body text-sm text-[var(--text-sec)]">{message}</p>
    </GlassCard>
  );
}

function InterventionCard({ data }: { data: Intervention }) {
  const progressPct = data.total === 0 ? 0 : (data.completed / data.total) * 100;

  return (
    <GlassCard className="p-4 md:p-5 border-l-2" style={{ borderLeftColor: data.priority === 'Immediate' ? 'var(--red)' : 'var(--gold)' }} pedagogicalLabel="Teacher action planning summarizes workbook evidence into a follow-up plan.">
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
            <h4 className="font-navigation text-lg font-medium text-[var(--text-primary)] break-words">
              {data.student}
            </h4>
            <span className="text-[10px] uppercase font-body bg-[var(--bg-deep)] px-2 py-1 rounded text-[var(--text-sec)] w-fit break-words">
              {data.archetype}
            </span>
          </div>
          <p className="font-body text-sm text-[var(--lav)] mt-2 leading-relaxed break-words">{data.type}</p>
        </div>
        <div className={`font-navigation text-[10px] uppercase shrink-0 ${data.priority === 'Immediate' ? 'text-[var(--red)]' : 'text-[var(--gold)]'}`}>
          {data.priority}
        </div>
      </div>

      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between text-xs font-body text-[var(--text-sec)] mb-3">
        <span className="break-words">Timeline: {data.timeline}</span>
        <span>Milestones: {data.completed}/{data.total}</span>
      </div>

      <div className="h-1.5 w-full bg-[var(--bg-deep)] rounded-full overflow-hidden flex">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            backgroundColor: data.completed === data.total ? 'var(--teal)' : 'var(--lav)',
          }}
        />
      </div>
    </GlassCard>
  );
}
