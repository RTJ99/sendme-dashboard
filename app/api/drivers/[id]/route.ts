import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Driver from '@/lib/models/Driver';
import User from '@/lib/models/User';
import Parcel from '@/lib/models/Parcel';
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

    const driver = await Driver.findById(params.id)
      .populate('userId', 'fullName email phoneNumber profileImage');

    if (!driver) {
      return createErrorResponse('Driver not found', 404);
    }

    // Get driver's recent parcels
    const recentParcels = await Parcel.find({ driver: driver.userId._id })
      .populate('sender', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10);

    return createSuccessResponse({
      driver,
      recentParcels
    });

  } catch (error) {
    console.error('Get driver error:', error);
    return createErrorResponse('Server error while fetching driver', 500);
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

    const { 
      vehicleType, 
      vehicleModel, 
      vehicleColor, 
      licensePlate, 
      licenseNumber, 
      address,
      isAvailable,
      isOnline
    } = await request.json();
    
    const updateData: any = {};
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (vehicleModel) updateData.vehicleModel = vehicleModel;
    if (vehicleColor) updateData.vehicleColor = vehicleColor;
    if (licensePlate) updateData.licensePlate = licensePlate;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;
    if (address !== undefined) updateData.address = address;
    if (typeof isAvailable === 'boolean') updateData.isAvailable = isAvailable;
    if (typeof isOnline === 'boolean') updateData.isOnline = isOnline;

    const driver = await Driver.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email phoneNumber');

    if (!driver) {
      return createErrorResponse('Driver not found', 404);
    }

    return createSuccessResponse({
      driver
    }, 'Driver updated successfully');

  } catch (error) {
    console.error('Update driver error:', error);
    return createErrorResponse('Server error while updating driver', 500);
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

    const driver = await Driver.findById(params.id);
    
    if (!driver) {
      return createErrorResponse('Driver not found', 404);
    }

    // Check if driver has active parcels
    const activeParcels = await Parcel.countDocuments({
      driver: driver.userId,
      status: { $in: ['accepted', 'picked_up', 'in_transit'] }
    });

    if (activeParcels > 0) {
      return createErrorResponse('Cannot delete driver with active parcels', 400);
    }

    // Update user role to client
    await User.findByIdAndUpdate(driver.userId, { role: 'client' });

    // Delete driver record
    await Driver.findByIdAndDelete(params.id);

    return createSuccessResponse(null, 'Driver deleted successfully');

  } catch (error) {
    console.error('Delete driver error:', error);
    return createErrorResponse('Server error while deleting driver', 500);
  }
}
