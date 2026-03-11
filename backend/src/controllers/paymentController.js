const bookingService = require('../services/bookingService');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

function handleError(res, next, err) {
  if (typeof next === 'function') return next(err);
  return res.status(500).json({ message: err.message || 'Server error' });
}

async function initiatePayment(req, res, next) {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const payment = await Payment.create({ bookingId: booking._id, amount: booking.totalAmount, paymentStatus: 'initiated', transactionId: require('uuid').v4() });
    // Return simulated payment url / transactionId
    res.json({ transactionId: payment.transactionId, paymentId: payment._id });
  } catch (err) { return handleError(res, next, err); }
}

// Simulate payment processing (POST /api/payments/process)
async function processPayment(req, res, next) {
  try {
    const { paymentId, transactionId } = req.body;
    if (!paymentId) return res.status(400).json({ success: false, message: 'paymentId required' });
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    // idempotent: if already success, return success
    if (payment.paymentStatus === 'success') return res.json({ success: true, message: 'Payment already processed' });

    // confirm booking via bookingService
    await bookingService.confirmBooking(payment._id, transactionId || payment.transactionId);

    res.json({ success: true, message: 'Payment Successful' });
  } catch (err) { return handleError(res, next, err); }
}

module.exports = { initiatePayment, processPayment };
