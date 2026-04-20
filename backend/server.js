const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const statsRoutes = require('./routes/stats');

const app = express();


// 🔥 DB connection middleware (ONLY ONCE)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ message: "Database connection failed" });
  }
});


// 🌐 CORS
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


// 📦 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


// 🚀 Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);


// 🏠 Root
app.get('/', (req, res) => {
  res.status(200).json({ message: 'JobFlow API is running. Try /api/health' });
});


// ❤️ Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});


// ❌ 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


// ⚠️ Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});


// 🖥️ Local dev server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });

} else {
  // ☁️ Vercel serverless
  module.exports = app;
}