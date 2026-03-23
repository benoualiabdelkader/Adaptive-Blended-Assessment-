from typing import Dict, List


FEEDBACK_TEMPLATES = {
    "planning_scaffold": (
        "Before rewriting, read the rubric carefully and make a short outline. Write your main "
        "claim, one supporting point, and one explanation before you begin drafting."
    ),
    "planning_prompt": (
        "Your paragraph would improve with clearer planning. Before writing, note your topic "
        "sentence, one example, and the explanation you want to add."
    ),
    "elaboration_prompt": (
        "Your paragraph is underdeveloped for this task. Add one supporting idea and one "
        "explanatory sentence to make the argument clearer."
    ),
    "motivational_reengagement": (
        "Revisit the assignment instructions, rubric, and model examples before writing again. "
        "Focus on one clear step at a time so you can complete the task with confidence."
    ),
    "explicit_strategic_instruction": (
        "You are making a clear effort, but your paragraph needs stronger structure and support. "
        "Focus on organizing your ideas and explaining how your evidence supports your argument."
    ),
    "metacognitive_prompt": (
        "Before revising, ask yourself: What is the main weakness in my paragraph? What one change "
        "would improve it the most? Revise with that goal in mind."
    ),
    "argument_scaffold": (
        "Your paragraph needs stronger argument development. Add one clear example and explain "
        "directly how it supports your main claim."
    ),
    "argument_expansion": (
        "Your main idea is relevant, but it needs deeper explanation. After giving your example, "
        "explain why it proves your point."
    ),
    "metacognitive_extension": (
        "Your argument is already strong. To make it more advanced, add a counter-argument or "
        "deepen your explanation of the issue."
    ),
    "cohesion_support": (
        "Your ideas are relevant, but the paragraph needs better flow. Use linking words such as "
        "however, therefore, furthermore, or in addition to connect your ideas more clearly."
    ),
    "organization_support": (
        "Your paragraph is generally organized, but the order of ideas can be clearer. Make sure "
        "each sentence supports the main point and follows a logical sequence."
    ),
    "direct_corrective_feedback": (
        "Your writing contains repeated grammar problems that reduce clarity. Revise the "
        "highlighted errors and correct the same pattern throughout the paragraph."
    ),
    "metalinguistic_feedback": (
        "Check the grammar pattern in the highlighted sentence. Think about the rule, then try "
        "correcting the sentence yourself before resubmitting."
    ),
    "fluency_extension": (
        "Your language is accurate. Now focus on making your paragraph more fluent and academic by "
        "varying sentence structure and using more precise wording."
    ),
    "lexical_enrichment": (
        "Your vocabulary is understandable, but it is too basic or repetitive for academic writing. "
        "Replace common words with more formal and precise academic alternatives."
    ),
    "lexical_refinement": (
        "Your vocabulary is developing well, but some expressions can be more precise. Revise a "
        "few key words so your paragraph sounds more academic."
    ),
    "revision_prompt": (
        "Revise your paragraph by improving one idea, one example, and one sentence pattern. Do not "
        "focus only on grammar; improve the meaning and support as well."
    ),
    "global_revision_feedback": (
        "You revised your paragraph, but you still need to improve explanation, organization, and "
        "support. Go beyond sentence correction and strengthen the whole paragraph."
    ),
    "metacognitive_feedback": (
        "Your revision shows real improvement. Reflect on what strategy helped you most so you can "
        "use it again in your next paragraph."
    ),
    "feedback_decoding": (
        "You viewed the feedback, but your draft does not yet show enough change. Re-read the "
        "comments and apply at least one improvement to your ideas and one to your language."
    ),
    "feedforward_guidance": (
        "You improved some parts of the paragraph. Now use the feedback to deepen your explanation "
        "and improve the structure of your ideas."
    ),
    "reinforcement_feedback": (
        "You used the feedback effectively. Continue refining your paragraph by strengthening your "
        "argument and making your writing more precise."
    ),
    "dialogic_scaffolding": (
        "Your question shows good engagement with the writing task. We will clarify the problem "
        "together and improve that part of the paragraph step by step."
    ),
    "intensive_support_plan": (
        "You need more structured support to improve this paragraph. Focus first on your weakest "
        "area, then revise step by step with guidance."
    ),
    "targeted_development_feedback": (
        "You are showing potential for improvement. Focus now on the one area that most limits "
        "your paragraph so your next revision becomes stronger."
    ),
    "argument_refinement": (
        "Your argument is developing, but it still needs clearer support and fuller explanation. "
        "Strengthen the link between your evidence and your claim."
    ),
    "metacognitive_training": (
        "Try to manage your writing process more actively: plan before writing, check your progress "
        "while drafting, and evaluate your paragraph after revising."
    ),
}


