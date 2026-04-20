import express from 'express'
import "dotenv/config";
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import statsRoutes from './routes/stats.js';

const app = express();


// 🔥 Connect DB (same as your working project)
try {
  await connectDB();
  console.log("✅ Database connection successful");
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  process.exit(1);
}


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
  console.error(err.message);
  res.status(500).json({ message: err.message });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});