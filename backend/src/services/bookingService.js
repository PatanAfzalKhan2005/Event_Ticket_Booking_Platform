const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const mongoose = require('mongoose');
const seatLockManager = require('../utils/seatLockManager');
const { v4: uuidv4 } = require('uuid');

async function createBooking(userId, eventId, seatNumbers) {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');
  const totalAmount = seatNumbers.length * event.ticketPrice;

  // try lock seats
  const locked = await seatLockManager.lockSeats(eventId, seatNumbers);
  if (!locked) throw new Error('Failed to lock seats');

  const booking = await Booking.create({ userId, eventId, seats: seatNumbers, totalAmount, bookingStatus: 'pending' });
  const payment = await Payment.create({ bookingId: booking._id, amount: totalAmount, paymentStatus: 'initiated', transactionId: uuidv4() });
  booking.paymentId = payment._id;
  await booking.save();
  return { booking, payment };
}

async function confirmBooking(paymentId, transactionId) {
  // atomic booking: mark payment success, booking confirmed, seats booked, tickets generated, decrement availableSeats
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new Error('Payment not found');
  if (payment.paymentStatus === 'success') return payment; // idempotent

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    payment.paymentStatus = 'success';
    payment.transactionId = transactionId || payment.transactionId;
    await payment.save({ session });

    const booking = await Booking.findById(payment.bookingId).session(session);
    if (!booking) throw new Error('Booking not found');
    booking.bookingStatus = 'confirmed';
    await booking.save({ session });

    // mark seats booked
    await seatLockManager.bookSeats(booking.eventId, booking.seats);

    // decrement event availableSeats
    await Event.findByIdAndUpdate(booking.eventId, { $inc: { availableSeats: -booking.seats.length } }, { session });

    // generate tickets
    const tickets = booking.seats.map((s) => ({ bookingId: booking._id, ticketCode: uuidv4(), seatNumber: s, eventId: booking.eventId, userId: booking.userId }));
    await Ticket.insertMany(tickets, { session });

    await session.commitTransaction();
    session.endSession();
    return payment;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = { createBooking, confirmBooking };
