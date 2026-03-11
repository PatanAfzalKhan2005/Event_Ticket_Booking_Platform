const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { permit } = require('../middleware/roleMiddleware');
const upload = require('../services/fileUploadService');
const { createEvent, listEvents, getEvent, updateEvent, deleteEvent, getSeatsForEvent } = require('../controllers/eventController');

router.post('/', auth, permit('organizer'), upload.single('image'), createEvent);
router.get('/', listEvents);
// seats endpoint before :id
router.get('/:id/seats', getSeatsForEvent);
router.get('/:id', getEvent);
router.put('/:id', auth, permit('organizer'), upload.single('image'), updateEvent);
router.delete('/:id', auth, permit('organizer'), deleteEvent);

module.exports = router;
