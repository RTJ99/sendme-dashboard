import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Health Check: Starting database health check...');
    
    // Check environment variables
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV
    };
    
    console.log('Health Check: Environment variables:', envCheck);
    
    // Test database connection
    await connectDB();
    console.log('Health Check: Database connected successfully');
    
    // Check if admin users exist
    const adminCount = await User.countDocuments({ role: 'admin' });
    const totalUsers = await User.countDocuments();
    
    console.log('Health Check: Admin users:', adminCount, 'Total users:', totalUsers);
    
    // Get sample admin user if exists
    let sampleAdmin = null;
    if (adminCount > 0) {
      sampleAdmin = await User.findOne({ role: 'admin' }).select('email role createdAt');
    }
    
    return createSuccessResponse({
      status: 'healthy',
      environment: envCheck,
      database: {
        connected: true,
        adminUsers: adminCount,
        totalUsers: totalUsers,
        sampleAdmin: sampleAdmin
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Health Check: Error:', error);
    return createErrorResponse(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}
