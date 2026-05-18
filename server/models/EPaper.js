import mongoose from 'mongoose';

const epaperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    cloudinaryId: { type: String, default: '' },
  },
  { timestamps: true }
);

const EPaper = mongoose.model('EPaper', epaperSchema);
export default EPaper;
