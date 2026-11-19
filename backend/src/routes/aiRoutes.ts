import { Router } from 'express';
import { aiController } from '../controllers/aiController';

const router = Router();

// POST /ai/music-insights -> Generate Gemini AI music intelligence answer
router.post('/music-insights', aiController.generateMusicInsights);

export default router;
