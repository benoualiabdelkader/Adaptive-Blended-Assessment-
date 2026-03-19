import React, { useEffect } from 'react';
import { useStationStore } from '../../store/stationStore';

export default function Station01_WritingTask() {
  const setInterpretation = useStationStore(state => state.setInterpretation);

  useEffect(() => {
    setInterpretation({
      notes: "The writing task anchors the entire analytical pipeline. Without precise parameter definitions here, lexical diversity metrics in Station 03 will lack a baseline for comparison.",
      findings: [
        "28 Students officially enrolled in the AW-III cohort",
        "Submission Rate: 84.2% (validated via Moodle batch)",
        "Study Active: BELHADJ BOUCHAIB UNIVERSITY (2025-2026)"
      ],
      references: [
        { author: "Graham (2006)", title: "Writing Instruction that Works" },
        { author: "Hyland (2015)", title: "Metadiscourse in Academic Writing" }
      ]
    });
  }, [setInterpretation]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Page Heading */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 data-label text-primary">
          <span className="w-1.5 h-1.5 bg-primary animate-pulse shadow-[0_0_8px_rgba(192,193,255,0.6)]"></span>
          STATION 01 / Task Definition
        </div>
        <h1 className="editorial-header text-3xl">Writing Task Context</h1>
      </header>

      {/* Top: Assignment Card */}
      <div className="card-base border-l-[6px] border-primary relative overflow-hidden group min-w-0">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <span className="material-symbols-outlined text-9xl">assignment</span>
        </div>
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="font-headline text-3xl text-on-surface italic leading-tight">Argumentative Paragraph — Moodle Assignment</h2>
            <p className="data-label !text-primary mt-2">Assignment ID: ANALYTIC-049-MP</p>
          </div>
          <div className="w-14 h-14 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-2xl">description</span>
          </div>
        </div>
        <blockquote className="bg-surface-container-low/60 backdrop-blur-sm p-10 border-l-4 border-primary italic font-headline text-2xl text-on-surface leading-relaxed shadow-inner">
          "Write the second body paragraph of an argumentative essay on: Online learning improves university education."
        </blockquote>
      </div>

      {/* Middle: Info Columns */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Column 1: Rubric */}
        <div className="space-y-4">
          <h3 className="data-label flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">checklist</span> Rubric Criteria
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Logical Flow', 'Evidence Quality', 'Counter-Argument', 'Syntactic Density'].map(item => (
              <span key={item} className="bg-secondary-container/10 text-secondary-container px-3 py-1 rounded-sm text-[10px] font-label border border-secondary-container/20 hover:bg-secondary-container/20 transition-colors cursor-default uppercase tracking-widest">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Column 2: Objectives */}
        <div className="space-y-4">
          <h3 className="data-label flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">target</span> Learning Objectives
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-on-surface/80 group">
              <span className="material-symbols-outlined text-primary text-lg transition-transform group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>check_box</span>
              <span className="group-hover:text-on-surface transition-colors font-body">Apply Toulmin model structures</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-on-surface/80 group">
              <span className="material-symbols-outlined text-primary text-lg transition-transform group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>check_box</span>
              <span className="group-hover:text-on-surface transition-colors font-body">Integrate primary source data</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-on-surface/80 group">
              <span className="material-symbols-outlined text-outline-variant text-lg">check_box_outline_blank</span>
              <span className="group-hover:text-on-surface transition-colors font-body">Address modal hedging</span>
            </li>
          </ul>
        </div>

        {/* Column 3: Timeline */}
        <div className="space-y-4">
          <h3 className="data-label flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">schedule</span> Assessment Context
          </h3>
          <div className="space-y-4">
            <div className="relative pl-6 border-l border-outline-variant/30">
              <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary-container"></div>
              <p className="data-label !text-primary !text-[9px]">Assigned</p>
              <p className="forensic-mono">Oct 12, 09:00 AM</p>
            </div>
            <div className="relative pl-6 border-l border-outline-variant/30">
              <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-outline-variant"></div>
              <p className="data-label !text-on-surface-variant !text-[9px]">Deadline</p>
              <p className="forensic-mono">Oct 19, 11:59 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-surface-container-high p-6 rounded-sm flex items-center justify-between border-t border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border border-surface bg-surface-container-highest flex items-center justify-center forensic-mono text-outline">ST</div>
            <div className="w-8 h-8 rounded-full border border-surface bg-surface-container-highest flex items-center justify-center forensic-mono text-outline">AL</div>
            <div className="w-8 h-8 rounded-full border border-surface bg-primary/20 flex items-center justify-center forensic-mono text-primary shadow-[0_0_10px_rgba(192,193,255,0.2)]">+26</div>
          </div>
          <div>
            <span className="block data-label !text-secondary font-bold">STUDY ACTIVE</span>
            <span className="block text-xl font-headline italic text-on-surface">28 Students Enrolled</span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end relative z-10">
          <span className="data-label !text-on-surface-variant block">Submission Rate</span>
          <span className="text-3xl forensic-mono text-primary font-bold phosphor-glow">84.2%</span>
        </div>
      </div>
    </div>
  );
}
