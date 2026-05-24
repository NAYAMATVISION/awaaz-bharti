import mongoose from 'mongoose';
import LiveNews from '../models/LiveNews.js';

export const createLiveNews = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, author, timestamp, isFeatured, featuredPriority } = req.body;
    const liveNews = new LiveNews({
      title,
      content,
      excerpt: excerpt || '',
      coverImage: coverImage || '',
      author: author || '',
      isFeatured: isFeatured || false,
      featuredPriority: featuredPriority || 0,
      status: 'pending',
      timestamp: timestamp || Date.now(),
      createdBy: req.user._id,
    });
    const created = await liveNews.save();
    res.status(201).json({ success: true, message: 'Live news update created', data: created });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLiveNews = async (req, res) => {
  try {
    const liveNews = await LiveNews.find({ status: 'approved' })
      .populate('createdBy', 'name email')
      .sort({ timestamp: -1 });
    res.json({ success: true, data: liveNews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLiveNewsBySlug = async (req, res) => {
  try {
    const item = await LiveNews.findOne({ slug: req.params.slug, status: 'approved' })
      .populate('createdBy', 'name email');
    if (!item) return res.status(404).json({ success: false, message: 'Live update not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedLiveNews = async (req, res) => {
  try {
    const items = await LiveNews.find({ status: 'approved', isFeatured: true })
      .populate('createdBy', 'name email')
      .sort({ featuredPriority: 1, timestamp: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminLiveNews = async (req, res) => {
  try {
    const liveNews = await LiveNews.find({})
      .populate('createdBy', 'name email')
      .sort({ timestamp: -1 });
    res.json({ success: true, data: liveNews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveLiveNews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid Live News ID' });
    const liveNews = await LiveNews.findById(req.params.id);
    if (!liveNews) return res.status(404).json({ success: false, message: 'Live update not found' });
    liveNews.status = 'approved';
    const updated = await liveNews.save();
    res.json({ success: true, message: 'Live update approved', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rejectLiveNews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid Live News ID' });
    const liveNews = await LiveNews.findById(req.params.id);
    if (!liveNews) return res.status(404).json({ success: false, message: 'Live update not found' });
    liveNews.status = 'rejected';
    const updated = await liveNews.save();
    res.json({ success: true, message: 'Live update rejected', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetLiveNews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid Live News ID' });
    const liveNews = await LiveNews.findById(req.params.id);
    if (!liveNews) return res.status(404).json({ success: false, message: 'Live update not found' });
    liveNews.status = 'pending';
    const updated = await liveNews.save();
    res.json({ success: true, message: 'Live update reset to pending', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLiveNews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ success: false, message: 'Invalid Live News ID' });
    const { isFeatured, featuredPriority, status, title, content, excerpt, coverImage, author } = req.body;
    const liveNews = await LiveNews.findById(req.params.id);
    if (!liveNews) return res.status(404).json({ success: false, message: 'Live update not found' });
    if (isFeatured !== undefined) liveNews.isFeatured = isFeatured;
    if (featuredPriority !== undefined) liveNews.featuredPriority = featuredPriority;
    if (status) liveNews.status = status;
    if (title) liveNews.title = title;
    if (content) liveNews.content = content;
    if (excerpt !== undefined) liveNews.excerpt = excerpt;
    if (coverImage !== undefined) liveNews.coverImage = coverImage;
    if (author !== undefined) liveNews.author = author;
    const updated = await liveNews.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyLiveNews = async (req, res) => {
  try {
    const liveNews = await LiveNews.find({ createdBy: req.user._id }).sort({ timestamp: -1 });
    res.json({ success: true, data: liveNews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLiveNews = async (req, res) => {
  try {
    const item = await LiveNews.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Live update not found' });
    res.json({ success: true, message: 'Live update deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMyLiveNews = async (req, res) => {
  try {
    const item = await LiveNews.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Live update not found' });
    if (item.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await item.deleteOne();
    res.json({ success: true, message: 'Live update deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
