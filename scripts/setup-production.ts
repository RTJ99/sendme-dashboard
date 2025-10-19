#!/usr/bin/env tsx

/**
 * Production Setup Script
 * 
 * This script helps set up the admin user and verify the database connection
 * for production deployment on Vercel.
 * 
 * Usage:
 * 1. Set your environment variables in Vercel dashboard
 * 2. Run this script to create an admin user
 * 3. Test the health check endpoint
 */

import { config } from 'dotenv';
import mongoose from 'mongoose';
import User from '../lib/models/User';

// Load environment variables
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sendme.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME || 'System Administrator';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+1234567890';

async function setupProduction() {
  try {
    console.log('🚀 Starting production setup...');
    
    // Check environment variables
    console.log('📋 Checking environment variables...');
    console.log('MONGODB_URI:', MONGODB_URI ? '✅ Set' : '❌ Missing');
    console.log('ADMIN_EMAIL:', ADMIN_EMAIL);
    console.log('ADMIN_PASSWORD:', ADMIN_PASSWORD ? '✅ Set' : '❌ Missing');
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    // Connect to database
    console.log('🔌 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected successfully');
    
    // Check if admin user exists
    console.log('👤 Checking for existing admin user...');
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      console.log('📧 Email:', existingAdmin.email);
      console.log('📅 Created:', existingAdmin.createdAt);
    } else {
      console.log('❌ No admin user found, creating one...');
      
      // Create admin user
      const adminUser = new User({
        fullName: ADMIN_FULL_NAME,
        email: ADMIN_EMAIL,
        phoneNumber: ADMIN_PHONE,
        password: ADMIN_PASSWORD,
        role: 'admin',
        isVerified: true
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('📧 Email:', adminUser.email);
      console.log('🔑 Password:', ADMIN_PASSWORD);
    }
    
    // Verify database health
    console.log('🏥 Verifying database health...');
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const driverCount = await User.countDocuments({ role: 'driver' });
    const clientCount = await User.countDocuments({ role: 'client' });
    
    console.log('📊 Database Statistics:');
    console.log('  Total Users:', totalUsers);
    console.log('  Admin Users:', adminCount);
    console.log('  Driver Users:', driverCount);
    console.log('  Client Users:', clientCount);
    
    console.log('🎉 Production setup completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Deploy your application to Vercel');
    console.log('2. Test the health check: GET /api/health');
    console.log('3. Test admin login with the credentials above');
    console.log('4. Verify all admin endpoints are working');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Run the setup
setupProduction();
