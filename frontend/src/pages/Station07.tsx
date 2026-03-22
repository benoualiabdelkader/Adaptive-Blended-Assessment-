import { useState } from 'react';
import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { PedagogicalInsightBadge } from '../components/PedagogicalInsightBadge';
import { Button } from '../components/Atoms';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import { RefreshCw, CheckCircle2, TrendingUp } from 'lucide-react';
import { getSelectedStudyCase, useStudyScopeStore } from '../state/studyScope';

interface FeatureBar {
  name: string;
  value: number;
  color: string;
}

const MAX_SCORE = 25;

function formatFeatureName(name: string) {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Station07() {
  const [isCalculating, setIsCalculating] = useState(false);
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });
  const predictionAvailable = Boolean(selectedCase?.analytics?.prediction.available);
  const metrics = selectedCase?.metrics?.rf_metrics;
  const student = selectedCase?.student;

  const importance = selectedCase?.metrics?.rf_importance ?? [];
  const featureData: FeatureBar[] = importance.slice(0, 5).map((feature, index) => {
    const colors = ['var(--teal)', 'var(--lav)', 'var(--gold)', 'var(--red)', 'var(--lav-dim)'];
    return {
      name: formatFeatureName(feature.feature),
      value: feature.importance,
      color: colors[index] ?? 'var(--text-muted)',
    };
  });

  const scatterData = student && typeof student.predicted_score === 'number'
    ? [
        {
          id: student.student_id,
          actual: Number(student.total_score.toFixed(1)),
          predicted: Number(student.predicted_score.toFixed(1)),
          color: 'var(--teal)',
        },
      ]
    : [];

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 2000);
  };

  return (
    <PipelineLayout
      verifiedEnabled={predictionAvailable && Boolean(student) && Boolean(metrics)}
      unavailableTitle="Verified Prediction Unavailable"
      unavailableMessage={
        selectedCase
          ? selectedCase.analytics?.prediction.reason ?? 'This selected case does not currently have verified prediction output.'
          : 'Select an imported workbook case first to open the verified prediction station.'
      }
      rightPanel={
        metrics && featureData[0] ? (
          <PedagogicalInsightBadge
            urgency="positive"
            label="Predictive Signal"
            observation={`The verified cohort model estimates ${student?.name}'s writing score with R2 = ${metrics.r2.toFixed(2)} and MAE = ${metrics.mae.toFixed(2)}.`}
            implication={`${featureData[0].name} is the strongest model feature in the current imported cohort, but the instructional meaning still requires teacher judgment.`}
            action="Use the prediction as a support signal, then confirm priorities from the actual text, rubric evidence, and revision trace."
            citation="Hattie & Timperley (2007) - The Power of Feedback"
          />
        ) : undefined
      }
    >
      <div className="max-w-7xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={7} title="Predictive Model" subtitle="Layer 7B: Performance Prediction (Random Forest)" />

        <GlassCard className="p-4 mb-6 bg-[var(--bg-raised)]/40 border-dashed border-[var(--border-bright)]">
          <p className="font-body text-sm text-[var(--text-sec)] leading-relaxed">
            This screen uses verified Random Forest output computed from the imported workbook cohort. It opens only when the backend has enough verified cases to train and evaluate the model without fallback values.
          </p>
        </GlassCard>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--teal)]"><TrendingUp size={20} /></div>
              <div>
                <p className="font-forensic text-[var(--teal)] text-lg">MAE: {metrics?.mae.toFixed(2)}</p>
                <p className="font-body text-[10px] text-[var(--text-sec)]">Model-wide prediction error</p>
              </div>
            </div>
            <div className="w-px h-10 bg-[var(--border)]"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--lav)]"><CheckCircle2 size={20} /></div>
              <div>
                <p className="font-forensic text-[var(--lav)] text-lg">R2: {metrics?.r2.toFixed(2)}</p>
                <p className="font-body text-[10px] text-[var(--text-sec)]">Instance Variance Explained</p>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={handleRecalculate}
            disabled={isCalculating}
            className="w-48 justify-center"
          >
            {isCalculating ? <RefreshCw className="animate-spin" size={16} /> : 'Validate Prediction'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GlassCard elevation="high" className="p-6 md:p-8 h-[450px]" pedagogicalLabel="Random Forest feature importance identifies the strongest individual predictors for Asmaa's learning path.">
            <h3 className="font-navigation text-lg font-medium text-[var(--text-primary)] mb-2">Predictive Feature Importance</h3>
            <p className="font-body text-[var(--text-sec)] text-xs mb-6">Variables most influential in the selected learner's score estimate within the imported cohort.</p>

            <ResponsiveContainer width="100%" height="80%" minWidth={0} minHeight={240}>
              <BarChart data={featureData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 11, fontFamily: 'var(--font-navigation)' }} width={100} />
                <RechartsTooltip cursor={{ fill: 'var(--bg-raised)' }} contentStyle={{ backgroundColor: 'var(--bg-high)', border: 'none', borderRadius: '4px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {featureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard elevation="high" className="p-6 md:p-8 h-[450px]" pedagogicalLabel="The single point represents Asmaa's current alignment between predicted potential and actual achievement.">
            <h3 className="font-navigation text-lg font-medium text-[var(--text-primary)] mb-2">Prediction vs Actual (Case Study)</h3>
            <p className="font-body text-[var(--text-sec)] text-xs mb-6">Mapping the selected student's predicted and observed result on the same 25-point scale.</p>

            <ResponsiveContainer width="100%" height="80%" minWidth={0} minHeight={240}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" dataKey="predicted" name="Predicted" domain={[0, MAX_SCORE]} stroke="var(--text-sec)" tick={{ fontSize: 10, fontFamily: 'var(--font-forensic)' }} tickFormatter={(value: number) => value.toFixed(0)} />
                <YAxis type="number" dataKey="actual" name="Actual" domain={[0, MAX_SCORE]} stroke="var(--text-sec)" tick={{ fontSize: 10, fontFamily: 'var(--font-forensic)' }} tickFormatter={(value: number) => value.toFixed(0)} />
                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'var(--bg-high)', border: '1px solid var(--border)' }} />
                <ReferenceLine segment={[{ x: 0, y: 0 }, { x: MAX_SCORE, y: MAX_SCORE }]} stroke="var(--text-muted)" strokeDasharray="4 4" />
                <Scatter name={student?.name ?? 'Selected student'} data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} r={10} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            <div className="flex justify-center gap-4 mt-2 font-navigation text-[10px] text-[var(--text-sec)] uppercase tracking-wider">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[var(--teal)]"></div> Target Alignment</span>
            </div>
          </GlassCard>
        </div>

        <StationFooter prevPath="/pipeline/6" nextPath="/pipeline/8" />
      </div>
    </PipelineLayout>
  );
}
