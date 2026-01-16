const Item = require('../models/Item');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// --- HELPER: CALCULATE PRICE BASED ON TYPE ---
const calculateBasePrice = (item, requestTime) => {
  const config = item.priceConfiguration;

  switch (item.priceType) {
    case 'static':
      return config.basePrice;

    case 'discount':
      const base = config.basePrice;
      if (config.discountType === 'percentage') {
        return base - (base * config.discountValue) / 100;
      } else {
        // Flat discount
        return Math.max(0, base - config.discountValue);
      }

    case 'dynamic':
      // Find the slot that matches the current time (or requested time)
      // We assume time is stored as "HH:mm" strings like "08:00"
      const currentHour = requestTime.getHours();
      // Simple logic: Check if current hour is within a slot
      // (For a real production app, we would parse minutes carefully)
      const matchedSlot = config.timeSlots.find((slot) => {
        const startH = parseInt(slot.startTime.split(':')[0]);
        const endH = parseInt(slot.endTime.split(':')[0]);
        return currentHour >= startH && currentHour < endH;
      });

      if (!matchedSlot) {
        throw new Error('Item not available at this time');
      }
      return matchedSlot.price;

    case 'complimentary':
      return 0;

    default:
      return config.basePrice || 0;
  }
};

// 1. Create Item
exports.createItem = async (req, res) => {
  try {
    // We added is_bookable, available_days, available_slots to this line:
    const {
      name,
      image,
      description,
      category,
      subCategory,
      tax,
      is_active,
      priceType,
      priceConfiguration,
      is_bookable,
      available_days,
      available_slots,
    } = req.body;

    if (category && subCategory) {
      return res
        .status(400)
        .json({ message: 'Item cannot have both Category and SubCategory' });
    }
    if (!category && !subCategory) {
      return res
        .status(400)
        .json({ message: 'Item must have either Category or SubCategory' });
    }

    const item = await Item.create({
      name,
      image,
      description,
      category,
      subCategory,
      tax,
      is_active,
      priceType,
      priceConfiguration,
      // We added these 3 lines so they get saved to the DB:
      is_bookable,
      available_days,
      available_slots,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All Items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('category', 'name')
      .populate('subCategory', 'name');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Item Price (The "Brain")
exports.getItemPrice = async (req, res) => {
  try {
    const { id } = req.params;

    // Find item and populate parents
    const item = await Item.findById(id)
      .populate('category')
      .populate('subCategory');

    if (!item) return res.status(404).json({ message: 'Item not found' });

    // 1. Calculate Base Price using our Helper
    let finalPrice = 0;
    try {
      // We pass "new Date()" to handle dynamic time-based pricing
      finalPrice = calculateBasePrice(item, new Date());
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    // 2. TAX INHERITANCE LOGIC
    let taxPercentage = 0;
    if (item.tax !== null && item.tax !== undefined) {
      taxPercentage = item.tax;
    } else if (item.subCategory && item.subCategory.tax !== null) {
      taxPercentage = item.subCategory.tax;
    } else if (item.category && item.category.tax !== null) {
      taxPercentage = item.category.tax;
    }

    const taxAmount = (finalPrice * taxPercentage) / 100;
    const totalAmount = finalPrice + taxAmount;

    res.status(200).json({
      success: true,
      data: {
        name: item.name,
        price_type: item.priceType,
        original_price: item.priceConfiguration.basePrice,
        final_price: finalPrice,
        tax_percentage: taxPercentage,
        tax_amount: taxAmount,
        total_payable: totalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Check Availability
exports.checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestDate } = req.body; // Expects "2026-01-20T10:00:00"

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // If item is not active, it's never available
    if (!item.is_active) {
      return res
        .status(200)
        .json({ available: false, reason: 'Item is inactive' });
    }

    // If not bookable, assume it's always available (like standard menu items)
    if (!item.is_bookable) {
      return res
        .status(200)
        .json({ available: true, message: 'Standard item, always available' });
    }

    const date = new Date(requestDate);

    // 1. Check Day of Week (0=Sun, 1=Mon, ..., 6=Sat)
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const requestDay = daysMap[date.getDay()];

    if (
      item.available_days.length > 0 &&
      !item.available_days.includes(requestDay)
    ) {
      return res
        .status(200)
        .json({ available: false, reason: `Not available on ${requestDay}` });
    }

    // 2. Check Time Slots
    // Convert request time to "HH:mm" (e.g., "14:30")
    const requestTime = date.toTimeString().slice(0, 5);
    const requestHour = parseInt(requestTime.split(':')[0]);
    const requestMin = parseInt(requestTime.split(':')[1]);

    if (item.available_slots.length > 0) {
      const isWithinSlot = item.available_slots.some((slot) => {
        const [startH, startM] = slot.startTime.split(':').map(Number);
        const [endH, endM] = slot.endTime.split(':').map(Number);

        // Simple check: Convert everything to minutes for easier comparison
        const reqMinutes = requestHour * 60 + requestMin;
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        return reqMinutes >= startMinutes && reqMinutes < endMinutes;
      });

      if (!isWithinSlot) {
        return res.status(200).json({
          available: false,
          reason: 'Time is outside available slots',
        });
      }
    }

    res.status(200).json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Search Items (Bonus: Simple name search)
exports.searchItems = async (req, res) => {
  try {
    const { name } = req.query;
    // 'i' means case-insensitive (matches "coffee", "Coffee", "COFFEE")
    const items = await Item.find({ name: { $regex: name, $options: 'i' } });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
