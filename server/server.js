import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import connectDB from './config/db.js';

// Routes
import articleRoutes from './routes/articleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import liveRoutes from './routes/liveRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import epaperRoutes from './routes/epaperRoutes.js';
import advertisementRoutes from './routes/advertisementRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Ensure upload directories exist
['uploads', 'uploads/epaper'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Static folder for uploads
app.use("/uploads", express.static("uploads"));

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Routes
import uploadRoutes from './routes/uploadRoutes.js';
app.use('/api/upload', uploadRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/epaper', epaperRoutes);
app.use('/api/ads', advertisementRoutes);

// Test Routes
import { protect, adminOnly } from './middleware/authMiddleware.js';

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend working successfully' });
});

app.get('/api/protected', protect, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route',
    user: req.user 
  });
});

app.get('/api/admin', protect, adminOnly, (req, res) => {
  res.json({ 
    message: 'Access granted to admin route',
    user: req.user 
  });
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
