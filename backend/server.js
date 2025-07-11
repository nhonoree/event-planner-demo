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

// Allowed frontend origins for CORS
const allowedOrigins = [
  'http://localhost:5173', // your local frontend (vite default port)
  'https://event-planner-demo-5mfd.vercel.app' // your deployed frontend URL (update this!)
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware to parse JSON
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
  app.use('/api/events', eventRoutes);
  console.log('Events routes loaded.');
} catch (error) {
  console.error('Error loading events routes:', error.message);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Graceful shutdown (optional)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
