import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/lib/models/Application';
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
    const status = searchParams.get('status') || '';

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const total = await Application.countDocuments(query);

    const applications = await Application.find(query)
      .populate('user', 'fullName email phoneNumber profileImage')
      .populate('reviewedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return createSuccessResponse({
      applications,
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
