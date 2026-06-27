import Article from '../models/Article.js';

const hasPendingEdit = (article) =>
  article.pendingChanges && article.pendingChanges.submittedAt;

const buildPreviewArticle = (article) => {
  const base = article.toObject ? article.toObject() : { ...article };
  if (hasPendingEdit(article)) {
    const pc = article.pendingChanges;
    return {
      ...base,
      title: pc.title ?? base.title,
      subheading: pc.subheading ?? base.subheading,
      content: pc.content ?? base.content,
      image: pc.image ?? base.image,
      category: pc.category ?? base.category,
      subCategory: pc.subCategory ?? base.subCategory,
      seoUrlTitle: pc.seoUrlTitle ?? base.seoUrlTitle,
    };
  }
  return base;
};

/**
 * @desc    Create a new article
 * @route   POST /api/articles
 * @access  Private (Employee/Admin)
 */
export const createArticle = async (req, res) => {
  try {
    const { title, subheading, content, image, category, subCategory, seoUrlTitle } = req.body;

    const article = new Article({
      title,
      subheading,
      content,
      image,
      category: category?.toLowerCase(),
      ...(subCategory ? { subCategory } : {}),
      ...(seoUrlTitle ? { seoUrlTitle } : {}),
      author: req.user._id,
      createdBy: req.user._id,
      status: 'pending',
      isBreaking: false,
      isFeatured: false,
    });

    const createdArticle = await article.save();
    res.status(201).json({
      success: true,
      message: 'Article submitted for review',
      data: createdArticle
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get approved articles
 * @route   GET /api/articles
 * @access  Public
 */
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'approved', isActive: { $ne: false } })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get breaking news
 * @route   GET /api/articles/breaking
 * @access  Public
 */
export const getBreakingNews = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'approved', isBreaking: true, isActive: { $ne: false } })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get articles by category
 * @route   GET /api/articles/category/:category
 * @access  Public
 */
export const getArticlesByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const articles = await Article.find({ status: 'approved', category, isActive: { $ne: false } })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Search articles
 * @route   GET /api/articles/search
 * @access  Public
 */
