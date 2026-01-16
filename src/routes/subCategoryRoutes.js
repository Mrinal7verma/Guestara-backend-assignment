const express = require('express');
const router = express.Router();
const {
  createSubCategory,
  getSubCategories,
} = require('../controllers/subCategoryController');

router.post('/', createSubCategory);
router.get('/', getSubCategories);

module.exports = router;
