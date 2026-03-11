const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createBooking, cancelBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');

router.post('/create', auth, createBooking);
router.get('/my-bookings', auth, getMyBookings);
router.get('/all', auth, getAllBookings);
router.post('/cancel/:bookingId', auth, cancelBooking);

module.exports = router;
