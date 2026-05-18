import express from 'express';
import {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementsByPlacement,
  updateAdvertisement,
  deleteAdvertisement,
  toggleAdvertisementStatus,
} from '../controllers/advertisementController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/placement/:placement', getAdvertisementsByPlacement);

// Admin
router.get('/', protect, adminOnly, getAdvertisements);
router.post('/', protect, adminOnly, createAdvertisement);
router.put('/:id', protect, adminOnly, updateAdvertisement);
router.put('/:id/toggle', protect, adminOnly, toggleAdvertisementStatus);
router.delete('/:id', protect, adminOnly, deleteAdvertisement);

export default router;
