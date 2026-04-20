const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
import connectDB from "./config/db.js";
require('dotenv').config();

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const statsRoutes = require('./routes/stats');


const app = express();
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});
// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://job-tracker-six-weld.vercel.app',
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
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);

// Root route (useful for quick checks)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'JobFlow API is running. Try /api/health' });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
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
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    isConnected = false;
    throw err;
  }
};

// Ensure DB connection exists before handling requests (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ message: 'Database connection failed' });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
      });
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
      console.error('❌ Failed to connect to MongoDB:', err.message);
      process.exitCode = 1;
    });
} else {
  // For Vercel serverless
  module.exports = app;
}