RULE_DEFINITIONS = {
    "A1": {
        "interpretation": "Low rubric consultation and weak task planning reduce forethought quality.",
        "onsite_intervention": "rubric_walkthrough_and_outline_support",
    },
    "A2": {
        "interpretation": "Short time-on-task and limited development indicate insufficient idea generation.",
        "onsite_intervention": "guided_planning_and_idea_expansion",
    },
    "B1": {
        "interpretation": "Argument quality remains weak and needs clearer claim-evidence-explanation support.",
        "onsite_intervention": "claim_evidence_explanation_modelling",
    },
    "B2": {
        "interpretation": "Reasoning is present but still needs deeper explanation and fuller support.",
        "onsite_intervention": "guided_argument_development",
    },
    "B3": {
        "interpretation": "Strong writers benefit from reflective extension rather than remediation.",
        "onsite_intervention": "counter_argument_and_style_extension",
    },
    "B4": {
        "interpretation": "Low cohesion weakens paragraph flow and idea linkage.",
        "onsite_intervention": "transition_and_linking_support",
    },
    "B5": {
        "interpretation": "Organization needs clearer sequencing and paragraph unity.",
        "onsite_intervention": "paragraph_restructuring_with_model",
    },
    "B6": {
        "interpretation": "Recurring grammatical problems are limiting performance.",
        "onsite_intervention": "targeted_error_correction_cycle",
    },
    "B7": {
        "interpretation": "Language errors should be paired with rule explanation, not correction alone.",
        "onsite_intervention": "mini_lesson_on_recurrent_language_patterns",
    },
    "B9": {
        "interpretation": "Vocabulary range and precision need explicit support.",
        "onsite_intervention": "academic_vocabulary_expansion",
    },
    "B10": {
        "interpretation": "Vocabulary choice and register need refinement for academic writing.",
        "onsite_intervention": "formal_register_refinement",
    },
    "C1": {
        "interpretation": "Revision activity is too limited to support improvement.",
        "onsite_intervention": "guided_revision_checklist",
    },
    "C2": {
        "interpretation": "Feedback must be translated into explicit revision actions.",
        "onsite_intervention": "feedback_interpretation_session",
    },
    "C3": {
        "interpretation": "Advanced writers should reflect on strategy and transfer their strengths.",
        "onsite_intervention": "self_explanation_and_transfer_prompt",
    },
    "C4": {
        "interpretation": "The learner responds to feedback, but still needs help reading comments at a deeper level.",
        "onsite_intervention": "feedback_to_revision_mapping",
    },
    "C5": {
        "interpretation": "Feedforward guidance can turn current gains into future drafting habits.",
        "onsite_intervention": "next_draft_transfer_prompt",
    },
    "C6": {
        "interpretation": "Positive reinforcement can extend a strong writer without diluting challenge.",
        "onsite_intervention": "strength_based_extension",
    },
    "D1": {
        "interpretation": "Re-engagement support is needed before detailed product-level feedback will be effective.",
        "onsite_intervention": "motivational_checkin_and_task_restart",
    },
    "D2": {
        "interpretation": "The learner is active but needs clearer strategic direction.",
        "onsite_intervention": "explicit_strategy_conference",
    },
    "D3": {
        "interpretation": "Current performance is acceptable, but self-regulation is fragile and inconsistent.",
        "onsite_intervention": "process_stability_prompt",
    },
    "D4": {
        "interpretation": "Adaptive help-seeking can be leveraged as part of the revision process.",
        "onsite_intervention": "short_clarification_conference",
    },
    "D5": {
        "interpretation": "Lack of help-seeking during difficulty increases the risk of stagnation.",
        "onsite_intervention": "help_seeking_activation_prompt",
    },
}


