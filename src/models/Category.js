const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: { type: String },
    description: { type: String },
    tax_applicable: {
      type: Boolean,
      default: false,
    },
    tax: {
      type: Number,
      // Validation: tax is required if tax_applicable is true
      required: function () {
        return this.tax_applicable;
      },
    },
    tax_type: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
