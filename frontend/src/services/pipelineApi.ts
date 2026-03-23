const DEFAULT_API_BASE = import.meta.env.DEV ? 'http://127.0.0.1:3001' : '';
const API_BASE = (import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE).replace(/\/$/, '');

export interface PipelineResponse {
  result_csv: string;
  stdout: string;
}

export async function runPipeline(files: File[]): Promise<PipelineResponse> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file, file.name);
  }

  const response = await fetch(`${API_BASE}/api/run-pipeline`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({ error: 'Pipeline execution failed.' }));
    throw new Error(errorPayload.error ?? 'Pipeline execution failed.');
  }

  return response.json();
}
