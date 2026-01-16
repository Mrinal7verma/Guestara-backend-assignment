const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
} = require('../controllers/categoryController');

// URL: /api/categories
router.post('/', createCategory); // POST creates data
router.get('/', getCategories); // GET reads data

module.exports = router;
