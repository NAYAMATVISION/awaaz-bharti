import Category from '../models/Category.js';

const DEFAULT_CATEGORIES = [
  { name: 'Politics',      slug: 'politics',      displayOrder: 1 },
  { name: 'Business',      slug: 'business',      displayOrder: 2 },
  { name: 'Technology',    slug: 'technology',    displayOrder: 3 },
  { name: 'Sports',        slug: 'sports',        displayOrder: 4 },
  { name: 'Entertainment', slug: 'entertainment', displayOrder: 5 },
  { name: 'Health',        slug: 'health',        displayOrder: 6 },
  { name: 'Crime',         slug: 'crime',         displayOrder: 7 },
];

// Called once on server start — only inserts if collection is empty
export const seedCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map(c => ({ ...c, isActive: true })));
    console.log('Default categories seeded');
  }
};

// Public — active categories ordered for nav
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin — all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, displayOrder, isActive } = req.body;
    const autoSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const category = await new Category({
      name: name.trim(),
      slug: autoSlug,
      displayOrder: displayOrder ?? 0,
      isActive: isActive ?? true,
    }).save();
    res.status(201).json({ success: true, data: category });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, slug, displayOrder, isActive } = req.body;
    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (slug !== undefined) update.slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (displayOrder !== undefined) update.displayOrder = displayOrder;
    if (isActive !== undefined) update.isActive = isActive;
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
