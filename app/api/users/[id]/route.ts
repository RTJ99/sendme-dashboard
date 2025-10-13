import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function GET(
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

    // Get user by ID
    const foundUser = await User.findById(userId).select('-password');
    
    if (!foundUser) {
      return createErrorResponse('User not found', 404);
    }

    return createSuccessResponse({
      user: foundUser
    });

  } catch (error) {
    console.error('Get user error:', error);
    return createErrorResponse('Server error while fetching user', 500);
  }
}

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
    const updateData = await request.json();
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData._id;
    delete updateData.createdAt;

    // Validate role if provided
    if (updateData.role && !['admin', 'driver', 'client'].includes(updateData.role)) {
      return createErrorResponse('Invalid role. Must be admin, driver, or client', 400);
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return createErrorResponse('User not found', 404);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return createSuccessResponse({
      user: updatedUser
    }, 'User updated successfully');

  } catch (error) {
    console.error('Update user error:', error);
    return createErrorResponse('Server error while updating user', 500);
  }
}

export async function DELETE(
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

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return createErrorResponse('User not found', 404);
    }

    // Prevent deleting the current admin user
    if (existingUser._id.toString() === user._id.toString()) {
      return createErrorResponse('Cannot delete your own account', 400);
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    return createSuccessResponse({}, 'User deleted successfully');

  } catch (error) {
    console.error('Delete user error:', error);
    return createErrorResponse('Server error while deleting user', 500);
  }
}
