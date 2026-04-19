const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const statsRoutes = require('./routes/stats');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelPreview = /^https?:\/\/.+\.vercel\.app$/i.test(origin);

    if (isExplicitlyAllowed || (process.env.NODE_ENV === 'production' && isVercelPreview)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);

// Root route (useful for quick checks)
app.get('/', (req, res) => {
  res.status(200).send('JobFlow API is running. Try /api/health');
});

// Health check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection?.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({
    status: 'ok',
    db: typeof dbState === 'number' ? dbState : 'unknown',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobtracker';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

<<<<<<< HEAD
// Ensure DB connection exists before DB-backed routes (serverless-safe)
=======
// Ensure DB connection exists before handling requests (serverless-safe)
>>>>>>> 0ebc300096bd3e44bb4f944932b49223f3c722af
app.use(async (req, res, next) => {
  // Allow basic endpoints to respond even when DB is down/misconfigured
  if (req.path === '/' || req.path === '/api/health') return next();

  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
      server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          console.error(`❌ Port ${PORT} is already in use. Stop the other process or set PORT to a free port.`);
          process.exitCode = 1;
          return;
        }
        console.error('❌ Server failed to start:', err);
        process.exitCode = 1;
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      process.exitCode = 1;
    });
<<<<<<< HEAD
=======
} else {
  // For Vercel serverless
  module.exports = app;
>>>>>>> 0ebc300096bd3e44bb4f944932b49223f3c722af
}
