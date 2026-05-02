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

  // 🔥 ADD THESE TWO LINES
  resetPasswordToken: String,
  resetPasswordExpire: Date

}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);