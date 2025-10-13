import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken, createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Login API: Starting login process...');
    await connectDB();

    const { email, password } = await request.json();
    console.log('Login API: Email:', email, 'Password length:', password?.length);

    if (!email || !password) {
      console.log('Login API: Missing email or password');
      return createErrorResponse('Email and password are required', 400);
    }

    // Find user by email
    console.log('Login API: Looking for user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login API: User not found');
      return createErrorResponse('Invalid credentials', 401);
    }

    console.log('Login API: User found:', user.email, 'Role:', user.role);

    // Check password
    console.log('Login API: Checking password...');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Login API: Invalid password');
      return createErrorResponse('Invalid credentials', 401);
    }

    console.log('Login API: Password valid, generating token...');
    // Generate token
    const token = generateToken(user._id.toString());

    const response = createSuccessResponse({
      user: user.getPublicProfile(),
      token
    }, 'Login successful');

    console.log('Login API: Login successful, returning response');
    return response;

  } catch (error) {
    console.error('Login API: Login error:', error);
    return createErrorResponse('Server error during login', 500);
  }
}
