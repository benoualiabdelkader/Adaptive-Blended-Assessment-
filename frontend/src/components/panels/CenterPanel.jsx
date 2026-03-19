import React, { useMemo } from 'react';
import { useStationStore } from '../../store/stationStore';
import { motion, AnimatePresence } from 'framer-motion';

import Station01_WritingTask from '../stations/Station01_WritingTask';
import Station02_DataCollection from '../stations/Station02_DataCollection';
import Station03_LearningAnalytics from '../stations/Station03_LearningAnalytics';
import Station04_TextAnalytics from '../stations/Station04_TextAnalytics';
import Station05_CorrelationAnalysis from '../stations/Station05_CorrelationAnalysis';
import Station06_LearnerClustering from '../stations/Station06_LearnerClustering';
import Station07_PredictiveModeling from '../stations/Station07_PredictiveModeling';
import Station08_CompetenceInference from '../stations/Station08_CompetenceInference';
import Station09_PedagogicalDiagnosis from '../stations/Station09_PedagogicalDiagnosis';
import Station10_AdaptiveFeedback from '../stations/Station10_AdaptiveFeedback';
import Station11_InstructionalIntervention from '../stations/Station11_InstructionalIntervention';
import Station12_RevisionCycle from '../stations/Station12_RevisionCycle';

export default function CenterPanel() {
  const activeStationId = useStationStore((state) => state.activeStationId);
  const MotionDiv = motion.div;

  const CurrentStation = useMemo(() => {
    switch (activeStationId) {
      case 1: return <Station01_WritingTask />;
      case 2: return <Station02_DataCollection />;
      case 3: return <Station03_LearningAnalytics />;
      case 4: return <Station04_TextAnalytics />;
      case 5: return <Station05_CorrelationAnalysis />;
      case 6: return <Station06_LearnerClustering />;
      case 7: return <Station07_PredictiveModeling />;
      case 8: return <Station08_CompetenceInference />;
      case 9: return <Station09_PedagogicalDiagnosis />;
      case 10: return <Station10_AdaptiveFeedback />;
      case 11: return <Station11_InstructionalIntervention />;
      case 12: return <Station12_RevisionCycle />;
      default: return <Station01_WritingTask />;
    }
  }, [activeStationId]);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeStationId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {CurrentStation}
        </MotionDiv>
      </AnimatePresence>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
