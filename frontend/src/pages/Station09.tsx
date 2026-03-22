import { useMemo, useState } from 'react';
import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { PedagogicalInsightBadge } from '../components/PedagogicalInsightBadge';
import { StatusChip } from '../components/Atoms';
import { getEngagementScore } from '../data/diagnostic';
import { getSelectedStudyCase, useStudyScopeStore, type TeacherStudyCase } from '../state/studyScope';

interface DiagnosticRule {
  id: string;
  type: 'Engagement' | 'Quality' | 'Progress';
  active: true;
  ifCond: string;
  thenCond: string;
  basis: string;
  hits: number;
}

function buildDiagnosticRules(studyCase: TeacherStudyCase): DiagnosticRule[] {
  const student = studyCase.student;

  const hasHit = (ruleId: string) => {
    if (ruleId === 'A1' && student.rubric_views === 0 && student.first_access_delay_minutes > 30) return 1;
    if (ruleId === 'B1' && student.cohesion <= 3.2) return 1;
    if (ruleId === 'B2' && student.argumentation <= 3.6) return 1;
    if (ruleId === 'C1' && student.revision_frequency === 0) return 1;
    if (ruleId === 'D1' && student.help_seeking_messages >= 4) return 1;
    if (ruleId === 'E1' && studyCase.activity.estimatedActiveMinutes > 150 && student.total_score < 20) return 1;
    return 0;
  };

  return [
    { id: 'A1', type: 'Engagement', active: true, ifCond: 'rubric_views == 0 AND delay > 30m', thenCond: 'Flag for criteria awareness + rubric walkthrough', basis: 'Zimmerman (2000) - Self-Regulated Learning', hits: hasHit('A1') },
    { id: 'B1', type: 'Quality', active: true, ifCond: 'cohesion <= 3.2', thenCond: 'Flag for discourse organization + restructuring scaffold', basis: 'Crossley & McNamara (2012)', hits: hasHit('B1') },
    { id: 'B2', type: 'Quality', active: true, ifCond: 'argumentation <= 3.6', thenCond: 'Flag for weak claim-evidence structure + C-E-E scaffold', basis: 'Toulmin (1958) - Uses of Argument', hits: hasHit('B2') },
    { id: 'C1', type: 'Progress', active: true, ifCond: 'revision_frequency == 0', thenCond: 'Flag for weak self-regulation + revision checklist', basis: 'Hyland (2003)', hits: hasHit('C1') },
    { id: 'D1', type: 'Engagement', active: true, ifCond: 'help_seeking_messages >= 4', thenCond: 'Flag for adaptive help-seeking + dialogic support', basis: 'Aleven et al. (2003)', hits: hasHit('D1') },
    { id: 'E1', type: 'Engagement', active: true, ifCond: 'time_on_task > 150 AND score < 20', thenCond: 'Flag as effortful but struggling + strategic instruction', basis: 'Shute (2008)', hits: hasHit('E1') },
  ];
}

