const Cart    = require('../models/Cart');
const Product = require('../models/Product');

// @GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id })
                           .populate('items.product', 'name price unit images stock');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/cart/add
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity)
      return res.status(400).json({ message: 'Insufficient stock' });

    let cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        customer: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        i => i.product.toString() === productId
      );
      if (itemIndex > -1) {
        // Product exists — update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.json(await cart.populate('items.product', 'name price unit images'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/cart/update
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(await cart.populate('items.product', 'name price unit images'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      i => i.product.toString() !== req.params.productId
    );
    await cart.save();
    res.json({ message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ customer: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };