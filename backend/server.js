import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import statsRoutes from './routes/stats.js';

const app = express();


// 🌐 CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://job-tracker-six-weld.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    const isVercelPreview = /^https?:\/\/.+\.vercel\.app$/i.test(origin);
    if (process.env.NODE_ENV === 'production' && isVercelPreview) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


// 📦 Middleware
app.use(express.json());
app.use(morgan('dev'));


// 🚀 Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);


// 🏠 Root
app.get('/', (req, res) => {
  res.send("JobFlow API running");
});


// ❤️ Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});


// ❌ 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


// ⚠️ Error handler
app.use((err, req, res, next) => {
  console.error('\n❌ Error:', err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  res.status(status).json({ message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) });
});

// Initialize DB connection on startup
let dbConnected = false;

if (process.env.NODE_ENV !== 'production') {
  // Local development
  connectDB().then(() => {
    dbConnected = true;
    console.log('✅ Database connected');
  }).catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });
}

export default app;