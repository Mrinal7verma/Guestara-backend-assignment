const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemPrice,
  checkAvailability,
  searchItems,
} = require('../controllers/itemController');

// Standard Routes
router.post('/', createItem);
router.get('/', getItems);

// Search Route (Must be before /:id routes so "search" isn't treated as an ID)
router.get('/search', searchItems);

// Specific Item Routes
router.get('/:id/price', getItemPrice);
router.post('/:id/availability', checkAvailability);

module.exports = router;
