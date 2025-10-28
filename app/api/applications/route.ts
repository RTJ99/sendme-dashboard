import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb-serverless';
import Application from '@/lib/models/Application';
import User from '@/lib/models/User';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';
import { withDatabaseConnection } from '@/lib/api-wrapper';

async function getApplicationsHandler(request: NextRequest) {
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

    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }

    // Get total count
    const total = await Application.countDocuments(query);

    // Get applications with user information
    const applications = await Application.find(query)
      .populate('user', 'fullName email phoneNumber profileImage')
      .populate('reviewedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter by search term if provided
    let filteredApplications = applications;
    if (search) {
      filteredApplications = applications.filter(application => {
        const user = application.user as any;
        return user.fullName.toLowerCase().includes(search.toLowerCase()) ||
               user.email.toLowerCase().includes(search.toLowerCase()) ||
               user.phoneNumber.includes(search) ||
               application.licensePlate.toLowerCase().includes(search.toLowerCase());
      });
    }

    return createSuccessResponse({
      applications: filteredApplications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    return createErrorResponse('Server error while fetching applications', 500);
  }
}

async function createApplicationHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const applicationData = await request.json();
    const { user: userId, fullName, email, phoneNumber, vehicleType, licensePlate } = applicationData;

    // Validation
    if (!userId || !fullName || !email || !phoneNumber || !vehicleType || !licensePlate) {
      return createErrorResponse('All required fields must be provided', 400);
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return createErrorResponse('User not found', 404);
    }

    // Check if application already exists for this user
    const existingApplication = await Application.findOne({ user: userId });
    if (existingApplication) {
      return createErrorResponse('Application already exists for this user', 400);
    }

    // Check if license plate is unique
    const existingLicensePlate = await Application.findOne({ licensePlate });
    if (existingLicensePlate) {
      return createErrorResponse('License plate already exists', 400);
    }

    // Create new application
    const newApplication = new Application({
      user: userId,
      fullName,
      email,
      phoneNumber,
      vehicleType,
      licensePlate,
      status: 'pending'
    });

    await newApplication.save();
    await newApplication.getApplicationWithUser();

    return createSuccessResponse({
      application: newApplication
    }, 'Application created successfully');

  } catch (error) {
    console.error('Create application error:', error);
    return createErrorResponse('Server error while creating application', 500);
  }
}

async function updateApplicationHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');
    
    if (!applicationId) {
      return createErrorResponse('Application ID is required', 400);
    }

    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.user;

    // Check if application exists
    const existingApplication = await Application.findById(applicationId);
    if (!existingApplication) {
      return createErrorResponse('Application not found', 404);
    }

    // Update application
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'fullName email phoneNumber profileImage')
     .populate('reviewedBy', 'fullName email');

    return createSuccessResponse({
      application: updatedApplication
    }, 'Application updated successfully');

  } catch (error) {
    console.error('Update application error:', error);
    return createErrorResponse('Server error while updating application', 500);
  }
}

async function deleteApplicationHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');
    
    if (!applicationId) {
      return createErrorResponse('Application ID is required', 400);
    }

    // Check if application exists
    const existingApplication = await Application.findById(applicationId);
    if (!existingApplication) {
      return createErrorResponse('Application not found', 404);
    }

    // Delete application
    await Application.findByIdAndDelete(applicationId);

    return createSuccessResponse({}, 'Application deleted successfully');

  } catch (error) {
    console.error('Delete application error:', error);
    return createErrorResponse('Server error while deleting application', 500);
  }
}

// Export handlers with database connection wrapper
export const GET = withDatabaseConnection(getApplicationsHandler);
export const POST = withDatabaseConnection(createApplicationHandler);
export const PUT = withDatabaseConnection(updateApplicationHandler);
export const DELETE = withDatabaseConnection(deleteApplicationHandler);

