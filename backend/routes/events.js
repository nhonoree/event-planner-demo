const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const jwt = require('jsonwebtoken')

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
