import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: { 
    type: String, 
    enum: ['CUSTOMER', 'SELLER', 'ADMIN'], 
    default: 'CUSTOMER' 
  },

  avatar: { type: String },
  phone: { type: String },

  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // ✅ ADDED: tracks when user last logged in
  lastLogin: {
    type: Date,
    default: null
  }

}, { timestamps: true });

// ✅ FIXED: removed `next` parameter — not needed in async pre-save hooks
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);