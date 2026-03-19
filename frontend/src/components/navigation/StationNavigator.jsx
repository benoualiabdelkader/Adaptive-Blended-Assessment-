import React from 'react';
import { useStationStore, stations } from '../../store/stationStore';
import { cn } from '../../lib/utils';

export default function StationNavigator({ mobile = false, className, onNavigate }) {
  const {
    activeStationId,
    completedStations,
    setActiveStation,
    isBatchRunning,
    runBatchProcess
  } = useStationStore();

  const handleNavigate = (stationId) => {
    setActiveStation(stationId);
    onNavigate?.(stationId);
  };

  const ContainerTag = mobile ? 'div' : 'aside';
  const completionPct = Math.round((completedStations.length / stations.length) * 100);

  return (
    <ContainerTag
      className={cn(
        mobile
          ? 'flex h-full flex-col'
          : 'fixed left-0 top-[var(--top-bar-height)] hidden h-[calc(100vh-var(--top-bar-height))] w-[var(--nav-width)] flex-col border-r border-outline-variant/30 bg-surface-container-low/95 lg:flex',
        className
      )}
    >
      {/* Header — no redundant CURRENT box */}
      <div className="border-b border-outline-variant/20 px-5 py-4">
        <p className="data-label !text-[9px] !tracking-[0.28em] text-primary">Analysis Pipeline</p>
        <h2 className="mt-1.5 text-base font-semibold text-on-surface">Forensic Stations</h2>
        {/* Compact progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="forensic-mono text-[10px] text-outline">{completedStations.length}/12</span>
        </div>
      </div>

      {/* Station list with vertical connector */}
      <nav
        className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar"
        aria-label="Station navigation"
      >
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-outline-variant/20" />

          <div className="space-y-0.5">
            {stations.map((station) => {
              const isActive = station.id === activeStationId;
              const isCompleted = completedStations.includes(station.id);

              return (
                <button
                  key={station.id}
                  type="button"
                  disabled={isBatchRunning}
                  onClick={() => handleNavigate(station.id)}
                  className={cn(
                    'group relative w-full rounded-lg px-3 py-2.5 text-left transition-all',
                    isActive
                      ? 'bg-primary/10'
                      : 'hover:bg-surface-container-high/50',
                    isBatchRunning && 'cursor-not-allowed opacity-50'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div className="flex items-center gap-3">
                    {/* Number badge */}
                    <span
                      className={cn(
                        'relative z-10 flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all',
                        isActive
                          ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(99,102,241,0.7)]'
                          : isCompleted
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-surface-container-high text-outline'
                      )}
                    >
                      {isCompleted && !isActive ? (
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check
                        </span>
                      ) : (
                        String(station.id).padStart(2, '0')
                      )}
                    </span>

                    {/* Label */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'text-[12px] font-semibold leading-tight truncate',
                          isActive
                            ? 'text-on-surface'
                            : isCompleted
                            ? 'text-secondary'
                            : 'text-on-surface-variant'
                        )}
                      >
                        {station.title}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-outline">
                        {station.description}
                      </p>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Run batch button */}
      <div className="border-t border-outline-variant/20 px-4 py-4">
        <button
          type="button"
          onClick={runBatchProcess}
          disabled={isBatchRunning}
          className={cn(
            'flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-on-primary-fixed shadow-[0_8px_24px_rgba(99,102,241,0.30)] transition-all hover:brightness-110 active:scale-[0.98]',
            isBatchRunning && 'cursor-not-allowed opacity-60 saturate-50'
          )}
        >
          <span className={cn('material-symbols-outlined text-[18px]', isBatchRunning && 'animate-spin')}>
            {isBatchRunning ? 'sync' : 'rocket_launch'}
          </span>
          {isBatchRunning ? 'Processing...' : 'Run Batch Process'}
        </button>
      </div>
    </ContainerTag>
  );
}
