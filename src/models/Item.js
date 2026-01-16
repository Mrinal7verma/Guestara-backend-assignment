const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },

    tax: { type: Number, default: null },

    is_active: { type: Boolean, default: true },

    priceType: {
      type: String,
      enum: ['static', 'tiered', 'dynamic', 'discount', 'complimentary'],
      required: true,
    },
    priceConfiguration: {
      basePrice: { type: Number },
      discountType: { type: String, enum: ['percentage', 'flat'] },
      discountValue: { type: Number },

      tiers: [
        {
          name: String,
          duration: Number,
          price: Number,
        },
      ],

      timeSlots: [
        {
          startTime: String,
          endTime: String,
          price: Number,
        },
      ],
    },

    is_bookable: { type: Boolean, default: false },
    available_days: [{ type: String }],
    available_slots: [
      {
        startTime: String,
        endTime: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
