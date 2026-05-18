import express from 'express';
import { 
  createArticle, 
  getAllArticles, 
  getBreakingNews,
  getArticlesByCategory,
  searchArticles,
  getAdminArticles, 
  getMyArticles,
  approveArticle, 
  rejectArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  deleteMyArticle,
  getTrendingArticles,
  toggleTrending,
  setTrendingOrder,
} from '../controllers/articleController.js';
import { protect, employeeOnly, adminOnly, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllArticles);
router.get('/breaking', getBreakingNews);
router.get('/trending', getTrendingArticles);
router.get('/category/:category', getArticlesByCategory);
router.get('/search', searchArticles);

// Protected routes (above dynamic :id)
router.get('/all', protect, adminOnly, getAdminArticles);
router.get('/me', protect, getMyArticles);
router.post('/', protect, employeeOnly, createArticle);
router.put('/:id', protect, adminOnly, updateArticle);
router.put('/:id/approve', protect, adminOnly, approveArticle);
router.put('/:id/reject', protect, adminOnly, rejectArticle);
router.put('/:id/toggle-trending', protect, adminOnly, toggleTrending);
router.put('/:id/set-trending-order', protect, adminOnly, setTrendingOrder);
router.delete('/:id', protect, adminOnly, deleteArticle);
router.delete('/:id/me', protect, employeeOnly, deleteMyArticle);

// Public dynamic route (must be last)
router.get('/:id', getArticleById);

export default router;
