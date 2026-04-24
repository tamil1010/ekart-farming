const express = require('express');
const router  = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');


// 🔥 1. SPECIFIC ROUTES FIRST (important)
router.get('/my/listings', protect, authorizeRoles('seller'), getMyProducts);


// 🔥 2. PUBLIC ROUTES
router.get('/', getAllProducts);          // Public
router.get('/:id', getProductById);       // Public


// 🔥 3. PROTECTED ROUTES (SELLER ONLY)
router.post('/', protect, authorizeRoles('seller'), createProduct);
router.put('/:id', protect, authorizeRoles('seller'), updateProduct);
router.delete('/:id', protect, authorizeRoles('seller'), deleteProduct);


module.exports = router;