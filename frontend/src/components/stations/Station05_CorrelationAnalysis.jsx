import React, { useEffect } from 'react';
import { useStationStore } from '../../store/stationStore';

const HeatmapCell = ({ val, isHeader = false, label = "" }) => {
  if (isHeader) {
    return (
      <div className="data-label !text-slate-500 flex items-center justify-end pr-3 min-w-0">
        {label}
      </div>
    );
  }

  // Matching the design: 0.64 is highlighted with border and ring
  const isHigh = val >= 0.6;
  const isMed = val >= 0.4 && val < 0.6;
  const isLow = val >= 0.2 && val < 0.4;

  let cellClass = "aspect-square flex flex-col items-center justify-center transition-all duration-300 min-w-0 ";
  if (isHigh) {
    cellClass += "bg-primary/20 border-2 border-primary ring-4 ring-primary/10 shadow-[0_0_15px_rgba(192,193,255,0.2)]";
  } else if (isMed) {
    cellClass += "bg-primary/15";
  } else if (isLow) {
    cellClass += "bg-primary/5";
  } else {
    cellClass += "bg-surface-container-highest opacity-50";
  }

  return (
    <div className={cellClass}>
      <span className={`forensic-mono ${isHigh ? 'text-sm font-bold text-primary' : (isMed ? 'text-xs text-on-surface/80' : 'text-[10px] text-on-surface/40')}`}>
        {val.toFixed(2)}
      </span>
      {isHigh && <span className="data-label !text-[8px] !text-primary/60">r-val</span>}
    </div>
  );
};

