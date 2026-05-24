import mongoose from 'mongoose';

const liveEntrySchema = new mongoose.Schema(
  {
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveStory', required: true },
    headline: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('LiveEntry', liveEntrySchema);
