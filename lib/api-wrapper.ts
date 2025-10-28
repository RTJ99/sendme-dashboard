import { NextRequest, NextResponse } from 'next/server';
import { ensureConnection, clearConnectionCache } from './mongodb-serverless';

/**
 * API Route wrapper that ensures database connection before executing handlers
 * This is specifically designed for serverless environments like Vercel
 */
export function withDatabaseConnection<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      // Ensure database connection before executing the handler
      const isConnected = await ensureConnection();
      
      if (!isConnected) {
        console.error('API Wrapper: Failed to establish database connection');
        return NextResponse.json(
          { 
            success: false, 
            message: 'Database connection failed. Please try again.' 
          },
          { status: 503 }
        );
      }
      
      // Execute the handler
      return await handler(request, ...args);
      
    } catch (error) {
      console.error('API Wrapper: Error in handler:', error);
      
      // If it's a database timeout error, try to clear cache and retry once
      if (error instanceof Error && error.message.includes('buffering timed out')) {
        console.log('API Wrapper: Detected timeout, attempting retry...');
        
        try {
          clearConnectionCache();
          const isReconnected = await ensureConnection();
          
          if (isReconnected) {
            console.log('API Wrapper: Retrying handler after reconnection...');
            return await handler(request, ...args);
          }
        } catch (retryError) {
          console.error('API Wrapper: Retry failed:', retryError);
        }
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Internal server error. Please try again.' 
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Utility function to create consistent API responses
 */
export function createApiResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function createApiError(message: string, status: number = 400) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

export function createApiSuccess(data: any, message: string = 'Success') {
  return NextResponse.json(
    { success: true, message, data },
    { status: 200 }
  );
}
