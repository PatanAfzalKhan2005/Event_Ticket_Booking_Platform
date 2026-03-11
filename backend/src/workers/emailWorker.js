const { Worker } = require('bullmq');
const { redisUrl } = require('../config/env');
const emailService = require('../services/emailService');

async function start() {
  const worker = new Worker('emails', async job => {
    const { to, subject, html } = job.data;
    await emailService.sendMail({ to, subject, html });
    return { ok: true };
  }, { connection: { connection: redisUrl } });
  worker.on('failed', (job, err) => console.error('Email job failed', err));
}

if (require.main === module) start();
module.exports = { start };
