import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Parcel from '@/lib/models/Parcel';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
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
