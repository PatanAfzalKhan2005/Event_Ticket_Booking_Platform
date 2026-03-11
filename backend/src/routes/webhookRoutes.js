const express = require('express');
const router = express.Router();
const { handlePaymentWebhook } = require('../services/webhookService');

router.post('/payment', async (req, res) => {
  try {
    await handlePaymentWebhook(req.body);
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

module.exports = router;
