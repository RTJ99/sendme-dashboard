import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('MongoDB: Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('MongoDB: Creating new connection...');
    console.log('MongoDB: URI exists:', !!MONGODB_URI);
    console.log('MongoDB: URI starts with:', MONGODB_URI?.substring(0, 20) + '...');
    
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB: Connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB: Connection established');
  } catch (e) {
    console.error('MongoDB: Connection failed:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
