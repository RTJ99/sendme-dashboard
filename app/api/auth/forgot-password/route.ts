import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { createSuccessResponse, createErrorResponse } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return createErrorResponse('Email is required', 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse('Please provide a valid email address', 400);
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if email exists or not
      return createSuccessResponse(
        null, 
        'If an account with that email exists, we have sent a password reset link.'
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // In a real application, you would send an email here
    // For now, we'll just return the token in development
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log('Password reset URL:', resetUrl);
    
    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, resetUrl);

    return createSuccessResponse(
      { resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined },
      'If an account with that email exists, we have sent a password reset link.'
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return createErrorResponse('Server error during password reset request', 500);
  }
}
