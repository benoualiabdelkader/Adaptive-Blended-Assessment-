import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Pipeline', icon: 'account_tree', to: '/pipeline' },
  { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
  { label: 'Students', icon: 'groups', to: '/students' },
  { label: 'Reports', icon: 'summarize', to: '/reports' }
];

const routeContext = {
  '/pipeline': { eyebrow: 'Analysis Pipeline', subtitle: 'Twelve-station forensic workflow' },
  '/dashboard': { eyebrow: 'Research Dashboard', subtitle: 'Cohort intelligence and action priorities' },
  '/students': { eyebrow: 'Student Registry', subtitle: 'Case-by-case tracking and intervention context' },
  '/reports': { eyebrow: 'Research Reports', subtitle: 'Exports, summaries, and dissertation-ready views' },
  '/import': { eyebrow: 'Data Intake', subtitle: 'Map, validate, and import source datasets' },
  '/settings': { eyebrow: 'Research Settings', subtitle: 'Thresholds, weights, and template controls' }
};

export default function TopNav({ onOpenStations, onOpenNotes, showNotesButton = true }) {
  const location = useLocation();
  const MotionDiv = motion.div;
  const context = routeContext[location.pathname] || routeContext['/pipeline'];

  return (
    <header className="fixed inset-x-0 top-0 z-50 glass-panel">
      <div className="mx-auto flex h-[var(--top-bar-height)] max-w-[1600px] items-center justify-between gap-4 px-4 md:px-6 xl:px-8">
        <div className="flex items-center gap-3 md:gap-6">
          <button
            type="button"
            onClick={onOpenStations}
            className="rounded-md border border-outline-variant/40 bg-surface-container-low px-3 text-outline transition-colors hover:text-primary lg:hidden"
            aria-label="Open navigation drawer"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/20 bg-primary/10 shadow-[0_0_24px_rgba(192,193,255,0.08)]">
              <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lens</span>
            </div>
            <div className="min-w-0">
              <p className="editorial-header !text-[1.9rem] !leading-none !tracking-tight text-primary">WriteLens</p>
              <div className="hidden md:block">
                <p className="data-label !text-[9px] !tracking-[0.35em] opacity-70">FORENSIC EDITORIAL STUDIO</p>
              </div>
            </div>
          </div>

          {/* Context hidden on pipeline to avoid dual-header conflict with main nav */}
          {location.pathname !== '/pipeline' && (
            <div className="hidden xl:flex xl:min-w-[320px] xl:flex-col">
              <span className="data-label !text-[9px] !tracking-[0.28em] text-primary/80">{context.eyebrow}</span>
              <p className="text-sm text-on-surface-variant">{context.subtitle}</p>
            </div>
          )}
        </div>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'relative flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-outline hover:text-on-surface'
              )}
            >
              {({ isActive }) => (
                <>
                  <span className={cn('material-symbols-outlined text-[18px]', isActive && 'scale-110')}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <MotionDiv
                      layoutId="topnav-active"
                      className="absolute inset-x-3 -bottom-[14px] h-[2px] rounded-full bg-primary"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-3 rounded-md border border-outline-variant/30 bg-surface-container-low px-3 md:flex">
            <span className="material-symbols-outlined text-[18px] text-outline">search</span>
            <input
              type="text"
              placeholder="Search analysis nodes..."
              className="w-56 bg-transparent text-sm text-on-surface outline-none placeholder:text-outline/60"
              aria-label="Search analysis nodes"
            />
            <span className="forensic-mono text-[10px] opacity-50">Ctrl+K</span>
          </div>

          <div className="hidden items-center gap-2 rounded-md border border-outline-variant/30 bg-surface-container-low px-3 py-2 sm:flex">
            <span className="inline-flex h-2 w-2 rounded-full bg-secondary shadow-[0_0_12px_rgba(79,219,200,0.65)]"></span>
            <span className="data-label !text-[9px] !tracking-[0.22em] text-secondary">System Sync 100%</span>
          </div>

          <button
            type="button"
            className="rounded-md border border-outline-variant/40 bg-surface-container-low px-3 text-outline transition-colors hover:text-primary"
            aria-label="View notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          <NavLink
            to="/import"
            className="rounded-md border border-outline-variant/40 bg-surface-container-low px-3 text-outline transition-colors hover:text-primary"
            aria-label="Open import workspace"
          >
            <span className="material-symbols-outlined text-[20px]">upload</span>
          </NavLink>

          {showNotesButton && (
            <button
              type="button"
              onClick={onOpenNotes}
              className="rounded-md border border-outline-variant/40 bg-surface-container-low px-3 text-outline transition-colors hover:text-primary"
              aria-label="Open research notes"
            >
              <span className="material-symbols-outlined text-[20px]">notes</span>
            </button>
          )}

          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-full border border-outline-variant/30 bg-surface-container-low pl-2 pr-4 text-left transition-colors hover:border-primary/40"
            aria-label="Open settings workspace"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-surface-container-high">
              <span className="material-symbols-outlined text-[20px] text-primary">settings</span>
            </span>
            <span className="hidden md:block">
              <span className="block text-sm font-semibold text-on-surface">Research Settings</span>
              <span className="data-label !text-[8px] !tracking-[0.24em] opacity-60">CONTROL SURFACE</span>
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
