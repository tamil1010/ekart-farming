const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity:     { type: Number, required: true },
      priceAtOrder: { type: Number, required: true }   // price snapshot
    }
  ],
  totalAmount:     { type: Number, required: true },
  status:          { type: String,
                     enum: ['pending','confirmed','shipped','delivered','cancelled'],
                     default: 'pending' },
  shippingAddress: { type: String, required: true },
  paymentStatus:   { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);