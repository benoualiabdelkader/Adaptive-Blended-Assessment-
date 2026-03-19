import { nlpService } from '../services/nlpService.js';
import { clusterService } from '../services/clusterService.js';
import { randomForestService } from '../services/randomForestService.js';
import { bayesianService } from '../services/bayesianService.js';

export const analyticsController = {
  processPipeline: async (req, res) => {
    try {
      const { students, essays } = req.body;

      if (!students || !Array.isArray(students)) {
        return res.status(400).json({ error: 'Invalid students data' });
      }

      console.log(`Processing pipeline for ${students.length} students...`);

      // Station 04: Text Analytics
      const textAnalysisResults = students.map(student => {
        const studentEssay = essays?.find(e => e.studentId === student.id);
        if (studentEssay) {
          return nlpService.processEssay(studentEssay.text, student.id, studentEssay.draftNumber || 1);
        }
        return null;
      }).filter(Boolean);

      // Station 06: Clustering
      const enrichedStudents = students.map(student => {
        const analysis = textAnalysisResults.find(a => a.student_id === student.id);
        return {
          ...student,
          nlpComplexity: analysis?.complexity || 0,
          engagementComposite: (student.platformLogins || 0) * 0.2 + (student.revisionFrequency || 0) * 0.8
        };
      });

      const matrix = clusterService.buildFeatureMatrix(enrichedStudents);
      const kMeansResult = clusterService.runKMeans(matrix, 4);
      const profiles = clusterService.assignProfileLabel(kMeansResult.clusters);

      // Station 07: Predictive Modeling (Random Forest)
      // For simplicity, we just return the feature importance from the service
      const featureImportance = randomForestService.rankFeatures(enrichedStudents);

      // Station 08: Competence Inference (Bayesian)
      const bayesianNetwork = bayesianService.buildNetwork();
      const competencies = enrichedStudents.map(student => {
        const analysis = textAnalysisResults.find(a => a.student_id === student.id);
        const evidence = bayesianService.setEvidence(student.id, 1, {
          ttr: analysis?.ttr || 0,
          complexity: analysis?.complexity || 0,
          error_density: analysis?.error_density || 0
        });
        const inference = bayesianService.inferCompetencies(bayesianNetwork, {}, evidence);
        return { studentId: student.id, ...inference };
      });

      res.json({
        success: true,
        summary: {
          studentsProcessed: students.length,
          profilesIdentified: profiles.length,
          timestamp: new Date().toISOString()
        },
        stations: {
          textAnalytics: textAnalysisResults,
          clustering: { profiles, silhouette: clusterService.calculateSilhouette() },
          predictive: { featureImportance },
          competencies
        }
      });
    } catch (error) {
      console.error('Pipeline Processing Error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
};
