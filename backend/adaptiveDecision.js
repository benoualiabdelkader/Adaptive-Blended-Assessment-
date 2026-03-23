const FEEDBACK_TEMPLATES = {
  planning_scaffold:
    'Before rewriting, read the rubric carefully and make a short outline. Write your main claim, one supporting point, and one explanation before you begin drafting.',
  planning_prompt:
    'Your paragraph would improve with clearer planning. Before writing, note your topic sentence, one example, and the explanation you want to add.',
  elaboration_prompt:
    'Your paragraph is underdeveloped for this task. Add one supporting idea and one explanatory sentence to make the argument clearer.',
  motivational_reengagement:
    'Revisit the assignment instructions, rubric, and model examples before writing again. Focus on one clear step at a time so you can complete the task with confidence.',
  explicit_strategic_instruction:
    'You are making a clear effort, but your paragraph needs stronger structure and support. Focus on organizing your ideas and explaining how your evidence supports your argument.',
  metacognitive_prompt:
    'Before revising, ask yourself: What is the main weakness in my paragraph? What one change would improve it the most? Revise with that goal in mind.',
  argument_scaffold:
    'Your paragraph needs stronger argument development. Add one clear example and explain directly how it supports your main claim.',
  argument_expansion:
    'Your main idea is relevant, but it needs deeper explanation. After giving your example, explain why it proves your point.',
  metacognitive_extension:
    'Your argument is already strong. To make it more advanced, add a counter-argument or deepen your explanation of the issue.',
  cohesion_support:
    'Your ideas are relevant, but the paragraph needs better flow. Use linking words such as however, therefore, furthermore, or in addition to connect your ideas more clearly.',
  organization_support:
    'Your paragraph is generally organized, but the order of ideas can be clearer. Make sure each sentence supports the main point and follows a logical sequence.',
  direct_corrective_feedback:
    'Your writing contains repeated grammar problems that reduce clarity. Revise the highlighted errors and correct the same pattern throughout the paragraph.',
  metalinguistic_feedback:
    'Check the grammar pattern in the highlighted sentence. Think about the rule, then try correcting the sentence yourself before resubmitting.',
  fluency_extension:
    'Your language is accurate. Now focus on making your paragraph more fluent and academic by varying sentence structure and using more precise wording.',
  lexical_enrichment:
    'Your vocabulary is understandable, but it is too basic or repetitive for academic writing. Replace common words with more formal and precise academic alternatives.',
  lexical_refinement:
    'Your vocabulary is developing well, but some expressions can be more precise. Revise a few key words so your paragraph sounds more academic.',
  revision_prompt:
    'Revise your paragraph by improving one idea, one example, and one sentence pattern. Do not focus only on grammar; improve the meaning and support as well.',
  global_revision_feedback:
    'You revised your paragraph, but you still need to improve explanation, organization, and support. Go beyond sentence correction and strengthen the whole paragraph.',
  metacognitive_feedback:
    'Your revision shows real improvement. Reflect on what strategy helped you most so you can use it again in your next paragraph.',
  feedback_decoding:
    'You viewed the feedback, but your draft does not yet show enough change. Re-read the comments and apply at least one improvement to your ideas and one to your language.',
  feedforward_guidance:
    'You improved some parts of the paragraph. Now use the feedback to deepen your explanation and improve the structure of your ideas.',
  reinforcement_feedback:
    'You used the feedback effectively. Continue refining your paragraph by strengthening your argument and making your writing more precise.',
  dialogic_scaffolding:
    'Your question shows good engagement with the writing task. We will clarify the problem together and improve that part of the paragraph step by step.',
  intensive_support_plan:
    'You need more structured support to improve this paragraph. Focus first on your weakest area, then revise step by step with guidance.',
  targeted_development_feedback:
    'You are showing potential for improvement. Focus now on the one area that most limits your paragraph so your next revision becomes stronger.',
  argument_refinement:
    'Your argument is developing, but it still needs clearer support and fuller explanation. Strengthen the link between your evidence and your claim.',
  metacognitive_training:
    'Try to manage your writing process more actively: plan before writing, check your progress while drafting, and evaluate your paragraph after revising.',
};

