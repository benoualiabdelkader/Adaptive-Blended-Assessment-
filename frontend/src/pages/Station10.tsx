import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { PedagogicalInsightBadge } from '../components/PedagogicalInsightBadge';
import { CommunicationTrace } from '../components/CommunicationTrace';
import { getSelectedStudyCase, useStudyScopeStore, type TeacherStudyCase } from '../state/studyScope';

interface FeedbackLoop {
  viewedDelayDays: number;
  revisionDelayDays: number;
  viewedAt: string;
}

function parseDate(input: string) {
  const trimmed = input.includes(' / ') ? input.split(' / ')[0] : input;
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function buildFeedbackLoop(studyCase: TeacherStudyCase): FeedbackLoop | null {
  const comment = studyCase.communication.instructorComments[0];
  const viewedAt = parseDate(studyCase.meta.feedbackViewedAt);
  const commentAt = comment ? parseDate(comment.date) : null;
  const feedbackAnchor = viewedAt ?? commentAt;
  const revisionAfterFeedback = studyCase.writing.sequence.find((step) => {
    if (!['revision', 'final'].includes(step.kind)) {
      return false;
    }
    const stepTime = parseDate(step.timestamp);
    return feedbackAnchor !== null && stepTime !== null && stepTime >= feedbackAnchor;
  });

  if (feedbackAnchor === null || !revisionAfterFeedback) {
    return null;
  }

  const revisionAt = parseDate(revisionAfterFeedback.timestamp);
  if (revisionAt === null) {
    return null;
  }

  const commentLagDays = commentAt !== null ? Math.max(0, (viewedAt ?? commentAt) - commentAt) / 86400000 : 0;
  return {
    viewedDelayDays: Number(commentLagDays.toFixed(1)),
    revisionDelayDays: Number(((revisionAt - feedbackAnchor) / 86400000).toFixed(1)),
    viewedAt: studyCase.meta.feedbackViewedAt,
  };
}

function getPlanningPrompt(studyCase: TeacherStudyCase) {
  const focusAreas: string[] = [];
  if (studyCase.student.argumentation < 3.6) focusAreas.push('clearer claim-evidence explanation');
  if (studyCase.student.grammar_accuracy < 3.4) focusAreas.push('more controlled academic phrasing');
  if (studyCase.student.cohesion < 3.6) focusAreas.push('stronger transitions between ideas');

  if (focusAreas.length === 0) {
    focusAreas.push('maintaining current gains with one precise revision target');
  }

  return `Keep the next teacher comment narrow and actionable. The current evidence suggests focusing on ${focusAreas.join(', ')}.`;
}

export function Station10() {
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });
  const feedbackLoop = selectedCase ? buildFeedbackLoop(selectedCase) : null;
  const planningPrompt = selectedCase ? getPlanningPrompt(selectedCase) : '';

  const histogramData = feedbackLoop
    ? [
        { range: '< 1 day', count: feedbackLoop.revisionDelayDays < 1 ? 1 : 0, fill: 'var(--teal)' },
        { range: '1-2 days', count: feedbackLoop.revisionDelayDays >= 1 && feedbackLoop.revisionDelayDays <= 2 ? 1 : 0, fill: 'var(--gold)' },
        { range: '> 3 days', count: feedbackLoop.revisionDelayDays > 3 ? 1 : 0, fill: 'var(--red)' },
      ]
    : [];

  const swimlaneData = selectedCase && feedbackLoop
    ? [
        {
          id: selectedCase.student.student_id,
          sent: 0,
          viewed: feedbackLoop.viewedDelayDays,
          submitted: feedbackLoop.revisionDelayDays,
          speed: feedbackLoop.revisionDelayDays <= 2 ? 'fast' : 'slow',
        },
      ]
    : [];

  return (
    <PipelineLayout
      verifiedEnabled={Boolean(selectedCase)}
      unavailableTitle="Verified Feedback Planning Unavailable"
      unavailableMessage="Import a verified workbook case before opening the feedback-planning station."
      rightPanel={
        selectedCase ? (
          <PedagogicalInsightBadge
            urgency="positive"
            label="Teacher Feedback Planning"
            observation={`The workbook trace for ${selectedCase.meta.studentName} shows how quickly feedback was reopened and whether revision followed within a short cycle.`}
            implication="This timing evidence helps the teacher judge whether the current feedback format is usable and whether the next round should stay narrow or become more explicit."
            action="Use the timing and message trace below to plan the next teacher comment. The actual feedback remains the instructor's decision."
            citation="Carless & Boud (2018) - Feedback Literacy / Formative Feedback"
          />
        ) : undefined
      }
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={10} title="Feedback Planning" subtitle="Layer 9: Feedback Timing and Teacher Review" />

        <GlassCard elevation="high" className="p-6 md:p-8 mb-8 overflow-x-auto" pedagogicalLabel="Swimlane topography visualises the temporal relationship between feedback delivery and revision response.">
          <h3 className="font-navigation text-lg font-medium text-[var(--text-primary)] mb-6">Feedback Response Topography</h3>

          {swimlaneData.length === 0 ? (
            <p className="font-body text-sm text-[var(--text-sec)]">The current workbook does not contain a parseable feedback-response loop for this visual.</p>
          ) : (
            <div className="min-w-[600px] border border-[var(--border)] rounded-lg bg-[var(--bg-deep)] p-4 relative">
              <div className="flex justify-between border-b border-[var(--border)] pb-2 mb-4 font-navigation text-[10px] text-[var(--text-primary)] font-bold">
                <span>Day 0 (sent)</span>
                <span>Day 2</span>
                <span>Day 4</span>
                <span>Day 6+</span>
              </div>

              <div className="space-y-4 relative">
                <div className="absolute inset-y-0 left-[33%] w-px bg-[var(--border-bright)] border-dashed"></div>
                <div className="absolute inset-y-0 left-[66%] w-px bg-[var(--border-bright)] border-dashed"></div>

                {swimlaneData.map((row) => (
                  <div key={row.id} className="flex items-center h-8 group hover:bg-[var(--bg-raised)] rounded px-2 -mx-2 transition-colors">
                    <div className="w-20 font-forensic text-xs text-[var(--text-sec)] group-hover:text-[var(--text-primary)]">CASE {row.id}</div>
                    <div className="flex-1 relative h-full flex items-center">
                      <div
                        className="absolute h-0.5"
                        style={{
                          left: `${(row.sent / 7) * 100}%`,
                          width: `${(Math.max(row.submitted - row.sent, 0.2) / 7) * 100}%`,
                          backgroundColor: row.speed === 'fast' ? 'var(--teal-dim)' : 'var(--gold-dim)',
                        }}
                      />
                      <div className="absolute w-3 h-3 rounded-full bg-[var(--text-muted)] border-2 border-[var(--bg-deep)] -translate-x-1.5" style={{ left: `${(row.sent / 7) * 100}%` }} title="Feedback sent" />
                      <div className="absolute w-3 h-3 rounded-full border-2 border-[var(--lav)] bg-[var(--bg-deep)] -translate-x-1.5 z-10" style={{ left: `${(row.viewed / 7) * 100}%` }} title="Feedback viewed" />
                      <div className="absolute w-3 h-3 z-20 -translate-x-1.5 bg-[var(--teal)]" style={{ left: `${(row.submitted / 7) * 100}%` }} title="Revision submitted" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-[var(--border)] font-navigation text-xs text-[var(--text-sec)]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--text-muted)]"></div> Sent</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full border-2 border-[var(--lav)]"></div> Viewed</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[var(--teal)]"></div> Revised</div>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6 mb-8">
          <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)] mb-2">Possible Teacher Focus</h3>
          <p className="font-body text-xs text-[var(--text-sec)] mb-6">
            This is a planning prompt derived from the workbook evidence. It is not final feedback delivered automatically to the student.
          </p>
          <div className="p-4 bg-[var(--bg-deep)] rounded border border-[var(--border)] border-l-4 border-l-[var(--lav)]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-navigation text-xs font-bold text-[var(--text-primary)]">
                {selectedCase?.meta.studentName ?? 'Selected case'}
              </span>
              <span className="font-forensic text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Teacher planning prompt</span>
            </div>
            <p className="font-body text-sm text-[var(--text-sec)] italic leading-relaxed">&quot;{planningPrompt}&quot;</p>
          </div>
        </GlassCard>

        {selectedCase && (
          <GlassCard className="p-6 mb-8" pedagogicalLabel="The exchange trace shows how the student asked for clarification and how the teacher's written comment shaped the next revision cycle.">
            <CommunicationTrace
              messages={selectedCase.communication.dialogue}
              comments={selectedCase.communication.instructorComments}
              title="Dialogue and Comment Trace"
              subtitle="Teacher-student messages and the formal instructor comment extracted from the verified workbook."
            />
          </GlassCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-6 h-[300px]" pedagogicalLabel="Response latency is a practical indicator of feedback uptake and task re-entry.">
            <h4 className="font-navigation text-sm uppercase tracking-widest text-[var(--text-sec)] mb-4">Observed Response Latency</h4>
            {histogramData.length === 0 ? (
              <p className="font-body text-sm text-[var(--text-sec)]">No verified response-latency distribution could be derived from the current workbook.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
                <BarChart data={histogramData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="range" tick={{ fill: 'var(--text-sec)', fontSize: 11, fontFamily: 'var(--font-navigation)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-sec)', fontSize: 11, fontFamily: 'var(--font-forensic)' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'var(--bg-raised)' }} contentStyle={{ backgroundColor: 'var(--bg-high)', border: 'none', borderRadius: '4px', color: 'var(--text-primary)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          <GlassCard accent="lav" glow className="p-6 flex flex-col justify-center bg-[var(--bg-base)]">
            <div className="font-forensic text-3xl text-[var(--lav)] mb-2">
              {feedbackLoop ? `${feedbackLoop.revisionDelayDays.toFixed(1)} Days` : 'N/A'}
            </div>
            <p className="font-navigation text-sm text-[var(--text-sec)] mb-4">Observed revision loop after teacher feedback</p>
            <div className="font-forensic text-xl text-[var(--text-muted)] mb-2">3.0 Days</div>
            <p className="font-navigation text-sm text-[var(--text-sec)]">Monitoring threshold for delayed response</p>
            <p className="font-body text-xs text-[var(--text-sec)] mt-6">
              Workbook viewed timestamp: {feedbackLoop?.viewedAt ?? 'Not parsed from current workbook'}
            </p>
          </GlassCard>
        </div>

        <StationFooter prevPath="/pipeline/9" nextPath="/pipeline/11" />
      </div>
    </PipelineLayout>
  );
}
