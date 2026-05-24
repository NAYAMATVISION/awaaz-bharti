import mongoose from 'mongoose';

const liveStorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'live', 'closed', 'rejected'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

liveStorySchema.pre('save', async function () {
  if (!this.slug && this.title) {
    let base = this.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').substring(0, 80);
    let slug = base, count = 1;
    while (await mongoose.model('LiveStory').exists({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${count++}`;
    }
    this.slug = slug;
  }
});

export default mongoose.model('LiveStory', liveStorySchema);
