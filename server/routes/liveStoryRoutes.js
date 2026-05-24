import express from 'express';
import {
  createStory, getStories, getAllStories, getMyStories, getStoryBySlug,
  updateMyStory, adminUpdateStory, deleteStory,
  addEntry, updateEntry, deleteEntry,
} from '../controllers/liveStoryController.js';
import { protect, adminOnly, employeeOnly, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getStories);
router.get('/slug/:slug', getStoryBySlug);

// Employee
router.post('/', protect, employeeOnly, checkPermission('add_live'), createStory);
router.get('/me', protect, employeeOnly, getMyStories);
router.put('/me/:id', protect, employeeOnly, updateMyStory);
router.delete('/me/:id', protect, employeeOnly, deleteStory);

// Admin
router.get('/all', protect, adminOnly, getAllStories);
router.put('/admin/:id', protect, adminOnly, adminUpdateStory);
router.delete('/admin/:id', protect, adminOnly, deleteStory);

// Entries (employee owns story, no admin approval needed)
router.post('/:storyId/entries', protect, employeeOnly, checkPermission('add_live'), addEntry);
router.put('/:storyId/entries/:entryId', protect, employeeOnly, updateEntry);
router.delete('/:storyId/entries/:entryId', protect, employeeOnly, deleteEntry);

export default router;
