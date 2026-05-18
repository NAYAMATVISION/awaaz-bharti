import express from 'express';
import { 
  createLiveNews, 
  getLiveNews, 
  getAdminLiveNews, 
  approveLiveNews, 
  rejectLiveNews,
  resetLiveNews,
  getMyLiveNews,
  deleteLiveNews,
  deleteMyLiveNews,
} from '../controllers/liveNewsController.js';
import { protect, employeeOnly, adminOnly, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getLiveNews);

// Protected routes
router.post('/', protect, employeeOnly, checkPermission('add_live'), createLiveNews);
router.get('/all', protect, adminOnly, getAdminLiveNews);
router.get('/me', protect, getMyLiveNews);
router.put('/:id/approve', protect, adminOnly, approveLiveNews);
router.put('/:id/reject', protect, adminOnly, rejectLiveNews);
router.put('/:id/reset', protect, adminOnly, resetLiveNews);
router.delete('/:id', protect, adminOnly, deleteLiveNews);
router.delete('/:id/me', protect, employeeOnly, deleteMyLiveNews);

export default router;
