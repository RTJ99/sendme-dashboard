import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/lib/models/Application';
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

    const { status, reviewNotes, rejectionReason } = await request.json();
    
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'on_hold'];
    if (!validStatuses.includes(status)) {
      return createErrorResponse('Invalid status', 400);
    }

    const application = await Application.findById(params.id);
    if (!application) {
      return createErrorResponse('Application not found', 404);
    }

    const updateData: any = {
      status,
      reviewedBy: user._id,
      reviewedAt: new Date(),
      reviewNotes
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'fullName email phoneNumber profileImage')
     .populate('reviewedBy', 'fullName email');

    // If application is approved, create driver record
    if (status === 'approved') {
      const applicationUser = await User.findById(application.user);
      
      if (applicationUser) {
        // Update user role to driver
        await User.findByIdAndUpdate(application.user, { role: 'driver' });

        // Create driver record
        const driver = new Driver({
          userId: application.user,
          vehicleType: application.vehicleType,
          vehicleModel: application.vehicleModel,
          vehicleColor: application.vehicleColor,
          licensePlate: application.licensePlate,
          licenseNumber: application.licenseNumber,
          licenseImage: application.documents.licenseImage,
          vehicleImage: application.documents.vehicleImage,
          address: application.address,
          status: 'approved',
          approvedDate: new Date()
        });

        await driver.save();
      }
    }

    return createSuccessResponse({
      application: updatedApplication
    }, `Application ${status} successfully`);

  } catch (error) {
    console.error('Review application error:', error);
    return createErrorResponse('Server error while reviewing application', 500);
  }
}
