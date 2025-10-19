import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken, createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Admin Setup: Starting admin user creation...');
    
    const { email, password, fullName, phoneNumber } = await request.json();
    
    // Validation
    if (!email || !password || !fullName || !phoneNumber) {
      return createErrorResponse('All fields are required: email, password, fullName, phoneNumber', 400);
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse('Please provide a valid email address', 400);
    }
    
    // Password validation
    if (password.length < 6) {
      return createErrorResponse('Password must be at least 6 characters long', 400);
    }
    
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email },
        { role: 'admin' }
      ]
    });
    
    if (existingAdmin) {
      if (existingAdmin.email === email) {
        return createErrorResponse('Admin user with this email already exists', 400);
      }
      if (existingAdmin.role === 'admin') {
        return createErrorResponse('An admin user already exists in the system', 400);
      }
    }
    
    // Create admin user
    const adminUser = new User({
      fullName,
      email,
      phoneNumber,
      password,
      role: 'admin',
      isVerified: true
    });
    
    await adminUser.save();
    console.log('Admin Setup: Admin user created successfully:', adminUser.email);
    
    // Generate token
    const token = generateToken(adminUser._id.toString());
    
    return createSuccessResponse({
      user: adminUser.getPublicProfile(),
      token
    }, 'Admin user created successfully');
    
  } catch (error) {
    console.error('Admin Setup: Error creating admin user:', error);
    return createErrorResponse('Server error while creating admin user', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Admin Setup: Checking admin user status...');
    
    await connectDB();
    
    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' }).select('email fullName createdAt');
    
    return createSuccessResponse({
      adminExists: !!adminExists,
      admin: adminExists
    });
    
  } catch (error) {
    console.error('Admin Setup: Error checking admin status:', error);
    return createErrorResponse('Server error while checking admin status', 500);
  }
}
