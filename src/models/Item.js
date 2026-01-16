const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },

    // Item belongs to EITHER category OR subcategory
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },

    tax: { type: Number, default: null }, // If null, we search up the chain

    is_active: { type: Boolean, default: true },

    // --- PRICING ENGINE ---
    priceType: {
      type: String,
      enum: ['static', 'tiered', 'dynamic', 'discount', 'complimentary'],
      required: true,
    },
    // Flexible pricing configuration
    priceConfiguration: {
      basePrice: { type: Number }, // For Static & Discount
      discountType: { type: String, enum: ['percentage', 'flat'] },
      discountValue: { type: Number },

      // For Tiered Pricing (e.g., 0-60 mins = 300)
      tiers: [
        {
          name: String,
          duration: Number, // In minutes
          price: Number,
        },
      ],

      // For Dynamic Pricing (Time slots)
      timeSlots: [
        {
          startTime: String, // "08:00"
          endTime: String, // "11:00"
          price: Number,
        },
      ],
    },

    // --- AVAILABILITY ---
    is_bookable: { type: Boolean, default: false },
    available_days: [{ type: String }], // ["Mon", "Tue"]
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
