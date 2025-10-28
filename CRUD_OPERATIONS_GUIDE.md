# Complete CRUD Operations Guide

This guide documents all the CRUD (Create, Read, Update, Delete) operations implemented for the bike admin dashboard.

## Overview

The system now includes comprehensive CRUD operations for all main entities:
- **Users** - User management
- **Drivers** - Driver profiles and management  
- **Parcels** - Package delivery management
- **Applications** - Driver application management
- **Payments** - Payment processing and management

## API Endpoints

### 1. Users CRUD Operations

#### GET /api/users
- **Description**: Get all users with pagination and filtering
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `search` (string): Search by name, email, or phone
  - `role` (string): Filter by role (admin, driver, client)
- **Response**: List of users with pagination info

#### POST /api/users
- **Description**: Create a new user
- **Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "password": "password123",
    "role": "client"
  }
  ```
- **Response**: Created user object

#### PUT /api/users?id={userId}
- **Description**: Update an existing user
- **Body**: User data to update
- **Response**: Updated user object

#### DELETE /api/users?id={userId}
- **Description**: Delete a user
- **Response**: Success message

### 2. Drivers CRUD Operations

#### GET /api/drivers
- **Description**: Get all drivers with pagination and filtering
- **Query Parameters**:
  - `page` (number): Page number
  - `limit` (number): Items per page
  - `search` (string): Search by name, email, or license plate
  - `status` (string): Filter by status (pending, approved, suspended, rejected)
  - `isOnline` (boolean): Filter by online status
- **Response**: List of drivers with pagination info

#### POST /api/drivers
- **Description**: Create a new driver profile
- **Body**:
  ```json
  {
    "userId": "user_id_here",
    "vehicleType": "motorcycle",
    "vehicleModel": "Honda CB125F",
    "vehicleColor": "Red",
    "licensePlate": "ABC123",
    "licenseNumber": "DL123456"
  }
  ```
- **Response**: Created driver object

#### PUT /api/drivers?id={driverId}
- **Description**: Update driver profile
- **Body**: Driver data to update
- **Response**: Updated driver object

#### DELETE /api/drivers?id={driverId}
- **Description**: Delete driver profile
- **Response**: Success message

### 3. Parcels CRUD Operations

#### GET /api/parcels
- **Description**: Get all parcels with pagination and filtering
- **Query Parameters**:
  - `page` (number): Page number
  - `limit` (number): Items per page
  - `search` (string): Search by description or locations
  - `status` (string): Filter by status
  - `paymentStatus` (string): Filter by payment status
  - `dateFrom` (string): Filter from date
  - `dateTo` (string): Filter to date
- **Response**: List of parcels with pagination info

#### POST /api/parcels
- **Description**: Create a new parcel
- **Body**:
  ```json
  {
    "sender": "user_id_here",
    "description": "Package description",
    "price": 25.00,
    "pickupLocation": {
      "name": "Pickup Location",
      "address": "123 Main St",
      "coordinates": {
        "latitude": -17.8252,
        "longitude": 31.0335
      }
    },
    "dropoffLocation": {
      "name": "Dropoff Location", 
      "address": "456 Oak Ave",
      "coordinates": {
        "latitude": -17.8300,
        "longitude": 31.0400
      }
    },
    "paymentMethod": "cash"
  }
  ```
- **Response**: Created parcel object

#### PUT /api/parcels?id={parcelId}
- **Description**: Update parcel
- **Body**: Parcel data to update
- **Response**: Updated parcel object

#### DELETE /api/parcels?id={parcelId}
- **Description**: Delete parcel
- **Response**: Success message

### 4. Applications CRUD Operations

#### GET /api/applications
- **Description**: Get all driver applications
- **Query Parameters**:
  - `page` (number): Page number
  - `limit` (number): Items per page
  - `search` (string): Search by name, email, or license plate
  - `status` (string): Filter by status (pending, under_review, approved, rejected, on_hold)
- **Response**: List of applications with pagination info

#### POST /api/applications
- **Description**: Create a new application
- **Body**:
  ```json
  {
    "user": "user_id_here",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "vehicleType": "motorcycle",
    "licensePlate": "ABC123"
  }
  ```
- **Response**: Created application object

#### PUT /api/applications?id={applicationId}
- **Description**: Update application
- **Body**: Application data to update
- **Response**: Updated application object

#### DELETE /api/applications?id={applicationId}
- **Description**: Delete application
- **Response**: Success message

### 5. Payments CRUD Operations

#### GET /api/payments
- **Description**: Get all payments
- **Query Parameters**:
  - `page` (number): Page number
  - `limit` (number): Items per page
  - `search` (string): Search by driver name or transaction ID
  - `status` (string): Filter by status (pending, processing, completed, failed, cancelled)
  - `type` (string): Filter by type (earnings, bonus, commission, refund)
- **Response**: List of payments with pagination info

#### POST /api/payments
- **Description**: Create a new payment
- **Body**:
  ```json
  {
    "driver": "driver_id_here",
    "amount": 150.00,
    "paymentMethod": "bank_transfer",
    "type": "earnings",
    "description": "Weekly earnings",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-07"
  }
  ```
- **Response**: Created payment object

#### PUT /api/payments?id={paymentId}
- **Description**: Update payment
- **Body**: Payment data to update
- **Response**: Updated payment object

#### DELETE /api/payments?id={paymentId}
- **Description**: Delete payment
- **Response**: Success message

## API Client Usage

The API client (`lib/api.ts`) provides convenient methods for all CRUD operations:

```typescript
import { apiClient } from '@/lib/api';

