import React from 'react';
import { useStationStore, stations } from '../../store/stationStore';

export default function RightPanel() {
  const { activeStationId } = useStationStore();
  const currentStation = stations.find((station) => station.id === activeStationId);

  return (
    <>
      <div className="rounded-sm border-t border-primary/20 bg-surface-container p-6">
        <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          Key Finding
        </p>
        <p className="font-headline text-lg leading-relaxed italic text-on-surface">
          {activeStationId === 1
            ? 'The writing task anchors the entire analytical pipeline'
            : activeStationId === 2
              ? 'Three data streams combined = full picture of learner'
              : `Analysis for ${currentStation?.title} yielded significant patterns.`}
        </p>
        <div className="mt-6 border-t border-outline-variant/10 pt-6">
          <p className="mb-1 font-mono text-[9px] uppercase text-on-surface/40">Theory ref</p>
          <p className="font-body text-xs font-semibold text-on-surface">
            {activeStationId === 1 ? 'Graham (2006)' : 'Siemens & Gasevic (2012)'}
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-sm border border-tertiary/20 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tertiary/10">
            <span className="material-symbols-outlined text-tertiary">engineering</span>
          </div>
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-tertiary">Professor Action</p>
            <p className="font-body text-xs leading-relaxed text-on-surface/80">
              {activeStationId === 1
                ? 'Define task parameters before importing Moodle data.'
                : 'Verify all variables are imported before continuing the structural analysis.'}
            </p>
            <button className="mt-4 border border-tertiary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-tertiary transition-colors hover:bg-tertiary/10">
              {activeStationId === 1 ? 'Configure Task' : 'Verify Import'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6">
        <div className="flex items-end justify-between border-b border-outline-variant/10 pb-2">
          <span className="font-mono text-[9px] uppercase text-on-surface/40">Throughput</span>
          <span className="font-mono text-xs text-primary">1.2 MB/s</span>
        </div>
        <div className="flex items-end justify-between border-b border-outline-variant/10 pb-2">
          <span className="font-mono text-[9px] uppercase text-on-surface/40">Latency</span>
          <span className="font-mono text-xs text-secondary">42ms</span>
        </div>
        <div className="flex items-end justify-between border-b border-outline-variant/10 pb-2">
          <span className="font-mono text-[9px] uppercase text-on-surface/40">Integrity</span>
          <span className="font-mono text-xs text-tertiary">99.8%</span>
        </div>
      </div>
    </>
  );
}
