import LiveStory from '../models/LiveStory.js';
import LiveEntry from '../models/LiveEntry.js';

// ── Stories ──────────────────────────────────────────────────────────────────

// Employee creates story — starts as pending
export const createStory = async (req, res) => {
  try {
    const { title, description, coverImage } = req.body;
    const story = await new LiveStory({
      title, description, coverImage,
      status: 'pending',
      createdBy: req.user._id,
    }).save();
    res.status(201).json({ success: true, data: story });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Public — only approved (live/closed) stories
export const getStories = async (req, res) => {
  try {
    const stories = await LiveStory.find({ status: { $in: ['live', 'closed'] } }).sort({ createdAt: -1 });
    const storiesWithCount = await Promise.all(
      stories.map(async (s) => {
        const entryCount = await LiveEntry.countDocuments({ story: s._id });
        return { ...s.toObject(), entryCount };
      })
    );
    res.json({ success: true, data: storiesWithCount });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin — all stories for review queue
export const getAllStories = async (req, res) => {
  try {
    const stories = await LiveStory.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    const storiesWithCount = await Promise.all(
      stories.map(async (s) => {
        const entryCount = await LiveEntry.countDocuments({ story: s._id });
        return { ...s.toObject(), entryCount };
      })
    );
    res.json({ success: true, data: storiesWithCount });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Employee — their own stories
export const getMyStories = async (req, res) => {
  try {
    const stories = await LiveStory.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    const storiesWithCount = await Promise.all(
      stories.map(async (s) => {
        const entryCount = await LiveEntry.countDocuments({ story: s._id });
        return { ...s.toObject(), entryCount };
      })
    );
    res.json({ success: true, data: storiesWithCount });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getStoryBySlug = async (req, res) => {
  try {
    const story = await LiveStory.findOne({ slug: req.params.slug }).populate('createdBy', 'name');
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    const entries = await LiveEntry.find({ story: story._id })
      .populate('createdBy', 'name')
      .sort({ timestamp: -1 });
    res.json({ success: true, data: { story, entries } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Employee updates own story details (title, description, coverImage, close)
export const updateMyStory = async (req, res) => {
  try {
    const story = await LiveStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    if (story.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const { title, description, coverImage, status } = req.body;
    // Employee can only toggle between live and closed, not set pending/rejected
    if (title) story.title = title;
    if (description !== undefined) story.description = description;
    if (coverImage !== undefined) story.coverImage = coverImage;
    if (status && ['live', 'closed'].includes(status)) story.status = status;
    const updated = await story.save();
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Admin — approve / reject / full update
export const adminUpdateStory = async (req, res) => {
  try {
    const story = await LiveStory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    res.json({ success: true, data: story });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await LiveStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    const isOwner = story.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await LiveEntry.deleteMany({ story: story._id });
    await story.deleteOne();
    res.json({ success: true, message: 'Story deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ── Entries ───────────────────────────────────────────────────────────────────

// Employee adds entry — only to approved (live) stories
export const addEntry = async (req, res) => {
  try {
    const story = await LiveStory.findById(req.params.storyId);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    if (story.status !== 'live')
      return res.status(403).json({ success: false, message: 'Story is not live' });
    const { headline, content, author } = req.body;
    const entry = await new LiveEntry({
      story: story._id, headline, content,
      author: author || req.user.name || '',
      createdBy: req.user._id,
    }).save();
    res.status(201).json({ success: true, data: entry });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const entry = await LiveEntry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    const isOwner = entry.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const { headline, content, author } = req.body;
    if (headline) entry.headline = headline;
    if (content) entry.content = content;
    if (author !== undefined) entry.author = author;
    const updated = await entry.save();
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const entry = await LiveEntry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    const isOwner = entry.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await entry.deleteOne();
    res.json({ success: true, message: 'Entry deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