const RULE_DEFINITIONS = {
  A1: {
    category: 'Planning',
    interpretation: 'Low rubric consultation and weak task planning reduce forethought quality.',
    onsite_intervention: 'rubric_walkthrough_and_outline_support',
  },
  A2: {
    category: 'Planning',
    interpretation: 'Short time-on-task and limited development indicate insufficient idea generation.',
    onsite_intervention: 'guided_planning_and_idea_expansion',
  },
  B1: {
    category: 'Argument',
    interpretation: 'Argument quality remains weak and needs clearer claim-evidence-explanation support.',
    onsite_intervention: 'claim_evidence_explanation_modelling',
  },
  B2: {
    category: 'Argument',
    interpretation: 'Reasoning is present but still needs deeper explanation and fuller support.',
    onsite_intervention: 'guided_argument_development',
  },
  B3: {
    category: 'Extension',
    interpretation: 'Strong writers benefit from reflective extension rather than remediation.',
    onsite_intervention: 'counter_argument_and_style_extension',
  },
  B4: {
    category: 'Discourse',
    interpretation: 'Low cohesion weakens paragraph flow and idea linkage.',
    onsite_intervention: 'transition_and_linking_support',
  },
  B5: {
    category: 'Discourse',
    interpretation: 'Organization needs clearer sequencing and paragraph unity.',
    onsite_intervention: 'paragraph_restructuring_with_model',
  },
  B6: {
    category: 'Language',
    interpretation: 'Recurring grammatical problems are limiting performance.',
    onsite_intervention: 'targeted_error_correction_cycle',
  },
  B7: {
    category: 'Language',
    interpretation: 'Language errors should be paired with rule explanation, not correction alone.',
    onsite_intervention: 'mini_lesson_on_recurrent_language_patterns',
  },
  B9: {
    category: 'Lexis',
    interpretation: 'Vocabulary range and precision need explicit support.',
    onsite_intervention: 'academic_vocabulary_expansion',
  },
  B10: {
    category: 'Lexis',
    interpretation: 'Vocabulary choice and register need refinement for academic writing.',
    onsite_intervention: 'formal_register_refinement',
  },
  C1: {
    category: 'Revision',
    interpretation: 'Revision activity is too limited to support improvement.',
    onsite_intervention: 'guided_revision_checklist',
  },
  C2: {
    category: 'Revision',
    interpretation: 'Feedback must be translated into explicit revision actions.',
    onsite_intervention: 'feedback_interpretation_session',
  },
  C3: {
    category: 'Revision',
    interpretation: 'Advanced writers should reflect on strategy and transfer their strengths.',
    onsite_intervention: 'self_explanation_and_transfer_prompt',
  },
  C4: {
    category: 'Feedback',
    interpretation: 'The learner responds to feedback, but still needs help reading comments at a deeper level.',
    onsite_intervention: 'feedback_to_revision_mapping',
  },
  C5: {
    category: 'Feedback',
    interpretation: 'Feedforward guidance can turn current gains into future drafting habits.',
    onsite_intervention: 'next_draft_transfer_prompt',
  },
  C6: {
    category: 'Feedback',
    interpretation: 'Positive reinforcement can extend a strong writer without diluting challenge.',
    onsite_intervention: 'strength_based_extension',
  },
  D1: {
    category: 'Engagement',
    interpretation: 'Re-engagement support is needed before detailed product-level feedback will be effective.',
    onsite_intervention: 'motivational_checkin_and_task_restart',
  },
  D2: {
    category: 'Engagement',
    interpretation: 'The learner is active but needs clearer strategic direction.',
    onsite_intervention: 'explicit_strategy_conference',
  },
  D3: {
    category: 'Regulation',
    interpretation: 'Current performance is acceptable, but self-regulation is fragile and inconsistent.',
    onsite_intervention: 'process_stability_prompt',
  },
  D4: {
    category: 'Regulation',
    interpretation: 'Adaptive help-seeking can be leveraged as part of the revision process.',
    onsite_intervention: 'short_clarification_conference',
  },
  D5: {
    category: 'Regulation',
    interpretation: 'Lack of help-seeking during difficulty increases the risk of stagnation.',
    onsite_intervention: 'help_seeking_activation_prompt',
  },
};

const CLUSTER_LABELS = {
  0: 'Disengaged / low-participation learner',
  1: 'Efficient but fragile regulator',
  2: 'Effortful but struggling writer',
  3: 'Engaged or strategic writer',
};

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function average(values) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function toDelimited(values) {
  return unique(values).join('; ');
}

