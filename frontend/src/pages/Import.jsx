import React, { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import ResearchShell from '../layouts/ResearchShell';
import { importService } from '../services/importService';
import { db } from '../store/db';

const TABLE_CONFIGS = {
  moodle_logs: {
    label: 'Moodle Logs',
    description: 'Process data such as logins, resource access, timestamps, and durations.',
    fields: ['student_id', 'action_type', 'timestamp', 'duration']
  },
  help_seeking_messages: {
    label: 'Help-Seeking Messages',
    description: 'Private support requests and communication traces.',
    fields: ['student_id', 'message_type', 'timestamp', 'content']
  },
  students: {
    label: 'Students',
    description: 'Student registry rows with code, name, and active status.',
    fields: ['student_code', 'name', 'status']
  },
  rubric_scores: {
    label: 'Rubric Scores',
    description: 'Product scores across the five writing dimensions.',
    fields: ['student_id', 'draft_number', 'grammar_acc', 'lex_range', 'org', 'cohesion', 'arg', 'total']
  },
  drafts: {
    label: 'Drafts',
    description: 'Submitted writing artifacts with text content and submission time.',
    fields: ['student_id', 'draft_number', 'title', 'text_content', 'submitted_at']
  },
  text_features: {
    label: 'NLP Features',
    description: 'Computed text analytics metrics such as TTR and error density.',
    fields: ['student_id', 'draft_id', 'ttr', 'error_density', 'cohesion_markers', 'complexity']
  }
};

function normalizeValue(field, value) {
  if (value === undefined || value === null || value === '') {
    if (field === 'status') {
      return 'active';
    }
    if (field === 'timestamp' || field === 'submitted_at') {
      return new Date().toISOString();
    }
    return value ?? '';
  }

  if (['student_id', 'draft_id', 'draft_number', 'duration', 'grammar_acc', 'lex_range', 'org', 'cohesion', 'arg', 'total', 'cohesion_markers'].includes(field)) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (['ttr', 'error_density', 'complexity'].includes(field)) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : Number(parsed.toFixed(3));
  }

  if (field === 'timestamp' || field === 'submitted_at') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }

  if (field === 'status') {
    return String(value).toLowerCase();
  }

  return value;
}

function buildMappedRows(rawRows, targetTable, mapping) {
  const config = TABLE_CONFIGS[targetTable];
  if (!config) {
    return [];
  }

  const mappedRows = importService.mapColumns(rawRows, mapping);
  return mappedRows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([field, value]) => [field, normalizeValue(field, value)])
    )
  );
}

