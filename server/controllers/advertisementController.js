import Advertisement from '../models/Advertisement.js';

export const createAdvertisement = async (req, res) => {
  try {
    const { title, image, redirectUrl, placement } = req.body;
    const ad = await Advertisement.create({
      title, image, redirectUrl, placement,
      createdBy: req.user._id,
      status: 'active',
    });
    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdvertisementsByPlacement = async (req, res) => {
  try {
    const ads = await Advertisement.find({
      placement: req.params.placement,
      status: 'active',
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    const { title, image, redirectUrl, placement, status } = req.body;
    if (title) ad.title = title;
    if (image) ad.image = image;
    if (redirectUrl) ad.redirectUrl = redirectUrl;
    if (placement) ad.placement = placement;
    if (status) ad.status = status;
    await ad.save();
    res.json({ success: true, data: ad });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    res.json({ success: true, message: 'Advertisement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleAdvertisementStatus = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    ad.status = ad.status === 'active' ? 'inactive' : 'active';
    await ad.save();
    res.json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
