const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'mobile_money', 'cash', 'ecocash'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['earnings', 'bonus', 'commission', 'refund'],
    default: 'earnings'
  },
  description: {
    type: String,
    required: true
  },
  
  // Transaction Details
  transactionId: {
    type: String,
    unique: true
  },
  externalTransactionId: {
    type: String
  },
  reference: {
    type: String
  },
  
  // Period Information
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  
  // Trip Information
  trips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcel'
  }],
  tripCount: {
    type: Number,
    default: 0
  },
  
  // Financial Breakdown
  grossEarnings: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  
  // Processing Information
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  },
  failureReason: {
    type: String
  },
  
  // Bank/Mobile Money Details
  bankDetails: {
    accountNumber: String,
    bankName: String,
    accountName: String
  },
  mobileMoneyDetails: {
    provider: String,
    phoneNumber: String,
    accountName: String
  },
  
  // Receipt Information
  receipt: {
    url: String,
    publicId: String
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
paymentSchema.index({ driver: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ periodStart: 1, periodEnd: 1 });
paymentSchema.index({ transactionId: 1 });

paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get payment with driver details
paymentSchema.methods.getPaymentWithDriver = async function() {
  await this.populate('driver', 'fullName email phoneNumber');
  if (this.processedBy) {
    await this.populate('processedBy', 'fullName email');
  }
  return this;
};

// Static method to get payment statistics
paymentSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalNetAmount: { $sum: '$netAmount' },
        totalPlatformFee: { $sum: '$platformFee' },
        pendingPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        processingPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
        },
        completedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        failedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        pendingAmount: {
          $sum: { 
            $cond: [
              { $in: ['$status', ['pending', 'processing']] }, 
              '$amount', 
              0
            ] 
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalPayments: 0,
    totalAmount: 0,
    totalNetAmount: 0,
    totalPlatformFee: 0,
    pendingPayments: 0,
    processingPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
    pendingAmount: 0
  };
};

module.exports = mongoose.model('Payment', paymentSchema);
