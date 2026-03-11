const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  date: { type: Date, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticketPrice: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  eventImage: String,
  status: { type: String, enum: ['draft', 'published', 'cancelled'], default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
