import nlp from 'compromise';

export const nlpService = {
  calculateTTR: (text) => {
    // Type-Token Ratio: Unique words / Total words
    const doc = nlp(text);
    const words = doc.terms().out('array');
    if (words.length === 0) return 0;
    
    // Using simple deduplication via Set
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    
    // Return rounded percentage
    return Number((uniqueWords.size / words.length).toFixed(3));
  },

  calculateErrorDensity: (text) => {
    // Deterministic approximation for client-side evaluation without a heavy grammar API.
    // We combine punctuation drift, lowercase starts, and simple repetition as a proxy signal.
    const doc = nlp(text);
    const wordCount = doc.terms().length;
    if (wordCount === 0) return 0;

    const sentences = doc.sentences().out('array');
    const words = doc.terms().out('array');
    const repeatedWordPenalty = Math.max(0, words.length - new Set(words.map((word) => word.toLowerCase())).size);
    const lowercaseSentenceStarts = sentences.filter((sentence) => {
      const trimmed = sentence.trim();
      return trimmed && trimmed[0] === trimmed[0]?.toLowerCase();
    }).length;
    const punctuationIssues = (text.match(/\s[,.;:!?]/g) || []).length + (text.match(/[a-zA-Z][!?]{2,}/g) || []).length;
    const imbalancePenalty = sentences.filter((sentence) => sentence.trim().split(/\s+/).length < 4).length;

    const estimatedErrors =
      repeatedWordPenalty * 0.15 +
      lowercaseSentenceStarts * 0.8 +
      punctuationIssues * 0.6 +
      imbalancePenalty * 0.5;

    return Number((estimatedErrors / wordCount).toFixed(4));
  },

  countCohesionMarkers: (text) => {
    // Count specific academic transition markers
    const markers = [
      'however', 'furthermore', 'therefore', 'in conclusion', 
      'moreover', 'for example', 'firstly', 'secondly', 'on the other hand',
      'subsequently', 'nevertheless', 'consequently'
    ];
    let count = 0;
    const lowerText = text.toLowerCase();
    
    markers.forEach(marker => {
      const regex = new RegExp(`\\b${marker}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  },

  measureComplexity: (text) => {
    // Mean Length of Utterance (Avg words per sentence)
    const doc = nlp(text);
    const sentences = doc.sentences().out('array');
    const words = doc.terms().length;
    
    if (sentences.length === 0) return 0;
    return Number((words / sentences.length).toFixed(1));
  },

  detectArgument: (text) => {
    // Detect elements of the Claim-Evidence-Warrant (CEW) structure
    const doc = nlp(text);
    const claimMarkers = doc.match('(argue|propose|suggest|claim|assert|hypothesize)').length;
    const evidenceMarkers = doc.match('(evidence|show|demonstrate|prove|according to|based on)').length;
    
    return {
      hasClaim: claimMarkers > 0,
      hasEvidence: evidenceMarkers > 0,
      score: claimMarkers + evidenceMarkers
    };
  },

  processEssay: (text, studentId, draftNumber) => {
    const analysisId = `${studentId}-D${draftNumber}-${Date.now()}`;
    return {
      id: analysisId,
      student_id: studentId,
      draft_id: draftNumber,
      ttr: nlpService.calculateTTR(text),
      error_density: nlpService.calculateErrorDensity(text),
      cohesion_markers: nlpService.countCohesionMarkers(text),
      complexity: nlpService.measureComplexity(text),
      argumentation_profile: nlpService.detectArgument(text)
    };
  }
};
