const express = require('express');
const router  = express.Router();
const { getAllUsers, deleteUser, getAllOrders, deleteProduct }
                          = require('../controllers/adminController');
const { protect }         = require('../middleware/authMiddleware');
const { authorizeRoles }  = require('../middleware/roleMiddleware');

router.use(protect, authorizeRoles('admin')); // All admin routes protected

router.get('/users',              getAllUsers);
router.delete('/users/:id',       deleteUser);
router.get('/orders',             getAllOrders);
router.delete('/products/:id',    deleteProduct);

module.exports = router;