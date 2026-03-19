import { defaultThresholds } from './researchConfig';
import { bayesianService } from '../services/bayesianService';
import { nlpService } from '../services/nlpService';
import { randomForestService } from '../services/randomForestService';
import { textDiffService } from '../services/textDiffService';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function average(values = []) {
  const filtered = values.filter((value) => Number.isFinite(value));
  if (!filtered.length) {
    return 0;
  }
  return filtered.reduce((sum, value) => sum + value, 0) / filtered.length;
}

function normalizeAction(log = {}) {
  const haystack = [log.action_type, log.component, log.context, log.origin]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (haystack.includes('feedback')) return 'feedback_view';
  if (haystack.includes('rubric')) return 'rubric_view';
  if (haystack.includes('submit')) return 'submission';
  if (haystack.includes('assign')) return 'assignment_view';
  if (haystack.includes('resource') || haystack.includes('file') || haystack.includes('page') || haystack.includes('url')) return 'resource_view';
  if (haystack.includes('login') || haystack.includes('course viewed') || haystack.includes('logged')) return 'login';
  return 'view';
}

function buildFeatureForDraft(draft, existingFeature) {
  if (existingFeature) {
    return {
      ...existingFeature,
      argumentation_profile: existingFeature.argumentation_profile ?? nlpService.detectArgument(draft?.text_content || '')
    };
  }

  return nlpService.processEssay(draft?.text_content || '', draft?.student_id || 0, draft?.draft_number || 1);
}

