import EPaper from '../models/EPaper.js';

export const uploadEpaper = async (req, res) => {
  try {
    const { title, fileUrl, publicationDate, coverImage } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ success: false, message: 'PDF URL is required' });
    }
    const epaperTitle = title || `E-Paper ${new Date().toLocaleDateString('en-IN')}`;
    const epaper = await EPaper.create({
      title: epaperTitle,
      fileUrl,
      publicationDate: publicationDate ? new Date(publicationDate) : new Date(),
      coverImage: coverImage || '',
    });
    res.status(201).json({ success: true, message: 'E-paper uploaded successfully', data: epaper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Returns the single latest edition (homepage / e-paper page current view)
export const getEpaper = async (req, res) => {
  try {
    const epaper = await EPaper.findOne().sort({ publicationDate: -1, createdAt: -1 });
    res.json({ success: true, data: epaper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Returns paginated archive with optional year/month filters
export const getEpaperArchive = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 12);
    const year = req.query.year ? parseInt(req.query.year) : null;
    const month = req.query.month ? parseInt(req.query.month) : null; // 1-12

    const filter = {};
    if (year || month) {
      const start = new Date(year || 2000, (month ? month - 1 : 0), 1);
      const end = month
        ? new Date(year || new Date().getFullYear(), month, 1)
        : new Date(year + 1, 0, 1);
      filter.publicationDate = { $gte: start, $lt: end };
    }

    const [total, editions] = await Promise.all([
      EPaper.countDocuments(filter),
      EPaper.find(filter)
        .sort({ publicationDate: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    res.json({
      success: true,
      data: editions,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const streamEpaper = async (req, res) => {
  try {
    const epaper = await EPaper.findOne().sort({ publicationDate: -1, createdAt: -1 });
    if (!epaper) return res.status(404).json({ success: false, message: 'No e-paper found' });
    res.redirect(epaper.fileUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEpaper = async (req, res) => {
  try {
    const epaper = await EPaper.findByIdAndDelete(req.params.id);
    if (!epaper) return res.status(404).json({ success: false, message: 'E-paper not found' });
    res.json({ success: true, message: 'E-paper deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