export default function Station05_CorrelationAnalysis() {
  const setInterpretation = useStationStore(state => state.setInterpretation);

  useEffect(() => {
    setInterpretation({
      notes: "Revision Frequency serves as the strongest behavioral predictor for Rubric Score consistency (r = 0.64). Feedback engagement shows moderate but significant clustering.",
      findings: [
        "Statistical Significance: 94% CI (M-23_PVAL_0.001)",
        "Revision Depth correlates heavily with Argumentative Consistency",
        "Low outlier detected in Rubric B (Feedback segment)"
      ],
      references: [
        { author: "Baker (2011)", title: "Predictive modeling in educational data mining" },
        { author: "Cohen (1988)", title: "Statistical Power Analysis" }
      ]
    });
  }, [setInterpretation]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Page Heading & Confidence Meter */}
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 data-label text-primary">
            <span className="w-1.5 h-1.5 bg-primary animate-pulse shadow-[0_0_8px_rgba(192,193,255,0.6)]"></span>
            STATION 05 / Correlation Analysis
          </div>
          <h1 className="editorial-header text-3xl phosphor-glow">Diagonal Relationships</h1>
          <p className="data-label !text-outline mt-2">Inter-Variable Matrix • Real-time Statistical Sync</p>
        </div>
        
        <div className="bg-surface-container-low p-5 rounded-sm flex flex-col items-end min-w-0">
          <span className="data-label !text-secondary font-bold mb-2">Statistical Significance</span>
          <div className="flex items-center gap-3">
            <div className="h-1 w-32 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-secondary shadow-[0_0_10px_rgba(79,219,200,0.5)]" style={{ width: '94%' }}></div>
            </div>
            <span className="forensic-mono text-sm text-on-surface font-bold">94% CI</span>
          </div>
        </div>
      </header>

      {/* Main Content: Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Heatmap Section (Left) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low p-8 relative overflow-hidden group min-w-0">
          <div className="absolute top-0 right-0 p-2 forensic-mono text-[9px] text-outline opacity-30">REF: M-23_PVAL_0.001</div>
          
          <div className="mb-10">
            <h3 className="data-label !text-primary font-bold">Inter-Variable Correlation Matrix</h3>
            <p className="font-headline text-2xl italic mt-2 text-on-surface/90">LMS Behavioral Correlates vs. Performance Metrics</p>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {/* X-Axis Labels */}
            <div className="col-start-2 col-span-4 grid grid-cols-4 mb-4">
              {['Rev. Freq', 'Feedback', 'Login Seg', 'Res. Time'].map(label => (
                <div key={label} className="data-label !text-slate-500 text-center !tracking-widest font-bold">
                  {label}
                </div>
              ))}
            </div>

            {/* Matrix Content */}
            <HeatmapCell isHeader label="Grammar Score" />
            <HeatmapCell val={0.64} />
            <HeatmapCell val={0.32} />
            <HeatmapCell val={0.11} />
            <HeatmapCell val={0.24} />

            <HeatmapCell isHeader label="Cohesion Dev" />
            <HeatmapCell val={0.45} />
            <HeatmapCell val={0.58} />
            <HeatmapCell val={0.19} />
            <HeatmapCell val={0.08} />

            <HeatmapCell isHeader label="Overall Total" />
            <HeatmapCell val={0.68} />
            <HeatmapCell val={0.42} />
            <HeatmapCell val={0.29} />
            <HeatmapCell val={0.38} />
          </div>

          <div className="mt-10 bg-surface-container p-5 border-l-2 border-primary min-w-0">
            <p className="font-body text-[13px] leading-relaxed text-on-surface/80">
              <span className="data-label !text-primary font-bold mr-2 underline decoration-primary/30 underline-offset-4">Observation:</span> 
              Revision Frequency serves as the strongest behavioral predictor for Rubric Score consistency. 
              Feedback engagement shows moderate but significant clustering, particularly in the Second Draft phase.
            </p>
          </div>
        </div>

        {/* Forensic Detail Column (Right) */}
        <div className="col-span-12 lg:col-span-4 space-y-8 text-on-surface min-w-0">
          {/* Observation Log */}
          <div className="bg-surface-container p-6">
            <h4 className="data-label !text-primary font-bold border-b border-outline-variant/10 pb-3 mb-4">Observation Log</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4 group">
                <span className="material-symbols-outlined text-secondary text-lg group-hover:scale-110 transition-transform">check_circle</span>
                <div>
                  <p className="forensic-mono text-outline uppercase tracking-tighter">09:42:01 UTC</p>
                  <p className="text-[11px] leading-tight text-on-surface/80 mt-1 italic font-body">Data cleaning finalized for Revision Freq cohort.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <span className="material-symbols-outlined text-tertiary text-lg group-hover:scale-110 transition-transform">warning</span>
                <div>
                  <p className="forensic-mono text-outline uppercase tracking-tighter">10:15:44 UTC</p>
                  <p className="text-[11px] leading-tight text-on-surface/80 mt-1 italic font-body">Low outlier detected in Rubric B (Feedback segment).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Moodle Variables Index */}
          <div className="bg-surface-container-low p-6 rounded-sm">
            <h4 className="data-label !text-on-surface-variant font-bold mb-6">Moodle Variables Index</h4>
            <ul className="space-y-4">
              {[
                { name: 'Revision Frequency', tag: 'High-Var', color: 'bg-secondary-container text-on-secondary-container' },
                { name: 'Feedback Access', tag: 'Stable', color: 'bg-surface-container-highest text-outline' },
                { name: 'Login Segmentation', tag: 'Linear', color: 'bg-surface-container-highest text-outline' }
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 py-1 px-2 -mx-2 transition-colors">
                  <span className="text-xs font-body group-hover:text-primary transition-colors">{item.name}</span>
                  <span className={`data-label !text-[8px] ${item.color} px-2 py-0.5 rounded-sm font-bold`}>{item.tag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Statistic Footnote */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="bg-surface-container-low p-4 border-b-2 border-primary/20 min-w-0">
              <span className="block data-label !text-outline mb-1">Skewness</span>
              <span className="forensic-mono text-lg text-on-surface font-bold">-0.42</span>
            </div>
            <div className="bg-surface-container-low p-4 border-b-2 border-secondary/20 min-w-0">
              <span className="block data-label !text-outline mb-1">Kurtosis</span>
              <span className="forensic-mono text-lg text-on-surface font-bold">1.18</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
