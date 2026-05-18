import dotenv from 'dotenv';
dotenv.config(); // Must be the very first executable line

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Routes
import uploadRoutes from './routes/uploadRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import liveRoutes from './routes/liveRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import epaperRoutes from './routes/epaperRoutes.js';
import advertisementRoutes from './routes/advertisementRoutes.js';
import { protect, adminOnly } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
connectDB();

// Ensure upload directories exist (for any local fallback)
['uploads', 'uploads/epaper'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const app = express();

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/epaper', epaperRoutes);
app.use('/api/ads', advertisementRoutes);

// Test Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend working successfully' });
});

app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

app.get('/api/admin', protect, adminOnly, (req, res) => {
  res.json({ message: 'Access granted to admin route', user: req.user });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
