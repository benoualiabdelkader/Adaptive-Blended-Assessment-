const { kmeans } = require('ml-kmeans');
const { RandomForestRegression } = require('ml-random-forest');

const CLUSTER_FEATURES = [
  'time_on_task',
  'revision_frequency',
  'feedback_views',
  'rubric_views',
  'help_seeking_messages',
  'total_score',
  'ttr',
  'cohesion_index',
  'word_count',
];

const PREDICTION_FEATURES = [
  'assignment_views',
  'resource_access_count',
  'rubric_views',
  'time_on_task',
  'revision_frequency',
  'feedback_views',
  'help_seeking_messages',
  'word_count',
  'error_density',
  'cohesion_index',
  'ttr',
  'argumentation',
];

function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function variance(values, avg) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
}

function standardizeMatrix(matrix) {
  if (matrix.length === 0) {
    return { scaled: [], means: [], stds: [] };
  }

  const columnCount = matrix[0].length;
  const means = new Array(columnCount).fill(0);
  const stds = new Array(columnCount).fill(1);

  for (let column = 0; column < columnCount; column += 1) {
    const columnValues = matrix.map((row) => row[column]);
    const avg = mean(columnValues);
    const std = Math.sqrt(variance(columnValues, avg)) || 1;
    means[column] = avg;
    stds[column] = std;
  }

  return {
    scaled: matrix.map((row) => row.map((value, index) => (value - means[index]) / stds[index])),
    means,
    stds,
  };
}

function inverseStandardizeRow(row, means, stds) {
  return row.map((value, index) => value * stds[index] + means[index]);
}

