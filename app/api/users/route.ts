import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb-serverless';
import User from '@/lib/models/User';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';
import { withDatabaseConnection } from '@/lib/api-wrapper';

async function getUsersHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    // Build query
    const query: any = {};
    
    if (role) {
      query.role = role;
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get users
    const users = await User.find(query)
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter by search term if provided
    let filteredUsers = users;
    if (search) {
      filteredUsers = users.filter(user => {
        return user.fullName.toLowerCase().includes(search.toLowerCase()) ||
               user.email.toLowerCase().includes(search.toLowerCase()) ||
               user.phoneNumber.includes(search);
      });
    }

    return createSuccessResponse({
      users: filteredUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return createErrorResponse('Server error while fetching users', 500);
  }
}

async function createUserHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { fullName, email, phoneNumber, password, role } = await request.json();

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

    // Role validation
    const validRoles = ['admin', 'driver', 'client'];
    if (role && !validRoles.includes(role)) {
      return createErrorResponse('Invalid role. Must be admin, driver, or client', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return createErrorResponse('User with this email or phone number already exists', 400);
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password,
      role: role || 'client',
      isVerified: true
    });

    await newUser.save();

    return createSuccessResponse({
      user: newUser.getPublicProfile()
    }, 'User created successfully');

  } catch (error) {
    console.error('Create user error:', error);
    return createErrorResponse('Server error while creating user', 500);
  }
}

async function updateUserHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return createErrorResponse('User ID is required', 400);
    }

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

async function deleteUserHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return createErrorResponse('User ID is required', 400);
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return createErrorResponse('User not found', 404);
    }

    // Prevent deleting the current admin user
    if (existingUser._id.toString() === (user._id as any).toString()) {
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

// Export handlers with database connection wrapper
export const GET = withDatabaseConnection(getUsersHandler);
export const POST = withDatabaseConnection(createUserHandler);
export const PUT = withDatabaseConnection(updateUserHandler);
export const DELETE = withDatabaseConnection(deleteUserHandler);
