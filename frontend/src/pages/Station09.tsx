import { useMemo, useState } from 'react';
import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { PedagogicalInsightBadge } from '../components/PedagogicalInsightBadge';
import { StatusChip } from '../components/Atoms';
import { getEngagementScore } from '../data/diagnostic';
import { getSelectedStudyCase, useStudyScopeStore, type TeacherStudyCase } from '../state/studyScope';

type DiagnosticGroup = 'Planning' | 'Writing' | 'Revision' | 'Engagement';

interface DiagnosticRule {
  id: string;
  group: DiagnosticGroup;
  interpretation: string;
  intervention: string;
  templates: string[];
}

function parseDelimited(value?: string) {
  return String(value ?? '')
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getGroupFromRule(ruleId: string): DiagnosticGroup {
  if (ruleId.startsWith('A')) return 'Planning';
  if (ruleId.startsWith('B')) return 'Writing';
  if (ruleId.startsWith('C')) return 'Revision';
  return 'Engagement';
}

function formatTemplateLabel(value: string) {
  return value.replace(/_/g, ' ');
}

function buildDiagnosticRules(studyCase: TeacherStudyCase): DiagnosticRule[] {
  const ruleIds = parseDelimited(studyCase.student.triggered_rule_ids);
  const interpretations = parseDelimited(studyCase.student.interpretations);
  const interventions = parseDelimited(studyCase.student.onsite_interventions);
  const templates = parseDelimited(
    studyCase.student.feedback_templates_selected ?? studyCase.student.feedback_types
  );

  return ruleIds.map((ruleId, index) => ({
    id: ruleId,
    group: getGroupFromRule(ruleId),
    interpretation: interpretations[index] ?? 'No interpretation returned for this rule.',
    intervention: interventions[index] ?? 'Teacher review required.',
    templates,
  }));
}

export function Station09() {
  const [activeTab, setActiveTab] = useState<DiagnosticGroup>('Planning');
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });

  const diagnosticRules = useMemo(
    () => (selectedCase ? buildDiagnosticRules(selectedCase) : []),
    [selectedCase]
  );
  const availableTabs = useMemo<DiagnosticGroup[]>(() => {
    const groups = new Set(diagnosticRules.map((rule) => rule.group));
    return (['Planning', 'Writing', 'Revision', 'Engagement'] as const).filter((group) => groups.has(group));
  }, [diagnosticRules]);
  const effectiveTab = availableTabs.includes(activeTab) ? activeTab : availableTabs[0] ?? 'Planning';
  const filteredRules = diagnosticRules.filter((rule) => rule.group === effectiveTab);
  const totalIndicators = diagnosticRules.length;
  const summaryBars = selectedCase
    ? [
        { label: 'Engagement', value: getEngagementScore(selectedCase.student), accent: 'var(--teal)' },
        {
          label: 'Quality',
          value: Math.round(
            ((selectedCase.student.cohesion +
              selectedCase.student.argumentation +
              selectedCase.student.grammar_accuracy +
              selectedCase.student.lexical_resource) /
              20) *
              100
          ),
          accent: 'var(--lav)',
        },
        {
          label: 'Revision Uptake',
          value: Math.min(100, Math.round((selectedCase.student.revision_frequency / 4) * 100)),
          accent: 'var(--gold)',
        },
        {
          label: 'Help-Seeking',
          value: Math.min(100, Math.round((selectedCase.student.help_seeking_messages / 5) * 100)),
          accent: 'var(--red)',
        },
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
            observation={`The current case for ${selectedCase.meta.studentName} matches ${totalIndicators} rule-level decision signals in the live adaptive layer.`}
            implication="These matched rules organise evidence, template selection, and revision priorities for teacher review rather than replacing instructor judgment."
            action={selectedCase.student.teacher_validation_prompt ?? 'Confirm the priority focus before releasing student-facing feedback.'}
            citation="Mislevy (1994) - Evidence-Centered Design in Assessment"
          />
        ) : undefined
      }
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={9} title="Diagnostic Signals" subtitle="Layer 8: Rule-Based Signals for Teacher Review" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div className="flex gap-4 border-b border-[var(--border)] overflow-x-auto w-full md:w-auto">
            {(['Planning', 'Writing', 'Revision', 'Engagement'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={!availableTabs.includes(tab)}
                className={`pb-3 px-2 text-sm font-navigation font-medium transition-colors border-b-2 whitespace-nowrap ${
                  effectiveTab === tab
                    ? 'border-[var(--lav)] text-[var(--lav)]'
                    : 'border-transparent text-[var(--text-sec)] hover:text-[var(--text-primary)]'
                } ${!availableTabs.includes(tab) ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {tab} Rules
              </button>
            ))}
          </div>
          <div className="font-forensic text-sm text-[var(--text-sec)] bg-[var(--bg-raised)] px-4 py-2 rounded-lg border border-[var(--border)]">
            Matched Signals for {selectedCase?.meta.studentName ?? 'Active Case'}:{' '}
            <span className="text-[var(--red)] font-bold text-lg">{totalIndicators}</span>
          </div>
        </div>

        <GlassCard
          elevation="high"
          className="p-6 md:p-8 mb-8"
          pedagogicalLabel="This panel summarises workbook-derived rule matches for teacher review."
        >
          <h3 className="font-navigation text-lg font-medium text-[var(--text-primary)] mb-3">Diagnostic Summary Panel</h3>
          <p className="font-body text-sm text-[var(--text-sec)] mb-6">
            These indicators organise evidence from the live decision layer. They support interpretation and planning, but the teacher still validates the final diagnosis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summaryBars.map((item) => (
              <div key={item.label} className="p-4 bg-[var(--bg-deep)] rounded-lg border border-[var(--border)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-navigation text-sm text-[var(--text-primary)]">{item.label}</span>
                  <span className="font-forensic text-sm" style={{ color: item.accent }}>
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${item.value}%`, backgroundColor: item.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {filteredRules.length === 0 ? (
          <GlassCard className="p-6 mb-8">
            <p className="font-body text-sm text-[var(--text-sec)]">
              No rules in the selected category were triggered for the current case.
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredRules.map((rule) => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        )}

        <StationFooter prevPath="/pipeline/8" nextPath="/pipeline/10" />
      </div>
    </PipelineLayout>
  );
}

function RuleCard({ rule }: { rule: DiagnosticRule }) {
  return (
    <GlassCard className="p-6 border-l-4 border-l-[var(--red)] transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div className="font-navigation text-[10px] tracking-widest text-[var(--text-sec)] flex items-center gap-3">
          RULE ID: <span className="text-[var(--text-primary)] font-forensic text-xs">{rule.id}</span>
        </div>
        <StatusChip variant="red">MATCHED</StatusChip>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-3 bg-[var(--bg-deep)] rounded border border-[var(--border)] border-l-2 border-l-[var(--lav-dim)]">
          <span className="font-navigation text-[10px] uppercase tracking-wide text-[var(--text-muted)] block mb-2">
            Interpretation
          </span>
          <p className="font-body text-sm text-[var(--text-primary)]">{rule.interpretation}</p>
        </div>
        <div className="p-3 bg-[var(--bg-deep)] rounded border border-[var(--border)] border-l-2 border-l-[var(--teal-dim)]">
          <span className="font-navigation text-[10px] uppercase tracking-wide text-[var(--text-muted)] block mb-2">
            Teacher Move
          </span>
          <p className="font-body text-sm text-[var(--text-primary)]">{rule.intervention}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border)]">
        <span className="font-navigation text-[10px] uppercase tracking-wide text-[var(--text-muted)] block mb-3">
          Selected Templates
        </span>
        <div className="flex flex-wrap gap-2">
          {rule.templates.map((template) => (
            <StatusChip key={`${rule.id}-${template}`} variant="lav">
              {formatTemplateLabel(template)}
            </StatusChip>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
