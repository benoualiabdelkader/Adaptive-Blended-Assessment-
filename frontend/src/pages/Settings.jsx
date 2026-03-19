import React, { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import ResearchShell from '../layouts/ResearchShell';
import { db } from '../store/db';
import { defaultFeedbackTemplates, defaultStudySettings, defaultThresholds } from '../lib/researchConfig';

function sanitizeRows(rows) {
  return rows.map(({ id: _id, ...rest }) => rest);
}

export default function Settings() {
  const [thresholdPatches, setThresholdPatches] = useState({});
  const [settingPatches, setSettingPatches] = useState({});
  const [templatePatches, setTemplatePatches] = useState({});
  const [status, setStatus] = useState({ tone: 'idle', text: 'Configuration is synchronized with the local database.' });

  const snapshot = useLiveQuery(async () => {
    const [thresholds, settings, templates] = await Promise.all([
      db.rule_definitions.toArray(),
      db.system_settings.toArray(),
      db.feedback_templates.toArray()
    ]);

    return {
      thresholds: thresholds.length ? thresholds : defaultThresholds,
      settings: settings.length ? settings : defaultStudySettings,
      templates: templates.length ? templates : defaultFeedbackTemplates
    };
  }, []);

  const thresholdRows = snapshot?.thresholds ?? defaultThresholds;
  const settingRows = snapshot?.settings ?? defaultStudySettings;
  const templateRows = snapshot?.templates ?? defaultFeedbackTemplates;

  const groupedThresholds = useMemo(() => {
    return thresholdRows.reduce((acc, row) => {
      const group = row.stream || 'Other';
      acc[group] = acc[group] || [];
      acc[group].push(row);
      return acc;
    }, {});
  }, [thresholdRows]);

  const sidePanel = (
    <div className="space-y-8">
      <div className="border-b border-outline-variant/10 pb-6">
        <h2 className="font-label text-[11px] uppercase tracking-widest text-primary">Settings Control</h2>
        <p className="text-[10px] text-outline">Thresholds, weights, and feedback templates</p>
      </div>

      <section className="space-y-3">
        <div className="rounded-sm border border-outline-variant/15 bg-surface-container p-4">
          <p className="font-label text-[10px] uppercase tracking-widest text-outline">Threshold Count</p>
          <p className="mt-2 font-mono text-3xl text-primary">{thresholdRows.length}</p>
        </div>
        <div className="rounded-sm border border-outline-variant/15 bg-surface-container p-4">
          <p className="font-label text-[10px] uppercase tracking-widest text-outline">Feedback Templates</p>
          <p className="mt-2 font-mono text-3xl text-secondary">{templateRows.length}</p>
        </div>
        <div className="rounded-sm border border-outline-variant/15 bg-surface-container p-4">
          <p className="font-label text-[10px] uppercase tracking-widest text-outline">Study Settings</p>
          <p className="mt-2 font-mono text-3xl text-tertiary">{settingRows.length}</p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Save Status</span>
          <span className="material-symbols-outlined text-sm text-outline">settings</span>
        </div>
        <div className="rounded-sm border border-outline-variant/15 bg-surface-container p-4">
          <p className={`text-sm ${
            status.tone === 'success'
              ? 'text-secondary'
              : status.tone === 'error'
                ? 'text-[color:var(--error)]'
                : 'text-on-surface-variant'
          }`}>
            {status.text}
          </p>
        </div>
      </section>
    </div>
  );

  async function saveAll() {
    try {
      const mergedThresholds = thresholdRows.map((row) => ({ ...row, ...(thresholdPatches[row.key] ?? {}) }));
      const mergedSettings = settingRows.map((row) => ({ ...row, ...(settingPatches[row.key] ?? {}) }));
      const mergedTemplates = templateRows.map((row, index) => ({
        ...row,
        ...(templatePatches[row.intent || index] ?? {})
      }));

      await db.transaction('rw', db.rule_definitions, db.system_settings, db.feedback_templates, async () => {
        await db.rule_definitions.clear();
        await db.system_settings.clear();
        await db.feedback_templates.clear();
        await db.rule_definitions.bulkAdd(sanitizeRows(mergedThresholds));
        await db.system_settings.bulkAdd(sanitizeRows(mergedSettings));
        await db.feedback_templates.bulkAdd(sanitizeRows(mergedTemplates));
      });

      setThresholdPatches({});
      setSettingPatches({});
      setTemplatePatches({});
      setStatus({ tone: 'success', text: 'All configuration sections were saved successfully.' });
    } catch (error) {
      setStatus({ tone: 'error', text: `Save failed: ${error.message}` });
    }
  }

  async function resetDefaults() {
    try {
      await db.transaction('rw', db.rule_definitions, db.system_settings, db.feedback_templates, async () => {
        await db.rule_definitions.clear();
        await db.system_settings.clear();
        await db.feedback_templates.clear();
        await db.rule_definitions.bulkAdd(defaultThresholds);
        await db.system_settings.bulkAdd(defaultStudySettings);
        await db.feedback_templates.bulkAdd(defaultFeedbackTemplates);
      });

      setThresholdPatches({});
      setSettingPatches({});
      setTemplatePatches({});
      setStatus({ tone: 'success', text: 'Defaults restored for thresholds, settings, and feedback templates.' });
    } catch (error) {
      setStatus({ tone: 'error', text: `Reset failed: ${error.message}` });
    }
  }

  return (
    <ResearchShell sidePanel={sidePanel} mainClassName="max-w-[1540px]">
      <header className="mb-10">
        <p className="data-label text-primary">System Settings</p>
        <h1 className="mt-3 font-headline text-4xl italic text-on-surface md:text-5xl">Research Configuration Console</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-on-surface-variant md:text-base">
          Tune threshold definitions, engagement weights, profile boundaries, and feedback templates from one place, with all changes saved locally to IndexedDB.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveAll}
          className="rounded-md bg-gradient-to-r from-primary to-primary-container px-5 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-[color:var(--on-primary-fixed)]"
        >
          Save All Changes
        </button>
        <button
          type="button"
          onClick={resetDefaults}
          className="rounded-md border border-outline-variant/30 bg-surface-container-low px-5 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface"
        >
          Restore Defaults
        </button>
      </div>

      <section className="mb-8 app-shell-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-outline">Study Information & Weights</p>
            <h2 className="mt-1 text-2xl font-semibold text-on-surface">Core Settings</h2>
          </div>
          <span className="material-symbols-outlined text-2xl text-secondary">tune</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settingRows.map((row) => {
            const value = settingPatches[row.key]?.value ?? row.value ?? '';
            return (
              <label key={row.key} className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-4">
                <p className="font-label text-[10px] uppercase tracking-widest text-outline">{row.key.replaceAll('_', ' ')}</p>
                <input
                  type="text"
                  value={value}
                  onChange={(event) =>
                    setSettingPatches((current) => ({
                      ...current,
                      [row.key]: { ...row, value: event.target.value }
                    }))
                  }
                  className="mt-3 w-full bg-surface px-3 py-2 text-sm text-on-surface outline-none"
                />
              </label>
            );
          })}
        </div>
      </section>

      <section className="mb-8 app-shell-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-outline">Threshold Editor</p>
            <h2 className="mt-1 text-2xl font-semibold text-on-surface">All 16 Diagnostic Thresholds</h2>
          </div>
          <span className="material-symbols-outlined text-2xl text-primary">rule_settings</span>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedThresholds).map(([group, rows]) => (
            <div key={group} className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-5">
              <div className="mb-4">
                <p className="font-label text-[10px] uppercase tracking-widest text-primary">{group} Stream</p>
                <h3 className="mt-1 text-lg font-semibold text-on-surface">{rows.length} threshold definitions</h3>
              </div>

              <div className="space-y-4">
                {rows.map((row) => {
                  const patch = thresholdPatches[row.key] ?? {};
                  return (
                    <div key={row.key} className="grid grid-cols-1 gap-3 rounded-xl border border-outline-variant/10 bg-surface-container p-4 xl:grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr]">
                      <div>
                        <p className="font-label text-[10px] uppercase tracking-widest text-outline">{row.name}</p>
                        <p className="mt-2 text-xs text-on-surface-variant">{row.reference}</p>
                      </div>
                      <input
                        type="text"
                        value={patch.threshold_value ?? row.threshold_value ?? ''}
                        onChange={(event) =>
                          setThresholdPatches((current) => ({
                            ...current,
                            [row.key]: { ...row, ...patch, threshold_value: event.target.value }
                          }))
                        }
                        className="bg-surface px-3 py-2 text-sm text-on-surface outline-none"
                      />
                      <input
                        type="text"
                        value={patch.rule ?? row.rule ?? ''}
                        onChange={(event) =>
                          setThresholdPatches((current) => ({
                            ...current,
                            [row.key]: { ...row, ...patch, rule: event.target.value }
                          }))
                        }
                        className="bg-surface px-3 py-2 text-sm text-on-surface outline-none"
                      />
                      <input
                        type="text"
                        value={patch.reference ?? row.reference ?? ''}
                        onChange={(event) =>
                          setThresholdPatches((current) => ({
                            ...current,
                            [row.key]: { ...row, ...patch, reference: event.target.value }
                          }))
                        }
                        className="bg-surface px-3 py-2 text-sm text-on-surface outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="app-shell-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-outline">Feedback Templates</p>
            <h2 className="mt-1 text-2xl font-semibold text-on-surface">Adaptive Intervention Messaging</h2>
          </div>
          <span className="material-symbols-outlined text-2xl text-tertiary">text_snippet</span>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {templateRows.map((template, index) => {
            const patch = templatePatches[template.intent || index] ?? {};
            return (
              <div key={template.intent || index} className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-5">
                <input
                  type="text"
                  value={patch.title ?? template.title ?? ''}
                  onChange={(event) =>
                    setTemplatePatches((current) => ({
                      ...current,
                      [template.intent || index]: { ...template, ...patch, title: event.target.value }
                    }))
                  }
                  className="w-full bg-transparent font-headline text-2xl italic text-on-surface outline-none"
                />
                <p className="mt-2 font-label text-[10px] uppercase tracking-widest text-primary">{template.intent}</p>
                <textarea
                  value={patch.content_structure ?? template.content_structure ?? ''}
                  onChange={(event) =>
                    setTemplatePatches((current) => ({
                      ...current,
                      [template.intent || index]: { ...template, ...patch, content_structure: event.target.value }
                    }))
                  }
                  rows={5}
                  className="mt-4 w-full resize-y bg-surface px-3 py-3 text-sm leading-relaxed text-on-surface outline-none"
                />
              </div>
            );
          })}
        </div>
      </section>
    </ResearchShell>
  );
}
