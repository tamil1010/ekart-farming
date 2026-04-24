const Product = require('../models/Product');

// @POST /api/products — Seller only
const createProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user._id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/products — Public (all customers & sellers)
const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = { isAvailable: true };

    if (category) query.category = category;
    if (search)   query.name = { $regex: search, $options: 'i' };

    let products = Product.find(query).populate('seller', 'name email phone');

    if (sort === 'price_asc')  products = products.sort({ price: 1 });
    if (sort === 'price_desc') products = products.sort({ price: -1 });
    if (sort === 'newest')     products = products.sort({ createdAt: -1 });

    res.json(await products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/products/:id — Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
                                 .populate('seller', 'name email phone');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/products/my/listings — Seller sees own products
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/products/:id — Seller only (own product)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only the seller who created it can update
    if (product.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to update this product' });

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/products/:id — Seller only (own product)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to delete this product' });

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct, getAllProducts, getProductById,
  getMyProducts, updateProduct, deleteProduct
};