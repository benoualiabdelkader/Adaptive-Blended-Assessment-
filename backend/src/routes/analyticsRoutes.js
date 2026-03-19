import express from 'express';
import { analyticsController } from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/pipeline', analyticsController.processPipeline);

export default router;
