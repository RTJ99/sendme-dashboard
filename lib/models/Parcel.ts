import mongoose, { Document, Schema } from 'mongoose';

export interface IParcel extends Document {
  sender: mongoose.Types.ObjectId;
  description: string;
  price: number;
  senderCounterOffer?: number;
  driverCounterOffer?: number;
  finalPrice?: number;
  distance: {
    value: number;
    text: string;
    fromCBD: number;
  };
  pickupLocation: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  dropoffLocation: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  driver?: mongoose.Types.ObjectId;
  paymentMethod: 'cash' | 'ecocash';
  ecocashNumber?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentDate?: Date;
  transactionId?: string;
  paynowReference?: string;
  rating?: number;
  comment?: string;
  images: Array<{
    url: string;
    publicId: string;
    uploadedAt: Date;
  }>;
  assignedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  driverCommission: number;
  platformFee: number;
  createdAt: Date;
  getParcelWithUsers(): Promise<IParcel>;
}

const parcelSchema = new Schema<IParcel>({
  sender: {
    type: Schema.Types.ObjectId,
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
    value: Number,
    text: String,
    fromCBD: Number
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
    type: Schema.Types.ObjectId,
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

export default mongoose.models.Parcel || mongoose.model<IParcel>('Parcel', parcelSchema);
