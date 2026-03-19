import { db } from '../store/db';

/**
 * Message Threshold & Research Analytics Service
 * Research Dimension: "Relating communication volume/intent to self-regulation (Zimmerman 2008)"
 */
export const messageThresholdService = {
  /**
   * Applies Research Thresholds to a student's private messages
   */
  calculateMessageResearchIndicators: async (studentId) => {
    const messages = await db.help_seeking_messages.where('student_id').equals(studentId).toArray();
    const eventLogs = await db.event_log.where('student_id').equals(studentId).toArray();

    const counts = {
      total: messages.length,
      conceptual: messages.filter(m => m.message_type === 'Conceptual').length,
      procedural: messages.filter(m => m.message_type === 'Procedural').length,
      language: messages.filter(m => m.message_type === 'Language').length
    };

    // 1. Struggling Profile Threshold (≥ 3 messages)
    const isStruggling = counts.total >= 3;

    // 2. Active Feedback Interaction (Message AFTER Feedback View)
    const feedbackView = eventLogs.find(e => e.action_type === 'feedback_view');
    const messageAfterFeedback = feedbackView 
      ? messages.some(m => new Date(m.timestamp) > new Date(feedbackView.timestamp))
      : false;

    // 3. Seeking without Application (Message + No subsequent Revision)
    const lastMessage = messages.length > 0 
      ? messages.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
      : null;
    const lastRevision = eventLogs
      .filter(e => e.action_type === 'draft_submit')
      .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    
    const seekingWithoutRevision = lastMessage && (!lastRevision || new Date(lastRevision.timestamp) < new Date(lastMessage.timestamp));

    // 4. Conceptual Difficulty (Rule 3 Trigger)
    const conceptualDifficulty = counts.conceptual >= 2;

    return {
      indicators: {
        isStruggling,
        messageAfterFeedback,
        seekingWithoutRevision,
        conceptualDifficulty
      },
      counts,
      summary: messageThresholdService.getResearchNarrative({
        isStruggling,
        messageAfterFeedback,
        seekingWithoutRevision,
        conceptualDifficulty
      })
    };
  },

  /**
   * Generates a research-backed narrative for the profile report
   */
  getResearchNarrative: (indicators) => {
    if (indicators.messageAfterFeedback && !indicators.seekingWithoutRevision) {
      return 'High Self-Regulation: Active feedback processing and application confirmed.';
    }
    if (indicators.isStruggling && indicators.seekingWithoutRevision) {
      return 'Critical Concern: Help-seeking behavior detected without subsequent behavioral modification.';
    }
    if (indicators.conceptualDifficulty) {
      return 'Cognitive Blockage: Repeated conceptual inquiries suggest fundamental logic struggles (Zimmerman Phase 1).';
    }
    return 'Moderate Engagement: Average communication volume with standard revision cycles.';
  }
};
