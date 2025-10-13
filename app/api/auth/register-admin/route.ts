import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken, createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { fullName, email, phoneNumber, password } = await request.json();

    // Validation
    if (!fullName || !email || !phoneNumber || !password) {
      return createErrorResponse('All fields are required: fullName, email, phoneNumber, password', 400);
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

    // Phone number validation (basic)
    if (phoneNumber.length < 10) {
      return createErrorResponse('Please provide a valid phone number', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return createErrorResponse('User with this email or phone number already exists', 400);
    }

    // Create new admin user
    const adminUser = new User({
      fullName,
      email,
      phoneNumber,
      password,
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();

    // Generate token
    const token = generateToken(adminUser._id.toString());

    return createSuccessResponse({
      user: adminUser.getPublicProfile(),
      token
    }, 'Admin user registered successfully');

  } catch (error) {
    console.error('Admin registration error:', error);
    return createErrorResponse('Server error during admin registration', 500);
  }
}
