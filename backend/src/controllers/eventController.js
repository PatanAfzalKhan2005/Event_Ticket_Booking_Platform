const Event = require('../models/Event');
const Seat = require('../models/Seat');
const seatService = require('../services/seatService');

function handleError(res, next, err) {
  if (typeof next === 'function') return next(err);
  return res.status(500).json({ message: err.message || 'Server error' });
}

async function getSeatsForEvent(req, res, next) {
  try {
    const eventId = req.params.id;
    const seats = await Seat.find({ eventId }).sort({ seatNumber: 1 });
    res.json(seats);
  } catch (err) { return handleError(res, next, err); }
}

async function createEvent(req, res, next) {
  try {
    const payload = req.body;
    if (req.file) payload.eventImage = `/uploads/events/${req.file.filename}`;
    payload.organizerId = req.user.id;
    payload.availableSeats = payload.totalSeats;
    const event = await Event.create(payload);
    // ensure seats
    await seatService.ensureSeatsExistForEvent(event._id, event.totalSeats);
    res.status(201).json(event);
  } catch (err) { return handleError(res, next, err); }
}

async function listEvents(req, res, next) {
  try { const events = await Event.find(); res.json(events); } catch (err) { return handleError(res, next, err); }
}

async function getEvent(req, res, next) {
  try { const event = await Event.findById(req.params.id); if (!event) return res.status(404).end(); res.json(event); } catch (err) { return handleError(res, next, err); }
}

async function updateEvent(req, res, next) {
  try {
    const id = req.params.id;
    const payload = req.body;
    if (req.file) payload.eventImage = `/uploads/events/${req.file.filename}`;
    const ev = await Event.findByIdAndUpdate(id, payload, { new: true });
    res.json(ev);
  } catch (err) { return handleError(res, next, err); }
}

async function deleteEvent(req, res, next) {
  try { await Event.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (err) { return handleError(res, next, err); }
}

module.exports = { createEvent, listEvents, getEvent, updateEvent, deleteEvent, getSeatsForEvent };
