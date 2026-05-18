import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    placement: {
      type: String,
      enum: ['homepage-sidebar'],
      default: 'homepage-sidebar',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Advertisement = mongoose.model('Advertisement', advertisementSchema);
export default Advertisement;