def _value(row, key: str, default=0.0):
    value = row.get(key, default)
    try:
        if value != value:
            return default
    except Exception:
        return default
    return value


def _average(values: List[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def _unique(values: List[str]) -> List[str]:
    seen = set()
    ordered = []
    for value in values:
        if value and value not in seen:
            seen.add(value)
            ordered.append(value)
    return ordered


def _delimited(values: List[str]) -> str:
    return "; ".join(_unique(values))


def build_bayesian_states(row, vocabulary_help_count: int = 0) -> Dict[str, str]:
    rubric_views = float(_value(row, "rubric_views"))
    time_on_task = float(_value(row, "time_on_task"))
    word_count = float(_value(row, "word_count"))
    argumentation = float(_value(row, "argumentation"))
    cohesion_index = float(_value(row, "cohesion_index"))
    cohesion = float(_value(row, "cohesion"))
    revision_frequency = float(_value(row, "revision_frequency"))
    feedback_views = float(_value(row, "feedback_views"))
    grammar_accuracy = float(_value(row, "grammar_accuracy"))
    error_density = float(_value(row, "error_density"))
    lexical_resource = float(_value(row, "lexical_resource"))
    ttr = float(_value(row, "ttr"))
    help_messages = float(_value(row, "help_seeking_messages"))

    forethought = (
        "Low"
        if rubric_views == 0 and time_on_task < 30 and word_count < 120
        else "Medium"
        if rubric_views <= 1 or time_on_task < 60 or word_count < 150
        else "High"
    )
    argument = "Low" if argumentation < 3 else "Medium" if argumentation < 3.8 else "High"
    cohesion_state = (
        "Low"
        if cohesion_index <= 2 or cohesion < 3
        else "Medium"
        if cohesion_index <= 4 or cohesion < 4
        else "High"
    )
    revision = "Low" if revision_frequency == 0 else "Medium" if revision_frequency <= 2 else "High"
    feedback = (
        "High"
        if feedback_views >= 2 and revision_frequency >= 2
        else "Medium"
        if feedback_views >= 1 and revision_frequency >= 1
        else "Low"
    )
    linguistic = (
        "Low"
        if grammar_accuracy < 3 or error_density >= 4
        else "Medium"
        if grammar_accuracy < 3.8 or error_density >= 2.8
        else "High"
    )
    lexical = (
        "Low"
        if lexical_resource < 3 or ttr < 0.45
        else "Medium"
        if lexical_resource < 3.9 or ttr < 0.54
        else "High"
    )
    help_state = "Adaptive" if help_messages >= 1 and vocabulary_help_count > 0 else "Present" if help_messages >= 1 else "None"

    return {
        "forethought": forethought,
        "argument": argument,
        "cohesion": cohesion_state,
        "revision": revision,
        "feedback": feedback,
        "linguistic": linguistic,
        "lexical": lexical,
        "help": help_state,
    }


def build_signals(row, vocabulary_help_count: int = 0) -> Dict[str, object]:
    total_quality = _average(
        [
            float(_value(row, "argumentation")),
            float(_value(row, "cohesion")),
            float(_value(row, "grammar_accuracy")),
            float(_value(row, "lexical_resource")),
        ]
    )
    states = build_bayesian_states(row, vocabulary_help_count)

    assignment_views = float(_value(row, "assignment_views"))
    resource_access_count = float(_value(row, "resource_access_count"))
    time_on_task = float(_value(row, "time_on_task"))
    rubric_views = float(_value(row, "rubric_views"))
    first_access_delay = float(_value(row, "first_access_delay_minutes"))
    word_count = float(_value(row, "word_count"))
    argumentation = float(_value(row, "argumentation"))
    cohesion_index = float(_value(row, "cohesion_index"))
    cohesion = float(_value(row, "cohesion"))
    grammar_accuracy = float(_value(row, "grammar_accuracy"))
    error_density = float(_value(row, "error_density"))
    lexical_resource = float(_value(row, "lexical_resource"))
    ttr = float(_value(row, "ttr"))
    revision_frequency = float(_value(row, "revision_frequency"))
    help_messages = float(_value(row, "help_seeking_messages"))
    feedback_views = float(_value(row, "feedback_views"))
    total_score = float(_value(row, "total_score"))
    score_gain = float(_value(row, "score_gain"))

    return {
        "states": states,
        "vocabulary_help_count": vocabulary_help_count,
        "total_quality": total_quality,
        "low_engagement": time_on_task < 40 and resource_access_count < 3 and feedback_views == 0,
        "high_engagement": time_on_task >= 90 and resource_access_count >= 5 and assignment_views >= 10,
        "strong_planning": rubric_views >= 3 and first_access_delay <= 30,
        "low_planning": rubric_views == 0 and first_access_delay > 30,
        "low_word_count": word_count < 120,
        "adequate_word_count": word_count >= 150,
        "weak_argument": argumentation < 3.6,
        "very_weak_argument": argumentation < 3,
        "acceptable_argument": argumentation >= 3.2,
        "low_cohesion": cohesion_index <= 2 or cohesion < 3,
        "strong_cohesion": cohesion_index >= 4 and cohesion >= 4,
        "low_grammar": grammar_accuracy < 3 or error_density >= 4,
        "persistent_grammar_problems": (grammar_accuracy < 3.2 or error_density >= 3.5)
        and feedback_views >= 1
        and revision_frequency >= 2,
        "low_lexical": lexical_resource < 3 or ttr < 0.45,
        "moderate_revision": 1 <= revision_frequency <= 2,
        "no_revision": revision_frequency == 0,
        "limited_revision": revision_frequency <= 1,
        "strong_revision": revision_frequency >= 3,
        "help_none": help_messages == 0,
        "help_present": help_messages >= 1,
        "feedback_viewed_not_used": feedback_views >= 1 and revision_frequency == 0,
        "feedback_responsive": feedback_views >= 2 and revision_frequency >= 2 and score_gain >= 2,
        "strong_writing": total_quality >= 4 and total_score >= 21.5,
        "acceptable_writing": total_quality >= 3.2 and total_score >= 18,
        "weak_writing": total_quality < 3.2 or total_score < 17,
        "improvement_visible": score_gain >= 2,
        "repeated_difficulty": total_score < 17 or (argumentation < 3.1 and cohesion < 3.1) or error_density >= 4,
    }


def select_scenario(row, vocabulary_help_count: int = 0) -> Dict[str, object]:
    s = build_signals(row, vocabulary_help_count)

    if (
        s["low_planning"]
        and float(_value(row, "time_on_task")) < 30
        and s["low_word_count"]
        and s["no_revision"]
        and s["help_none"]
        and s["very_weak_argument"]
        and s["low_cohesion"]
    ):
        return {
            "learner_profile": "Disengaged / low-participation learner",
            "cluster_label": 0,
            "cluster_profile": "Disengaged / low-participation learner",
            "random_forest_output": "Low improvement predicted; high risk of weak performance",
            "predicted_improvement": "Low",
            "bayesian_output": "Forethought = Low; Argument competence = Low; SRL revision = Low",
            "rule_ids": ["A1", "A2", "C1", "D1", "D5"],
            "templates": [
                "planning_scaffold",
                "elaboration_prompt",
                "revision_prompt",
                "motivational_reengagement",
                "metacognitive_prompt",
            ],
            "final_feedback_focus": (
                "Re-engage the learner, build planning habits, increase task understanding, and "
                "require minimum paragraph development before deeper writing feedback."
            ),
        }

    if s["repeated_difficulty"] and s["help_none"] and (s["no_revision"] or s["low_engagement"]):
        return {
            "learner_profile": "At-risk passive learner",
            "cluster_label": 0,
            "cluster_profile": "Disengaged / low-participation learner",
            "random_forest_output": "Low improvement predicted; risk of stagnation high",
            "predicted_improvement": "Low",
            "bayesian_output": "SRL revision = Low; Help-seeking regulation = None",
            "rule_ids": ["D5", "C1", "C2"],
            "templates": ["metacognitive_prompt", "revision_prompt", "feedback_decoding"],
            "final_feedback_focus": (
                "Encourage recognition of difficulty, explicit help-seeking, and supported revision "
                "before performance declines further."
            ),
        }

    if s["persistent_grammar_problems"] and s["high_engagement"] and s["strong_revision"]:
        return {
            "learner_profile": "Persistent language-support learner",
            "cluster_label": 3,
            "cluster_profile": "Engaged or strategic writer",
            "random_forest_output": "Moderate improvement predicted, but form-level issues remain limiting",
            "predicted_improvement": "Moderate",
            "bayesian_output": "Linguistic control = Low-Medium; Feedback uptake = Medium",
            "rule_ids": ["B6", "B7", "C5"],
            "templates": ["direct_corrective_feedback", "metalinguistic_feedback", "feedforward_guidance"],
            "final_feedback_focus": (
                "Target recurrent error patterns systematically and combine correction with "
                "explanation and guided reuse."
            ),
        }

    if s["low_grammar"] and s["moderate_revision"] and s["low_lexical"]:
        return {
            "learner_profile": "Language-limited developing writer",
            "cluster_label": 2,
            "cluster_profile": "Effortful but struggling writer",
            "random_forest_output": "Low to moderate improvement predicted unless language support is targeted",
            "predicted_improvement": "Low-Moderate",
            "bayesian_output": "Linguistic control = Low; Lexical competence = Low-Medium",
            "rule_ids": ["B6", "B7", "B9"],
            "templates": ["direct_corrective_feedback", "metalinguistic_feedback", "lexical_enrichment"],
            "final_feedback_focus": (
                "Reduce repeated grammatical errors, improve rule awareness, and expand academic vocabulary."
            ),
        }

    if s["low_lexical"] and s["vocabulary_help_count"] > 0:
        return {
            "learner_profile": "Lexically developing writer with adaptive monitoring",
            "cluster_label": 2,
            "cluster_profile": "Effortful but struggling writer",
            "random_forest_output": "Moderate improvement predicted if lexical support is provided",
            "predicted_improvement": "Moderate",
            "bayesian_output": "Lexical competence = Low-Medium; Help-seeking regulation = Adaptive",
            "rule_ids": ["B9", "B10", "D4"],
            "templates": ["lexical_enrichment", "lexical_refinement", "dialogic_scaffolding"],
            "final_feedback_focus": (
                "Improve formal register, precision, and vocabulary choice through guided lexical support."
            ),
        }

    if s["feedback_responsive"] and s["improvement_visible"] and s["weak_argument"]:
        return {
            "learner_profile": "Feedback-responsive developing writer",
            "cluster_label": 3,
            "cluster_profile": "Engaged or strategic writer",
            "random_forest_output": "Moderate to high improvement predicted if higher-order support continues",
            "predicted_improvement": "Moderate-High",
            "bayesian_output": "Feedback uptake = Medium-High; Argument competence = Medium",
            "rule_ids": ["C4", "C5", "B2"],
            "templates": ["feedback_decoding", "feedforward_guidance", "argument_expansion"],
            "final_feedback_focus": (
                "Consolidate feedback use and push the learner from partial revision to deeper "
                "reasoning and stronger support."
            ),
        }

    if s["high_engagement"] and s["strong_planning"] and s["adequate_word_count"] and not s["low_grammar"] and s["weak_argument"]:
        return {
            "learner_profile": "Well-engaged but conceptually weak writer",
            "cluster_label": 3,
            "cluster_profile": "Engaged or strategic writer",
            "random_forest_output": "Moderate improvement predicted; argumentation is the key limiting factor",
            "predicted_improvement": "Moderate",
            "bayesian_output": "Argument competence = Low-Medium; SRL = High",
            "rule_ids": ["B1", "B2"],
            "templates": ["argument_scaffold", "argument_expansion"],
            "final_feedback_focus": (
                "Focus narrowly on reasoning quality, support, and argumentative depth rather than "
                "on engagement or language accuracy."
            ),
        }

    if s["high_engagement"] and s["strong_revision"] and s["strong_writing"] and s["strong_cohesion"] and s["states"]["feedback"] == "High":
        return {
            "learner_profile": "Strategic writer",
            "cluster_label": 3,
            "cluster_profile": "Engaged or strategic writer",
            "random_forest_output": "High improvement predicted; strongest predictors = revision quality and discourse control",
            "predicted_improvement": "High",
            "bayesian_output": "Argument competence = High; Cohesion competence = High; SRL revision = High",
            "rule_ids": ["B3", "C3", "C6"],
            "templates": ["metacognitive_extension", "metacognitive_feedback", "reinforcement_feedback"],
            "final_feedback_focus": (
                "Extend the learner beyond the current baseline through self-reflection, "
                "counter-argumentation, and stylistic refinement."
            ),
        }

    if s["low_engagement"] and s["acceptable_writing"] and s["limited_revision"] and s["help_none"]:
        return {
            "learner_profile": "Efficient but fragile regulator",
            "cluster_label": 1,
            "cluster_profile": "Efficient but fragile regulator",
            "random_forest_output": "Moderate performance predicted, but future growth looks unstable",
            "predicted_improvement": "Moderate",
            "bayesian_output": "Argument competence = Medium; SRL revision = Low-Medium",
            "rule_ids": ["D3", "C1"],
            "templates": ["metacognitive_prompt", "revision_prompt"],
            "final_feedback_focus": (
                "Stabilize the writing process and encourage more consistent self-regulation rather "
                "than remediating product quality alone."
            ),
        }

    if s["high_engagement"] and s["low_cohesion"] and s["acceptable_argument"] and s["moderate_revision"]:
        return {
            "learner_profile": "Developing discourse writer",
            "cluster_label": 3,
            "cluster_profile": "Engaged or strategic writer",
            "random_forest_output": "Moderate improvement predicted; discourse variables appear highly important",
            "predicted_improvement": "Moderate",
            "bayesian_output": "Cohesion competence = Low-Medium; Argument competence = Medium",
            "rule_ids": ["B4", "B5", "C2"],
            "templates": ["cohesion_support", "organization_support", "global_revision_feedback"],
            "final_feedback_focus": (
                "Improve transitions, sequencing, and paragraph unity while keeping the main focus "
                "on discourse control rather than grammar."
            ),
        }

    if float(_value(row, "assignment_views")) >= 10 and s["weak_writing"] and s["feedback_viewed_not_used"] and s["weak_argument"]:
        return {
            "learner_profile": "Effortful but struggling writer",
            "cluster_label": 2,
            "cluster_profile": "Effortful but struggling writer",
            "random_forest_output": (
                "Low to moderate improvement predicted; strongest predictors = revision, cohesion, "
                "and argument quality"
            ),
            "predicted_improvement": "Low-Moderate",
            "bayesian_output": "Argument competence = Low; Feedback uptake = Low; SRL revision = Low",
            "rule_ids": ["B1", "C1", "C2", "D2"],
            "templates": ["argument_scaffold", "revision_prompt", "feedback_decoding", "explicit_strategic_instruction"],
            "final_feedback_focus": (
                "Support claim-evidence-explanation structure, teach how to use feedback, and move "
                "the learner from effort to strategy."
            ),
        }

    if s["high_engagement"] and s["strong_revision"] and s["help_present"] and s["adequate_word_count"] and not s["strong_writing"]:
        return {
            "learner_profile": "Engaged but developing writer",
            "cluster_label": 3,
            "cluster_profile": "Engaged or strategic writer",
            "random_forest_output": "Moderate improvement predicted; likely gain if cohesion and reasoning improve",
            "predicted_improvement": "Moderate",
            "bayesian_output": "Argument competence = Medium; Cohesion competence = Medium; SRL revision = Medium-High",
            "rule_ids": ["B2", "C2", "D4", "D2"],
            "templates": [
                "argument_expansion",
                "global_revision_feedback",
                "dialogic_scaffolding",
                "explicit_strategic_instruction",
            ],
            "final_feedback_focus": (
                "Deepen explanation, improve paragraph flow, refine academic wording, and encourage "
                "meaning-level revision."
            ),
        }

    return {
        "learner_profile": "Engaged but developing writer",
        "cluster_label": 3,
        "cluster_profile": "Engaged or strategic writer",
        "random_forest_output": "Moderate improvement predicted; likely gain if cohesion and reasoning improve",
        "predicted_improvement": "Moderate",
        "bayesian_output": (
            f"Forethought = {s['states']['forethought']}; Argument competence = {s['states']['argument']}; "
            f"Cohesion competence = {s['states']['cohesion']}"
        ),
        "rule_ids": ["B2", "C2"],
        "templates": ["argument_expansion", "global_revision_feedback"],
        "final_feedback_focus": (
            "Support the next revision at the level of reasoning, organization, and explanation "
            "rather than surface correction alone."
        ),
    }


def _estimate_predicted_score(row, predicted_improvement: str) -> float:
    gain_multiplier = (
        1.2
        if predicted_improvement == "High"
        else 1.05
        if predicted_improvement == "Moderate-High"
        else 0.9
        if predicted_improvement == "Moderate"
        else 0.75
        if predicted_improvement == "Low-Moderate"
        else 0.6
    )
    total_score = float(_value(row, "total_score"))
    score_gain = float(_value(row, "score_gain"))
    return round(total_score + score_gain * gain_multiplier, 1)


def compute_adaptive_decision(row, vocabulary_help_count: int = 0) -> Dict[str, object]:
    states = build_bayesian_states(row, vocabulary_help_count)
    scenario = select_scenario(row, vocabulary_help_count)
    rule_ids = _unique(list(scenario["rule_ids"]))
    templates = _unique(list(scenario["templates"]))
    interpretations = [RULE_DEFINITIONS[rule_id]["interpretation"] for rule_id in rule_ids if rule_id in RULE_DEFINITIONS]
    interventions = [RULE_DEFINITIONS[rule_id]["onsite_intervention"] for rule_id in rule_ids if rule_id in RULE_DEFINITIONS]
    feedback_parts = [FEEDBACK_TEMPLATES[template_id] for template_id in templates if template_id in FEEDBACK_TEMPLATES]

    return {
        "learner_profile": scenario["learner_profile"],
        "cluster_profile": scenario["cluster_profile"],
        "clustering_output": scenario["learner_profile"],
        "cluster_label": scenario["cluster_label"],
        "predicted_improvement": scenario["predicted_improvement"],
        "random_forest_output": scenario["random_forest_output"],
        "bayesian_output": scenario["bayesian_output"],
        "ai_forethought_state": states["forethought"],
        "ai_argument_state": states["argument"],
        "ai_cohesion_state": states["cohesion"],
        "ai_revision_state": states["revision"],
        "ai_feedback_state": states["feedback"],
        "ai_linguistic_state": states["linguistic"],
        "ai_lexical_state": states["lexical"],
        "ai_help_state": states["help"],
        "triggered_rules": _delimited(rule_ids),
        "triggered_rule_ids": _delimited(rule_ids),
        "interpretations": _delimited(interpretations),
        "feedback_types": _delimited(templates),
        "feedback_templates_selected": _delimited(templates),
        "onsite_interventions": _delimited(interventions),
        "final_feedback_focus": scenario["final_feedback_focus"],
        "teacher_validation_prompt": (
            "Teacher validation required: confirm that the main focus should be "
            f"\"{scenario['final_feedback_focus']}\" before releasing the student-facing message."
        ),
        "predicted_score": _estimate_predicted_score(row, scenario["predicted_improvement"]),
        "final_feedback_message": " ".join(feedback_parts)
        if feedback_parts
        else "No specific writing needs detected. Continue following the task guidelines.",
    }
