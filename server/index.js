import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Models
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';

// Middleware
import { auth, seller, admin } from './middleware/auth.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // MongoDB Connection
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('MongoDB not connected. Auth system will not work properly.');
  } else {
    try {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }

  // Middleware
  app.use(cors());
  app.use(express.json());

  // --- Forgot Password ---
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.send({ message: 'If an account exists, a reset link has been sent.' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            resetPasswordToken: hashedToken,
            resetPasswordExpire: new Date(Date.now() + 3600000)
          }
        }
      );

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
      console.log("RESET LINK:", resetUrl);

      res.send({
        message: 'If an account exists, a reset link has been sent.',
        dev_debug_link: resetUrl
      });

    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).send({ error: 'Failed to generate reset link' });
    }
  });

  // --- Reset Password ---
  app.post('/api/auth/reset-password/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password || password.length < 6) {
        return res.status(400).send({ error: 'Password must be at least 6 characters' });
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).send({ error: 'Invalid or expired token' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.updateOne(
        { _id: user._id },
        {
          $set: { password: hashedPassword },
          $unset: { resetPasswordToken: "", resetPasswordExpire: "" }
        }
      );

      res.send({ message: 'Password reset successful' });

    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).send({ error: 'Reset failed' });
    }
  });

  // --- Register ---
  app.post('/api/auth/register', async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);

      if (mongoose.connection.readyState !== 1) {
        return res.status(500).send({ error: "Database not connected" });
      }

      const newUser = new User(req.body);
      await newUser.save();

      const token = jwt.sign(
        { _id: newUser._id.toString() },
        process.env.JWT_SECRET || 'your_super_secret_jwt_key_here'
      );

      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).send({ user: userResponse, token });
    } catch (e) {
      console.error('Registration error:', e);
      if (e.code === 11000) {
        return res.status(400).send({ error: 'User already exists with this email' });
      }
      res.status(400).send({ error: e.message || 'Registration failed' });
    }
  });

  // ✅ FIX: Login now updates lastLogin in DB after successful login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // ✅ FIX 1: Check DB connection first
      if (mongoose.connection.readyState !== 1) {
        return res.status(500).send({ error: 'Database not connected' });
      }

      // ✅ FIX 2: Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).send({ error: 'Invalid login credentials' });
      }

      // ✅ FIX 3: Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).send({ error: 'Invalid password' });
      }

      // ✅ FIX 4: Update lastLogin in DB — this was MISSING before
      await User.updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date() } }
      );

      const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET || 'your_super_secret_jwt_key_here'
      );

      const userResponse = user.toObject();
      delete userResponse.password;

      res.send({ user: userResponse, token });
    } catch (e) {
      console.error('Login error:', e);
      res.status(400).send({ error: e.message || 'Login failed' });
    }
  });

  // --- Get Current User ---
  app.get('/api/auth/me', auth, async (req, res) => {
    const userResponse = req.user.toObject();
    delete userResponse.password;
    res.send(userResponse);
  });

  // --- Update Profile ---
  app.patch('/api/auth/profile', auth, async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['name', 'phone', 'address', 'avatar'];
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
      }

      updates.forEach((update) => req.user[update] = req.body[update]);
      await req.user.save();

      const userResponse = req.user.toObject();
      delete userResponse.password;
      res.send(userResponse);
    } catch (e) {
      res.status(400).send({ error: e.message || 'Profile update failed' });
    }
  });

  // --- Products API ---
  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find({}).populate('seller', 'name');
      res.send(products);
    } catch (e) {
      res.status(500).send();
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('seller', 'name');
      if (!product) return res.status(404).send();
      res.send(product);
    } catch (e) {
      res.status(500).send();
    }
  });

  app.post('/api/products', auth, seller, async (req, res) => {
    try {
      const product = new Product({
        ...req.body,
        seller: req.user._id
      });
      await product.save();
      res.status(201).send(product);
    } catch (e) {
      console.error("Product create error:", e);
      res.status(400).send({ error: e.message || 'Failed to create product' });
    }
  });

  app.patch('/api/products/:id', auth, seller, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'price', 'unit', 'category', 'image', 'stock'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
      const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
      if (!product) return res.status(404).send();

      updates.forEach((update) => product[update] = req.body[update]);
      await product.save();
      res.send(product);
    } catch (e) {
      res.status(400).send({ error: e.message || 'Failed to update product' });
    }
  });

  app.delete('/api/products/:id', auth, seller, async (req, res) => {
    try {
      const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
      if (!product) return res.status(404).send();
      res.send(product);
    } catch (e) {
      res.status(500).send();
    }
  });

  // --- Orders API ---
  app.post('/api/orders', auth, async (req, res) => {
    try {
      const order = new Order({
        ...req.body,
        customer: req.user._id
      });
      await order.save();
      res.status(201).send(order);
    } catch (e) {
      res.status(400).send({ error: e.message || 'Failed to place order' });
    }
  });

  app.get('/api/orders/my-orders', auth, async (req, res) => {
    try {
      const orders = await Order.find({ customer: req.user._id }).populate('items.product');
      res.send(orders);
    } catch (e) {
      res.status(500).send();
    }
  });

  app.get('/api/orders/seller', auth, seller, async (req, res) => {
    try {
      const products = await Product.find({ seller: req.user._id });
      const productIds = products.map(p => p._id);
      const orders = await Order.find({
        'items.product': { $in: productIds }
      }).populate('items.product').populate('customer', 'name email phone');
      res.send(orders);
    } catch (e) {
      res.status(500).send();
    }
  });

  app.patch('/api/orders/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send();

    order.status = req.body.status;

    // ✅ Auto-mark COD orders as PAID when delivered
    if (req.body.status === 'DELIVERED' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'PAID';
    }

    await order.save();
    res.send(order);
  } catch (e) {
    res.status(400).send({ error: e.message || 'Failed to update order status' });
  }
});

  // --- Health ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'eKart Backend is healthy',
      dbConnected: mongoose.connection.readyState === 1
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});