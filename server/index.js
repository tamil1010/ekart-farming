import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';


//import { createServer as createViteServer } from 'vite';

// Models
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';

// Middleware
import { auth, seller, admin } from './middleware/auth.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { mockUsers } from './mockStore.js';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // MongoDB Connection
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('MONGODB_URI not found in environment. Backend will run with in-memory storage for auth.');
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

  // --- Auth API ---
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      let newUser;

      if (mongoose.connection.readyState === 1) {
        newUser = new User(req.body);
        await newUser.save();
      } else {
        // Check if user already exists in mock
        const existingMockUser = mockUsers.find(u => u.email === email);
        if (existingMockUser) {
          return res.status(400).send({ error: 'User already exists with this email' });
        }
        
        newUser = {
          _id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          password, 
          role: role || 'CUSTOMER',
          createdAt: new Date().toISOString()
        };
        mockUsers.push(newUser);
      }

      const token = jwt.sign({ _id: newUser._id.toString() }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here');
      
      const userResponse = (newUser && typeof newUser.toObject === 'function') ? newUser.toObject() : { ...newUser };
      delete userResponse.password;

      res.status(201).send({ user: userResponse, token });
    } catch (e) {
      console.error('Registration error:', e);
      if (e.code === 11000 || (e.name === 'MongoServerError' && e.message.includes('E11000'))) {
        return res.status(400).send({ error: 'User already exists with this email' });
      }
      res.status(400).send({ error: e.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      let user;

      // Try database first if connected
      if (mongoose.connection.readyState === 1) {
        user = await User.findOne({ email });
        if (user && !(await user.comparePassword(password))) {
          return res.status(401).send({ error: 'Invalid password' });
        }
      } 
      
      // Fallback to mock users if not found in DB or DB not connected
      if (!user) {
        user = mockUsers.find(u => u.email === email && u.password === password);
      }

      if (!user) {
        return res.status(401).send({ error: 'Invalid login credentials' });
      }

      const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here');
      
      const userResponse = (user && typeof user.toObject === 'function') ? user.toObject() : { ...user };
      delete userResponse.password;
      
      res.send({ user: userResponse, token });
    } catch (e) {
      res.status(400).send({ error: e.message || 'Login failed' });
    }
  });

  app.get('/api/auth/me', auth, async (req, res) => {
    // req.user is set by auth middleware
    const userResponse = (req.user && typeof req.user.toObject === 'function') ? req.user.toObject() : { ...req.user };
    delete userResponse.password;
    res.send(userResponse);
  });

  app.patch('/api/auth/profile', auth, async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['name', 'phone', 'address', 'avatar'];
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
      }

      if (mongoose.connection.readyState === 1) {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
      } else {
        // Mock update
        const userIdx = mockUsers.findIndex(u => u._id === req.user._id);
        if (userIdx !== -1) {
          updates.forEach((update) => {
            mockUsers[userIdx][update] = req.body[update];
          });
          req.user = { ...mockUsers[userIdx] };
        }
      }

      const userResponse = (req.user && typeof req.user.toObject === 'function') ? req.user.toObject() : { ...req.user };
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

      if (!product) {
        return res.status(404).send();
      }

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

      if (!product) {
        return res.status(404).send();
      }

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
      await order.save();
      res.send(order);
    } catch (e) {
      res.status(400).send({ error: e.message || 'Failed to update order status' });
    }
  });

  // Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'eKart Backend is healthy', dbConnected: mongoose.connection.readyState === 1 });
  });

  // Vite integration
  // if (process.env.NODE_ENV !== 'production') {
  //   const vite = await createViteServer({
  //     root: path.resolve(__dirname, '../client'),
  //     server: { middlewareMode: true },
  //     appType: 'spa',
  //   });
  //   app.use(vite.middlewares);
  // } else {
  //   const distPath = path.join(process.cwd(), 'client/dist');
  //   app.use(express.static(distPath));
  //   app.get('*', (req, res) => {
  //     res.sendFile(path.join(distPath, 'index.html'));
  //   });
  // }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
