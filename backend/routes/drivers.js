const express = require('express');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Parcel = require('../models/Parcel');
const { authenticate, authorizeAdmin, authorizeDriver } = require('../middleware/auth');
const { validatePagination, validateSearch, validateObjectId, validateStatus } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/drivers
// @desc    Get all drivers with pagination and search
// @access  Private (Admin only)
router.get('/', authenticate, authorizeAdmin, validatePagination, validateSearch, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const isOnline = req.query.isOnline;

    // Build query
    const query = {};
    
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
        const user = driver.userId;
        return user.fullName.toLowerCase().includes(search.toLowerCase()) ||
               user.email.toLowerCase().includes(search.toLowerCase()) ||
               user.phoneNumber.includes(search) ||
               driver.licensePlate.toLowerCase().includes(search.toLowerCase());
      });
    }

    res.json({
      success: true,
      data: {
        drivers: filteredDrivers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalDrivers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching drivers'
    });
  }
});

// @route   GET /api/drivers/:id
// @desc    Get driver by ID
// @access  Private (Admin only)
router.get('/:id', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('userId', 'fullName email phoneNumber profileImage');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Get driver's recent parcels
    const recentParcels = await Parcel.find({ driver: driver.userId._id })
      .populate('sender', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        driver,
        recentParcels
      }
    });
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching driver'
    });
  }
});

// @route   PUT /api/drivers/:id/status
// @desc    Update driver status
// @access  Private (Admin only)
router.put('/:id/status', authenticate, authorizeAdmin, validateObjectId, validateStatus, async (req, res) => {
  try {
    const { status, suspensionReason } = req.body;
    
    const updateData = { status };
    
    if (status === 'suspended') {
      updateData.suspensionReason = suspensionReason;
      updateData.suspensionDate = new Date();
      updateData.isOnline = false;
      updateData.isAvailable = false;
    } else if (status === 'approved') {
      updateData.approvedDate = new Date();
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email phoneNumber');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: `Driver status updated to ${status}`,
      data: { driver }
    });
  } catch (error) {
    console.error('Update driver status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating driver status'
    });
  }
});

// @route   PUT /api/drivers/:id
// @desc    Update driver information
// @access  Private (Admin only)
router.put('/:id', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const { 
      vehicleType, 
      vehicleModel, 
      vehicleColor, 
      licensePlate, 
      licenseNumber, 
      address 
    } = req.body;
    
    const updateData = {};
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (vehicleModel) updateData.vehicleModel = vehicleModel;
    if (vehicleColor) updateData.vehicleColor = vehicleColor;
    if (licensePlate) updateData.licensePlate = licensePlate;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;
    if (address) updateData.address = address;

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email phoneNumber');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver updated successfully',
      data: { driver }
    });
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating driver'
    });
  }
});

// @route   DELETE /api/drivers/:id
// @desc    Delete driver
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Check if driver has active parcels
    const activeParcels = await Parcel.countDocuments({
      driver: driver.userId,
      status: { $in: ['accepted', 'picked_up', 'in_transit'] }
    });

    if (activeParcels > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete driver with active parcels'
      });
    }

    // Update user role to client
    await User.findByIdAndUpdate(driver.userId, { role: 'client' });

    // Delete driver record
    await Driver.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting driver'
    });
  }
});

// @route   GET /api/drivers/:id/parcels
// @desc    Get driver's parcels
// @access  Private (Admin only)
router.get('/:id/parcels', authenticate, authorizeAdmin, validateObjectId, validatePagination, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';

    const query = { driver: driver.userId };
    if (status) {
      query.status = status;
    }

    const total = await Parcel.countDocuments(query);

    const parcels = await Parcel.find(query)
      .populate('sender', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        parcels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalParcels: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get driver parcels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching driver parcels'
    });
  }
});

// @route   GET /api/drivers/stats
// @desc    Get driver statistics
// @access  Private (Admin only)
router.get('/stats', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const stats = await Driver.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalTrips: { $sum: '$totalTrips' },
          totalEarnings: { $sum: '$totalEarnings' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const totalDrivers = await Driver.countDocuments();
    const onlineDrivers = await Driver.countDocuments({ isOnline: true });
    const availableDrivers = await Driver.countDocuments({ isAvailable: true });

    res.json({
      success: true,
      data: {
        totalDrivers,
        onlineDrivers,
        availableDrivers,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Driver stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching driver statistics'
    });
  }
});

module.exports = router;
