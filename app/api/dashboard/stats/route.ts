import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Driver from '@/lib/models/Driver';
import Parcel from '@/lib/models/Parcel';
import Application from '@/lib/models/Application';
import Payment from '@/lib/models/Payment';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalClients = await User.countDocuments({ role: 'client' });
    const activeDrivers = await Driver.countDocuments({ 
      status: 'approved',
      isOnline: true 
    });

    // Get application statistics
    const applicationStats = await Application.getStatistics();

    // Get parcel statistics
    const parcelStats = await Parcel.getStatistics();

    // Get payment statistics
    const paymentStats = await Payment.getStatistics();

    // Get recent activity
    const recentApplications = await Application.find({ status: 'pending' })
      .populate('user', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentParcels = await Parcel.find()
      .populate('sender', 'fullName email')
      .populate('driver', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get monthly revenue data (last 7 months)
    const monthlyRevenue = await Parcel.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$finalPrice' },
          trips: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get driver performance data
    const topDrivers = await Driver.aggregate([
      {
        $match: { status: 'approved' }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          fullName: '$user.fullName',
          email: '$user.email',
          totalTrips: 1,
          rating: 1,
          totalEarnings: 1,
          isOnline: 1
        }
      },
      {
        $sort: { totalTrips: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return createSuccessResponse({
      overview: {
        totalUsers,
        totalDrivers,
        totalClients,
        activeDrivers,
        pendingApplications: applicationStats.pendingApplications,
        totalParcels: parcelStats.totalParcels,
        totalRevenue: parcelStats.totalRevenue,
        pendingPayments: paymentStats.pendingAmount
      },
      applications: applicationStats,
      parcels: parcelStats,
      payments: paymentStats,
      monthlyRevenue,
      topDrivers,
      recentActivity: {
        applications: recentApplications,
        parcels: recentParcels
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return createErrorResponse('Server error while fetching dashboard statistics', 500);
  }
}
