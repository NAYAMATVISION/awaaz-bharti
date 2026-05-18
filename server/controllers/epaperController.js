import EPaper from '../models/EPaper.js';

export const uploadEpaper = async (req, res) => {
  try {
    const { title, fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ success: false, message: 'PDF URL is required' });
    }

    const epaperTitle = title || `E-Paper ${new Date().toLocaleDateString('en-IN')}`;
    const existing = await EPaper.findOne();

    if (existing) {
      existing.title = epaperTitle;
      existing.fileUrl = fileUrl;
      await existing.save();
      return res.json({ success: true, message: 'E-paper updated successfully', data: existing });
    }

    const epaper = await EPaper.create({ title: epaperTitle, fileUrl });
    res.status(201).json({ success: true, message: 'E-paper uploaded successfully', data: epaper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEpaper = async (req, res) => {
  try {
    const epaper = await EPaper.findOne();
    res.json({ success: true, data: epaper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const streamEpaper = async (req, res) => {
  try {
    const epaper = await EPaper.findOne();
    if (!epaper) return res.status(404).json({ success: false, message: 'No e-paper found' });
    // Redirect to the stored URL (Google Drive preview URL opens directly)
    res.redirect(epaper.fileUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
