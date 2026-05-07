import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: [
  'PENDING',
  'ACCEPTED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
],
    default: 'PENDING' 
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
  shippingAddress: {
    fullAddress: String,
    city: String,
    state: String,
    pincode: String,
  }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
