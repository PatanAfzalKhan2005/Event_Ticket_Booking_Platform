const Seat = require('../models/Seat');

async function lockSeats(eventId, seatNumbers, ttlMs = 2 * 60 * 1000) {
  const now = new Date();
  const lockedUntil = new Date(now.getTime() + ttlMs);
  const res = await Seat.updateMany({ eventId, seatNumber: { $in: seatNumbers }, status: 'available' }, { $set: { status: 'locked', lockedUntil } });
  return res.modifiedCount === seatNumbers.length;
}

async function releaseSeats(eventId, seatNumbers) {
  await Seat.updateMany({ eventId, seatNumber: { $in: seatNumbers }, status: 'locked' }, { $set: { status: 'available', lockedUntil: null } });
}

async function bookSeats(eventId, seatNumbers) {
  await Seat.updateMany({ eventId, seatNumber: { $in: seatNumbers }, status: 'locked' }, { $set: { status: 'booked', lockedUntil: null } });
}

async function cleanupExpiredLocks() {
  const now = new Date();
  await Seat.updateMany({ status: 'locked', lockedUntil: { $lt: now } }, { $set: { status: 'available', lockedUntil: null } });
}

module.exports = { lockSeats, releaseSeats, bookSeats, cleanupExpiredLocks };
