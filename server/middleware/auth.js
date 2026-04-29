import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { mockUsers } from '../mockStore.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here');
    
    let user;
    if (mongoose.connection.readyState === 1) {
      // Check if it's a valid MongoDB ObjectId before querying
      if (mongoose.Types.ObjectId.isValid(decoded._id)) {
        user = await User.findOne({ _id: decoded._id });
      } else {
        // If not a valid ObjectId but we are connected to DB, 
        // it might be a mock user ID from a previous session
        user = mockUsers.find(u => u._id === decoded._id);
      }
    } else {
      user = mockUsers.find(u => u._id === decoded._id);
    }

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export const admin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).send({ error: 'Access denied. Admin only.' });
  }
  next();
};

export const seller = (req, res, next) => {
  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    return res.status(403).send({ error: 'Access denied. Sellers only.' });
  }
  next();
};
