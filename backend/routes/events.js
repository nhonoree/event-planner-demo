const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Events route works!' });
});

// Middleware to verify token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('AuthMiddleware - Token:', token);

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('AuthMiddleware - Decoded:', decoded);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log('AuthMiddleware - Token error:', err.message);
    res.status(403).json({ message: 'Invalid token' });
  }
}

// GET /api/events - get all public events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'username');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// ✅ GET /api/events/my - get events created by logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    console.log('GET /my - userId:', req.userId);
    const events = await Event.find({ creator: req.userId });
    res.json(events);
  } catch (err) {
    console.error('GET /my error:', err.message);
    res.status(500).json({ message: 'Error fetching your events' });
  }
});

// GET /api/events/:id - get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event' });
  }
});

// POST /api/events - create event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const event = new Event({ ...req.body, creator: req.userId });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

// DELETE /api/events/:id - delete event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Event.findOneAndDelete({
      _id: req.params.id,
      creator: req.userId,
    });
    if (!result) return res.status(404).json({ message: 'Event not found or unauthorized' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// PUT /api/events/:id - update event
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.creator.toString() !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;

    await event.save();
    res.json({ message: 'Event updated', event });
  } catch (err) {
    res.status(500).json({ message: 'Error updating event' });
  }
});

module.exports = router;
