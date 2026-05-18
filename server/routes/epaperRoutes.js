import express from 'express';
import { uploadEpaper, getEpaper, streamEpaper } from '../controllers/epaperController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, uploadEpaper);
router.get('/', getEpaper);
router.get('/view', streamEpaper);

export default router;
