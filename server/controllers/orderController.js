const Order   = require('../models/Order');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');

// @POST /api/orders/place — Customer places order from cart
const placeOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  try {
    const cart = await Cart.findOne({ customer: req.user._id })
                           .populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product || product.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${product?.name}` });

      orderItems.push({
        product:      product._id,
        quantity:     item.quantity,
        priceAtOrder: product.price
      });
      totalAmount += product.price * item.quantity;

      // Deduct stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    // Clear cart after order
    await Cart.findOneAndUpdate({ customer: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders/my — Customer sees their orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
                              .populate('items.product', 'name price unit images')
                              .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders/seller — Seller sees orders containing their products
const getSellerOrders = async (req, res) => {
  try {
    const myProducts = await Product.find({ seller: req.user._id }).select('_id');
    const myProductIds = myProducts.map(p => p._id);

    const orders = await Order.find({ 'items.product': { $in: myProductIds } })
                              .populate('items.product', 'name price')
                              .populate('customer', 'name email phone')
                              .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/orders/:id/status — Seller updates order status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus };