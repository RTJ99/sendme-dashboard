const express = require('express');
const Parcel = require('../models/Parcel');
const Driver = require('../models/Driver');
const { authenticate, authorizeAdmin, authorizeDriver } = require('../middleware/auth');
const { validatePagination, validateSearch, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/parcels
// @desc    Get all parcels with pagination and filters
// @access  Private (Admin only)
router.get('/', authenticate, authorizeAdmin, validatePagination, validateSearch, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const paymentStatus = req.query.paymentStatus || '';
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Get total count
    const total = await Parcel.countDocuments(query);

    // Get parcels with user information
    const parcels = await Parcel.find(query)
      .populate('sender', 'fullName email phoneNumber')
      .populate('driver', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter by search term if provided
    let filteredParcels = parcels;
    if (search) {
      filteredParcels = parcels.filter(parcel => {
        const sender = parcel.sender;
        const driver = parcel.driver;
        return sender.fullName.toLowerCase().includes(search.toLowerCase()) ||
               sender.email.toLowerCase().includes(search.toLowerCase()) ||
               (driver && driver.fullName.toLowerCase().includes(search.toLowerCase())) ||
               parcel.description.toLowerCase().includes(search.toLowerCase()) ||
               parcel.pickupLocation.name.toLowerCase().includes(search.toLowerCase()) ||
               parcel.dropoffLocation.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    res.json({
      success: true,
      data: {
        parcels: filteredParcels,
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
    console.error('Get parcels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching parcels'
    });
  }
});

// @route   GET /api/parcels/:id
// @desc    Get parcel by ID
// @access  Private (Admin only)
router.get('/:id', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate('sender', 'fullName email phoneNumber')
      .populate('driver', 'fullName email phoneNumber');

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found'
      });
    }

    res.json({
      success: true,
      data: { parcel }
    });
  } catch (error) {
    console.error('Get parcel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching parcel'
    });
  }
});

// @route   PUT /api/parcels/:id/status
// @desc    Update parcel status
// @access  Private (Admin only)
router.put('/:id/status', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    
    const validStatuses = ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    
    if (status === 'cancelled') {
      updateData.cancellationReason = cancellationReason;
      updateData.cancelledAt = new Date();
    } else if (status === 'picked_up') {
      updateData.pickedUpAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('sender', 'fullName email phoneNumber')
     .populate('driver', 'fullName email phoneNumber');

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found'
      });
    }

    res.json({
      success: true,
      message: `Parcel status updated to ${status}`,
      data: { parcel }
    });
  } catch (error) {
    console.error('Update parcel status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating parcel status'
    });
  }
});

// @route   PUT /api/parcels/:id/assign
// @desc    Assign parcel to driver
// @access  Private (Admin only)
router.put('/:id/assign', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const { driverId } = req.body;
    
    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: 'Driver ID is required'
      });
    }

    // Check if driver exists and is available
    const driver = await Driver.findOne({ 
      userId: driverId, 
      status: 'approved',
      isAvailable: true 
    });

    if (!driver) {
      return res.status(400).json({
        success: false,
        message: 'Driver not found or not available'
      });
    }

    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { 
        driver: driverId,
        status: 'accepted',
        assignedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('sender', 'fullName email phoneNumber')
     .populate('driver', 'fullName email phoneNumber');

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found'
      });
    }

    res.json({
      success: true,
      message: 'Parcel assigned to driver successfully',
      data: { parcel }
    });
  } catch (error) {
    console.error('Assign parcel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning parcel'
    });
  }
});

// @route   PUT /api/parcels/:id
// @desc    Update parcel information
// @access  Private (Admin only)
router.put('/:id', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const { 
      description, 
      price, 
      finalPrice, 
      paymentMethod, 
      ecocashNumber 
    } = req.body;
    
    const updateData = {};
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (finalPrice) updateData.finalPrice = finalPrice;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (ecocashNumber) updateData.ecocashNumber = ecocashNumber;

    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('sender', 'fullName email phoneNumber')
     .populate('driver', 'fullName email phoneNumber');

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found'
      });
    }

    res.json({
      success: true,
      message: 'Parcel updated successfully',
      data: { parcel }
    });
  } catch (error) {
    console.error('Update parcel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating parcel'
    });
  }
});

// @route   DELETE /api/parcels/:id
// @desc    Delete parcel
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, validateObjectId, async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    
    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found'
      });
    }

    // Check if parcel is in progress
    if (['accepted', 'picked_up', 'in_transit'].includes(parcel.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete parcel that is in progress'
      });
    }

    await Parcel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Parcel deleted successfully'
    });
  } catch (error) {
    console.error('Delete parcel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting parcel'
    });
  }
});

// @route   GET /api/parcels/stats
// @desc    Get parcel statistics
// @access  Private (Admin only)
router.get('/stats', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const stats = await Parcel.getStatistics();

    // Get status distribution
    const statusDistribution = await Parcel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get payment status distribution
    const paymentStatusDistribution = await Parcel.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...stats,
        statusDistribution,
        paymentStatusDistribution
      }
    });
  } catch (error) {
    console.error('Parcel stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching parcel statistics'
    });
  }
});

module.exports = router;
