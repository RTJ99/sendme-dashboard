import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Driver from '@/lib/models/Driver';
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
