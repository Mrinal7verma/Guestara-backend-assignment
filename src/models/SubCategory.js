const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: { type: String },
    description: { type: String },
    tax_applicable: { type: Boolean, default: null }, // Null means "inherit from parent"
    tax: { type: Number },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);
