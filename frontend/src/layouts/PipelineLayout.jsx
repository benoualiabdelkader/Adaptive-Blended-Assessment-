import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../components/navigation/TopNav';
import StationNavigator from '../components/navigation/StationNavigator';
import CenterPanel from '../components/panels/CenterPanel';
import { stations, useStationStore } from '../store/stationStore';
import { cn } from '../lib/utils';

export default function PipelineLayout() {
  const { activeStationId, completedStations, interpretation, isBatchRunning } = useStationStore();
  const [isStationsOpen, setIsStationsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const MotionDiv = motion.div;

  const activeStation = useMemo(
    () => stations.find((station) => station.id === activeStationId) || stations[0],
    [activeStationId]
  );

  const notesPanel = (
    <div className="flex h-full flex-col">
      <div className="border-b border-outline-variant/20 px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="data-label !text-xs !tracking-[0.28em] text-primary">Interpretation</p>
            <h2 className="mt-2 text-xl font-semibold text-on-surface">Research notes</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Live synthesis for the current station.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsNotesOpen(false)}
            className="rounded-md border border-outline-variant/40 bg-surface-container-low px-3 text-outline transition-colors hover:text-primary"
            aria-label="Close research notes"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 custom-scrollbar">
        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="data-label !text-[11px] !tracking-[0.22em] text-primary">Research Notes</span>
            <span className="material-symbols-outlined text-[16px] text-outline">description</span>
          </div>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            {interpretation.notes || 'Awaiting behavioral data stream...'}
          </p>
        </section>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="data-label !text-[11px] !tracking-[0.22em] text-secondary">Key Findings</span>
            <span className="material-symbols-outlined text-[16px] text-outline">insights</span>
          </div>
          <div className="space-y-3">
            {(interpretation.findings?.length ? interpretation.findings : ['No findings mapped yet.']).map((finding, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg bg-surface-container-high/50 px-3 py-3">
                <span className="mt-0.5 inline-flex h-2 w-2 rounded-full bg-primary"></span>
                <p className="text-sm leading-relaxed text-on-surface-variant">{finding}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="data-label !text-[11px] !tracking-[0.22em] text-outline">Theoretical Basis</span>
            <span className="material-symbols-outlined text-[16px] text-outline">menu_book</span>
          </div>
          <div className="space-y-3">
            {(interpretation.references?.length
              ? interpretation.references
              : [{ author: 'No references yet', title: 'Reference mapping will appear once the station provides context.' }]
            ).map((reference, index) => (
              <div key={index} className="rounded-lg border border-outline-variant/15 bg-surface-container-high/35 px-3 py-3">
                <p className="forensic-mono text-xs uppercase text-primary">{reference.author}</p>
                <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{reference.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <TopNav
        onOpenStations={() => setIsStationsOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      <StationNavigator />

      <AnimatePresence>
        {isStationsOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-drawer fixed inset-0 z-50 lg:hidden"
            onClick={() => setIsStationsOpen(false)}
          >
            <MotionDiv
              initial={{ x: -28, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -28, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-[min(90vw,22rem)] border-r border-outline-variant/30 bg-surface-container"
              onClick={(event) => event.stopPropagation()}
            >
              <StationNavigator mobile onNavigate={() => setIsStationsOpen(false)} />
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNotesOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-drawer fixed inset-0 z-50 xl:hidden"
            onClick={() => setIsNotesOpen(false)}
          >
            <MotionDiv
              initial={{ x: 28, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 28, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-auto h-full w-[min(92vw,24rem)] border-l border-outline-variant/30 bg-surface-container"
              onClick={(event) => event.stopPropagation()}
            >
              {notesPanel}
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="flex pt-[var(--top-bar-height)]">
        <main
          id="main-content"
          className={cn(
            'min-h-[calc(100vh-var(--top-bar-height))] flex-1 overflow-y-auto bg-surface/70 pb-12 lg:ml-[var(--nav-width)]',
            isNotesOpen && 'xl:mr-[var(--notes-width)]',
            isBatchRunning && 'pointer-events-none opacity-85'
          )}
        >
          <div className="section-container">
            {/* Station context strip — minimal, per design spec */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-xs font-bold text-primary">
                  {String(activeStation.id).padStart(2, '0')}
                </span>
                <div>
                  <p className="data-label !text-xs !tracking-[0.28em] text-primary">Analysis Pipeline</p>
                  <p className="text-sm font-semibold text-on-surface">{activeStation.title}</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span className="rounded-full border border-secondary/25 bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary">
                  {completedStations.length}/{stations.length} complete
                </span>
                <button
                  type="button"
                  onClick={() => setIsNotesOpen(!isNotesOpen)}
                  className={cn(
                    'hidden items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors xl:flex',
                    isNotesOpen
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-outline-variant/35 bg-surface-container-low text-outline hover:border-primary/35 hover:text-primary'
                  )}
                >
                  <span className="material-symbols-outlined text-[14px]">notes</span>
                  Notes
                </button>
                <button
                  type="button"
                  onClick={() => setIsStationsOpen(true)}
                  className="flex items-center gap-1.5 rounded-md border border-outline-variant/35 bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-outline transition-colors hover:border-primary/35 hover:text-primary lg:hidden"
                >
                  <span className="material-symbols-outlined text-[14px]">menu</span>
                  Stations
                </button>
              </div>
            </div>

            <CenterPanel />
          </div>

          <AnimatePresence>
            {isBatchRunning && (
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 flex items-center justify-center bg-surface/72 px-4 backdrop-blur-sm"
              >
                <div className="app-shell-card w-full max-w-md px-8 py-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                  </div>
                  <h3 className="mt-6 font-headline text-3xl italic text-on-surface">Running batch analytics</h3>
                  <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                    Synchronizing all stations with the current cohort snapshot and preparing the forensic synthesis layer.
                  </p>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-surface-container-highest">
                    <MotionDiv
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      animate={{
                        width: ['0%', '100%'],
                        transition: { duration: 1.1, repeat: Infinity, ease: 'linear' }
                      }}
                    />
                  </div>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </main>

        {isNotesOpen && (
          <aside className="fixed right-0 top-[var(--top-bar-height)] hidden h-[calc(100vh-var(--top-bar-height))] w-[var(--notes-width)] border-l border-outline-variant/30 bg-surface-container xl:block">
            {notesPanel}
          </aside>
        )}
      </div>
    </div>
  );
}
