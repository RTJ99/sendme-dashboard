import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import User, { IUser } from './models/User';
import { ensureConnection, clearConnectionCache } from './mongodb-serverless';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

// Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// Verify JWT token
export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

// Get user from request headers
export const getUserFromRequest = async (request: NextRequest): Promise<IUser | null> => {
  try {
    console.log('Auth: Getting user from request...');
    const authHeader = request.headers.get('authorization');
    console.log('Auth: Authorization header exists:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth: No valid authorization header');
      return null;
    }

    const token = authHeader.substring(7);
    console.log('Auth: Token length:', token.length);
    
    const decoded = verifyToken(token);
    console.log('Auth: Token decoded, userId:', decoded.userId);
    
    // Check if JWT_SECRET is available
    if (!JWT_SECRET) {
      console.error('Auth: JWT_SECRET is not defined');
      return null;
    }
    
    // Ensure database connection before querying
    const isConnected = await ensureConnection();
    if (!isConnected) {
      console.error('Auth: Failed to establish database connection');
      return null;
    }
    
    // Check database connection with retry logic
    try {
      const user = await User.findById(decoded.userId).select('-password');
      console.log('Auth: User found:', !!user, user?.email, user?.role);
      
      if (!user) {
        console.error('Auth: User not found in database for userId:', decoded.userId);
        // Try to find any admin users to verify database connection
        try {
          const adminCount = await User.countDocuments({ role: 'admin' });
          console.log('Auth: Total admin users in database:', adminCount);
        } catch (countError) {
          console.error('Auth: Failed to count admin users:', countError);
        }
      }
      
      return user;
    } catch (dbError) {
      console.error('Auth: Database error:', dbError);
      
      // If it's a timeout error, try to reconnect
      if (dbError instanceof Error && dbError.message.includes('buffering timed out')) {
        console.log('Auth: Detected buffering timeout, attempting to reconnect...');
        try {
          // Clear connection cache and try again
          clearConnectionCache();
          
          // Ensure fresh connection
          const isReconnected = await ensureConnection();
          if (!isReconnected) {
            console.error('Auth: Failed to reconnect to database');
            return null;
          }
          
          // Try the query again with a fresh connection
          const user = await User.findById(decoded.userId).select('-password');
          console.log('Auth: User found after reconnect:', !!user, user?.email, user?.role);
          return user;
        } catch (retryError) {
          console.error('Auth: Retry failed:', retryError);
        }
      }
      
      return null;
    }
  } catch (error) {
    console.error('Auth: Error getting user from request:', error);
    return null;
  }
};

// Check if user has admin role
export const isAdmin = (user: IUser | null): boolean => {
  return user?.role === 'admin';
};

// Check if user has driver role
export const isDriver = (user: IUser | null): boolean => {
  return user?.role === 'driver' || user?.role === 'admin';
};

// Check if user has client role
export const isClient = (user: IUser | null): boolean => {
  return user?.role === 'client' || user?.role === 'admin';
};

// API Response helpers
export const createResponse = (data: any, status: number = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createErrorResponse = (message: string, status: number = 400) => {
  return createResponse({
    success: false,
    message
  }, status);
};

export const createSuccessResponse = (data: any, message: string = 'Success') => {
  return createResponse({
    success: true,
    message,
    data
  });
};
