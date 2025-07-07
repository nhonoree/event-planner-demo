console.log('Starting server.js...');

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();
console.log('Environment loaded.');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('Middleware setup complete.');

// Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('Auth routes loaded.');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  const eventRoutes = require('./routes/events');
  console.log('Events routes loaded.');
  app.use('/api/events', eventRoutes);
  console.log('Mounted /api/events routes');
} catch (error) {
  console.error('Error loading events routes:', error.message);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
});