function buildBayesianStates(student, options = {}) {
  const vocabularyHelpCount = Number(options.vocabularyHelpCount ?? 0);
  const forethought =
    student.rubric_views === 0 && student.time_on_task < 30 && student.word_count < 120
      ? 'Low'
      : student.rubric_views <= 1 || student.time_on_task < 60 || student.word_count < 150
        ? 'Medium'
        : 'High';
  const argument =
    student.argumentation < 3
      ? 'Low'
      : student.argumentation < 3.8
        ? 'Medium'
        : 'High';
  const cohesion =
    student.cohesion_index <= 2 || student.cohesion < 3
      ? 'Low'
      : student.cohesion_index <= 4 || student.cohesion < 4
        ? 'Medium'
        : 'High';
  const revision =
    student.revision_frequency === 0
      ? 'Low'
      : student.revision_frequency <= 2
        ? 'Medium'
        : 'High';
  const feedback =
    student.feedback_views >= 2 && student.revision_frequency >= 2
      ? 'High'
      : student.feedback_views >= 1 && student.revision_frequency >= 1
        ? 'Medium'
        : 'Low';
  const linguistic =
    student.grammar_accuracy < 3 || student.error_density >= 4
      ? 'Low'
      : student.grammar_accuracy < 3.8 || student.error_density >= 2.8
        ? 'Medium'
        : 'High';
  const lexical =
    student.lexical_resource < 3 || student.ttr < 0.45
      ? 'Low'
      : student.lexical_resource < 3.9 || student.ttr < 0.54
        ? 'Medium'
        : 'High';
  const help =
    student.help_seeking_messages >= 1
      ? vocabularyHelpCount > 0
        ? 'Adaptive'
        : 'Present'
      : 'None';

  return {
    forethought,
    argument,
    cohesion,
    revision,
    feedback,
    linguistic,
    lexical,
    help,
  };
}

function buildSignals(student, options = {}) {
  const totalQuality = average([
    Number(student.argumentation ?? 0),
    Number(student.cohesion ?? 0),
    Number(student.grammar_accuracy ?? 0),
    Number(student.lexical_resource ?? 0),
  ]);
  const vocabularyHelpCount = Number(options.vocabularyHelpCount ?? 0);
  const states = buildBayesianStates(student, options);

  return {
    states,
    vocabularyHelpCount,
    totalQuality,
    lowEngagement:
      student.time_on_task < 40 &&
      student.resource_access_count < 3 &&
      student.feedback_views === 0,
    highEngagement:
      student.time_on_task >= 90 &&
      student.resource_access_count >= 5 &&
      student.assignment_views >= 10,
    strongPlanning:
      student.rubric_views >= 3 && Number(student.first_access_delay_minutes ?? 0) <= 30,
    lowPlanning:
      student.rubric_views === 0 && Number(student.first_access_delay_minutes ?? 0) > 30,
    lowWordCount: student.word_count < 120,
    adequateWordCount: student.word_count >= 150,
    weakArgument: student.argumentation < 3.6,
    veryWeakArgument: student.argumentation < 3,
    acceptableArgument: student.argumentation >= 3.2,
    lowCohesion: student.cohesion_index <= 2 || student.cohesion < 3,
    moderateCohesion: student.cohesion_index >= 3 && student.cohesion >= 3 && student.cohesion < 4.1,
    strongCohesion: student.cohesion_index >= 4 && student.cohesion >= 4,
    lowGrammar: student.grammar_accuracy < 3 || student.error_density >= 4,
    persistentGrammarProblems:
      (student.grammar_accuracy < 3.2 || student.error_density >= 3.5) &&
      student.feedback_views >= 1 &&
      student.revision_frequency >= 2,
    lowLexical: student.lexical_resource < 3 || student.ttr < 0.45,
    moderateLexical:
      student.lexical_resource >= 3 &&
      student.lexical_resource < 3.9 &&
      student.ttr >= 0.45 &&
      student.ttr < 0.55,
    noRevision: student.revision_frequency === 0,
    limitedRevision: student.revision_frequency <= 1,
    moderateRevision: student.revision_frequency >= 1 && student.revision_frequency <= 2,
    strongRevision: student.revision_frequency >= 3,
    helpNone: student.help_seeking_messages === 0,
    helpPresent: student.help_seeking_messages >= 1,
    feedbackViewedNotUsed: student.feedback_views >= 1 && student.revision_frequency === 0,
    feedbackResponsive:
      student.feedback_views >= 2 && student.revision_frequency >= 2 && Number(student.score_gain ?? 0) >= 2,
    strongWriting: totalQuality >= 4 && student.total_score >= 21.5,
    acceptableWriting: totalQuality >= 3.2 && student.total_score >= 18,
    weakWriting: totalQuality < 3.2 || student.total_score < 17,
    improvementVisible: Number(student.score_gain ?? 0) >= 2,
    repeatedDifficulty:
      student.total_score < 17 ||
      (student.argumentation < 3.1 && student.cohesion < 3.1) ||
      student.error_density >= 4,
  };
}

