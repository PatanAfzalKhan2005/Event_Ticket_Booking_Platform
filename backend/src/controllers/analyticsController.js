const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

function handleError(res, next, err) {
  if (typeof next === 'function') return next(err);
  return res.status(500).json({ message: err.message || 'Server error' });
}

async function summary(req, res, next) {
  try {
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const agg = await Booking.aggregate([{ $group: { _id: null, revenue: { $sum: '$totalAmount' } } }]);
    const revenue = (agg[0] && agg[0].revenue) || 0;
    res.json({ totalEvents, totalBookings, revenue });
  } catch (err) { return handleError(res, next, err); }
}

async function eventAnalytics(req, res, next) {
  try {
    const eventId = require('mongoose').Types.ObjectId(req.params.id);
    const ticketsSold = await Ticket.countDocuments({ eventId });
    const revenueAgg = await Booking.aggregate([
      { $match: { eventId } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
    ]);
    const revenue = (revenueAgg[0] && revenueAgg[0].revenue) || 0;
    const seatOccupancy = ticketsSold; // total seats sold
    const daily = await Booking.aggregate([
      { $match: { eventId } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ ticketsSold, revenue, seatOccupancy, dailyBookings: daily });
  } catch (err) { return handleError(res, next, err); }
}

module.exports = { eventAnalytics, summary };
