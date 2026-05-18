import mongoose from 'mongoose';
import LiveNews from '../models/LiveNews.js';

/**
 * @desc    Create live news update
 * @route   POST /api/live
 * @access  Private (Employee/Admin)
 */
export const createLiveNews = async (req, res) => {
  try {
    const { title, content, timestamp } = req.body;

    const liveNews = new LiveNews({
      title,
      content,
      status: 'pending',
      timestamp: timestamp || Date.now(),
      createdBy: req.user._id,
    });

    const createdLiveNews = await liveNews.save();
    res.status(201).json({
      success: true,
      message: 'Live news update created',
      data: createdLiveNews,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get latest live news updates
 * @route   GET /api/live
 * @access  Public
 */
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

/**
 * @desc    Get all live news (Admin Only)
 * @route   GET /api/live/all
 * @access  Private (Admin)
 */
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

/**
 * @desc    Approve live news
 * @route   PUT /api/live/:id/approve
 * @access  Private (Admin)
 */
export const approveLiveNews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Live News ID' });
    }

    const liveNews = await LiveNews.findById(req.params.id);
    if (!liveNews) return res.status(404).json({ success: false, message: 'Live update not found' });
    if (liveNews.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Live update is already approved' });
    }

    liveNews.status = 'approved';
    const updatedLiveNews = await liveNews.save();
    res.json({ success: true, message: 'Live update approved successfully', data: updatedLiveNews });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reject live news
 * @route   PUT /api/live/:id/reject
 * @access  Private (Admin)
 */
export const rejectLiveNews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Live News ID' });
    }

    const liveNews = await LiveNews.findById(req.params.id);
    if (!liveNews) return res.status(404).json({ success: false, message: 'Live update not found' });
    if (liveNews.status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Live update is already rejected' });
    }

    liveNews.status = 'rejected';
    const updatedLiveNews = await liveNews.save();
    res.json({ success: true, message: 'Live update rejected successfully', data: updatedLiveNews });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetLiveNews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Live News ID' });
    }
    const liveNews = await LiveNews.findById(req.params.id);
    if (!liveNews) return res.status(404).json({ success: false, message: 'Live update not found' });
    liveNews.status = 'pending';
    const updated = await liveNews.save();
    res.json({ success: true, message: 'Live update reset to pending', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get my live news
 * @route   GET /api/live/me
 * @access  Private (Employee/Admin)
 */
export const getMyLiveNews = async (req, res) => {
  try {
    const liveNews = await LiveNews.find({ createdBy: req.user._id })
      .sort({ timestamp: -1 });
    res.json({ success: true, data: liveNews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete live news (Admin)
 * @route   DELETE /api/live/:id
 * @access  Private (Admin)
 */
export const deleteLiveNews = async (req, res) => {
  try {
    const item = await LiveNews.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Live update not found' });
    res.json({ success: true, message: 'Live update deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete own live news (Employee)
 * @route   DELETE /api/live/:id/me
 * @access  Private (Employee)
 */
export const deleteMyLiveNews = async (req, res) => {
  try {
    const item = await LiveNews.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Live update not found' });
    if (item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this update' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Live update deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
