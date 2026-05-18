import path from 'path';
import express from 'express';
import multer from 'multer';
import { uploadEpaper, getEpaper } from '../controllers/epaperController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/epaper/');
  },
  filename(req, file, cb) {
    cb(null, `epaper-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter(req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

router.post('/', protect, adminOnly, upload.single('pdf'), uploadEpaper);
router.get('/', getEpaper);

export default router;
