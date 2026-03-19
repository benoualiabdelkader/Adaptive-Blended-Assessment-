import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TopNav from '../components/navigation/TopNav';
import { cn } from '../lib/utils';

const pageLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  { label: 'Students', to: '/students', icon: 'groups' },
  { label: 'Pipeline', to: '/pipeline', icon: 'account_tree' },
  { label: 'Reports', to: '/reports', icon: 'summarize' },
  { label: 'Import', to: '/import', icon: 'upload_file' },
  { label: 'Settings', to: '/settings', icon: 'tune' }
];

export default function ResearchShell({ children, sidePanel, mainClassName }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const hasSidePanel = Boolean(sidePanel);
  const MotionDiv = motion.div;
  const MotionAside = motion.aside;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <TopNav
        onOpenStations={() => setIsNavOpen(true)}
        onOpenNotes={hasSidePanel ? () => setIsNotesOpen(true) : undefined}
        showNotesButton={hasSidePanel}
      />

      <AnimatePresence>
        {isNavOpen && (
          <MotionDiv
            className="mobile-drawer fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0"
              aria-label="Close navigation drawer"
              onClick={() => setIsNavOpen(false)}
            />
            <MotionAside
              className="absolute left-0 top-0 h-full w-[min(86vw,22rem)] border-r border-outline-variant/25 bg-surface-container-low px-5 py-6"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="editorial-header !text-[2rem] text-primary">WriteLens</p>
                  <p className="data-label !text-xs !tracking-[0.26em] opacity-70">WORKSPACE ROUTES</p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-outline-variant/40 bg-surface-container px-3 text-outline"
                  onClick={() => setIsNavOpen(false)}
                  aria-label="Close navigation drawer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <nav className="space-y-2" aria-label="Workspace navigation">
                {pageLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsNavOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-lg border px-4 py-4 transition-colors',
                        isActive
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'border-outline-variant/20 bg-surface-container text-on-surface-variant hover:text-on-surface'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                          <span className="font-label text-[11px] uppercase tracking-[0.2em]">{item.label}</span>
                        </span>
                        <span className={cn('material-symbols-outlined text-[18px]', isActive && 'text-primary')}>
                          arrow_outward
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </MotionAside>
          </MotionDiv>
        )}
      </AnimatePresence>

      {hasSidePanel && (
        <AnimatePresence>
          {isNotesOpen && (
            <MotionDiv
              className="mobile-drawer fixed inset-0 z-50 xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                className="absolute inset-0"
                aria-label="Close details panel"
                onClick={() => setIsNotesOpen(false)}
              />
              <MotionAside
                className="absolute right-0 top-0 h-full w-[min(92vw,25rem)] overflow-y-auto border-l border-outline-variant/25 bg-surface-container-low px-5 py-6 custom-scrollbar"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              >
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    className="rounded-md border border-outline-variant/40 bg-surface-container px-3 text-outline"
                    onClick={() => setIsNotesOpen(false)}
                    aria-label="Close details panel"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                {sidePanel}
              </MotionAside>
            </MotionDiv>
          )}
        </AnimatePresence>
      )}

      <main
        id="main-content"
        className={cn(
          'mx-auto min-h-screen max-w-[1600px] px-4 pb-16 pt-[calc(var(--top-bar-height)+1.5rem)] md:px-6 xl:px-8',
          hasSidePanel && 'xl:pr-[21.5rem]',
          mainClassName
        )}
      >
        {children}
      </main>

      {hasSidePanel && (
        <aside className="fixed right-0 top-[var(--top-bar-height)] hidden h-[calc(100vh-var(--top-bar-height))] w-[20rem] overflow-y-auto border-l border-outline-variant/15 bg-surface-container-low px-5 py-6 xl:block custom-scrollbar">
          {sidePanel}
        </aside>
      )}
    </>
  );
}
