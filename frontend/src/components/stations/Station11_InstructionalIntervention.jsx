import React, { useEffect } from 'react';
import { useStationStore } from '../../store/stationStore';

export default function Station11_InstructionalIntervention() {
  const setInterpretation = useStationStore(state => state.setInterpretation);

  useEffect(() => {
    setInterpretation({
      notes: "Deployment of targeted pedagogical mechanisms based on forensic profiling. Priority Alpha (At-Risk) requires bi-weekly clinical conversations to identify cognitive blockages.",
      findings: [
        "Priority Alpha: At-Risk (Retention Prob. 42.8%)",
        "Priority Beta: Strategic (Growth Velocity 1.2x)",
        "Intervention Confidence: 0.94 (σ=0.02)"
      ],
      references: [
        { author: "Zimmerman (2008)", title: "Investigating self-regulation and motivation: Historical background" },
        { author: "Hattie (2009)", title: "Visible Learning" }
      ]
    });
  }, [setInterpretation]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="mb-12 border-l-4 border-primary pl-8">
        <div className="flex items-center gap-4 mb-3">
          <span className="data-label text-secondary bg-secondary/10 px-3 py-1 rounded-sm font-bold tracking-widest">PHASE 04</span>
          <span className="data-label text-outline font-bold">Intervention Core</span>
        </div>
        <h1 className="editorial-header text-3xl phosphor-glow">Instructional Intervention</h1>
        <p className="font-body text-on-surface-variant mt-6 max-w-3xl leading-relaxed text-sm italic">
          Deployment of targeted pedagogical mechanisms based on forensic profiling of student engagement vectors. 
          Strategic mapping of feedback modalities to learner archetypes.
        </p>
      </header>

      {/* Intervention Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card: At-Risk */}
        <section className="bg-surface-container p-10 rounded-sm relative overflow-hidden group border border-error/5 hover:bg-surface-container-high transition-all">
          <div className="absolute top-0 right-0 p-4 data-label !text-error opacity-40 font-bold">PRIORITY: ALPHA</div>
          <h3 className="font-headline text-3xl italic text-error mb-8">At-Risk Profile</h3>
          <div className="space-y-8">
            <div className="flex gap-5 group/item">
              <span className="material-symbols-outlined text-error pt-1 group-hover/item:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <div>
                <p className="data-label !text-outline mb-2 font-bold opacity-60">Pedagogical Action 01</p>
                <h4 className="font-body font-bold text-on-surface text-lg">1-on-1 Clinical Conversations</h4>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed italic opacity-80">Bi-weekly qualitative assessment to identify cognitive blockages and motivational stressors.</p>
              </div>
            </div>
            <div className="flex gap-5 group/item">
              <span className="material-symbols-outlined text-error pt-1 group-hover/item:scale-110 transition-transform">rebase_edit</span>
              <div>
                <p className="data-label !text-outline mb-2 font-bold opacity-60">Pedagogical Action 02</p>
                <h4 className="font-body font-bold text-on-surface text-lg">Scaffolded Logic Workshops</h4>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed italic opacity-80">Reduced-complexity modules focused on foundational mental models and structural alignment.</p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-outline-variant/10 flex items-center justify-between">
            <span className="data-label !text-on-surface-variant font-bold">Retention Probability</span>
            <span className="forensic-mono text-xl text-error font-bold">42.8%</span>
          </div>
        </section>

        {/* Profile Card: Strategic */}
        <section className="bg-surface-container p-10 rounded-sm relative overflow-hidden group border border-secondary/5 hover:bg-surface-container-high transition-all">
          <div className="absolute top-0 right-0 p-4 data-label !text-secondary opacity-40 font-bold">PRIORITY: BETA</div>
          <h3 className="font-headline text-3xl italic text-secondary mb-8">Strategic Profile</h3>
          <div className="space-y-8">
            <div className="flex gap-5 group/item">
              <span className="material-symbols-outlined text-secondary pt-1 group-hover/item:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
              <div>
                <p className="data-label !text-outline mb-2 font-bold opacity-60">Pedagogical Action 01</p>
                <h4 className="font-body font-bold text-on-surface text-lg">Collaborative Peer Synthesis</h4>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed italic opacity-80">Small-group dynamics to leverage existing metacognitive strengths and cross-draft peer review.</p>
              </div>
            </div>
            <div className="flex gap-5 group/item">
              <span className="material-symbols-outlined text-secondary pt-1 group-hover/item:scale-110 transition-transform">insights</span>
              <div>
                <p className="data-label !text-outline mb-2 font-bold opacity-60">Pedagogical Action 02</p>
                <h4 className="font-body font-bold text-on-surface text-lg">Advanced Synthesis Labs</h4>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed italic opacity-80">Inquiry-based challenges requiring high-order cross-domain mapping and theoretical depth.</p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-outline-variant/10 flex items-center justify-between">
            <span className="data-label !text-on-surface-variant font-bold">Growth Velocity</span>
            <span className="forensic-mono text-xl text-secondary font-bold shadow-secondary/20 drop-shadow-sm">1.2x</span>
          </div>
        </section>
      </div>

      {/* Intervention Sequencing (Timeline) */}
      <section className="bg-surface-container-high p-12 rounded-sm border-l border-primary/20 shadow-xl group">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <h3 className="font-headline text-2xl text-primary italic mb-2 tracking-tight">Intervention Sequencing</h3>
            <p className="data-label !text-on-surface-variant font-bold">Linear Execution Pipeline</p>
          </div>
          <div className="flex gap-6">
            <div className="bg-surface/40 px-6 py-3 border border-outline-variant/10 flex flex-col items-end">
              <p className="data-label !text-outline font-bold mb-1">Active Cohort</p>
              <p className="forensic-mono font-bold text-lg text-on-surface tracking-widest">N=142</p>
            </div>
            <div className="bg-surface/40 px-6 py-3 border border-outline-variant/10 flex flex-col items-end">
              <p className="data-label !text-outline font-bold mb-1">Expected Success</p>
              <p className="forensic-mono font-bold text-lg text-secondary tracking-widest uppercase">88.4%</p>
            </div>
          </div>
        </div>

        {/* Timeline visualization */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="absolute top-[22px] left-0 right-0 h-[2px] bg-surface-container-highest hidden md:block opacity-20"></div>
          
          {[
            { tag: 'Week 01-02', name: 'Diagnostic Sweep', active: true },
            { tag: 'Week 03-05', name: 'Targeted Action', active: false },
            { tag: 'Week 06-08', name: 'Synthesis Assm.', active: false },
            { tag: 'Week 09', name: 'Forensic Audit', active: false }
          ].map((step, i) => (
            <div key={i} className={`relative transition-all duration-500 ${step.active ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'}`}>
              <div className="h-10 w-full flex items-center mb-6 relative">
                 <div className={`w-4 h-4 rounded-full border-2 transition-all ${step.active ? 'bg-primary border-primary shadow-[0_0_15px_rgba(192,193,255,0.6)]' : 'bg-surface-container border-outline-variant/30'}`}></div>
              </div>
              <p className={`data-label mb-2 italic font-bold ${step.active ? 'text-primary' : 'text-outline'}`}>{step.tag}</p>
              <h5 className="font-headline font-bold text-base text-on-surface tracking-tight italic">{step.name}</h5>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