function selectScenario(student, options = {}) {
  const s = buildSignals(student, options);

  if (
    s.lowPlanning &&
    student.time_on_task < 30 &&
    s.lowWordCount &&
    s.noRevision &&
    s.helpNone &&
    s.veryWeakArgument &&
    s.lowCohesion
  ) {
    return {
      learnerProfile: 'Disengaged / low-participation learner',
      clusterLabel: 0,
      randomForestOutput: 'Low improvement predicted; high risk of weak performance',
      predictedImprovement: 'Low',
      bayesianOutput: 'Forethought = Low; Argument competence = Low; SRL revision = Low',
      ruleIds: ['A1', 'A2', 'C1', 'D1', 'D5'],
      templates: [
        'planning_scaffold',
        'elaboration_prompt',
        'revision_prompt',
        'motivational_reengagement',
        'metacognitive_prompt',
      ],
      finalFeedbackFocus:
        'Re-engage the learner, build planning habits, increase task understanding, and require minimum paragraph development before deeper writing feedback.',
    };
  }

  if (s.repeatedDifficulty && s.helpNone && (s.noRevision || s.lowEngagement)) {
    return {
      learnerProfile: 'At-risk passive learner',
      clusterLabel: 0,
      randomForestOutput: 'Low improvement predicted; risk of stagnation high',
      predictedImprovement: 'Low',
      bayesianOutput: 'SRL revision = Low; Help-seeking regulation = None',
      ruleIds: ['D5', 'C1', 'C2'],
      templates: ['metacognitive_prompt', 'revision_prompt', 'feedback_decoding'],
      finalFeedbackFocus:
        'Encourage recognition of difficulty, explicit help-seeking, and supported revision before performance declines further.',
    };
  }

  if (s.persistentGrammarProblems && s.highEngagement && s.strongRevision) {
    return {
      learnerProfile: 'Persistent language-support learner',
      clusterLabel: 3,
      randomForestOutput: 'Moderate improvement predicted, but form-level issues remain limiting',
      predictedImprovement: 'Moderate',
      bayesianOutput: 'Linguistic control = Low-Medium; Feedback uptake = Medium',
      ruleIds: ['B6', 'B7', 'C5'],
      templates: ['direct_corrective_feedback', 'metalinguistic_feedback', 'feedforward_guidance'],
      finalFeedbackFocus:
        'Target recurrent error patterns systematically and combine correction with explanation and guided reuse.',
    };
  }

  if (s.lowGrammar && s.moderateRevision && s.lowLexical) {
    return {
      learnerProfile: 'Language-limited developing writer',
      clusterLabel: 2,
      randomForestOutput: 'Low to moderate improvement predicted unless language support is targeted',
      predictedImprovement: 'Low-Moderate',
      bayesianOutput: 'Linguistic control = Low; Lexical competence = Low-Medium',
      ruleIds: ['B6', 'B7', 'B9'],
      templates: ['direct_corrective_feedback', 'metalinguistic_feedback', 'lexical_enrichment'],
      finalFeedbackFocus:
        'Reduce repeated grammatical errors, improve rule awareness, and expand academic vocabulary.',
    };
  }

  if (s.lowLexical && s.vocabularyHelpCount > 0) {
    return {
      learnerProfile: 'Lexically developing writer with adaptive monitoring',
      clusterLabel: 2,
      randomForestOutput: 'Moderate improvement predicted if lexical support is provided',
      predictedImprovement: 'Moderate',
      bayesianOutput: 'Lexical competence = Low-Medium; Help-seeking regulation = Adaptive',
      ruleIds: ['B9', 'B10', 'D4'],
      templates: ['lexical_enrichment', 'lexical_refinement', 'dialogic_scaffolding'],
      finalFeedbackFocus:
        'Improve formal register, precision, and vocabulary choice through guided lexical support.',
    };
  }

  if (s.feedbackResponsive && s.improvementVisible && s.weakArgument) {
    return {
      learnerProfile: 'Feedback-responsive developing writer',
      clusterLabel: 3,
      randomForestOutput: 'Moderate to high improvement predicted if higher-order support continues',
      predictedImprovement: 'Moderate-High',
      bayesianOutput: 'Feedback uptake = Medium-High; Argument competence = Medium',
      ruleIds: ['C4', 'C5', 'B2'],
      templates: ['feedback_decoding', 'feedforward_guidance', 'argument_expansion'],
      finalFeedbackFocus:
        'Consolidate feedback use and push the learner from partial revision to deeper reasoning and stronger support.',
    };
  }

  if (s.highEngagement && s.strongPlanning && s.adequateWordCount && !s.lowGrammar && s.weakArgument) {
    return {
      learnerProfile: 'Well-engaged but conceptually weak writer',
      clusterLabel: 3,
      randomForestOutput: 'Moderate improvement predicted; argumentation is the key limiting factor',
      predictedImprovement: 'Moderate',
      bayesianOutput: 'Argument competence = Low-Medium; SRL = High',
      ruleIds: ['B1', 'B2'],
      templates: ['argument_scaffold', 'argument_expansion'],
      finalFeedbackFocus:
        'Focus narrowly on reasoning quality, support, and argumentative depth rather than on engagement or language accuracy.',
    };
  }

  if (s.highEngagement && s.strongRevision && s.strongWriting && s.strongCohesion && s.states.feedback === 'High') {
    return {
      learnerProfile: 'Strategic writer',
      clusterLabel: 3,
      randomForestOutput: 'High improvement predicted; strongest predictors = revision quality and discourse control',
      predictedImprovement: 'High',
      bayesianOutput: 'Argument competence = High; Cohesion competence = High; SRL revision = High',
      ruleIds: ['B3', 'C3', 'C6'],
      templates: ['metacognitive_extension', 'metacognitive_feedback', 'reinforcement_feedback'],
      finalFeedbackFocus:
        'Extend the learner beyond the current baseline through self-reflection, counter-argumentation, and stylistic refinement.',
    };
  }

  if (s.lowEngagement && s.acceptableWriting && s.limitedRevision && s.helpNone) {
    return {
      learnerProfile: 'Efficient but fragile regulator',
      clusterLabel: 1,
      randomForestOutput: 'Moderate performance predicted, but future growth looks unstable',
      predictedImprovement: 'Moderate',
      bayesianOutput: 'Argument competence = Medium; SRL revision = Low-Medium',
      ruleIds: ['D3', 'C1'],
      templates: ['metacognitive_prompt', 'revision_prompt'],
      finalFeedbackFocus:
        'Stabilize the writing process and encourage more consistent self-regulation rather than remediating product quality alone.',
    };
  }

  if (s.highEngagement && s.lowCohesion && s.acceptableArgument && s.moderateRevision) {
    return {
      learnerProfile: 'Developing discourse writer',
      clusterLabel: 3,
      randomForestOutput: 'Moderate improvement predicted; discourse variables appear highly important',
      predictedImprovement: 'Moderate',
      bayesianOutput: 'Cohesion competence = Low-Medium; Argument competence = Medium',
      ruleIds: ['B4', 'B5', 'C2'],
      templates: ['cohesion_support', 'organization_support', 'global_revision_feedback'],
      finalFeedbackFocus:
        'Improve transitions, sequencing, and paragraph unity while keeping the main focus on discourse control rather than grammar.',
    };
  }

  if (student.assignment_views >= 10 && s.weakWriting && s.feedbackViewedNotUsed && s.weakArgument) {
    return {
      learnerProfile: 'Effortful but struggling writer',
      clusterLabel: 2,
      randomForestOutput:
        'Low to moderate improvement predicted; strongest predictors = revision, cohesion, and argument quality',
      predictedImprovement: 'Low-Moderate',
      bayesianOutput: 'Argument competence = Low; Feedback uptake = Low; SRL revision = Low',
      ruleIds: ['B1', 'C1', 'C2', 'D2'],
      templates: ['argument_scaffold', 'revision_prompt', 'feedback_decoding', 'explicit_strategic_instruction'],
      finalFeedbackFocus:
        'Support claim-evidence-explanation structure, teach how to use feedback, and move the learner from effort to strategy.',
    };
  }

  if (s.highEngagement && s.strongRevision && s.helpPresent && s.adequateWordCount && !s.strongWriting) {
    return {
      learnerProfile: 'Engaged but developing writer',
      clusterLabel: 3,
      randomForestOutput: 'Moderate improvement predicted; likely gain if cohesion and reasoning improve',
      predictedImprovement: 'Moderate',
      bayesianOutput: 'Argument competence = Medium; Cohesion competence = Medium; SRL revision = Medium-High',
      ruleIds: ['B2', 'C2', 'D4', 'D2'],
      templates: [
        'argument_expansion',
        'global_revision_feedback',
        'dialogic_scaffolding',
        'explicit_strategic_instruction',
      ],
      finalFeedbackFocus:
        'Deepen explanation, improve paragraph flow, refine academic wording, and encourage meaning-level revision.',
    };
  }

  return {
    learnerProfile: 'Engaged but developing writer',
    clusterLabel: 3,
    randomForestOutput: 'Moderate improvement predicted; likely gain if cohesion and reasoning improve',
    predictedImprovement: 'Moderate',
    bayesianOutput: `Forethought = ${s.states.forethought}; Argument competence = ${s.states.argument}; Cohesion competence = ${s.states.cohesion}`,
    ruleIds: ['B2', 'C2'],
    templates: ['argument_expansion', 'global_revision_feedback'],
    finalFeedbackFocus:
      'Support the next revision at the level of reasoning, organization, and explanation rather than surface correction alone.',
  };
}

