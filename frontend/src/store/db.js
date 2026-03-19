import Dexie from 'dexie';

// Define the WriteLens local database
export const db = new Dexie('WriteLensDB');

// Define the 17-table schema as dictated by the doctoral research framework
db.version(1).stores({
  // 1. Core Entities
  students: '++id, student_code, status', // S01-S28
  writing_tasks: '++id, module_name, deadline',
  drafts: '++id, student_id, draft_number, submitted_at, text_content', // Draft 1, 2, 3
  
  // 2. Behavioral Data (Process)
  moodle_logs: '++id, student_id, action_type, timestamp, duration', 
  help_seeking_messages: '++id, student_id, message_type, timestamp', // Code per type
  
  // 3. Performance Data (Product)
  rubric_scores: '++id, student_id, draft_number, grammar_acc, lex_range, org, cohesion, arg, total',
  text_features: '++id, draft_id, student_id, ttr, error_density, cohesion_markers',
  
  // 4. Derived Analytics
  engagement_scores: '++id, student_id, draft_number, composite_score, classification', // High, Mod, Low
  learner_profiles: '++id, student_id, cluster_label, silhouette_score', // Strategic, Struggling, Passive, At-Risk
  predictive_models: '++id, target_variable, model_accuracy', // Random Forest Metadata
  bayesian_competencies: '++id, student_id, draft_number, comp_lexical, comp_grammar, comp_discourse, comp_arg',
  
  // 5. Diagnostics & Intervention
  diagnostic_rules: '++id, student_id, draft_number, rule_triggered, severity', // Rule 1-5
  feedback_records: '++id, student_id, draft_number, template_id, custom_text, delivered',
  intervention_log: '++id, student_id, intervention_type, date, outcome',
  
  // 6. Config & Settings
  rule_definitions: '++id, name, threshold_value',
  feedback_templates: '++id, intent, content_structure',
  system_settings: '++id, key, value',

  // 7. Advanced Research Indicators (Phase 6)
  event_log: '++id, student_id, draft_id, action_type, timestamp', // For Sequential Analysis
  text_diffs: '++id, student_id, draft_a_id, draft_b_id, added_cohesion, added_evidence, lexical_growth' // For Revision Growth
});

// Singleton Database Initialization Service
export const initializeDB = async () => {
  try {
    await db.open();
    return true;
  } catch (err) {
    console.error("WriteLens DB Initialization Failed:", err);
    return false;
  }
};
