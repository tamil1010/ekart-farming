const express = require('express');
const router  = express.Router();
const { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus }
                             = require('../controllers/orderController');
const { protect }            = require('../middleware/authMiddleware');
const { authorizeRoles }     = require('../middleware/roleMiddleware');

router.post('/place',         protect, authorizeRoles('customer'),        placeOrder);
router.get('/my',             protect, authorizeRoles('customer'),        getMyOrders);
router.get('/seller',         protect, authorizeRoles('seller'),          getSellerOrders);
router.put('/:id/status',     protect, authorizeRoles('seller', 'admin'), updateOrderStatus);

module.exports = router;