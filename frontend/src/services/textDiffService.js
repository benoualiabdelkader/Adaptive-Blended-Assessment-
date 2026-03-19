import nlp from 'compromise';

/**
 * Text Revision & Growth Analysis Service
 * Research Dimension: "What changed in the text itself?"
 */
export const textDiffService = {
  /**
   * Compares two draft strings and extracts growth metrics
   */
  calculateGrowthDelta: (textA, textB) => {
    if (!textA || !textB) return null;

    const docA = nlp(textA);
    const docB = nlp(textB);

    // 1. Lexical Variety (Unique words)
    const uniqueA = new Set(docA.terms().out('array').map(t => t.toLowerCase())).size;
    const uniqueB = new Set(docB.terms().out('array').map(t => t.toLowerCase())).size;
    const lexicalGrowth = uniqueB > 0 ? (uniqueB - uniqueA) / uniqueB : 0;

    // 2. Added Evidence (Citations)
    // Simple heuristic: Search for (Name, Year) or [Number]
    const citeRegex = /\(\w+,\s\d{4}\)|\[\d+\]/g;
    const citesA = (textA.match(citeRegex) || []).length;
    const citesB = (textB.match(citeRegex) || []).length;
    const addedEvidence = Math.max(0, citesB - citesA);

    // 3. Added Cohesion (Conjunctions/Transitional phrases)
    const cohesionMarkers = ['because', 'therefore', 'however', 'consequently', 'furthermore', 'in addition'];
    let markersA = 0;
    let markersB = 0;
    
    cohesionMarkers.forEach(m => {
      const reg = new RegExp(`\\b${m}\\b`, 'gi');
      markersA += (textA.match(reg) || []).length;
      markersB += (textB.match(reg) || []).length;
    });
    
    const addedCohesion = Math.max(0, markersB - markersA);

    return {
      lexicalGrowth: Number(lexicalGrowth.toFixed(3)),
      addedEvidence,
      addedCohesion,
      wordCountDelta: docB.wordCount() - docA.wordCount()
    };
  },

  /**
   * Generates a "Diff Summary" for the research report
   */
  getDiffSummary: (delta) => {
    if (delta.lexicalGrowth > 0.05) return 'Significant Lexical Expansion';
    if (delta.addedEvidence > 0) return 'Evidence-Based Improvement';
    if (delta.addedCohesion > 2) return 'Enhanced Structural Cohesion';
    return 'Marginal Revision Improvements';
  }
};
