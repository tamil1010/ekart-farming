const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');

const getAllUsers    = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

const deleteUser    = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

const getAllOrders   = async (req, res) => {
  const orders = await Order.find()
    .populate('customer', 'name email')
    .populate('items.product', 'name price');
  res.json(orders);
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted by admin' });
};

module.exports = { getAllUsers, deleteUser, getAllOrders, deleteProduct };