import mongoose from 'mongoose';
import Video from '../models/Video.js';

/**
 * @desc    Create video entry
 * @route   POST /api/videos
 * @access  Private (Employee/Admin)
 */
export const createVideo = async (req, res) => {
  try {
    const { title, youtubeUrl, category } = req.body;

    const video = new Video({
      title,
      youtubeUrl,
      category: category?.toLowerCase(),
      status: 'pending',
      createdBy: req.user._id,
    });

    const createdVideo = await video.save();
    res.status(201).json({
      success: true,
      message: 'Video added successfully',
      data: createdVideo,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all videos
 * @route   GET /api/videos
 * @access  Public
 */
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ status: 'approved' })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all videos (Admin Only)
 * @route   GET /api/videos/all
 * @access  Private (Admin)
 */
export const getAdminVideos = async (req, res) => {
  try {
    const videos = await Video.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Approve video
 * @route   PUT /api/videos/:id/approve
 * @access  Private (Admin)
 */
export const approveVideo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Video ID' });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    if (video.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Video is already approved' });
    }

    video.status = 'approved';
    const updatedVideo = await video.save();
    res.json({ success: true, message: 'Video approved successfully', data: updatedVideo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reject video
 * @route   PUT /api/videos/:id/reject
 * @access  Private (Admin)
 */
export const rejectVideo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Video ID' });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    if (video.status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Video is already rejected' });
    }

    video.status = 'rejected';
    const updatedVideo = await video.save();
    res.json({ success: true, message: 'Video rejected successfully', data: updatedVideo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetVideo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Video ID' });
    }
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    video.status = 'pending';
    const updated = await video.save();
    res.json({ success: true, message: 'Video reset to pending', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get my videos
 * @route   GET /api/videos/me
 * @access  Private (Employee/Admin)
 */
export const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete video (Admin)
 * @route   DELETE /api/videos/:id
 * @access  Private (Admin)
 */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete own video (Employee)
 * @route   DELETE /api/videos/:id/me
 * @access  Private (Employee)
 */
export const deleteMyVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    if (video.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this video' });
    }
    await video.deleteOne();
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
