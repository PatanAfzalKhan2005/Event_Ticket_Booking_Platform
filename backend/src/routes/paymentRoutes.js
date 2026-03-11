const express = require('express');
const router = express.Router();
const { initiatePayment, processPayment } = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

router.post('/initiate', auth, initiatePayment);
router.post('/process', auth, processPayment);

module.exports = router;
