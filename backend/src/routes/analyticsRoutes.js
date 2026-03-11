const express = require('express');
const router = express.Router();
const { eventAnalytics, summary } = require('../controllers/analyticsController');

router.get('/events/:id', eventAnalytics);
router.get('/summary', summary);

module.exports = router;
