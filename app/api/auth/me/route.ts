import { NextRequest } from 'next/server';
import { getUserFromRequest, createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Profile API: Getting user profile...');
    const user = await getUserFromRequest(request);
    
    if (!user) {
      console.log('Profile API: No user found, access denied');
      return createErrorResponse('Access denied. No token provided.', 401);
    }

    console.log('Profile API: User found:', user.email, 'Role:', user.role);
    return createSuccessResponse({
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Profile API: Get profile error:', error);
    return createErrorResponse('Server error while fetching profile', 500);
  }
}
