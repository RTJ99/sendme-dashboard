import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  address: string;
  city: string;
  vehicleType: 'bike' | 'motorcycle' | 'car' | 'van';
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  licensePlate: string;
  licenseNumber: string;
  licenseExpiry: Date;
  documents: {
    licenseImage: {
      url: string;
      publicId: string;
    };
    vehicleImage: {
      url: string;
      publicId: string;
    };
    insuranceDocument: {
      url: string;
      publicId: string;
    };
    registrationDocument: {
      url: string;
      publicId: string;
    };
    identityDocument: {
      url: string;
      publicId: string;
    };
  };
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'on_hold';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  rejectionReason?: string;
  experience?: 'beginner' | 'intermediate' | 'experienced' | 'expert';
  previousEmployer?: string;
  references: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  expectedEarnings?: number;
  availability?: 'full_time' | 'part_time' | 'weekends_only' | 'flexible';
  createdAt: Date;
  updatedAt: Date;
  getApplicationWithUser(): Promise<IApplication>;
}

const applicationSchema = new Schema<IApplication>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['bike', 'motorcycle', 'car', 'van']
  },
  vehicleModel: {
    type: String,
    required: true
  },
  vehicleYear: {
    type: Number,
    required: true
  },
  vehicleColor: {
    type: String,
    required: true
  },
  licensePlate: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  licenseExpiry: {
    type: Date,
    required: true
  },
  documents: {
    licenseImage: {
      url: String,
      publicId: String
    },
    vehicleImage: {
      url: String,
      publicId: String
    },
    insuranceDocument: {
      url: String,
      publicId: String
    },
    registrationDocument: {
      url: String,
      publicId: String
    },
    identityDocument: {
      url: String,
      publicId: String
    }
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'on_hold'],
    default: 'pending'
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'experienced', 'expert']
  },
  previousEmployer: {
    type: String
  },
  references: [{
    name: String,
    phone: String,
    relationship: String
  }],
  expectedEarnings: {
    type: Number
  },
  availability: {
    type: String,
    enum: ['full_time', 'part_time', 'weekends_only', 'flexible']
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
applicationSchema.index({ user: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ reviewedBy: 1 });

applicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to get application with user details
applicationSchema.methods.getApplicationWithUser = async function() {
  await this.populate('user', 'fullName email phoneNumber profileImage');
  if (this.reviewedBy) {
    await this.populate('reviewedBy', 'fullName email');
  }
  return this;
};

// Static method to get application statistics
applicationSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalApplications: { $sum: 1 },
        pendingApplications: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        underReviewApplications: {
          $sum: { $cond: [{ $eq: ['$status', 'under_review'] }, 1, 0] }
        },
        approvedApplications: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
        },
        rejectedApplications: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
        },
        onHoldApplications: {
          $sum: { $cond: [{ $eq: ['$status', 'on_hold'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalApplications: 0,
    pendingApplications: 0,
    underReviewApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    onHoldApplications: 0
  };
};

export default mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);