export function Station09() {
  const [activeTab, setActiveTab] = useState<'Engagement' | 'Quality' | 'Progress'>('Engagement');
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });

  const diagnosticRules = useMemo(() => (selectedCase ? buildDiagnosticRules(selectedCase) : []), [selectedCase]);
  const filteredRules = diagnosticRules.filter((rule) => rule.type === activeTab);
  const totalIndicators = diagnosticRules.reduce((accumulator, rule) => accumulator + rule.hits, 0);
  const summaryBars = selectedCase
    ? [
        { label: 'Engagement', value: getEngagementScore(selectedCase.student), accent: 'var(--teal)' },
        { label: 'Quality', value: Math.round(((selectedCase.student.cohesion + selectedCase.student.argumentation + selectedCase.student.grammar_accuracy + selectedCase.student.lexical_resource) / 20) * 100), accent: 'var(--lav)' },
        { label: 'Revision Uptake', value: Math.min(100, Math.round((selectedCase.student.revision_frequency / 4) * 100)), accent: 'var(--gold)' },
        { label: 'Help-Seeking', value: Math.min(100, Math.round((selectedCase.student.help_seeking_messages / 5) * 100)), accent: 'var(--red)' },
      ]
    : [];

  return (
    <PipelineLayout
      verifiedEnabled={Boolean(selectedCase)}
      unavailableTitle="Verified Diagnostic Signals Unavailable"
      unavailableMessage="Import a verified workbook case before opening the rule-based diagnostic station."
      rightPanel={
        selectedCase ? (
          <PedagogicalInsightBadge
            urgency="monitor"
            label="Teacher Review Note"
            observation={`The current case for ${selectedCase.meta.studentName} matches ${totalIndicators} workbook-derived rule signals in the selected categories.`}
            implication="These rule matches organize evidence for teacher review; they do not replace the instructor's interpretation of the student's needs."
            action="Use the matched rules to guide your reading of the workbook, rubric, and revision trace before deciding the next teaching move."
            citation="Mislevy (1994) - Evidence-Centered Design in Assessment"
          />
        ) : undefined
      }
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={9} title="Diagnostic Signals" subtitle="Layer 8: Rule-Based Signals for Teacher Review" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div className="flex gap-4 border-b border-[var(--border)] overflow-x-auto w-full md:w-auto">
            {(['Engagement', 'Quality', 'Progress'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 text-sm font-navigation font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-[var(--lav)] text-[var(--lav)]'
                    : 'border-transparent text-[var(--text-sec)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab} Rules
              </button>
            ))}
          </div>
          <div className="font-forensic text-sm text-[var(--text-sec)] bg-[var(--bg-raised)] px-4 py-2 rounded-lg border border-[var(--border)]">
            Matched Signals for {selectedCase?.meta.studentName ?? 'Active Case'}: <span className="text-[var(--red)] font-bold text-lg">{totalIndicators}</span>
          </div>
        </div>

        <GlassCard elevation="high" className="p-6 md:p-8 mb-8" pedagogicalLabel="This panel summarizes workbook-derived rule matches for teacher review.">
          <h3 className="font-navigation text-lg font-medium text-[var(--text-primary)] mb-3">Diagnostic Summary Panel</h3>
          <p className="font-body text-sm text-[var(--text-sec)] mb-6">
            The percentages below are summary views of workbook indicators. They help the teacher notice patterns quickly, but they are not a final diagnosis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summaryBars.map((item) => (
              <div key={item.label} className="p-4 bg-[var(--bg-deep)] rounded-lg border border-[var(--border)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-navigation text-sm text-[var(--text-primary)]">{item.label}</span>
                  <span className="font-forensic text-sm" style={{ color: item.accent }}>{item.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
                  <div className="h-full transition-all duration-500" style={{ width: `${item.value}%`, backgroundColor: item.accent }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredRules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>

        <StationFooter prevPath="/pipeline/8" nextPath="/pipeline/10" />
      </div>
    </PipelineLayout>
  );
}

function RuleCard({ rule }: { rule: DiagnosticRule }) {
  return (
    <GlassCard className={`p-6 border-l-4 transition-colors ${rule.hits > 0 ? 'border-l-[var(--red)]' : 'border-l-[var(--teal)]'}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="font-navigation text-[10px] tracking-widest text-[var(--text-sec)] flex items-center gap-3">
          RULE ID: <span className="text-[var(--text-primary)] font-forensic text-xs">{rule.id}</span>
        </div>
        <StatusChip variant="lav">Shown</StatusChip>
      </div>

      <div className="font-forensic text-sm space-y-4 mb-6 text-[var(--text-primary)]">
        <div className="flex gap-4 p-3 bg-[var(--bg-deep)] rounded border border-[var(--border)] border-l-2 border-l-[var(--lav-dim)]">
          <span className="text-[var(--lav)] font-bold">IF:</span>
          <span className="tracking-wide">{rule.ifCond}</span>
        </div>
        <div className="flex gap-4 p-3 bg-[var(--bg-deep)] rounded border border-[var(--border)] border-l-2 border-l-[var(--teal-dim)]">
          <span className="text-[var(--teal)] font-bold">THEN:</span>
          <span>{rule.thenCond}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
        <div className="font-body text-[10px] text-[var(--text-sec)] leading-tight break-words min-w-0">
          <span className="uppercase tracking-wide text-[var(--text-muted)] block mb-1">Theoretical Basis</span>
          {rule.basis}
        </div>
        <div className="text-right">
          <span className="font-navigation text-[10px] uppercase tracking-wider text-[var(--text-sec)] block mb-1">Case Match</span>
          {rule.hits > 0 ? (
            <StatusChip variant="red" className="shadow-[0_0_10px_var(--red-dim)]">MATCHED</StatusChip>
          ) : (
            <StatusChip variant="teal">NOT MATCHED</StatusChip>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
