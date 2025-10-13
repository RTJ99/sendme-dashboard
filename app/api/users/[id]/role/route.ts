import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Driver from '@/lib/models/Driver';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { id: userId } = params;
    const { role } = await request.json();

    if (!role) {
      return createErrorResponse('Role is required', 400);
    }

    // Validate role
    if (!['admin', 'driver', 'client'].includes(role)) {
      return createErrorResponse('Invalid role. Must be admin, driver, or client', 400);
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return createErrorResponse('User not found', 404);
    }

    // Prevent changing your own role
    if (existingUser._id.toString() === user._id.toString()) {
      return createErrorResponse('Cannot change your own role', 400);
    }

    // If changing to driver role, check if driver profile exists
    if (role === 'driver') {
      const existingDriver = await Driver.findOne({ userId: userId });
      if (!existingDriver) {
        return createErrorResponse('Driver profile not found. User must have a driver application approved first.', 400);
      }
    }

    // If changing from driver to client, handle driver profile
    if (existingUser.role === 'driver' && role === 'client') {
      // Optionally, you might want to deactivate the driver profile instead of deleting it
      // For now, we'll just update the user role
      console.log(`Converting driver ${userId} back to client role`);
    }

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    return createSuccessResponse({
      user: updatedUser
    }, 'User role updated successfully');

  } catch (error) {
    console.error('Update user role error:', error);
    return createErrorResponse('Server error while updating user role', 500);
  }
}
