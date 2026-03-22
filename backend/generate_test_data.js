const xlsx = require('xlsx');

const PROFILE_TEMPLATES = [
  {
    label: 'Independent Writer',
    assignment_views: 9,
    resource_access_count: 6,
    rubric_views: 2,
    time_on_task: 85,
    revision_frequency: 1,
    feedback_views: 1,
    help_seeking_messages: 0,
    word_count: 155,
    error_density: 4.1,
    cohesion_index: 2,
    cohesion: 2.7,
    ttr: 0.41,
    argumentation: 2.8,
    grammar_accuracy: 2.9,
    lexical_resource: 3.0,
    first_access_delay_minutes: 42,
    total_score: 13.5,
    score_gain: 1.2,
    sample_text:
      'Online learning gives students flexibility, but many learners still need clearer structure and stronger study habits in order to succeed consistently.',
  },
  {
    label: 'Responsive Reviser',
    assignment_views: 14,
    resource_access_count: 9,
    rubric_views: 4,
    time_on_task: 132,
    revision_frequency: 3,
    feedback_views: 3,
    help_seeking_messages: 2,
    word_count: 188,
    error_density: 3.2,
    cohesion_index: 3,
    cohesion: 3.4,
    ttr: 0.49,
    argumentation: 3.5,
    grammar_accuracy: 3.4,
    lexical_resource: 3.5,
    first_access_delay_minutes: 24,
    total_score: 18.6,
    score_gain: 2.3,
    sample_text:
      'Teacher feedback supports revision because it helps students identify weak evidence, improve cohesion, and write with greater academic control.',
  },
  {
    label: 'High Engagement',
    assignment_views: 18,
    resource_access_count: 12,
    rubric_views: 6,
    time_on_task: 176,
    revision_frequency: 4,
    feedback_views: 4,
    help_seeking_messages: 4,
    word_count: 214,
    error_density: 2.5,
    cohesion_index: 4,
    cohesion: 3.9,
    ttr: 0.56,
    argumentation: 4.0,
    grammar_accuracy: 3.8,
    lexical_resource: 3.9,
    first_access_delay_minutes: 12,
    total_score: 22.4,
    score_gain: 3.1,
    sample_text:
      'Responsible use of digital tools can strengthen drafting, but students still need to justify claims with evidence and maintain ownership of the final text.',
  },
  {
    label: 'Support-Seeking',
    assignment_views: 16,
    resource_access_count: 11,
    rubric_views: 5,
    time_on_task: 149,
    revision_frequency: 3,
    feedback_views: 4,
    help_seeking_messages: 5,
    word_count: 196,
    error_density: 3.0,
    cohesion_index: 3,
    cohesion: 3.6,
    ttr: 0.52,
    argumentation: 3.7,
    grammar_accuracy: 3.5,
    lexical_resource: 3.6,
    first_access_delay_minutes: 18,
    total_score: 20.1,
    score_gain: 2.8,
    sample_text:
      'Students often improve when they ask where feedback is located, clarify expectations, and return to the task with a clear revision goal.',
  },
];

function buildStudentRecord(index) {
  const template = PROFILE_TEMPLATES[index % PROFILE_TEMPLATES.length];
  const sequence = index + 1;

  return {
    student_id: `S${String(sequence).padStart(2, '0')}`,
    name: `Synthetic Student ${String(sequence).padStart(2, '0')}`,
    email: `synthetic.student${String(sequence).padStart(2, '0')}@example.edu`,
    assignment_views: template.assignment_views + (sequence % 3),
    resource_access_count: template.resource_access_count + (sequence % 2),
    rubric_views: template.rubric_views,
    time_on_task: template.time_on_task + (sequence % 4) * 6,
    revision_frequency: template.revision_frequency,
    feedback_views: template.feedback_views,
    help_seeking_messages: template.help_seeking_messages,
    word_count: template.word_count + (sequence % 5) * 4,
    error_density: Number((template.error_density - (sequence % 3) * 0.1).toFixed(2)),
    cohesion_index: template.cohesion_index,
    cohesion: template.cohesion,
    ttr: template.ttr,
    argumentation: template.argumentation,
    grammar_accuracy: template.grammar_accuracy,
    lexical_resource: template.lexical_resource,
    total_score: template.total_score,
    score_gain: template.score_gain,
    first_access_delay_minutes: template.first_access_delay_minutes,
    sample_text: template.sample_text,
  };
}

function generateSyntheticCohort(size = 28) {
  return Array.from({ length: size }, (_, index) => buildStudentRecord(index));
}

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(generateSyntheticCohort());
xlsx.utils.book_append_sheet(workbook, worksheet, 'CohortData');

const filename = 'Cohort_Writing_Data.xlsx';
xlsx.writeFile(workbook, filename);

console.log(`Generated ${filename} with 28 deterministic synthetic student records.`);
