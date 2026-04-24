const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  unit:        { type: String, required: true, enum: ['kg', 'gram', 'litre', 'dozen', 'piece'] },
  stock:       { type: Number, required: true, default: 0 },
  category:    { type: String, required: true, 
                 enum: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Others'] },
  images:      [{ type: String }],
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);