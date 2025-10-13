const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  senderCounterOffer: {
    type: Number
  },
  driverCounterOffer: {
    type: Number
  },
  finalPrice: {
    type: Number
  },
  distance: {
    value: Number, // Distance in meters
    text: String,  // Human readable distance
    fromCBD: Number // Distance from CBD in kilometers
  },
  pickupLocation: {
    name: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  dropoffLocation: {
    name: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'ecocash'],
    required: true
  },
  ecocashNumber: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  transactionId: {
    type: String
  },
  paynowReference: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Additional fields for admin tracking
  assignedAt: {
    type: Date
  },
  pickedUpAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  },
  // Commission tracking
  driverCommission: {
    type: Number,
    default: 0
  },
  platformFee: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
parcelSchema.index({ sender: 1 });
parcelSchema.index({ driver: 1 });
parcelSchema.index({ status: 1 });
parcelSchema.index({ createdAt: -1 });
parcelSchema.index({ paymentStatus: 1 });

// Method to get parcel with user details
parcelSchema.methods.getParcelWithUsers = async function() {
  await this.populate('sender', 'fullName email phoneNumber');
  if (this.driver) {
    await this.populate('driver', 'fullName email phoneNumber');
  }
  return this;
};

// Static method to get parcel statistics
parcelSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalParcels: { $sum: 1 },
        totalRevenue: { $sum: '$finalPrice' },
        totalCommission: { $sum: '$driverCommission' },
        totalPlatformFee: { $sum: '$platformFee' },
        pendingParcels: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        activeParcels: {
          $sum: { 
            $cond: [
              { $in: ['$status', ['accepted', 'picked_up', 'in_transit']] }, 
              1, 
              0
            ] 
          }
        },
        completedParcels: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        cancelledParcels: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalParcels: 0,
    totalRevenue: 0,
    totalCommission: 0,
    totalPlatformFee: 0,
    pendingParcels: 0,
    activeParcels: 0,
    completedParcels: 0,
    cancelledParcels: 0
  };
};

module.exports = mongoose.model('Parcel', parcelSchema);
