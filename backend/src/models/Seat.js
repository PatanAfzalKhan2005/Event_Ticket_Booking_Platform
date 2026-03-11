const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  seatNumber: { type: String, required: true },
  row: String,
  status: { type: String, enum: ['available', 'locked', 'booked'], default: 'available' },
  lockedUntil: Date
});

SeatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', SeatSchema);
