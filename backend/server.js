const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parseWorkbook } = require('./workbookParser');
const { buildAnalyticsSummary } = require('./liveAnalytics');
const { exec } = require('child_process');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WriteLens Backend Operations Active.' });
});

app.post('/api/upload-dataset', upload.any(), (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];

  if (files.length === 0) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const parsedCases = files.map((file) => parseWorkbook(file.buffer, file.originalname));
    const { cases, analytics } = buildAnalyticsSummary(parsedCases);
    const firstCase = cases[0];
    const studentCount = cases.reduce((sum, result) => sum + result.data.length, 0);

    res.json({
      message: 'Processing complete',
      workbookCount: cases.length,
      studentCount,
      analytics,
      cases,
      ...firstCase,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to process dataset: ${error.message}` });
  }
});

app.post('/api/run-pipeline', upload.any(), (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  
  if (files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const pipelineDir = path.resolve(__dirname, '../adaptive_writing_system');
  const dataDir = path.join(pipelineDir, 'data');
  const outputsDir = path.join(pipelineDir, 'outputs');

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch(err) {
    return res.status(500).json({ error: `Failed to create data dir: ${err.message}` });
  }

  // Save the files to the data directory using their original names (e.g. moodle_logs.csv)
  try {
    files.forEach(file => {
      const filePath = path.join(dataDir, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
    });
  } catch (err) {
    return res.status(500).json({ error: `Failed to save files: ${err.message}` });
  }

  // Execute the python pipeline
  exec('python app/run_pipeline.py', { cwd: pipelineDir }, (error, stdout, stderr) => {
    if (error) {
       console.error(`Pipeline execution error: ${error.message}`);
       // Pipeline failed, maybe python is not installed or script failed
       return res.status(500).json({ error: 'Python pipeline failed', details: stderr || error.message });
    }

    // Read the output
    const feedbackOutput = path.join(outputsDir, '08_feedback.csv');
    if (!fs.existsSync(feedbackOutput)) {
       return res.status(500).json({ error: 'Pipeline did not produce expected output csv.' });
    }

    // Parse CSV to JSON (simple parsing)
    const content = fs.readFileSync(feedbackOutput, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 1) {
       return res.json({ result: [] });
    }
    
    // Simplistic CSV parser (not robust for commas inside quotes, but good enough for this data if there are quotes we need a library like csv-parse, but let's just send the raw string or parse it simply. Since feedback texts might contain commas, we should properly parse it or send text.)
    res.json({ result_csv: content, stdout });
  });
});

const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
    res.sendFile(frontendIndexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.status(503).json({
      status: 'frontend_missing',
      message: 'Backend is running, but the frontend production build was not found.',
      expectedPath: frontendIndexPath,
    });
  });
}

const PORT = Number(process.env.PORT || 3001);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(
      fs.existsSync(frontendIndexPath)
        ? `Frontend build detected at ${frontendIndexPath}`
        : `Frontend build missing at ${frontendIndexPath}`
    );
  });
}

module.exports = {
  app,
};
