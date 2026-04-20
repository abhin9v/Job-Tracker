import app from '../server.js';
import { connectDB } from '../config/db.js';

// Ensure DB is connected before handling requests
let dbConnected = false;

const ensureDBConnection = async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('✅ Database connected');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return res.status(500).json({ message: 'Database connection failed' });
    }
  }
  next();
};

app.use(ensureDBConnection);

export default app;
