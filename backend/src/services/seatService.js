const Seat = require('../models/Seat');
const seatLockManager = require('../utils/seatLockManager');

async function ensureSeatsExistForEvent(eventId, totalSeats) {
  // create seats if none exist
  const count = await Seat.countDocuments({ eventId });
  if (count === 0) {
    const docs = [];
    for (let i = 1; i <= totalSeats; i++) docs.push({ eventId, seatNumber: `${i}` });
    await Seat.insertMany(docs);
  }
}

module.exports = { ensureSeatsExistForEvent, lockSeats: seatLockManager.lockSeats, releaseSeats: seatLockManager.releaseSeats, bookSeats: seatLockManager.bookSeats };
