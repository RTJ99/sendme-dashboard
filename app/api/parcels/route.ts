import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb-serverless';
import Parcel from '@/lib/models/Parcel';
import User from '@/lib/models/User';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';
import { withDatabaseConnection } from '@/lib/api-wrapper';

async function getParcelsHandler(request: NextRequest) {
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
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Get total count
    const total = await Parcel.countDocuments(query);

    // Get parcels with user information
    const parcels = await Parcel.find(query)
      .populate('sender', 'fullName email phoneNumber')
      .populate('driver', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter by search term if provided
    let filteredParcels = parcels;
    if (search) {
      filteredParcels = parcels.filter(parcel => {
        const sender = parcel.sender as any;
        const driver = parcel.driver as any;
        return sender.fullName.toLowerCase().includes(search.toLowerCase()) ||
               sender.email.toLowerCase().includes(search.toLowerCase()) ||
               (driver && driver.fullName.toLowerCase().includes(search.toLowerCase())) ||
               parcel.description.toLowerCase().includes(search.toLowerCase()) ||
               parcel.pickupLocation.name.toLowerCase().includes(search.toLowerCase()) ||
               parcel.dropoffLocation.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    return createSuccessResponse({
      parcels: filteredParcels,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalParcels: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get parcels error:', error);
    return createErrorResponse('Server error while fetching parcels', 500);
  }
}

async function createParcelHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const parcelData = await request.json();
    const { sender, description, price, pickupLocation, dropoffLocation, paymentMethod } = parcelData;

    // Validation
    if (!sender || !description || !price || !pickupLocation || !dropoffLocation || !paymentMethod) {
      return createErrorResponse('All required fields must be provided', 400);
    }

    // Check if sender exists
    const existingSender = await User.findById(sender);
    if (!existingSender) {
      return createErrorResponse('Sender not found', 404);
    }

    // Create new parcel
    const newParcel = new Parcel({
      sender,
      description,
      price,
      pickupLocation,
      dropoffLocation,
      paymentMethod,
      status: 'pending'
    });

    await newParcel.save();
    await newParcel.getParcelWithUsers();

    return createSuccessResponse({
      parcel: newParcel
    }, 'Parcel created successfully');

  } catch (error) {
    console.error('Create parcel error:', error);
    return createErrorResponse('Server error while creating parcel', 500);
  }
}

async function updateParcelHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const parcelId = searchParams.get('id');
    
    if (!parcelId) {
      return createErrorResponse('Parcel ID is required', 400);
    }

    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.sender;

    // Check if parcel exists
    const existingParcel = await Parcel.findById(parcelId);
    if (!existingParcel) {
      return createErrorResponse('Parcel not found', 404);
    }

    // Update parcel
    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      updateData,
      { new: true, runValidators: true }
    ).populate('sender', 'fullName email phoneNumber')
     .populate('driver', 'fullName email phoneNumber');

    return createSuccessResponse({
      parcel: updatedParcel
    }, 'Parcel updated successfully');

  } catch (error) {
    console.error('Update parcel error:', error);
    return createErrorResponse('Server error while updating parcel', 500);
  }
}

async function deleteParcelHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const parcelId = searchParams.get('id');
    
    if (!parcelId) {
      return createErrorResponse('Parcel ID is required', 400);
    }

    // Check if parcel exists
    const existingParcel = await Parcel.findById(parcelId);
    if (!existingParcel) {
      return createErrorResponse('Parcel not found', 404);
    }

    // Delete parcel
    await Parcel.findByIdAndDelete(parcelId);

    return createSuccessResponse({}, 'Parcel deleted successfully');

  } catch (error) {
    console.error('Delete parcel error:', error);
    return createErrorResponse('Server error while deleting parcel', 500);
  }
}

// Export handlers with database connection wrapper
export const GET = withDatabaseConnection(getParcelsHandler);
export const POST = withDatabaseConnection(createParcelHandler);
export const PUT = withDatabaseConnection(updateParcelHandler);
export const DELETE = withDatabaseConnection(deleteParcelHandler);