// Users
const users = await apiClient.getUsers({ page: 1, limit: 10, role: 'driver' });
const newUser = await apiClient.createUser({
  fullName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
  password: 'password123',
  role: 'client'
});
const updatedUser = await apiClient.updateUser(userId, { fullName: 'Jane Doe' });
await apiClient.deleteUser(userId);

// Drivers
const drivers = await apiClient.getDrivers({ status: 'approved' });
const newDriver = await apiClient.createDriver({
  userId: 'user_id',
  vehicleType: 'motorcycle',
  vehicleModel: 'Honda CB125F',
  vehicleColor: 'Red',
  licensePlate: 'ABC123',
  licenseNumber: 'DL123456'
});

// Parcels
const parcels = await apiClient.getParcels({ status: 'pending' });
const newParcel = await apiClient.createParcel({
  sender: 'user_id',
  description: 'Package description',
  price: 25.00,
  pickupLocation: { /* location data */ },
  dropoffLocation: { /* location data */ },
  paymentMethod: 'cash'
});

// Applications
const applications = await apiClient.getApplications({ status: 'pending' });
const newApplication = await apiClient.createApplication({
  user: 'user_id',
  fullName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
  vehicleType: 'motorcycle',
  licensePlate: 'ABC123'
});

// Payments
const payments = await apiClient.getPayments({ status: 'pending' });
const newPayment = await apiClient.createPayment({
  driver: 'driver_id',
  amount: 150.00,
  paymentMethod: 'bank_transfer',
  type: 'earnings',
  description: 'Weekly earnings',
  periodStart: '2024-01-01',
  periodEnd: '2024-01-07'
});
```

## Authentication & Authorization

All CRUD operations require:
- **Authentication**: Valid JWT token in Authorization header
- **Authorization**: Admin privileges required
- **Database Connection**: Optimized for serverless environments

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

Success responses:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

## Database Connection

All CRUD operations use the optimized serverless database connection with:
- Automatic retry on connection failures
- Connection pooling optimized for Vercel
- Timeout handling for serverless environments

## Features

- **Pagination**: All list endpoints support pagination
- **Search**: Text search across relevant fields
- **Filtering**: Filter by status, role, type, etc.
- **Validation**: Input validation and error handling
- **Relationships**: Proper population of related data
- **Optimized Queries**: Efficient database queries with indexes

