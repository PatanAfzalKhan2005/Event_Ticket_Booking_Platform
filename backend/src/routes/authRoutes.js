const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, forgotPassword, resetPassword, me } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', auth, me);

module.exports = router;
