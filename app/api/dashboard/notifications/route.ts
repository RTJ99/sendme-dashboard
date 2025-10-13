import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/lib/models/Application';
import Payment from '@/lib/models/Payment';
import Driver from '@/lib/models/Driver';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const notifications = [];

    // Check for pending applications
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    if (pendingApplications > 0) {
      notifications.push({
        type: 'application',
        message: `${pendingApplications} pending driver applications`,
        count: pendingApplications,
        priority: 'high'
      });
    }

    // Check for overdue payments
    const overduePayments = await Payment.countDocuments({
      status: 'pending',
      createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 7 days ago
    });
    if (overduePayments > 0) {
      notifications.push({
        type: 'payment',
        message: `${overduePayments} overdue payments`,
        count: overduePayments,
        priority: 'medium'
      });
    }

    // Check for suspended drivers
    const suspendedDrivers = await Driver.countDocuments({ status: 'suspended' });
    if (suspendedDrivers > 0) {
      notifications.push({
        type: 'driver',
        message: `${suspendedDrivers} suspended drivers`,
        count: suspendedDrivers,
        priority: 'low'
      });
    }

    // Check for failed payments
    const failedPayments = await Payment.countDocuments({ status: 'failed' });
    if (failedPayments > 0) {
      notifications.push({
        type: 'payment',
        message: `${failedPayments} failed payments`,
        count: failedPayments,
        priority: 'medium'
      });
    }

    return createSuccessResponse({
      notifications,
      totalCount: notifications.reduce((sum, notif) => sum + notif.count, 0)
    });

  } catch (error) {
    console.error('Notifications error:', error);
    return createErrorResponse('Server error while fetching notifications', 500);
  }
}
