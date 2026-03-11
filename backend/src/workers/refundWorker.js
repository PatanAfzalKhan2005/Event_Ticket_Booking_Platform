const { Worker } = require('bullmq');
const { redisUrl } = require('../config/env');
const Payment = require('../models/Payment');

async function start() {
  const worker = new Worker('refunds', async job => {
    const { bookingId } = job.data;
    // simple refund processing: mark payment refunded
    const payment = await Payment.findOne({ bookingId });
    if (!payment) return { ok: false, message: 'no payment' };
    payment.paymentStatus = 'refunded';
    await payment.save();
    return { ok: true };
  }, { connection: { connection: redisUrl } });
  worker.on('failed', (job, err) => console.error('Refund job failed', err));
}

if (require.main === module) start();
module.exports = { start };