export const searchArticles = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const articles = await Article.find({
      status: 'approved',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all articles (Admin Only)
 * @route   GET /api/articles/all
 * @access  Private (Admin)
 */
export const getAdminArticles = async (req, res) => {
  try {
    const articles = await Article.find({})
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Approve article
 * @route   PUT /api/articles/:id/approve
 * @access  Private (Admin)
 */
export const approveArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (hasPendingEdit(article)) {
      const pc = article.pendingChanges;
      if (pc.title !== undefined) article.title = pc.title;
      if (pc.subheading !== undefined) article.subheading = pc.subheading;
      if (pc.content !== undefined) article.content = pc.content;
      if (pc.image !== undefined) article.image = pc.image;
      if (pc.category !== undefined) article.category = pc.category;
      if (pc.subCategory !== undefined) article.subCategory = pc.subCategory;
      if (pc.seoUrlTitle !== undefined) article.seoUrlTitle = pc.seoUrlTitle;
      article.pendingChanges = undefined;
      article.markModified('pendingChanges');
      article.status = 'approved';
    } else if (article.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Article is already approved' });
    } else {
      article.status = 'approved';
    }

    const updatedArticle = await article.save();

    res.json({
      success: true,
      message: 'Article approved successfully',
      data: updatedArticle
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reject article
 * @route   PUT /api/articles/:id/reject
 * @access  Private (Admin)
 */
export const rejectArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (hasPendingEdit(article)) {
      article.pendingChanges = undefined;
      article.markModified('pendingChanges');
      const updatedArticle = await article.save();
      return res.json({
        success: true,
        message: 'Pending edits rejected. Published version unchanged.',
        data: updatedArticle
      });
    }

    if (article.status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Article is already rejected' });
    }

    article.status = 'rejected';
    const updatedArticle = await article.save();

    res.json({
      success: true,
      message: 'Article rejected successfully',
      data: updatedArticle
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update article (Admin Only)
 * @route   PUT /api/articles/:id
 * @access  Private (Admin)
 */
export const updateArticle = async (req, res) => {
  try {
    const {
      status,
      isBreaking,
      isFeatured,
      isActive,
      title,
      subheading,
      content,
      image,
      category,
      subCategory,
      seoUrlTitle,
    } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (status) article.status = status;
    if (isBreaking !== undefined) article.isBreaking = isBreaking;
    if (isFeatured !== undefined) article.isFeatured = isFeatured;
    if (isActive !== undefined) article.isActive = isActive;
    if (title !== undefined) article.title = title;
    if (subheading !== undefined) article.subheading = subheading;
    if (content !== undefined) article.content = content;
    if (image !== undefined) article.image = image;
    if (category !== undefined) article.category = category.toLowerCase();
    if (subCategory !== undefined) article.subCategory = subCategory;
    if (seoUrlTitle !== undefined) article.seoUrlTitle = seoUrlTitle;

    const updatedArticle = await article.save();
    res.json({ success: true, data: updatedArticle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update own article (Employee)
 * @route   PUT /api/articles/:id/me
 * @access  Private (Employee)
 */
export const updateMyArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    if (article.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this article' });
    }

    const { title, subheading, content, image, category, subCategory, seoUrlTitle, submitForApproval } = req.body;

    if (article.status === 'approved') {
      if (!submitForApproval) {
        return res.status(400).json({ success: false, message: 'Published articles must be submitted for approval' });
      }
      article.pendingChanges = {
        title,
        subheading,
        content,
        image,
        category: category?.toLowerCase(),
        subCategory,
        seoUrlTitle,
        submittedAt: new Date(),
      };
      const updatedArticle = await article.save();
      return res.json({
        success: true,
        message: 'Edits submitted for approval',
        data: updatedArticle,
      });
    }

    if (article.status !== 'pending' && article.status !== 'rejected') {
      return res.status(400).json({ success: false, message: 'This article cannot be edited' });
    }

    if (title !== undefined) article.title = title;
    if (subheading !== undefined) article.subheading = subheading;
    if (content !== undefined) article.content = content;
    if (image !== undefined) article.image = image;
    if (category !== undefined) article.category = category.toLowerCase();
    if (subCategory !== undefined) article.subCategory = subCategory;
    if (seoUrlTitle !== undefined) article.seoUrlTitle = seoUrlTitle;
    if (article.status === 'rejected') article.status = 'pending';

    const updatedArticle = await article.save();
    res.json({ success: true, data: updatedArticle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete article (Admin)
 * @route   DELETE /api/articles/:id
 * @access  Private (Admin)
 */
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete own article (Employee)
 * @route   DELETE /api/articles/:id/me
 * @access  Private (Employee)
 */
export const deleteMyArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    if (article.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this article' });
    }
    await article.deleteOne();
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get trending articles
 * @route   GET /api/articles/trending
 * @access  Public
 */
export const getTrendingArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'approved', isTrending: true, isActive: { $ne: false } })
      .populate('author', 'name email')
      .sort({ trendingOrder: 1 })
      .limit(8);
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle trending status
 * @route   PUT /api/articles/:id/toggle-trending
 * @access  Private (Admin)
 */
export const toggleTrending = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    if (!article.isTrending) {
      const trendingCount = await Article.countDocuments({ isTrending: true });
      if (trendingCount >= 8) {
        return res.status(400).json({ success: false, message: 'Maximum 8 trending articles allowed. Remove one first.' });
      }
    }

    article.isTrending = !article.isTrending;
    if (!article.isTrending) article.trendingOrder = 0;
    await article.save();
    res.json({ success: true, message: `Trending ${article.isTrending ? 'enabled' : 'disabled'}`, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Set trending order
 * @route   PUT /api/articles/:id/set-trending-order
 * @access  Private (Admin)
 */
export const setTrendingOrder = async (req, res) => {
  try {
    const { order } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    if (!article.isTrending) return res.status(400).json({ success: false, message: 'Article is not trending' });
    article.trendingOrder = order;
    await article.save();
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * @desc    Get article by ID
 * @route   GET /api/articles/:id
 * @access  Public
 */
/**
 * @desc    Preview pending article or pending edits (Admin Only)
 * @route   GET /api/articles/:id/admin
 * @access  Private (Admin)
 */
export const getAdminArticlePreview = async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Article ID' });
    }

    const article = await Article.findById(req.params.id).populate('author', 'name email');
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const canPreview = article.status === 'pending' || hasPendingEdit(article);
    if (!canPreview) {
      return res.status(400).json({ success: false, message: 'No pending version to preview' });
    }

    res.json({ success: true, data: buildPreviewArticle(article) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Article ID' });
    }

    const article = await Article.findById(req.params.id).populate('author', 'name email');

    if (article && article.status === 'approved' && article.isActive !== false) {
      res.json({ success: true, data: article });
    } else {
      res.status(404).json({ success: false, message: 'Article not found or is currently hidden' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
