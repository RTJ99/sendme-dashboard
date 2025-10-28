import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb-serverless';
import Driver from '@/lib/models/Driver';
import User from '@/lib/models/User';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';
import { withDatabaseConnection } from '@/lib/api-wrapper';

async function getDriversHandler(request: NextRequest) {
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
    const status = searchParams.get('status') || '';
    const isOnline = searchParams.get('isOnline');

    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (typeof isOnline === 'string') {
      query.isOnline = isOnline === 'true';
    }

    // Get total count
    const total = await Driver.countDocuments(query);

    // Get drivers with user information
    const drivers = await Driver.find(query)
      .populate('userId', 'fullName email phoneNumber profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter by search term if provided
    let filteredDrivers = drivers;
    if (search) {
      filteredDrivers = drivers.filter(driver => {
        const user = driver.userId as any;
        return user.fullName.toLowerCase().includes(search.toLowerCase()) ||
               user.email.toLowerCase().includes(search.toLowerCase()) ||
               user.phoneNumber.includes(search) ||
               driver.licensePlate.toLowerCase().includes(search.toLowerCase());
      });
    }

    return createSuccessResponse({
      drivers: filteredDrivers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalDrivers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get drivers error:', error);
    return createErrorResponse('Server error while fetching drivers', 500);
  }
}

async function createDriverHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const driverData = await request.json();
    const { userId, vehicleType, vehicleModel, vehicleColor, licensePlate, licenseNumber } = driverData;

    // Validation
    if (!userId || !vehicleType || !vehicleModel || !vehicleColor || !licensePlate || !licenseNumber) {
      return createErrorResponse('All required fields must be provided', 400);
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return createErrorResponse('User not found', 404);
    }

    // Check if driver already exists for this user
    const existingDriver = await Driver.findOne({ userId });
    if (existingDriver) {
      return createErrorResponse('Driver profile already exists for this user', 400);
    }

    // Check if license plate is unique
    const existingLicensePlate = await Driver.findOne({ licensePlate });
    if (existingLicensePlate) {
      return createErrorResponse('License plate already exists', 400);
    }

    // Create new driver
    const newDriver = new Driver({
      userId,
      vehicleType,
      vehicleModel,
      vehicleColor,
      licensePlate,
      licenseNumber,
      status: 'pending',
      applicationDate: new Date()
    });

    await newDriver.save();
    await newDriver.getDriverWithUser();

    return createSuccessResponse({
      driver: newDriver
    }, 'Driver created successfully');

  } catch (error) {
    console.error('Create driver error:', error);
    return createErrorResponse('Server error while creating driver', 500);
  }
}

async function updateDriverHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('id');
    
    if (!driverId) {
      return createErrorResponse('Driver ID is required', 400);
    }

    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.userId;

    // Check if driver exists
    const existingDriver = await Driver.findById(driverId);
    if (!existingDriver) {
      return createErrorResponse('Driver not found', 404);
    }

    // Update driver
    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email phoneNumber profileImage');

    return createSuccessResponse({
      driver: updatedDriver
    }, 'Driver updated successfully');

  } catch (error) {
    console.error('Update driver error:', error);
    return createErrorResponse('Server error while updating driver', 500);
  }
}

async function deleteDriverHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('id');
    
    if (!driverId) {
      return createErrorResponse('Driver ID is required', 400);
    }

    // Check if driver exists
    const existingDriver = await Driver.findById(driverId);
    if (!existingDriver) {
      return createErrorResponse('Driver not found', 404);
    }

    // Delete driver
    await Driver.findByIdAndDelete(driverId);

    return createSuccessResponse({}, 'Driver deleted successfully');

  } catch (error) {
    console.error('Delete driver error:', error);
    return createErrorResponse('Server error while deleting driver', 500);
  }
}

// Export handlers with database connection wrapper
export const GET = withDatabaseConnection(getDriversHandler);
export const POST = withDatabaseConnection(createDriverHandler);
export const PUT = withDatabaseConnection(updateDriverHandler);
export const DELETE = withDatabaseConnection(deleteDriverHandler);
