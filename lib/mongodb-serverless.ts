import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Optimized MongoDB connection for serverless environments like Vercel
 * This version is specifically designed to handle cold starts and connection timeouts
 */

// Global connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connection options optimized for serverless
const connectionOptions = {
  bufferCommands: false,
  bufferMaxEntries: 0,
  maxPoolSize: 1, // Maintain up to 1 socket connection
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
  // Additional serverless optimizations
  retryWrites: true,
  retryReads: true,
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
};

async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    console.log('MongoDB: Using cached connection');
    return cached.conn;
  }

  // Create new connection if not already in progress
  if (!cached.promise) {
    console.log('MongoDB: Creating new connection for serverless environment...');
    console.log('MongoDB: URI exists:', !!MONGODB_URI);
    console.log('MongoDB: URI starts with:', MONGODB_URI?.substring(0, 20) + '...');
    
    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions).then((mongoose) => {
      console.log('MongoDB: Connected successfully to serverless environment');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB: Connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB: Disconnected');
        // Clear cache on disconnect
        cached.conn = null;
        cached.promise = null;
      });
      
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB: Connection failed:', error);
      // Clear promise on error so we can retry
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB: Connection established for serverless');
  } catch (e) {
    console.error('MongoDB: Connection failed:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Utility function to ensure connection before operations
export async function ensureConnection() {
  try {
    await connectDB();
    return true;
  } catch (error) {
    console.error('MongoDB: Failed to ensure connection:', error);
    return false;
  }
}

// Utility function to clear connection cache (useful for retries)
export function clearConnectionCache() {
  if (global.mongoose) {
    global.mongoose.conn = null;
    global.mongoose.promise = null;
  }
}

export default connectDB;
