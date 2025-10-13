import mongoose, { Document, Schema } from 'mongoose';

export interface IDriver extends Document {
  userId: mongoose.Types.ObjectId;
  vehicleType: string;
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  licenseNumber: string;
  licenseImage: {
    url: string;
    publicId: string;
  };
  vehicleImage: {
    url: string;
    publicId: string;
  };
  address?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  isAvailable: boolean;
  isOnline: boolean;
  rating: number;
  totalTrips: number;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  applicationDate: Date;
  approvedDate?: Date;
  suspensionReason?: string;
  suspensionDate?: Date;
  totalEarnings: number;
  pendingEarnings: number;
  lastPaymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  calculateDistance(latitude: number, longitude: number): number;
  getDriverWithUser(): Promise<IDriver>;
}

const driverSchema = new Schema<IDriver>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  vehicleModel: {
    type: String,
    required: true
  },
  vehicleColor: {
    type: String,
    required: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  licenseImage: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  vehicleImage: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  address: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalTrips: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'suspended', 'rejected'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvedDate: {
    type: Date
  },
  suspensionReason: {
    type: String
  },
  suspensionDate: {
    type: Date
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  pendingEarnings: {
    type: Number,
    default: 0
  },
  lastPaymentDate: {
    type: Date
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

// Create geospatial index for location queries
driverSchema.index({ location: '2dsphere' });

// Index for efficient queries
driverSchema.index({ userId: 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ isOnline: 1, isAvailable: 1 });

driverSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

driverSchema.methods.calculateDistance = function(latitude: number, longitude: number) {
  if (!this.location || !this.location.coordinates) {
    return Infinity;
  }
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (latitude - this.location.coordinates[1]) * Math.PI / 180;
  const dLon = (longitude - this.location.coordinates[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.location.coordinates[1] * Math.PI / 180) * 
    Math.cos(latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Method to get driver with user details
driverSchema.methods.getDriverWithUser = async function() {
  await this.populate('userId', 'fullName email phoneNumber profileImage');
  return this;
};

export default mongoose.models.Driver || mongoose.model<IDriver>('Driver', driverSchema);
