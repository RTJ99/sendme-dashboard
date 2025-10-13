import { NextRequest } from 'next/server';
import { createSuccessResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // In a more sophisticated setup, you might want to blacklist the token
  // For now, we'll just return success as token removal is handled client-side
  return createSuccessResponse(null, 'Logged out successfully');
}
