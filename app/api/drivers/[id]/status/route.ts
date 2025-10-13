import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
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

    const { status, suspensionReason } = await request.json();
    
    const validStatuses = ['pending', 'approved', 'suspended', 'rejected'];
    if (!validStatuses.includes(status)) {
      return createErrorResponse('Invalid status', 400);
    }

    const updateData: any = { status };
    
    if (status === 'suspended') {
      updateData.suspensionReason = suspensionReason;
      updateData.suspensionDate = new Date();
      updateData.isOnline = false;
      updateData.isAvailable = false;
    } else if (status === 'approved') {
      updateData.approvedDate = new Date();
    }

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
    }, `Driver status updated to ${status}`);

  } catch (error) {
    console.error('Update driver status error:', error);
    return createErrorResponse('Server error while updating driver status', 500);
  }
}
