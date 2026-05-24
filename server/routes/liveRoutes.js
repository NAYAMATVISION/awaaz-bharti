import express from 'express';
import {
  createLiveNews,
  getLiveNews,
  getLiveNewsBySlug,
  getFeaturedLiveNews,
  getAdminLiveNews,
  approveLiveNews,
  rejectLiveNews,
  resetLiveNews,
  updateLiveNews,
  getMyLiveNews,
  deleteLiveNews,
  deleteMyLiveNews,
} from '../controllers/liveNewsController.js';
import { protect, employeeOnly, adminOnly, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getLiveNews);
router.get('/featured', getFeaturedLiveNews);
router.get('/slug/:slug', getLiveNewsBySlug);

// Protected routes
router.post('/', protect, employeeOnly, checkPermission('add_live'), createLiveNews);
router.get('/all', protect, adminOnly, getAdminLiveNews);
router.get('/me', protect, getMyLiveNews);
router.put('/:id', protect, adminOnly, updateLiveNews);
router.put('/:id/approve', protect, adminOnly, approveLiveNews);
router.put('/:id/reject', protect, adminOnly, rejectLiveNews);
router.put('/:id/reset', protect, adminOnly, resetLiveNews);
router.delete('/:id', protect, adminOnly, deleteLiveNews);
router.delete('/:id/me', protect, employeeOnly, deleteMyLiveNews);

export default router;
