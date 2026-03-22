const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parseWorkbook } = require('./workbookParser');

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
    const cases = files.map((file) => parseWorkbook(file.buffer, file.originalname));
    const firstCase = cases[0];
    const studentCount = cases.reduce((sum, result) => sum + result.data.length, 0);

    res.json({
      message: 'Processing complete',
      workbookCount: cases.length,
      studentCount,
      cases,
      ...firstCase,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to process dataset: ${error.message}` });
  }
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