function deriveRubric(feature, textContent = '') {
  const argumentProfile = feature.argumentation_profile || nlpService.detectArgument(textContent);
  const grammarAcc = clamp(5 - feature.error_density * 60, 1, 5);
  const lexRange = clamp(1 + feature.ttr * 5.5, 1, 5);
  const org = clamp(1 + feature.cohesion_markers / 3 + feature.complexity / 20, 1, 5);
  const cohesion = clamp(1 + feature.cohesion_markers / 2.5, 1, 5);
  const arg = clamp(1 + argumentProfile.score * 1.25, 1, 5);
  const total = (grammarAcc + lexRange + org + cohesion + arg) / 5;

  return {
    grammarAcc: Number(grammarAcc.toFixed(2)),
    lexRange: Number(lexRange.toFixed(2)),
    org: Number(org.toFixed(2)),
    cohesion: Number(cohesion.toFixed(2)),
    arg: Number(arg.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}

function scoreToPercent(score, max = 5) {
  return Math.round((score / max) * 100);
}

function featureToPercent(feature) {
  return {
    lexical: scoreToPercent(feature.rubric.lexRange),
    cohesion: scoreToPercent(feature.rubric.cohesion),
    grammarControl: Math.round((1 - clamp(feature.metrics.error_density * 12, 0, 1)) * 100),
    ttr: Math.round(clamp(feature.metrics.ttr, 0, 1) * 100),
    complexity: Math.round(clamp(feature.metrics.complexity / 30, 0, 1) * 100),
    argumentation: scoreToPercent(feature.rubric.arg)
  };
}

function computeSigma(primaryValue, values) {
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  const stdDev = Math.sqrt(variance);
  if (stdDev === 0) {
    return 0;
  }
  return Number(((primaryValue - mean) / stdDev).toFixed(2));
}

function getThresholdMap(ruleDefinitions = []) {
  const rows = ruleDefinitions.length ? ruleDefinitions : defaultThresholds;
  return Object.fromEntries(rows.map((row) => [row.key, row.threshold_value]));
}

export function buildCohortRecords(snapshot = {}) {
  const students = snapshot.students ?? [];
  const drafts = snapshot.drafts ?? [];
  const textFeatures = snapshot.textFeatures ?? [];
  const logs = snapshot.logs ?? [];
  const messages = snapshot.messages ?? [];
  const profiles = snapshot.profiles ?? [];

  const draftsByStudent = drafts.reduce((acc, draft) => {
    const studentDrafts = acc.get(draft.student_id) ?? [];
    studentDrafts.push(draft);
    acc.set(draft.student_id, studentDrafts);
    return acc;
  }, new Map());

  const featuresByDraft = new Map(
    textFeatures
      .filter((feature) => feature.draft_id !== undefined)
      .map((feature) => [`${feature.student_id}-${feature.draft_id}`, feature])
  );

  const profileMap = new Map(profiles.map((profile) => [profile.student_id, profile.cluster_label]));

  return students.map((student, index) => {
    const studentDrafts = [...(draftsByStudent.get(student.id) ?? [])].sort((a, b) => (a.draft_number || 0) - (b.draft_number || 0));
    const draftAnalytics = studentDrafts.map((draft) => {
      const key = `${draft.student_id}-${draft.id ?? draft.draft_number}`;
      const feature = buildFeatureForDraft(draft, featuresByDraft.get(key) || textFeatures.find((item) => item.student_id === draft.student_id && item.draft_id === draft.id));
      const rubric = deriveRubric(feature, draft.text_content || '');
      return {
        draft,
        metrics: feature,
        rubric,
        percentages: featureToPercent({ metrics: feature, rubric })
      };
    });

    const latestAnalytics = draftAnalytics[draftAnalytics.length - 1] ?? {
      draft: null,
      metrics: { ttr: 0, error_density: 0, cohesion_markers: 0, complexity: 0, argumentation_profile: { score: 0 } },
      rubric: { grammarAcc: 1, lexRange: 1, org: 1, cohesion: 1, arg: 1, total: 1 },
      percentages: { lexical: 20, cohesion: 20, grammarControl: 20, ttr: 20, complexity: 20, argumentation: 20 }
    };

    const studentLogs = logs.filter((log) => log.student_id === student.id).map((log) => ({
      ...log,
      action_type: normalizeAction(log)
    }));
    const studentMessages = messages.filter((message) => message.student_id === student.id);
    const actionCounts = studentLogs.reduce((acc, log) => {
      acc[log.action_type] = (acc[log.action_type] ?? 0) + 1;
      return acc;
    }, {});
    const totalDuration = studentLogs.reduce((sum, log) => sum + (Number(log.duration) || 0), 0);
    const profileLabel = profileMap.get(student.id) || 'Strategic Writer';

    return {
      id: student.id ?? index + 1,
      studentCode: student.student_code ?? `S${String(index + 1).padStart(2, '0')}`,
      name: student.name ?? `Research Subject ${String(index + 1).padStart(2, '0')}`,
      profileLabel,
      drafts: studentDrafts,
      draftAnalytics,
      latestAnalytics,
      logs: studentLogs,
      messages: studentMessages,
      actions: actionCounts,
      totalDuration,
      submissionCount: actionCounts.submission ?? studentDrafts.length,
      feedbackViews: actionCounts.feedback_view ?? 0,
      resourceViews: actionCounts.resource_view ?? 0,
      logins: actionCounts.login ?? 0,
      rubricViews: actionCounts.rubric_view ?? 0,
      assignmentsViewed: actionCounts.assignment_view ?? 0
    };
  });
}

export function selectPrimaryRecord(records = []) {
  if (!records.length) {
    return null;
  }

  return [...records].sort((a, b) => b.draftAnalytics.length - a.draftAnalytics.length || b.logs.length - a.logs.length)[0];
}

export function buildTextAnalyticsData(snapshot = {}) {
  const records = buildCohortRecords(snapshot);
  const primary = selectPrimaryRecord(records);
  if (!primary) {
    return null;
  }

  const cohortPercentages = records.map((record) => record.latestAnalytics.percentages);
  const primaryPercentages = primary.latestAnalytics.percentages;
  const radarData = [
    { subject: 'Lexical Range', A: primaryPercentages.lexical, B: Math.round(average(cohortPercentages.map((item) => item.lexical))) },
    { subject: 'Cohesion', A: primaryPercentages.cohesion, B: Math.round(average(cohortPercentages.map((item) => item.cohesion))) },
    { subject: 'Grammar Control', A: primaryPercentages.grammarControl, B: Math.round(average(cohortPercentages.map((item) => item.grammarControl))) },
    { subject: 'TTR Index', A: primaryPercentages.ttr, B: Math.round(average(cohortPercentages.map((item) => item.ttr))) },
    { subject: 'Complexity', A: primaryPercentages.complexity, B: Math.round(average(cohortPercentages.map((item) => item.complexity))) },
    { subject: 'Argumentation', A: primaryPercentages.argumentation, B: Math.round(average(cohortPercentages.map((item) => item.argumentation))) }
  ];

  const sigma = computeSigma(primary.latestAnalytics.metrics.ttr, records.map((record) => record.latestAnalytics.metrics.ttr));
  const thresholdMap = getThresholdMap(snapshot.ruleDefinitions);
  const anomalies = [
    {
      label: 'Vocabulary Flag',
      value: primary.latestAnalytics.metrics.ttr < 0.35 ? 'TRIGGERED' : primary.latestAnalytics.metrics.ttr > 0.55 ? 'ELEVATED' : 'STABLE'
    },
    {
      label: 'Error Density',
      value: primary.latestAnalytics.metrics.error_density > 0.035 ? 'HIGH' : 'NOMINAL'
    },
    {
      label: 'Cohesion Markers',
      value: primary.latestAnalytics.metrics.cohesion_markers < 3 ? 'LOW' : 'SECURE'
    }
  ];

  return {
    primary,
    radarData,
    sigma,
    confidence: Math.round(clamp(72 + Math.abs(sigma) * 9, 0, 98)),
    anomalyCount: anomalies.filter((item) => item.value !== 'NOMINAL' && item.value !== 'STABLE' && item.value !== 'SECURE').length,
    anomalies,
    thresholdMap
  };
}

export function buildPredictiveModelingData(snapshot = {}) {
  const records = buildCohortRecords(snapshot).filter((record) => record.logs.length || record.drafts.length);
  const primary = selectPrimaryRecord(records);
  if (!primary) {
    return null;
  }

  const trainingRows = records.map((record) =>
    randomForestService.buildTrainingData(
      record.logs,
      { total: record.latestAnalytics.rubric.total },
      record.messages.length
    )
  );

  const model = randomForestService.trainModel(trainingRows);
  const featureData = randomForestService
    .getFeatureImportance(model, trainingRows[0]?.features || [], trainingRows)
    .map((item, index) => ({
      name: item.feature,
      val: Math.round(item.importance * 100),
      isPrimary: index === 0
    }));

  const primaryTraining = randomForestService.buildTrainingData(
    primary.logs,
    { total: primary.latestAnalytics.rubric.total },
    primary.messages.length
  );
  const prediction = randomForestService.predict(model, primaryTraining.X);

  return {
    primary,
    model,
    featureData,
    prediction,
    datasetSize: records.reduce((sum, record) => sum + record.logs.length + record.drafts.length + record.messages.length, 0)
  };
}

function buildPriorDistribution(network) {
  return network.nodes.reduce((acc, node) => {
    acc[node] = {
      Developing: network.prior,
      Emerging: network.prior,
      Achieved: network.prior,
      Advanced: network.prior
    };
    return acc;
  }, {});
}

export function buildCompetenceInferenceData(snapshot = {}) {
  const records = buildCohortRecords(snapshot);
  const primary = selectPrimaryRecord(records);
  if (!primary || !primary.draftAnalytics.length) {
    return null;
  }

  const network = bayesianService.buildNetwork();
  let prior = buildPriorDistribution(network);

  const draftDistributions = primary.draftAnalytics.map((entry, index) => {
    const evidence = bayesianService.setEvidence(primary.id, entry.draft.draft_number || index + 1, {
      lexical: entry.metrics.ttr,
      grammar: 1 - entry.metrics.error_density,
      discourse: entry.rubric.org / 5,
      argumentation: entry.rubric.arg / 5,
      cohesion: entry.rubric.cohesion / 5
    });
    const posterior = bayesianService.inferCompetencies(network, prior, evidence);
    prior = bayesianService.updatePrior(posterior);

    return {
      draftNumber: entry.draft.draft_number || index + 1,
      posterior
    };
  });

  const first = draftDistributions[0]?.posterior;
  const latest = draftDistributions[draftDistributions.length - 1]?.posterior;
  const competencyMap = {
    Lexical: 'Lexical Range',
    Grammar: 'Grammar',
    Discourse: 'Discourse',
    Argumentation: 'Argumentation'
  };

  const radarData = Object.entries(competencyMap).map(([node, label]) => ({
    subject: label,
    prior: Math.round((first?.[node]?.Achieved || 0) * 100),
    posterior: Math.round((latest?.[node]?.Achieved || 0) * 100)
  }));

  const rails = radarData.map((item) => ({
    label: item.subject,
    val: item.posterior,
    delta: item.posterior - item.prior
  }));

  return {
    primary,
    radarData,
    rails,
    confidence: Math.round(average(rails.map((item) => item.val))),
    gainBits: Number((rails.reduce((sum, item) => sum + Math.abs(item.delta), 0) / 25).toFixed(2)),
    latestDraftLabel: `Draft ${draftDistributions[draftDistributions.length - 1]?.draftNumber || 1}`
  };
}

export function buildDiagnosisData(snapshot = {}) {
  const records = buildCohortRecords(snapshot);
  const thresholdMap = getThresholdMap(snapshot.ruleDefinitions);

  const rules = [
    {
      id: 'RULE-01',
      severity: 'high',
      name: 'Linguistic Accuracy Issue',
      subtitle: 'Global Error',
      basis: 'Ferris (2011) - Corrective Feedback Research',
      color: 'primary'
    },
    {
      id: 'RULE-02',
      severity: 'medium',
      name: 'Discourse Structure Problem',
      subtitle: 'Organization Gap',
      basis: 'Flower & Hayes (1981) - Cognitive Process Theory',
      color: 'secondary'
    },
    {
      id: 'RULE-03',
      severity: 'medium',
      name: 'Rhetorical Mastery Gap',
      subtitle: 'Argumentative Depth',
      basis: 'Hyland (2019) - Metadiscourse in Academic Writing',
      color: 'tertiary'
    },
    {
      id: 'RULE-04',
      severity: 'high',
      name: 'Feedback Uptake Failure',
      subtitle: 'No Revision After Feedback',
      basis: 'Hattie & Timperley (2007) - The Power of Feedback',
      color: 'primary'
    },
    {
      id: 'RULE-05',
      severity: 'medium',
      name: 'Help-Seeking Regulation Signal',
      subtitle: 'Support Without Uptake',
      basis: 'Zimmerman (2008) - Self-Regulated Learning',
      color: 'secondary'
    }
  ].map((rule) => ({ ...rule, count: 0, condition: '', pattern: '', intervention: '' }));

  records.forEach((record) => {
    const latest = record.latestAnalytics;
    if (latest.rubric.grammarAcc <= 2 || latest.metrics.error_density > 0.035) rules[0].count += 1;
    if (latest.rubric.org <= 2 || latest.rubric.cohesion <= 2 || latest.metrics.cohesion_markers < 3) rules[1].count += 1;
    if (record.submissionCount >= 2 && latest.rubric.arg <= 3) rules[2].count += 1;
    if (record.feedbackViews === 0 || (record.feedbackViews > 0 && record.submissionCount <= 1)) rules[3].count += 1;
    if (record.messages.length >= 1) rules[4].count += 1;
  });

  rules[0].condition = `Grammar ${thresholdMap.grammar_accuracy_low || '<= 2/5'} OR Error Density ${thresholdMap.error_density_high || '> 3.5/100w'}`;
  rules[0].pattern = 'High grammar load with dense low-level error traces';
  rules[0].intervention = 'Trigger corrective feedback with localized error cues and one focused accuracy target.';

  rules[1].condition = `Organization ${thresholdMap.text_organisation_low || '<= 2/5'} OR Cohesion Markers ${thresholdMap.cohesion_markers_low || '< 3'}`;
  rules[1].pattern = 'Weak paragraph progression and limited transition signaling';
  rules[1].intervention = 'Provide structure-focused feedback with paragraph sequencing prompts.';

  rules[2].condition = `Revision Frequency ${thresholdMap.revision_frequency_active || '>= 2'} AND Argumentation ${thresholdMap.argumentation_low || '<= 3/5'}`;
  rules[2].pattern = 'Multiple revisions without meaningful argumentative strengthening';
  rules[2].intervention = 'Shift from surface correction toward evidence-claim-warrant coaching.';

  rules[3].condition = `Feedback Viewed ${thresholdMap.feedback_viewed_false || 'FALSE'} OR Revision After Feedback ${thresholdMap.revision_after_feedback_zero || '= 0'}`;
  rules[3].pattern = 'Learner receives input but does not translate it into revision behavior';
  rules[3].intervention = 'Escalate to metacognitive prompting and require explicit revision planning.';

  rules[4].condition = `Help-Seeking ${thresholdMap.help_seeking_low || '>= 1 msg'} AND Message Threshold active`;
  rules[4].pattern = 'Support requests indicate effort, but uptake may remain inconsistent';
  rules[4].intervention = 'Pair affective support with one narrow revision objective and follow-up checkpoint.';

  const activeRule = [...rules].sort((a, b) => b.count - a.count)[0];
  return { rules, activeRule };
}

export function buildRevisionCycleData(snapshot = {}) {
  const records = buildCohortRecords(snapshot);
  const primary = selectPrimaryRecord(records);
  if (!primary || !primary.draftAnalytics.length) {
    return null;
  }

  const chartData = primary.draftAnalytics.map((entry, index) => ({
    name: `D${entry.draft.draft_number || index + 1}`,
    grammar: scoreToPercent(entry.rubric.grammarAcc),
    cohesion: scoreToPercent(entry.rubric.cohesion),
    argumentation: scoreToPercent(entry.rubric.arg),
    overall: scoreToPercent(entry.rubric.total)
  }));

  const diffSummaries = primary.draftAnalytics.slice(1).map((entry, index) => {
    const previous = primary.draftAnalytics[index];
    const delta = textDiffService.calculateGrowthDelta(previous.draft.text_content || '', entry.draft.text_content || '');
    return {
      from: previous.draft.draft_number || index + 1,
      to: entry.draft.draft_number || index + 2,
      delta,
      summary: delta ? textDiffService.getDiffSummary(delta) : 'No diff available'
    };
  });

  const overallScores = chartData.map((item) => item.overall);
  const avgGain = overallScores.length > 1 ? overallScores[overallScores.length - 1] - overallScores[0] : 0;
  const improvedCount = records.filter((record) => record.latestAnalytics.rubric.total >= 3).length;

  return {
    primary,
    chartData,
    diffSummaries,
    avgGain: Number((avgGain / 20).toFixed(1)),
    improvementPercent: Math.max(0, overallScores.length > 1 ? overallScores[overallScores.length - 1] - overallScores[0] : 0),
    improvedCount,
    atRiskCount: records.filter((record) => record.latestAnalytics.rubric.total <= 2.5).length,
    bayesianConfidence: Math.round(average(records.map((record) => scoreToPercent(record.latestAnalytics.rubric.total, 5))))
  };
}
