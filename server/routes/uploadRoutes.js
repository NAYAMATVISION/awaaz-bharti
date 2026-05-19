import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { getCloudinary } from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Build multer upload lazily so Cloudinary is configured after dotenv loads
function getUpload() {
  const cloudinary = getCloudinary();
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder: 'awaaz-bharti/uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto' }],
    }),
  });
  return multer({
    storage,
    fileFilter(req, file, cb) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Images only! Allowed: jpg, jpeg, png, webp'));
      }
    },
  });
}

router.post('/', protect, (req, res, next) => {
  getUpload().single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ message: 'Image uploaded', image: req.file.path });
  });
});

export default router;
