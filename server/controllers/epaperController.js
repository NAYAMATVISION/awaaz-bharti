import fs from 'fs';
import path from 'path';
import EPaper from '../models/EPaper.js';

export const uploadEpaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const fileUrl = `${baseUrl}/uploads/epaper/${req.file.filename}`;
    const title = req.body.title || `E-Paper ${new Date().toLocaleDateString('en-IN')}`;

    const existing = await EPaper.findOne();

    if (existing) {
      // Delete old file from disk
      const oldFilename = existing.fileUrl.split('/uploads/epaper/')[1];
      if (oldFilename) {
        const oldPath = path.join('uploads', 'epaper', oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      existing.title = title;
      existing.fileUrl = fileUrl;
      await existing.save();
      return res.json({ success: true, message: 'E-paper updated successfully', data: existing });
    }

    const epaper = await EPaper.create({ title, fileUrl });
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
