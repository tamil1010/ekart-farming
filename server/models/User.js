const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
  type: String, 
  enum: ['customer', 'seller'], 
  default: 'customer' 
},
  phone: String,
  address: String
}, { timestamps: true });

// 🔐 hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔐 compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ THIS LINE IS CRITICAL
module.exports = mongoose.model('User', userSchema);
// console.log("User model loaded");