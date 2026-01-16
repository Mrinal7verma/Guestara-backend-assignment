const Category = require('../models/Category');

// 1. Create a Category
exports.createCategory = async (req, res) => {
  try {
    const { name, image, description, tax_applicable, tax, tax_type } =
      req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // specific validation: If tax is applicable, tax value is mandatory
    if (tax_applicable && !tax) {
      return res
        .status(400)
        .json({ message: 'Tax percentage is required if tax is applicable' });
    }

    const category = await Category.create({
      name,
      image,
      description,
      tax_applicable,
      tax,
      tax_type,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
