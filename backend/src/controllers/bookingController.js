const bookingService = require('../services/bookingService')
const Booking = require('../models/Booking')

function handleError(res, next, err) {
  if (typeof next === 'function') return next(err)
  return res.status(500).json({ message: err.message || 'Server error' })
}

async function createBooking(req, res, next) {
  try {
    const { eventId, seats } = req.body
    const userId = req.user.id
    const { booking, payment } = await bookingService.createBooking(userId, eventId, seats)
    res.json({ booking, payment })
  } catch (err) {
    return handleError(res, next, err)
  }
}

async function cancelBooking(req, res, next) {
  try {
    const bookingId = req.params.bookingId
    const booking = await Booking.findById(bookingId)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    if (String(booking.userId) !== req.user.id && req.user.role !== 'admin') return res.status(403).end()

    booking.bookingStatus = 'cancelled'
    await booking.save()

    const Payment = require('../models/Payment')
    const payment = await Payment.findById(booking.paymentId)

    if (payment) {
      payment.paymentStatus = 'refunded'
      await payment.save()
    }

    res.json({ ok: true })
  } catch (err) {
    return handleError(res, next, err)
  }
}

async function getMyBookings(req, res, next) {
  try {
    const userId = req.user.id
    const bookings = await Booking.find({ userId }).populate('eventId').lean()
    const mapped = bookings.map((booking) => ({ ...booking, eventName: booking.eventId?.title }))
    res.json(mapped)
  } catch (err) {
    return handleError(res, next, err)
  }
}

async function getAllBookings(req, res, next) {
  try {
    if (req.user.role === 'organizer') {
      const events = await require('../models/Event').find({ organizerId: req.user.id }).select('_id')
      const eventIds = events.map((event) => event._id)
      const bookings = await Booking.find({ eventId: { $in: eventIds } }).populate('userId').populate('eventId').lean()
      const mapped = bookings.map((booking) => ({
        ...booking,
        userName: booking.userId?.name,
        email: booking.userId?.email,
        eventName: booking.eventId?.title
      }))
      return res.json(mapped)
    }

    const bookings = await Booking.find().populate('userId').populate('eventId').lean()
    const mapped = bookings.map((booking) => ({
      ...booking,
      userName: booking.userId?.name,
      email: booking.userId?.email,
      eventName: booking.eventId?.title
    }))
    res.json(mapped)
  } catch (err) {
    return handleError(res, next, err)
  }
}

module.exports = { createBooking, cancelBooking, getMyBookings, getAllBookings }
