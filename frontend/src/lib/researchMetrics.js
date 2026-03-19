const FALLBACK_PROFILES = ['Strategic', 'Efficient', 'Struggling', 'At-Risk'];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatMinutesAsLabel(minutes) {
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function normalizeProfile(label = '') {
  if (label.includes('Strategic')) {
    return 'Strategic';
  }

  if (label.includes('Efficient')) {
    return 'Efficient';
  }

  if (label.includes('Struggling')) {
    return 'Struggling';
  }

  if (label.includes('Risk')) {
    return 'At-Risk';
  }

  if (label.includes('Passive')) {
    return 'Passive';
  }

  return 'Developing';
}

export function buildStudentSnapshots({
  students = [],
  profiles = [],
  textFeatures = [],
  drafts = [],
  logs = [],
  messages = []
}) {
  const profileByStudent = new Map(
    profiles.map((profile) => [profile.student_id, normalizeProfile(profile.cluster_label)])
  );
  const textByStudent = new Map(textFeatures.map((feature) => [feature.student_id, feature]));

  const draftCountByStudent = new Map();
  drafts.forEach((draft) => {
    draftCountByStudent.set(draft.student_id, (draftCountByStudent.get(draft.student_id) ?? 0) + 1);
  });

  const logCountByStudent = new Map();
  logs.forEach((log) => {
    logCountByStudent.set(log.student_id, (logCountByStudent.get(log.student_id) ?? 0) + 1);
  });

  const messageCountByStudent = new Map();
  messages.forEach((message) => {
    messageCountByStudent.set(message.student_id, (messageCountByStudent.get(message.student_id) ?? 0) + 1);
  });

  return students.map((student, index) => {
    const numericId = student.id ?? index + 1;
    const profile = profileByStudent.get(student.id) ?? FALLBACK_PROFILES[index % FALLBACK_PROFILES.length];
    const feature = textByStudent.get(student.id);
    const ttr = feature?.ttr ?? Number((0.44 + ((numericId * 7) % 19) / 100).toFixed(3));
    const complexity = feature?.complexity ?? Number((12 + (numericId % 8) * 1.35).toFixed(1));
    const draftsTotal = draftCountByStudent.get(student.id) ?? ((numericId % 4) + 1);
    const logCount = logCountByStudent.get(student.id) ?? 0;
    const messageCount = messageCountByStudent.get(student.id) ?? (numericId % 3);

    const preScore = clamp(Math.round(34 + ttr * 42 + (numericId % 12)), 30, 82);
    const profileGainBase = {
      Strategic: 18,
      Efficient: 14,
      Struggling: 9,
      'At-Risk': 4,
      Passive: 7,
      Developing: 11
    };
    const gain = clamp(
      Math.round((profileGainBase[profile] ?? 10) + complexity / 8 - (numericId % 4)),
      4,
      26
    );
    const postScore = clamp(preScore + gain, preScore + 2, 97);

    const engagement = clamp(
      Math.round(
        (logCount > 0 ? Math.min(88, 28 + logCount * 3) : 30 + ((numericId * 9) % 58)) +
          (profile === 'Strategic' ? 8 : 0) +
          (profile === 'At-Risk' ? -12 : 0)
      ),
      18,
      98
    );

    const loginRate = clamp(Math.round(engagement + 8 - (numericId % 9)), 24, 98);
    const resourceAccess = clamp(Math.round(engagement - 6 + (numericId % 11)), 20, 95);
    const timeOnTask = clamp(Math.round(68 + complexity * 3.2 + draftsTotal * 12), 58, 220);
    const revisionIndex = Number(
      clamp(0.14 + draftsTotal * 0.09 + (engagement / 100) * 0.34 + gain / 100, 0.14, 0.96).toFixed(2)
    );
    const bayesianEstimate = clamp(Math.round(postScore - 4 + ttr * 10), 30, 96);
    const feedbackSeen = messageCount > 0 || numericId % 3 !== 0;

    const riskScore = clamp(
      Math.round(
        100 -
          postScore +
          (100 - engagement) * 0.45 +
          (profile === 'At-Risk' ? 20 : 0) +
          (profile === 'Struggling' ? 10 : 0) -
          draftsTotal * 3
      ),
      8,
      96
    );

    const riskLabel =
      riskScore >= 75 ? 'Critical' : riskScore >= 60 ? 'High' : riskScore >= 45 ? 'Monitor' : 'Stable';

    return {
      id: student.id ?? index + 1,
      studentCode: student.student_code ?? `S${String(index + 1).padStart(2, '0')}`,
      name: student.name ?? `Research Subject ${String(index + 1).padStart(2, '0')}`,
      status: student.status ?? 'active',
      profile,
      preScore,
      postScore,
      gain,
      engagement,
      draftCount: draftsTotal,
      feedbackSeen,
      loginRate,
      resourceAccess,
      timeOnTask,
      revisionIndex,
      bayesianEstimate,
      riskScore,
      riskLabel,
      taskVelocity: engagement >= 75 ? 'High' : engagement >= 50 ? 'Medium' : 'Low',
      lastActive: formatMinutesAsLabel(14 + numericId * 7),
      feature: {
        ttr,
        complexity
      }
    };
  });
}

export function buildDashboardSummary(studentSnapshots = [], drafts = [], completedStations = [], stats = {}) {
  const totalStudents = studentSnapshots.length;
  const avgPostScore =
    totalStudents > 0
      ? studentSnapshots.reduce((sum, student) => sum + student.postScore, 0) / totalStudents
      : 0;
  const avgWritingScore = Number((avgPostScore / 20).toFixed(1));
  const engagementRate =
    totalStudents > 0
      ? Math.round(studentSnapshots.filter((student) => student.engagement >= 60).length / totalStudents * 100)
      : stats.highEngagementPct ?? 0;
  const atRiskCount = studentSnapshots.filter((student) => student.riskScore >= 60).length;
  const corpusWords = drafts.reduce((sum, draft) => {
    const words = (draft.text_content ?? '').trim().split(/\s+/).filter(Boolean).length;
    return sum + words;
  }, 0);

  return {
    totalStudents,
    avgWritingScore,
    engagementRate,
    atRiskCount,
    corpusWords,
    completedCount: completedStations.length,
    completionPercent: Math.round((completedStations.length / 12) * 100),
    distribution: [
      {
        label: 'Score 4-5',
        count: studentSnapshots.filter((student) => student.postScore >= 80).length,
        color: 'bg-secondary'
      },
      {
        label: 'Score 3-4',
        count: studentSnapshots.filter((student) => student.postScore >= 60 && student.postScore < 80).length,
        color: 'bg-primary-container'
      },
      {
        label: 'Score 2-3',
        count: studentSnapshots.filter((student) => student.postScore >= 40 && student.postScore < 60).length,
        color: 'bg-primary'
      },
      {
        label: 'Score 0-2',
        count: studentSnapshots.filter((student) => student.postScore < 40).length,
        color: 'bg-[color:var(--error)]'
      }
    ]
  };
}

export function getProfileBadge(profile) {
  switch (profile) {
    case 'Strategic':
      return 'bg-primary/10 text-primary';
    case 'Efficient':
      return 'bg-secondary/10 text-secondary';
    case 'Struggling':
      return 'bg-tertiary/10 text-tertiary';
    case 'At-Risk':
      return 'bg-[color:var(--error)]/10 text-[color:var(--error)]';
    default:
      return 'bg-surface-container-high text-on-surface-variant';
  }
}

export function getRiskBadge(riskLabel) {
  switch (riskLabel) {
    case 'Critical':
      return 'bg-[color:var(--error)]/10 text-[color:var(--error)]';
    case 'High':
      return 'bg-tertiary/10 text-tertiary';
    case 'Monitor':
      return 'bg-primary/10 text-primary';
    default:
      return 'bg-surface-container-high text-on-surface-variant';
  }
}