function toFeatureMatrix(students, featureNames) {
  return students.map((student) => featureNames.map((feature) => Number(student[feature] ?? 0)));
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function computeR2(actuals, predictions) {
  if (actuals.length === 0) return 0;
  const avg = mean(actuals);
  const total = actuals.reduce((sum, value) => sum + (value - avg) ** 2, 0);
  if (total === 0) return 0;
  const residual = actuals.reduce((sum, value, index) => sum + (value - predictions[index]) ** 2, 0);
  return 1 - residual / total;
}

function computeMae(actuals, predictions) {
  if (actuals.length === 0) return 0;
  return actuals.reduce((sum, value, index) => sum + Math.abs(value - predictions[index]), 0) / actuals.length;
}

function inferCanonicalClusterLabel(centroid) {
  const engagementScore =
    centroid.time_on_task * 0.2 +
    centroid.revision_frequency * 12 +
    centroid.feedback_views * 10 +
    centroid.help_seeking_messages * 6;

  if (centroid.total_score < 15 && engagementScore < 80) {
    return 0;
  }

  if (centroid.total_score >= 20 && engagementScore < 95) {
    return 1;
  }

  if (centroid.total_score < 20 && engagementScore >= 95) {
    return 2;
  }

  return 3;
}

function runClustering(students) {
  if (students.length < 4) {
    return {
      available: false,
      reason: 'At least 4 verified workbook cases are required for cohort clustering.',
      clusterCentroids: [],
      labelsById: {},
    };
  }

  const matrix = toFeatureMatrix(students, CLUSTER_FEATURES);
  const { scaled, means, stds } = standardizeMatrix(matrix);
  const result = kmeans(scaled, 4, { seed: 42 });

  const centroidLabelMap = {};
  const clusterCentroids = result.centroids.map((centroid, index) => {
    const inverted = inverseStandardizeRow(centroid.centroid, means, stds);
    const centroidObject = Object.fromEntries(
      CLUSTER_FEATURES.map((feature, featureIndex) => [feature, round(inverted[featureIndex])])
    );
    const canonicalLabel = inferCanonicalClusterLabel(centroidObject);
    centroidLabelMap[index] = canonicalLabel;
    return {
      ...centroidObject,
      cluster_label: canonicalLabel,
      size: centroid.size,
      error: round(centroid.error),
    };
  });

  const labelsById = {};
  result.clusters.forEach((rawCluster, index) => {
    labelsById[students[index].student_id] = centroidLabelMap[rawCluster];
  });

  return {
    available: true,
    reason: null,
    clusterCentroids,
    labelsById,
  };
}

function trainPredictionModel(students) {
  if (students.length < 5) {
    return {
      available: false,
      reason: 'At least 5 verified workbook cases are required for prediction.',
      metrics: null,
      importance: [],
      predictionsById: {},
    };
  }

  const dataset = toFeatureMatrix(students, PREDICTION_FEATURES);
  const targets = students.map((student) => Number(student.total_score ?? 0));

  const cvPredictions = [];
  for (let index = 0; index < students.length; index += 1) {
    const trainSet = dataset.filter((_, rowIndex) => rowIndex !== index);
    const trainTargets = targets.filter((_, rowIndex) => rowIndex !== index);
    const model = new RandomForestRegression({
      seed: 42,
      maxFeatures: Math.max(2, Math.round(PREDICTION_FEATURES.length * 0.7)),
      replacement: true,
      nEstimators: 100,
      selectionMethod: 'mean',
    });
    model.train(trainSet, trainTargets);
    const prediction = model.predict([dataset[index]])[0];
    cvPredictions.push(prediction);
  }

  const fullModel = new RandomForestRegression({
    seed: 42,
    maxFeatures: Math.max(2, Math.round(PREDICTION_FEATURES.length * 0.7)),
    replacement: true,
    nEstimators: 200,
    selectionMethod: 'mean',
  });
  fullModel.train(dataset, targets);

  const featureImportance = fullModel.featureImportance().map((importance, index) => ({
    feature: PREDICTION_FEATURES[index],
    importance: round(importance, 4),
  })).sort((left, right) => right.importance - left.importance);

  const predictionsById = {};
  const finalPredictions = fullModel.predict(dataset);
  students.forEach((student, index) => {
    predictionsById[student.student_id] = round(finalPredictions[index], 1);
  });

  return {
    available: true,
    reason: null,
    metrics: {
      mae: round(computeMae(targets, cvPredictions), 2),
      r2: round(computeR2(targets, cvPredictions), 2),
    },
    importance: featureImportance,
    predictionsById,
  };
}

function buildAnalyticsSummary(cases) {
  const students = cases.map((studyCase) => studyCase.data[0]).filter(Boolean);
  const clustering = runClustering(students);
  const prediction = trainPredictionModel(students);

  const enrichedCases = cases.map((studyCase) => {
    const student = studyCase.data[0];
    const studentId = student.student_id;

    return {
      ...studyCase,
      data: [
        {
          ...student,
          cluster_label: clustering.available ? clustering.labelsById[studentId] : -1,
          predicted_score: prediction.available ? prediction.predictionsById[studentId] : null,
        },
      ],
      metrics: {
        rf_metrics: prediction.metrics ?? null,
        rf_importance: prediction.importance,
        cluster_centroids: clustering.clusterCentroids,
      },
      analytics: {
        source: 'verified-cohort',
        cohort_size: students.length,
        clustering: {
          available: clustering.available,
          reason: clustering.reason,
        },
        prediction: {
          available: prediction.available,
          reason: prediction.reason,
        },
        bayesian: {
          available: false,
          reason: 'A verified live Bayesian service is not connected in the current backend build.',
        },
      },
    };
  });

  return {
    cases: enrichedCases,
    analytics: {
      source: 'verified-cohort',
      cohort_size: students.length,
      clustering: {
        available: clustering.available,
        reason: clustering.reason,
        cluster_centroids: clustering.clusterCentroids,
      },
      prediction: {
        available: prediction.available,
        reason: prediction.reason,
        rf_metrics: prediction.metrics,
        rf_importance: prediction.importance,
      },
      bayesian: {
        available: false,
        reason: 'A verified live Bayesian service is not connected in the current backend build.',
      },
    },
  };
}

module.exports = {
  buildAnalyticsSummary,
};
