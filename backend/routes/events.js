const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const jwt = require('jsonwebtoken')

// Simple test route to check if routing works
router.get('/test', (req, res) => {
  res.json({ message: 'Events route works!' });
})

// Middleware to verify token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' })
  }
}

// GET /api/events - get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'username')
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' })
  }
})

// POST /api/events - create event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const event = new Event({ ...req.body, creator: req.userId })
    await event.save()
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ message: 'Error creating event' })
  }
})

module.exports = router
