import mongoose from 'mongoose';

mongoose.set('bufferTimeoutMS', 30000); // 🔥 IMPORTANT FIX

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required but not set');
  }

  if (cached.conn) {
    console.log("⚡ Using cached DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: 'jobtracker',
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    };

    console.log("⏳ Connecting to DB...");

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ DB Connected");
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.log("❌ DB connection failed:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};