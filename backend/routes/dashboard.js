const express = require('express');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Parcel = require('../models/Parcel');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats', authenticate, authorizeAdmin, async (req, res) => {
  try {
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

    res.json({
      success: true,
      data: {
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
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get detailed analytics data
// @access  Private (Admin only)
router.get('/analytics', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range based on period
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Revenue and trip trends
    const revenueTrend = await Parcel.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          revenue: { $sum: '$finalPrice' },
          trips: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // Driver performance analytics
    const driverAnalytics = await Driver.aggregate([
      {
        $match: { status: 'approved' }
      },
      {
        $lookup: {
          from: 'parcels',
          localField: 'userId',
          foreignField: 'driver',
          as: 'parcels'
        }
      },
      {
        $project: {
          userId: 1,
          totalTrips: { $size: '$parcels' },
          totalEarnings: { $sum: '$parcels.finalPrice' },
          averageRating: { $avg: '$parcels.rating' },
          isOnline: 1,
          isAvailable: 1
        }
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
          totalEarnings: 1,
          averageRating: 1,
          isOnline: 1,
          isAvailable: 1
        }
      }
    ]);

    // Payment status distribution
    const paymentDistribution = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Application status distribution
    const applicationDistribution = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        revenueTrend,
        driverAnalytics,
        paymentDistribution,
        applicationDistribution
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/dashboard/notifications
// @desc    Get dashboard notifications
// @access  Private (Admin only)
router.get('/notifications', authenticate, authorizeAdmin, async (req, res) => {
  try {
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

    res.json({
      success: true,
      data: {
        notifications,
        totalCount: notifications.reduce((sum, notif) => sum + notif.count, 0)
      }
    });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

module.exports = router;
