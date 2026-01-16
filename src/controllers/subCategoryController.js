const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

// 1. Create SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { category, name, image, description, tax_applicable, tax } =
      req.body;

    // Check if parent category exists
    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return res.status(404).json({ message: 'Parent category not found' });
    }

    const subCategory = await SubCategory.create({
      category,
      name,
      image,
      description,
      tax_applicable,
      tax,
    });

    res.status(201).json({ success: true, data: subCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All SubCategories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category', 'name');
    res
      .status(200)
      .json({
        success: true,
        count: subCategories.length,
        data: subCategories,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
