import { create } from 'zustand';
import { db } from './db';

export const stations = [
  { id: 1, title: 'Writing Task', description: 'Contextualise the assignment', icon: 'assignment' },
  { id: 2, title: 'Data Collection', description: 'Moodle export & rubric scores', icon: 'database' },
  { id: 3, title: 'Learning Analytics', description: 'Behavioural statistics', icon: 'analytics' },
  { id: 4, title: 'Text Analytics', description: 'Linguistic feature analysis', icon: 'abc' },
  { id: 5, title: 'Correlation Analysis', description: 'Behaviour vs performance', icon: 'hub' },
  { id: 6, title: 'Learner Clustering', description: 'K-Means profiling (4 groups)', icon: 'groups' },
  { id: 7, title: 'Predictive Modeling', description: 'Random Forest ranking', icon: 'bar_chart' },
  { id: 8, title: 'Competence Inference', description: 'Bayesian updating', icon: 'psychology' },
  { id: 9, title: 'Pedagogical Diagnosis', description: 'Rule-based triggers', icon: 'fact_check' },
  { id: 10, title: 'Adaptive Feedback', description: 'Personalised strategies', icon: 'rate_review' },
  { id: 11, title: 'Instructional Intervention', description: 'Prioritised action plan', icon: 'bolt' },
  { id: 12, title: 'Revision Cycle', description: 'Growth tracking across drafts', icon: 'terminal' },
];

export const useStationStore = create((set) => ({
  activeStationId: 1,
  completedStations: [1],
  isBatchRunning: false,
  stats: {
    avgRevisionFreq: 4.2,
    feedbackViewRate: 88,
    avgTimeOnTask: 124,
    highEngagementPct: 43
  },
  interpretation: {
    notes: "Awaiting behavioral data from Station 01...",
    findings: [],
    references: []
  },
  setStats: (newStats) => set((state) => ({ stats: { ...state.stats, ...newStats } })),
  setInterpretation: (data) => set({ interpretation: data }),
  setIsBatchRunning: (isRunning) => set({ isBatchRunning: isRunning }),
  setActiveStation: (id) => set((state) => ({ 
    activeStationId: id,
    completedStations: state.completedStations.includes(id) 
      ? state.completedStations 
      : [...state.completedStations, id]
  })),
  nextStation: () => set((state) => {
    const nextId = Math.min(state.activeStationId + 1, 12);
    return {
      activeStationId: nextId,
      completedStations: state.completedStations.includes(nextId) 
        ? state.completedStations 
        : [...state.completedStations, nextId]
    };
  }),
  prevStation: () => set((state) => ({
    activeStationId: Math.max(state.activeStationId - 1, 1)
  })),
  runBatchProcess: async (providedStudents, providedEssays) => {
    set({ isBatchRunning: true });
    try {
      // 1. Fetch data if not provided (supports being called from anywhere)
      const students = providedStudents || await db.students.toArray();
      const drafts = providedEssays || await db.drafts.toArray();
      
      const essays = drafts.map(d => ({
        studentId: d.student_id,
        text: d.text_content,
        draftNumber: d.draft_number
      }));

      // 2. Call real backend API
      const response = await fetch('http://localhost:5000/api/analytics/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students, essays })
      });

      if (!response.ok) throw new Error('Pipeline processing failed');
      const data = await response.json();

      // 2. Simulate station transitions in UI while data is processed
      for (let i = 1; i <= 12; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        set(state => ({
          activeStationId: i,
          completedStations: state.completedStations.includes(i) 
            ? state.completedStations 
            : [...state.completedStations, i]
        }));
      }

      // 3. Update store with real results
      console.log('Pipeline Results:', data);

      // 4. Persist result to Dexie
      const { textAnalytics, clustering, competencies } = data.stations;

      if (textAnalytics) {
        await db.text_features.bulkPut(textAnalytics.map(a => ({
          student_id: a.student_id,
          draft_id: a.draft_id,
          ttr: a.ttr,
          error_density: a.error_density,
          cohesion_markers: a.cohesion_markers,
          complexity: a.complexity
        })));
      }

      if (clustering?.profiles) {
        const profileUpdates = [];
        clustering.profiles.forEach(p => {
          p.students.forEach(sId => {
            profileUpdates.push({
              student_id: sId,
              cluster_label: p.profileName,
              silhouette_score: clustering.silhouette
            });
          });
        });
        await db.learner_profiles.bulkPut(profileUpdates);
      }

      if (competencies) {
        // Assume we store competencies in a new table or existing one
        // For now, let's keep them in the store or log them
        set({ interpretation: { 
          ...useStationStore.getState().interpretation,
          findings: [
            `${data.summary.studentsProcessed} students processed.`,
            `${data.summary.profilesIdentified} profiles updated.`
          ]
        }});
      }
      
    } catch (error) {
      console.error('Frontend Pipeline Error:', error);
    } finally {
      set({ isBatchRunning: false });
    }
  }
}));
