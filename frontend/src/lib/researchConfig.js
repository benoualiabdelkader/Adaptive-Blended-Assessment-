export const defaultThresholds = [
  {
    key: 'grammar_accuracy_low',
    name: 'Grammar Accuracy threshold',
    threshold_value: '<= 2/5',
    stream: 'Product',
    rule: 'Rule 1',
    reference: 'Grammar remediation'
  },
  {
    key: 'error_density_high',
    name: 'Error Density threshold',
    threshold_value: '> 3.5/100w',
    stream: 'Product',
    rule: 'Rule 1',
    reference: 'Grammar remediation'
  },
  {
    key: 'text_organisation_low',
    name: 'Text Organisation threshold',
    threshold_value: '<= 2/5',
    stream: 'Product',
    rule: 'Rule 2',
    reference: 'Discourse structure'
  },
  {
    key: 'cohesion_score_low',
    name: 'Cohesion Score threshold',
    threshold_value: '<= 2/5',
    stream: 'Product',
    rule: 'Rule 2',
    reference: 'Hyland cohesion'
  },
  {
    key: 'cohesion_markers_low',
    name: 'Cohesion Markers threshold',
    threshold_value: '< 3',
    stream: 'NLP',
    rule: 'Rule 2',
    reference: 'Marker inventory'
  },
  {
    key: 'revision_frequency_active',
    name: 'Revision Frequency threshold',
    threshold_value: '>= 2',
    stream: 'Process',
    rule: 'Rule 3 check',
    reference: 'Engagement validation'
  },
  {
    key: 'argumentation_low',
    name: 'Argumentation threshold',
    threshold_value: '<= 3/5',
    stream: 'Product',
    rule: 'Rule 3',
    reference: 'CEW support'
  },
  {
    key: 'feedback_viewed_false',
    name: 'Feedback Viewed threshold',
    threshold_value: 'FALSE',
    stream: 'Process',
    rule: 'Rule 4',
    reference: 'No uptake'
  },
  {
    key: 'revision_after_feedback_zero',
    name: 'Revision after feedback threshold',
    threshold_value: '= 0',
    stream: 'Process',
    rule: 'Rule 4',
    reference: 'No revision cycle'
  },
  {
    key: 'help_seeking_low',
    name: 'Help-Seeking threshold',
    threshold_value: '>= 1 msg',
    stream: 'Communication',
    rule: 'Rule 5',
    reference: 'Zimmerman signal'
  },
  {
    key: 'overall_score_risk',
    name: 'Overall Score threshold',
    threshold_value: '<= 2.5',
    stream: 'Product',
    rule: 'At-Risk flag',
    reference: 'Urgency classifier'
  },
  {
    key: 'engagement_composite_low',
    name: 'Engagement Composite threshold',
    threshold_value: '< 0.40',
    stream: 'Process',
    rule: 'Low engagement',
    reference: 'Composite behavior'
  },
  {
    key: 'ttr_low',
    name: 'TTR threshold',
    threshold_value: '< 0.35',
    stream: 'NLP',
    rule: 'Vocabulary flag',
    reference: 'Lexical diversity'
  },
  {
    key: 'single_submission_only',
    name: 'Draft Submissions threshold',
    threshold_value: '= 1 only',
    stream: 'Process',
    rule: 'No revision cycle',
    reference: 'Draft monitoring'
  },
  {
    key: 'score_gain_low',
    name: 'Score Gain D1→D2 threshold',
    threshold_value: '< 0.5 pts',
    stream: 'Product',
    rule: 'Intensify intervention',
    reference: 'Growth delta'
  },
  {
    key: 'bayesian_competence_low',
    name: 'Bayesian Competence threshold',
    threshold_value: '< 50%',
    stream: 'AI Output',
    rule: 'Weakness confirmed',
    reference: 'Posterior probability'
  }
];

export const defaultStudySettings = [
  { key: 'study_title', value: 'Adaptive Blended Assessment Through Learning Analytics and Artificial Intelligence to Enhance Academic Writing' },
  { key: 'institution', value: 'Belhadj Bouchaib University' },
  { key: 'cohort_size', value: '28' },
  { key: 'academic_year', value: '2025-2026' },
  { key: 'engagement_weight_logins', value: '0.25' },
  { key: 'engagement_weight_revisions', value: '0.30' },
  { key: 'engagement_weight_feedback', value: '0.20' },
  { key: 'engagement_weight_time_on_task', value: '0.25' },
  { key: 'profile_boundary_high_engagement', value: '0.65' },
  { key: 'profile_boundary_high_performance', value: '3.20' }
];

export const defaultFeedbackTemplates = [
  {
    intent: 'Rule 1',
    title: 'Direct Corrective Feedback',
    content_structure: 'Highlight recurring grammar patterns, model a corrected sentence, and set one explicit micro-goal for the next revision.'
  },
  {
    intent: 'Rule 2',
    title: 'Discourse / PEEL Structure',
    content_structure: 'Prompt the learner to restate the paragraph point, attach evidence, explain it clearly, and link back to the argument.'
  },
  {
    intent: 'Rule 3',
    title: 'Argumentation / CEW Framework',
    content_structure: 'Reinforce claim-evidence-warrant reasoning and require one additional supporting justification in the next draft.'
  },
  {
    intent: 'Rule 4',
    title: 'Metacognitive Prompt',
    content_structure: 'Ask the learner to review feedback, identify two revision priorities, and explain how those changes will strengthen the paragraph.'
  },
  {
    intent: 'At-Risk',
    title: 'Motivational / At-Risk',
    content_structure: 'Provide affective support, simplify the next step, and encourage a short targeted revision task with low cognitive load.'
  }
];
