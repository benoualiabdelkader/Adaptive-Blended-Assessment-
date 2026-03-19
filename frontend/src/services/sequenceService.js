import { db } from '../store/db';

/**
 * Sequential Behaviour Analysis Service
 * Research Dimension: "What did the student do, and in what order?"
 */
export const sequenceService = {
  /**
   * Fetches the full event sequence for a student
   */
  getStudentSequence: async (studentId) => {
    return await db.event_log
      .where('student_id')
      .equals(studentId)
      .sortBy('timestamp');
  },

  /**
   * Analyzes a sequence to find specific Research Patterns
   * Pattern A: "Proactive" (Rubric view BEFORE Draft 1)
   * Pattern B: "Feedback-Driven" (Feedback view AFTER Draft 1, BEFORE Draft 2)
   * Pattern C: "Impulsive" (Draft 1 without Rubric view)
   */
  classifyBehaviourSequence: (events) => {
    if (!events || events.length === 0) return 'Insufficient Data';

    const hasRubricView = events.some(e => e.action_type === 'rubric_view');
    const firstDraftIndex = events.findIndex(e => e.action_type === 'draft_submit' && e.draft_id === 1);
    const rubricViewIndex = events.findIndex(e => e.action_type === 'rubric_view');
    const feedbackViewIndex = events.findIndex(e => e.action_type === 'feedback_view');
    const secondDraftIndex = events.findIndex(e => e.action_type === 'draft_submit' && e.draft_id === 2);

    // Logic for Pattern Identification
    if (hasRubricView && firstDraftIndex !== -1 && rubricViewIndex < firstDraftIndex) {
      return 'Proactive Strategic';
    }

    if (firstDraftIndex !== -1 && feedbackViewIndex !== -1 && secondDraftIndex !== -1) {
      if (feedbackViewIndex > firstDraftIndex && feedbackViewIndex < secondDraftIndex) {
        return 'Feedback Reactive';
      }
    }

    if (firstDraftIndex !== -1 && !hasRubricView) {
      return 'Impulsive / Low Prep';
    }

    return 'Standard Procedural';
  },

  /**
   * Identifies "Cognitive Blockage" points
   * If a student views assignment many times without submitting.
   */
  detectBlockages: (events) => {
    const assignmentViews = events.filter(e => e.action_type === 'assignment_view').length;
    const hasSubmission = events.some(e => e.action_type === 'draft_submit');
    
    if (assignmentViews > 3 && !hasSubmission) {
      return { status: 'At-Risk', reason: 'High Assignment Re-entry / Loop' };
    }
    return { status: 'Nominal', reason: 'None' };
  }
};
