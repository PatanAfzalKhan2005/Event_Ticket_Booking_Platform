const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['initiated', 'success', 'failed', 'refunded'], default: 'initiated' },
  transactionId: String,
  webhookProcessed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
