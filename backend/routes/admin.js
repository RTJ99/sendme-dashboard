const express = require('express');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Application = require('../models/Application');
const Parcel = require('../models/Parcel');
const Payment = require('../models/Payment');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { validateObjectId, validateStatus } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/admin/applications
// @desc    Get all driver applications
// @access  Private (Admin only)
router.get('/applications', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';

    const query = {};
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

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalApplications: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// @route   GET /api/admin/applications/:id
// @desc    Get application by ID
// @access  Private (Admin only)
router.get('/applications/:id', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('user', 'fullName email phoneNumber profileImage')
      .populate('reviewedBy', 'fullName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: { application }
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application'
    });
  }
});

// @route   PUT /api/admin/applications/:id/review
// @desc    Review and update application status
// @access  Private (Admin only)
router.put('/applications/:id/review', authenticate, authorizeAdmin, validateObjectId, validateStatus, async (req, res) => {
  try {
    const { status, reviewNotes, rejectionReason } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const updateData = {
      status,
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      reviewNotes
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'fullName email phoneNumber profileImage')
     .populate('reviewedBy', 'fullName email');

    // If application is approved, create driver record
    if (status === 'approved') {
      const user = await User.findById(application.user);
      
      // Update user role to driver
      await User.findByIdAndUpdate(application.user, { role: 'driver' });

      // Create driver record
      const driver = new Driver({
        userId: application.user,
        vehicleType: application.vehicleType,
        vehicleModel: application.vehicleModel,
        vehicleColor: application.vehicleColor,
        licensePlate: application.licensePlate,
        licenseNumber: application.licenseNumber,
        licenseImage: application.documents.licenseImage,
        vehicleImage: application.documents.vehicleImage,
        address: application.address,
        status: 'approved',
        approvedDate: new Date()
      });

      await driver.save();
    }

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      data: { application: updatedApplication }
    });
  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while reviewing application'
    });
  }
});

// @route   GET /api/admin/payments
// @desc    Get all payments
// @access  Private (Admin only)
router.get('/payments', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';

    const query = {};
    if (status) {
      query.status = status;
    }

    const total = await Payment.countDocuments(query);

    const payments = await Payment.find(query)
      .populate('driver', 'fullName email phoneNumber')
      .populate('processedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPayments: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payments'
    });
  }
});

// @route   PUT /api/admin/payments/:id/process
// @desc    Process payment
// @access  Private (Admin only)
router.put('/payments/:id/process', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const { status, transactionId, failureReason } = req.body;
    
    const validStatuses = ['processing', 'completed', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = {
      status,
      processedBy: req.user._id,
      processedAt: new Date()
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    if (status === 'failed' && failureReason) {
      updateData.failureReason = failureReason;
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('driver', 'fullName email phoneNumber')
     .populate('processedBy', 'fullName email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      message: `Payment ${status} successfully`,
      data: { payment }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment'
    });
  }
});

// @route   POST /api/admin/payments/generate
// @desc    Generate payments for drivers
// @access  Private (Admin only)
router.post('/payments/generate', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { periodStart, periodEnd, driverIds } = req.body;
    
    if (!periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        message: 'Period start and end dates are required'
      });
    }

    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    // Get drivers to process
    const driverQuery = { status: 'approved' };
    if (driverIds && driverIds.length > 0) {
      driverQuery.userId = { $in: driverIds };
    }

    const drivers = await Driver.find(driverQuery).populate('userId', 'fullName email phoneNumber');

    const generatedPayments = [];

    for (const driver of drivers) {
      // Get completed parcels for the period
      const parcels = await Parcel.find({
        driver: driver.userId._id,
        status: 'delivered',
        deliveredAt: { $gte: startDate, $lte: endDate }
      });

      if (parcels.length === 0) continue;

      // Calculate earnings
      const grossEarnings = parcels.reduce((sum, parcel) => sum + (parcel.finalPrice || 0), 0);
      const platformFee = grossEarnings * 0.1; // 10% platform fee
      const netAmount = grossEarnings - platformFee;

      // Check if payment already exists for this period
      const existingPayment = await Payment.findOne({
        driver: driver.userId._id,
        periodStart: startDate,
        periodEnd: endDate
      });

      if (existingPayment) continue;

      // Create payment record
      const payment = new Payment({
        driver: driver.userId._id,
        amount: grossEarnings,
        netAmount,
        platformFee,
        grossEarnings,
        paymentMethod: 'bank_transfer', // Default method
        description: `Earnings for period ${startDate.toDateString()} - ${endDate.toDateString()}`,
        periodStart: startDate,
        periodEnd: endDate,
        trips: parcels.map(p => p._id),
        tripCount: parcels.length,
        status: 'pending'
      });

      await payment.save();
      await payment.getPaymentWithDriver();
      generatedPayments.push(payment);
    }

    res.json({
      success: true,
      message: `Generated ${generatedPayments.length} payments`,
      data: { payments: generatedPayments }
    });
  } catch (error) {
    console.error('Generate payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating payments'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get comprehensive analytics
// @access  Private (Admin only)
router.get('/analytics', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
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
    }

    // Get comprehensive statistics
    const [
      userStats,
      driverStats,
      applicationStats,
      parcelStats,
      paymentStats
    ] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            verified: { $sum: { $cond: ['$isVerified', 1, 0] } }
          }
        }
      ]),
      Driver.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalTrips: { $sum: '$totalTrips' },
            totalEarnings: { $sum: '$totalEarnings' }
          }
        }
      ]),
      Application.getStatistics(),
      Parcel.getStatistics(),
      Payment.getStatistics()
    ]);

    // Get trend data
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

    res.json({
      success: true,
      data: {
        period,
        userStats,
        driverStats,
        applicationStats,
        parcelStats,
        paymentStats,
        revenueTrend
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

module.exports = router;
