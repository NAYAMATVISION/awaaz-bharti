import express from 'express';
import { 
  createVideo, 
  getVideos, 
  getAdminVideos, 
  approveVideo, 
  rejectVideo,
  resetVideo,
  getMyVideos,
  deleteVideo,
  deleteMyVideo,
} from '../controllers/videoController.js';
import { protect, employeeOnly, adminOnly, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getVideos);

// Protected routes
router.post('/', protect, employeeOnly, checkPermission('add_video'), createVideo);
router.get('/all', protect, adminOnly, getAdminVideos);
router.get('/me', protect, getMyVideos);
router.put('/:id/approve', protect, adminOnly, approveVideo);
router.put('/:id/reject', protect, adminOnly, rejectVideo);
router.put('/:id/reset', protect, adminOnly, resetVideo);
router.delete('/:id', protect, adminOnly, deleteVideo);
router.delete('/:id/me', protect, employeeOnly, deleteMyVideo);

export default router;
