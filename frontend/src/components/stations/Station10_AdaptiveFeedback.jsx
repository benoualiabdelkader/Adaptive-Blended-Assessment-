import React, { useEffect, useMemo } from 'react';
import { useStationStore } from '../../store/stationStore';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

export default function Station10_AdaptiveFeedback() {
  const setInterpretation = useStationStore(state => state.setInterpretation);

  const histogramData = useMemo(() => [
    { h: 30 }, { h: 45 }, { h: 65 }, { h: 55 }, 
    { h: 80 }, { h: 70 }, { h: 95 }, { h: 40 }, 
    { h: 55 }, { h: 85 }, { h: 90 }, { h: 60 }, 
    { h: 45 }, { h: 75 }, { h: 50 }, { h: 65 }
  ], []);

  useEffect(() => {
    setInterpretation({
      notes: "Feedback loops are automated across three levels: Task, Process, and Self-Regulation (Hattie & Timperley, 2007). Current engine status is optimizing for Station 10 offsets.",
      findings: [
        "Phase 1: Quantitative baseline established (Score 8.42/10)",
        "Phase 2: Cognitive flux identified as 'Medium'",
        "Phase 3: Feedback Template 'Omega' (Forensic Audit) active"
      ],
      references: [
        { author: "Hattie & Timperley (2007)", title: "The Power of Feedback" },
        { author: "Zimmerman (2008)", title: "Self-regulation and motivation: Historical background" }
      ]
    });
  }, [setInterpretation]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Header */}
      <header className="mb-8 border-l border-primary/20 pl-8">
        <h1 className="editorial-header text-3xl mb-2 phosphor-glow">Adaptive Feedback Engine</h1>
        <p className="data-label !text-on-surface-variant">Instrumental Architecture for Personalized Scholarly Refinement</p>
      </header>

      {/* Main Grid: Phase Sequence */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Phase 1 & 2 Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Phase 1: Quantitative Baseline */}
          <section className="bg-surface-container p-8 rounded-sm border-l-2 border-secondary/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 data-label !text-secondary opacity-40 font-bold">PHASE_01 // QUANT</div>
            <h3 className="data-label !text-secondary font-bold mb-8">Phase 1 Scores: The Forensic Baseline</h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Structural Integrity', val: '8.42', width: '84%', color: 'bg-secondary' },
                { label: 'Semantic Density', val: '6.18', width: '61%', color: 'bg-tertiary' },
                { label: 'Citation Velocity', val: '9.05', width: '90%', color: 'bg-secondary' }
              ].map((m, i) => (
                <div key={i} className="bg-surface-container-low p-6 group-hover:bg-surface-container-high transition-colors">
                  <span className="data-label !text-slate-500 block mb-3 font-bold">{m.label}</span>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="font-headline text-4xl text-on-surface font-light italic">{m.val}</span>
                    <span className="text-secondary mb-1">
                      <span className="material-symbols-outlined text-xs">arrow_upward</span>
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1 overflow-hidden rounded-full">
                    <div className={`${m.color} h-full transition-all duration-1000 shadow-[0_0_8px_rgba(79,219,200,0.5)]`} style={{ width: m.width }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Phase 2: Behavioral Analysis */}
          <section className="bg-surface-container p-8 rounded-sm border-l-2 border-primary/40 group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="data-label !text-primary font-bold">Phase 2 Behavior: Engagement Heuristics</h3>
                <p className="text-on-surface-variant text-sm mt-3 max-w-md italic opacity-70">Mapping the metabolic rate of text revision and cognitive load markers.</p>
              </div>
              <span className="data-label !text-primary opacity-40 font-bold">PHASE_02 // BEHAV</span>
            </div>
            <div className="grid grid-cols-4 gap-px bg-outline-variant/10 rounded-sm overflow-hidden">
              {[
                { label: 'Recursive Edits', val: '12.4s', icon: 'query_stats', color: 'text-secondary' },
                { label: 'Gaze Duration', val: '340ms', icon: 'visibility', color: 'text-tertiary' },
                { label: 'Cognitive Flux', val: 'Medium', icon: 'psychology', color: 'text-secondary' },
                { label: 'Draft Latency', val: 'Low', icon: 'history_edu', color: 'text-primary' }
              ].map((item, i) => (
                <div key={i} className="bg-surface-container-low p-6 flex flex-col items-center hover:bg-surface-container-high transition-colors">
                  <div className={`w-14 h-14 rounded-full border border-white/5 flex items-center justify-center mb-4 bg-surface-container-high group-hover:scale-110 transition-transform`}>
                    <span className={`material-symbols-outlined ${item.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <span className="data-label !text-slate-500 text-center font-bold">{item.label}</span>
                  <span className="forensic-mono text-xl text-on-surface mt-2 group-hover:text-primary">{item.val}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Theoretical Rail & Phase 3 (Right) */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">
          {/* Theoretical Rail */}
          <section className="bg-surface-container-lowest p-8 border border-outline-variant/10 rounded-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-sm text-primary">menu_book</span>
              <h4 className="data-label !text-on-surface-variant font-bold">Theoretical Rail</h4>
            </div>
            <div className="space-y-6">
              <p className="font-headline italic text-[15px] text-on-surface leading-relaxed opacity-90">
                "The most powerful single moderator that enhances achievement is feedback."
              </p>
              <div className="flex justify-between items-center bg-surface-container-low px-3 py-2 border-l border-secondary/30">
                <span className="data-label !text-slate-500 font-bold">— Hattie & Timperley (2007)</span>
                <span className="data-label !text-[8px] bg-secondary-container/20 text-secondary px-2 py-0.5 rounded-sm font-bold">CORE_REF</span>
              </div>
              <div className="h-px bg-outline-variant/10 w-full"></div>
              <p className="text-[12px] text-slate-400 font-body leading-relaxed">
                Feedback as an 'engine' requires three levels: <span className="text-primary font-bold">Task</span>, <span className="text-secondary font-bold">Process</span>, and <span className="text-tertiary font-bold">Self-Regulation</span>. Station 10 automates these loops.
              </p>
            </div>
          </section>

          {/* Phase 3: Personalized Templates */}
          <section className="bg-surface-container-high p-8 rounded-sm shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="data-label !text-on-surface font-bold">Phase 3 Templates</h3>
              <span className="material-symbols-outlined text-primary text-base animate-spin-slow">auto_awesome</span>
            </div>
            <div className="space-y-4">
              {[
                { id: 'ALPHA', name: 'Structural Skepticism', color: 'primary' },
                { id: 'BETA', name: 'Narrative Flow & Coherence', color: 'secondary' }
              ].map(t => (
                <div key={t.id} className="group bg-surface-container-low p-4 border border-outline-variant/10 hover:border-primary/40 cursor-pointer transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="forensic-mono text-[9px] text-primary font-bold">SYN_TEMPLATE_{t.id}</span>
                    <span className="material-symbols-outlined text-[10px] text-slate-500 group-hover:text-primary transition-colors">open_in_new</span>
                  </div>
                  <p className="text-[13px] font-headline italic text-on-surface-variant group-hover:text-on-surface transition-colors">Focus: {t.name}</p>
                </div>
              ))}
              <div className="group glow-button p-4 cursor-pointer shadow-lg transform scale-[1.02] rounded-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="forensic-mono text-[9px] text-on-primary font-bold">SYN_TEMPLATE_OMEGA</span>
                  <span className="material-symbols-outlined text-sm text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <p className="text-[14px] font-headline italic text-on-primary font-bold">Active: Comprehensive Forensic Audit</p>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_rgba(79,219,200,0.6)]"></div>
                <span className="data-label !text-slate-500 font-bold">Engine Status: Optimizing...</span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Latency Histogram Footer */}
      <footer className="mt-4 grid grid-cols-12 gap-8 items-end">
        <div className="col-span-8">
          <div className="bg-surface-container-high h-[120px] relative overflow-hidden rounded-sm">
            <div className="absolute inset-0 p-4 pointer-events-none z-10">
              <span className="data-label !text-slate-500 font-bold opacity-50">ADAPTIVE_LOOP_LATENCY_HISTOGRAM</span>
            </div>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={96} initialDimension={{ width: 620, height: 120 }}>
              <BarChart data={histogramData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <Bar dataKey="h" radius={[2, 2, 0, 0]}>
                  {histogramData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index < 7 ? '#c0c1ff66' : index < 11 ? '#4fdbc866' : '#ffb95f66'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-4 flex flex-col justify-end h-full">
          <div className="bg-surface-container-low p-6 border-b-2 border-primary shadow-sm">
            <div className="flex justify-between items-center">
              <span className="data-label !text-slate-500 font-bold">Station Sync Offset</span>
              <span className="forensic-mono text-xl text-primary font-bold phosphor-glow">+0.0034ms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