function estimatePredictedScore(student, scenario) {
  const gainMultiplier =
    scenario.predictedImprovement === 'High'
      ? 1.2
      : scenario.predictedImprovement === 'Moderate-High'
        ? 1.05
        : scenario.predictedImprovement === 'Moderate'
          ? 0.9
          : scenario.predictedImprovement === 'Low-Moderate'
            ? 0.75
            : 0.6;
  const projected = Number(student.total_score ?? 0) + Number(student.score_gain ?? 0) * gainMultiplier;
  return round(projected, 1);
}

function buildTeacherValidationPrompt(scenario) {
  return `Teacher validation required: confirm that the main focus should be "${scenario.finalFeedbackFocus}" before releasing the student-facing message.`;
}

function getClusterLabelDescription(label) {
  return CLUSTER_LABELS[label] ?? CLUSTER_LABELS[3];
}

function evaluateAdaptiveDecision(student, options = {}) {
  const scenario = selectScenario(student, options);
  const states = buildBayesianStates(student, options);
  const ruleIds = unique(scenario.ruleIds);
  const templates = unique(scenario.templates);
  const interpretations = ruleIds.map((ruleId) => RULE_DEFINITIONS[ruleId]?.interpretation).filter(Boolean);
  const interventions = ruleIds.map((ruleId) => RULE_DEFINITIONS[ruleId]?.onsite_intervention).filter(Boolean);
  const feedbackParts = templates.map((templateId) => FEEDBACK_TEMPLATES[templateId]).filter(Boolean);

  return {
    learner_profile: scenario.learnerProfile,
    cluster_profile: getClusterLabelDescription(scenario.clusterLabel),
    clustering_output: scenario.learnerProfile,
    cluster_label: scenario.clusterLabel,
    predicted_improvement: scenario.predictedImprovement,
    random_forest_output: scenario.randomForestOutput,
    bayesian_output: scenario.bayesianOutput,
    ai_forethought_state: states.forethought,
    ai_argument_state: states.argument,
    ai_cohesion_state: states.cohesion,
    ai_revision_state: states.revision,
    ai_feedback_state: states.feedback,
    ai_linguistic_state: states.linguistic,
    ai_lexical_state: states.lexical,
    ai_help_state: states.help,
    triggered_rule_ids: toDelimited(ruleIds),
    interpretations: toDelimited(interpretations),
    feedback_types: toDelimited(templates),
    feedback_templates_selected: toDelimited(templates),
    onsite_interventions: toDelimited(interventions),
    final_feedback_focus: scenario.finalFeedbackFocus,
    teacher_validation_prompt: buildTeacherValidationPrompt(scenario),
    personalized_feedback:
      feedbackParts.length > 0
        ? feedbackParts.join(' ')
        : 'No specific writing needs detected. Continue following the task guidelines.',
    predicted_score: estimatePredictedScore(student, scenario),
  };
}

module.exports = {
  FEEDBACK_TEMPLATES,
  RULE_DEFINITIONS,
  CLUSTER_LABELS,
  evaluateAdaptiveDecision,
  buildBayesianStates,
  getClusterLabelDescription,
};
