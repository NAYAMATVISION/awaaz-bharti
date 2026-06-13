import mongoose from 'mongoose';

const epaperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    cloudinaryId: { type: String, default: '' },
    publicationDate: { type: Date, default: Date.now },
    coverImage: { type: String, default: '' },
  },
  { timestamps: true }
);

const EPaper = mongoose.model('EPaper', epaperSchema);

// Drop the stale `date_1` unique index left over from a previous schema version.
// It no longer exists in the schema but remains in MongoDB, causing E11000
// duplicate key errors when multiple records have date: null.
EPaper.collection.dropIndex('date_1').catch(() => {
  // Silently ignore — index may already be gone on subsequent boots
});

export default EPaper;
