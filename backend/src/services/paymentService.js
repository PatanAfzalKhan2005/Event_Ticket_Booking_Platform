const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');

async function initiatePayment(bookingId, amount) {
  const payment = await Payment.create({ bookingId, amount, paymentStatus: 'initiated', transactionId: uuidv4() });
  // In a real system we'd redirect to a payment provider; here we simulate
  return payment;
}

async function confirmPayment(transactionId) {
  const payment = await Payment.findOne({ transactionId });
  if (!payment) throw new Error('Payment not found');
  payment.paymentStatus = 'success';
  await payment.save();
  return payment;
}

module.exports = { initiatePayment, confirmPayment };