export default function Import() {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rawRows, setRawRows] = useState([]);
  const [fileHeaders, setFileHeaders] = useState([]);
  const [targetTable, setTargetTable] = useState('moodle_logs');
  const [mapping, setMapping] = useState({});
  const [status, setStatus] = useState({ tone: 'idle', text: 'Awaiting source file.' });
  const [isImporting, setIsImporting] = useState(false);

  const dbCounts = useLiveQuery(async () => {
    const tables = Object.keys(TABLE_CONFIGS);
    const counts = await Promise.all(tables.map((table) => db[table].count()));
    return Object.fromEntries(tables.map((table, index) => [table, counts[index]]));
  }, []);

  const mappedRows = useMemo(
    () => buildMappedRows(rawRows, targetTable, mapping),
    [mapping, rawRows, targetTable]
  );

  const previewRows = mappedRows.slice(0, 5);
  const validation = mappedRows.length ? importService.validateImport(mappedRows) : { valid: false, message: 'No mapped rows yet.' };

  const sidePanel = (
    <div className="space-y-8">
      <div className="border-b border-outline-variant/10 pb-6">
        <h2 className="font-label text-[11px] uppercase tracking-widest text-primary">Import Workflow</h2>
        <p className="text-[10px] text-outline">Five-step ingestion wizard</p>
      </div>

      <section className="space-y-3">
        {[
          'Upload source file',
          'Choose target table',
          'Map source columns',
          'Validate and preview',
          'Commit to IndexedDB'
        ].map((label, index) => {
          const current = index + 1 === step;
          const complete = index + 1 < step;
          return (
            <div
              key={label}
              className={`rounded-sm border px-4 py-3 ${
                current
                  ? 'border-primary/30 bg-primary/10'
                  : complete
                    ? 'border-secondary/20 bg-secondary/10'
                    : 'border-outline-variant/15 bg-surface-container'
              }`}
            >
              <p className="font-label text-[10px] uppercase tracking-widest text-outline">Step {index + 1}</p>
              <p className={`mt-1 text-sm ${current ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Current Status</span>
          <span className="material-symbols-outlined text-sm text-outline">monitoring</span>
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

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-label text-[10px] uppercase tracking-widest text-outline">Table Footprint</span>
          <span className="material-symbols-outlined text-sm text-outline">database</span>
        </div>
        <div className="space-y-2">
          {Object.entries(TABLE_CONFIGS).map(([key, config]) => (
            <div key={key} className="rounded-sm border border-outline-variant/15 bg-surface-container px-4 py-3">
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface">{config.label}</p>
              <p className="mt-1 font-mono text-xs text-primary">{dbCounts?.[key] ?? 0} rows</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  async function handleFileSelection(file) {
    if (!file) {
      return;
    }

    try {
      setSelectedFile(file);
      const lower = file.name.toLowerCase();
      const parsedRows = lower.endsWith('.csv')
        ? await importService.parseCSV(file)
        : await importService.parseExcel(file);

      const headers = parsedRows.length ? Object.keys(parsedRows[0]) : [];
      const defaultFields = TABLE_CONFIGS[targetTable].fields;
      const nextMapping = Object.fromEntries(
        defaultFields.map((field, index) => [field, headers[index] ?? ''])
      );

      setRawRows(parsedRows);
      setFileHeaders(headers);
      setMapping(nextMapping);
      setStep(2);
      setStatus({ tone: 'success', text: `${parsedRows.length} rows loaded from ${file.name}.` });
    } catch (error) {
      setStatus({ tone: 'error', text: `Import parsing failed: ${error.message}` });
    }
  }

  function handleTargetChange(nextTable) {
    setTargetTable(nextTable);
    const fields = TABLE_CONFIGS[nextTable].fields;
    setMapping((current) =>
      Object.fromEntries(fields.map((field, index) => [field, current[field] ?? fileHeaders[index] ?? '']))
    );
    setStep(Math.max(step, 3));
  }

  async function handleImport() {
    try {
      setIsImporting(true);
      const rowsToSave = buildMappedRows(rawRows, targetTable, mapping).filter((row) =>
        Object.values(row).some((value) => value !== '' && value !== null && value !== undefined)
      );

      const result = await importService.saveToDatabase(rowsToSave, targetTable);
      if (!result.success) {
        throw new Error(result.error || 'Unknown Dexie write failure');
      }

      setStep(5);
      setStatus({ tone: 'success', text: `${result.count} rows imported into ${TABLE_CONFIGS[targetTable].label}.` });
    } catch (error) {
      setStatus({ tone: 'error', text: `Database import failed: ${error.message}` });
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <ResearchShell sidePanel={sidePanel} mainClassName="max-w-[1520px]">
      <header className="mb-10">
        <p className="data-label text-primary">Import Wizard</p>
        <h1 className="mt-3 font-headline text-4xl italic text-on-surface md:text-5xl">Moodle and Research Data Intake</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-on-surface-variant md:text-base">
          Upload CSV or Excel files, map their columns to the WriteLens schema, validate the payload, and push it into the local research database.
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="app-shell-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-outline">Step 1</p>
              <h2 className="mt-1 text-2xl font-semibold text-on-surface">Select Source File</h2>
            </div>
            <span className="material-symbols-outlined text-2xl text-primary">upload_file</span>
          </div>

          <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low px-6 text-center transition-colors hover:border-primary/35 hover:bg-surface-container">
            <span className="material-symbols-outlined mb-4 text-5xl text-primary">cloud_upload</span>
            <p className="font-headline text-2xl italic text-on-surface">Drop CSV / XLSX here</p>
            <p className="mt-2 text-sm text-on-surface-variant">Supported formats: `.csv`, `.xls`, `.xlsx`</p>
            <span className="mt-5 rounded-md bg-primary px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-[color:var(--on-primary-fixed)]">
              Choose File
            </span>
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={(event) => handleFileSelection(event.target.files?.[0])}
            />
          </label>

          {selectedFile && (
            <div className="mt-5 rounded-xl border border-outline-variant/15 bg-surface-container px-4 py-4">
              <p className="font-label text-[10px] uppercase tracking-widest text-outline">Loaded File</p>
              <p className="mt-2 text-sm text-on-surface">{selectedFile.name}</p>
              <p className="mt-1 text-xs text-on-surface-variant">{rawRows.length} rows detected</p>
            </div>
          )}
        </div>

        <div className="app-shell-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-outline">Step 2</p>
              <h2 className="mt-1 text-2xl font-semibold text-on-surface">Target Table</h2>
            </div>
            <span className="material-symbols-outlined text-2xl text-secondary">table_view</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {Object.entries(TABLE_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTargetChange(key)}
                className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                  targetTable === key
                    ? 'border-primary/30 bg-primary/10'
                    : 'border-outline-variant/15 bg-surface-container-low hover:border-outline-variant/30'
                }`}
              >
                <p className="font-label text-[10px] uppercase tracking-widest text-primary">{config.label}</p>
                <p className="mt-2 text-sm text-on-surface-variant">{config.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8 app-shell-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-outline">Step 3</p>
            <h2 className="mt-1 text-2xl font-semibold text-on-surface">Column Mapping</h2>
          </div>
          <span className="material-symbols-outlined text-2xl text-tertiary">conversion_path</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TABLE_CONFIGS[targetTable].fields.map((field) => (
            <label key={field} className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-4">
              <p className="font-label text-[10px] uppercase tracking-widest text-outline">{field}</p>
              <select
                value={mapping[field] ?? ''}
                onChange={(event) => setMapping((current) => ({ ...current, [field]: event.target.value }))}
                className="mt-3 w-full border-none bg-surface px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
              >
                <option value="">Ignore field</option>
                {fileHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className="app-shell-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-outline">Step 4</p>
            <h2 className="mt-1 text-2xl font-semibold text-on-surface">Validation and Preview</h2>
          </div>
          <span className="material-symbols-outlined text-2xl text-primary">fact_check</span>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-4">
            <p className="font-label text-[10px] uppercase tracking-widest text-outline">Mapped Rows</p>
            <p className="mt-2 font-mono text-3xl text-on-surface">{mappedRows.length}</p>
          </div>
          <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-4">
            <p className="font-label text-[10px] uppercase tracking-widest text-outline">Validation</p>
            <p className={`mt-2 font-mono text-lg ${validation.valid ? 'text-secondary' : 'text-[color:var(--error)]'}`}>
              {validation.valid ? 'READY' : 'BLOCKED'}
            </p>
          </div>
          <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-4">
            <p className="font-label text-[10px] uppercase tracking-widest text-outline">Target</p>
            <p className="mt-2 text-sm text-on-surface">{TABLE_CONFIGS[targetTable].label}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-outline-variant/15 bg-surface-container-low custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant/15 bg-surface-container">
                {TABLE_CONFIGS[targetTable].fields.map((field) => (
                  <th key={field} className="px-4 py-3 font-label text-[10px] uppercase tracking-widest text-outline">{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, index) => (
                <tr key={index} className="border-b border-outline-variant/5">
                  {TABLE_CONFIGS[targetTable].fields.map((field) => (
                    <td key={`${index}-${field}`} className="px-4 py-3 text-xs text-on-surface-variant">
                      {String(row[field] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
              {!previewRows.length && (
                <tr>
                  <td colSpan={TABLE_CONFIGS[targetTable].fields.length} className="px-4 py-8 text-center text-sm text-on-surface-variant">
                    Upload and map a file to preview rows here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStep(4)}
            disabled={!validation.valid || isImporting}
            className="rounded-md bg-gradient-to-r from-primary to-primary-container px-5 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-[color:var(--on-primary-fixed)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Validate Ready
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!validation.valid || isImporting}
            className="rounded-md border border-secondary/30 bg-secondary/10 px-5 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImporting ? 'Importing...' : 'Commit To Database'}
          </button>
        </div>
      </section>
    </ResearchShell>
  );
}
