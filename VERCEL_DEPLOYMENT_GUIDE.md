# Vercel Deployment Guide

This guide will help you resolve the authentication issues you're experiencing on Vercel deployment.

## Problem Analysis

The issue you're experiencing is that:
- ✅ User authentication works locally
- ✅ JWT token is valid and user has admin role
- ❌ API calls fail with 403 "Access denied. Admin privileges required" on Vercel
- ❌ **Root Cause**: `Operation 'users.findOne()' buffering timed out after 10000ms`

This is a **MongoDB connection timeout issue** specific to Vercel's serverless environment.

## Root Causes

1. **MongoDB Connection Timeout**: Vercel's serverless functions have cold start issues with MongoDB connections
2. **Connection Pooling Issues**: Default MongoDB connection settings are not optimized for serverless
3. **Missing Admin User**: The admin user might not exist in the production database
4. **Environment Variables**: JWT_SECRET or MONGODB_URI might not be set correctly

## Solution Implemented

The code has been updated with:

1. **Serverless-Optimized MongoDB Connection** (`lib/mongodb-serverless.ts`)
   - Optimized connection options for Vercel
   - Reduced connection pool size
   - Faster timeout settings
   - Connection retry logic

2. **Enhanced Authentication with Retry Logic** (`lib/auth.ts`)
   - Automatic reconnection on timeout
   - Better error handling
   - Connection validation before queries

3. **API Route Wrapper** (`lib/api-wrapper.ts`)
   - Ensures database connection before API execution
   - Automatic retry on connection failures
   - Consistent error handling

4. **Vercel Configuration** (`vercel.json`)
   - Extended function timeout (30 seconds)
   - Environment variable configuration

## Solution Steps

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to "Environment Variables"
4. Add the following variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
ADMIN_EMAIL=admin@sendme.com
ADMIN_PASSWORD=admin123
ADMIN_FULL_NAME=System Administrator
ADMIN_PHONE=+1234567890
```

### Step 2: Test Database Connection

After deploying, test the health check endpoint:

```bash
curl https://your-app.vercel.app/api/health
```

This will show you:
- Environment variables status
- Database connection status
- Number of admin users in the database

### Step 3: Create Admin User (if needed)

If the health check shows no admin users, create one:

```bash
curl -X POST https://your-app.vercel.app/api/setup/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sendme.com",
    "password": "admin123",
    "fullName": "System Administrator",
    "phoneNumber": "+1234567890"
  }'
```

### Step 4: Test Authentication

1. Login with the admin credentials
2. Check the browser console for detailed auth logs
3. Test API endpoints that require admin privileges

## Debugging Tools Added

### 1. Enhanced Auth Logging
The `getUserFromRequest` function now logs:
- JWT token validation
- Database connection status
- User lookup results
- Admin user count

### 2. Health Check Endpoint
`GET /api/health` provides:
- Environment variables status
- Database connection status
- User statistics
- Sample admin user info

### 3. Admin Setup Endpoint
`POST /api/setup/admin` allows creating admin users in production.

### 4. Database Connection Logging
Enhanced MongoDB connection logging shows:
- Connection attempts
- Success/failure status
- URI validation

## Common Issues and Solutions

### Issue: "JWT_SECRET is not defined"
**Solution**: Ensure JWT_SECRET is set in Vercel environment variables.

### Issue: "Database connection failed"
**Solution**: 
1. Check MONGODB_URI format
2. Ensure MongoDB Atlas allows connections from Vercel IPs
3. Verify database credentials

### Issue: "User not found in database"
**Solution**:
1. Run the health check to verify database connection
2. Create admin user using the setup endpoint
3. Check if the user ID in the JWT matches a user in the database

### Issue: "No admin users in database"
**Solution**: Use the admin setup endpoint to create an admin user.

## Testing Checklist

- [ ] Environment variables are set in Vercel
- [ ] Health check endpoint returns success
- [ ] Admin user exists in database
- [ ] Login works and returns valid JWT
- [ ] API endpoints with admin auth work
- [ ] Dashboard loads without 403 errors

## Local Testing

You can test the setup locally:

```bash
# Set up environment variables in .env.local
npm run setup-production

# Test health check
curl http://localhost:3000/api/health

# Test admin setup
curl -X POST http://localhost:3000/api/setup/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sendme.com","password":"admin123","fullName":"Admin","phoneNumber":"+1234567890"}'
```

## Next Steps

1. Deploy the updated code to Vercel
2. Set environment variables in Vercel dashboard
3. Test the health check endpoint
4. Create admin user if needed
5. Test authentication and admin endpoints
6. Monitor logs for any remaining issues

The enhanced logging will help identify exactly where the authentication is failing on Vercel.
