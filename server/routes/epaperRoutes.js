import express from 'express';
import { uploadEpaper, getEpaper, getEpaperArchive, streamEpaper, deleteEpaper } from '../controllers/epaperController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, uploadEpaper);
router.get('/', getEpaper);
router.get('/archive', getEpaperArchive);
router.get('/view', streamEpaper);
router.delete('/:id', protect, adminOnly, deleteEpaper);

export default router;
