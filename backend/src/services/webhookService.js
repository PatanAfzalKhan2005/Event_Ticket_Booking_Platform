const Payment = require('../models/Payment');
const { isProcessed, markProcessed } = require('../utils/idempotency');
const bookingService = require('./bookingService');

async function handlePaymentWebhook(payload) {
  const { transactionId, paymentId } = payload;
  const key = transactionId || paymentId;
  if (isProcessed(key)) return { ok: true, message: 'already processed' };
  const payment = await Payment.findOne({ transactionId });
  if (!payment) throw new Error('Payment not found');
  if (payment.webhookProcessed) return { ok: true, message: 'already processed' };

  await bookingService.confirmBooking(payment._id, transactionId);
  payment.webhookProcessed = true;
  await payment.save();
  markProcessed(key);
  return { ok: true };
}

module.exports = { handlePaymentWebhook };
