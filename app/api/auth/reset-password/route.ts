import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { token, password } = await request.json();

    if (!token || !password) {
      return createErrorResponse('Token and password are required', 400);
    }

    // Password validation
    if (password.length < 6) {
      return createErrorResponse('Password must be at least 6 characters long', 400);
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return createErrorResponse('Invalid or expired reset token', 400);
    }

    // Update password and clear reset token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return createSuccessResponse(
      null,
      'Password has been reset successfully. You can now log in with your new password.'
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return createErrorResponse('Server error during password reset', 500);
  }
}

// GET endpoint to verify reset token
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return createErrorResponse('Reset token is required', 400);
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return createErrorResponse('Invalid or expired reset token', 400);
    }

    return createSuccessResponse(
      { email: user.email },
      'Reset token is valid'
    );

  } catch (error) {
    console.error('Verify reset token error:', error);
    return createErrorResponse('Server error during token verification', 500);
  }
}
