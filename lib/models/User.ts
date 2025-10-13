import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'admin' | 'driver' | 'client';
  isVerified: boolean;
  profileImage: {
    url: string;
    publicId: string;
  };
  pushTokens: Array<{
    token: string;
    platform: 'ios' | 'android' | 'web';
    createdAt: Date;
  }>;
  notificationSettings: {
    parcelUpdates: boolean;
    driverAssigned: boolean;
    paymentConfirmations: boolean;
    promotionalMessages: boolean;
  };
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): Partial<IUser>;
}

const userSchema = new Schema<IUser>({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'driver', 'client'],
    default: 'client'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  pushTokens: [{
    token: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      enum: ['ios', 'android', 'web'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  notificationSettings: {
    parcelUpdates: {
      type: Boolean,
      default: true
    },
    driverAssigned: {
      type: Boolean,
      default: true
    },
    paymentConfirmations: {
      type: Boolean,
      default: true
    },
    promotionalMessages: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.pushTokens;
  return userObject;
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
