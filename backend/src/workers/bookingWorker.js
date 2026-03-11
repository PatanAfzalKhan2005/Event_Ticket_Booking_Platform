const { Worker, Queue } = require('bullmq');
const { redisUrl } = require('../config/env');
const seatLockManager = require('../utils/seatLockManager');

// periodic cleanup using worker
async function start() {
  // simple worker that listens to a 'cleanup' queue
  const worker = new Worker('booking-cleanup', async job => {
    await seatLockManager.cleanupExpiredLocks();
    return { ok: true };
  }, { connection: { connection: redisUrl } });

  worker.on('error', err => console.error('bookingWorker error', err));
}

if (require.main === module) start();

module.exports = { start };
