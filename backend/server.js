console.log('Starting server initialization...');

// Enhanced require statements with error handling
const requiredModules = [
  { name: 'express', module: 'express' },
  { name: 'mongoose', module: 'mongoose' },
  { name: 'dotenv', module: 'dotenv' },
  { name: 'cors', module: 'cors' }
];

const dependencies = {};
for (const { name, module } of requiredModules) {
  try {
    dependencies[name] = require(module);
    console.log(`Successfully loaded ${name} module`);
  } catch (err) {
    console.error(`FATAL: Failed to load ${name} module`);
    process.exit(1);
  }
}

const { express, mongoose, dotenv, cors } = dependencies;

// Environment configuration
dotenv.config();
console.log('Environment variables loaded');

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`FATAL: Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
'https://event-planner-demo.vercel.app'
  
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10kb' }));
console.log('Middleware setup completed');

// Route loading with better error handling
const loadRoute = async (path, routeName) => {
  try {
    const route = require(path);
    app.use(`/api/${routeName}`, route);
    console.log(`Successfully loaded ${routeName} routes`);
    return true;
  } catch (error) {
    console.error(`Failed to load ${routeName} routes:`, error.message);
    return false;
  }
};

// Load routes
Promise.all([
  loadRoute('./routes/auth', 'auth'),
  loadRoute('./routes/events', 'events')
]).then(results => {
  if (results.some(success => !success)) {
    console.warn('Some routes failed to load');
  }
});

// Enhanced MongoDB connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('MongoDB connection established');
  
  // Start server only after DB connection
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
  });

  // Handle server errors
  server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
})
.catch(err => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});