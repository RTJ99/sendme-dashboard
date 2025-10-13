# Bike Admin Dashboard - Next.js API Setup Guide

This guide will help you set up the Next.js API routes for your Bike Admin Dashboard.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```bash
cp env.local.example .env.local
```

Update the `.env.local` file with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/bike-admin-dashboard

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Admin credentials (for initial setup)
ADMIN_EMAIL=admin@sendme.com
ADMIN_PASSWORD=admin123
ADMIN_PHONE=+1234567890
```

### 3. Initialize Database

```bash
npm run init-db
```

This will create the default admin user with the credentials specified in your `.env.local` file.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

All API routes are now located in the `app/api` directory and follow Next.js 13+ App Router conventions.

### Authentication Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### Dashboard Routes
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/notifications` - Get dashboard notifications

### Driver Management Routes
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/[id]` - Get driver by ID
- `PUT /api/drivers/[id]/status` - Update driver status

### Application Management Routes
- `GET /api/admin/applications` - Get all applications
- `PUT /api/admin/applications/[id]/review` - Review application

### Parcel Management Routes
- `GET /api/parcels` - Get all parcels

## Database Models

The database models are located in `lib/models/`:

- **User.ts** - User accounts (admin, driver, client)
- **Driver.ts** - Driver-specific information and vehicle details
- **Parcel.ts** - Delivery parcels and tracking
- **Application.ts** - Driver applications
- **Payment.ts** - Driver payments and earnings

## Authentication

The authentication system uses JWT tokens and includes:

- Password hashing with bcrypt
- Role-based authorization (admin, driver, client)
- Token-based authentication for API routes
- Automatic token validation middleware

## Frontend Integration

The existing API client (`lib/api.ts`) has been updated to work with the Next.js API routes. The React hooks (`hooks/useDashboard.ts`) and authentication context (`contexts/AuthContext.tsx`) are ready to use.

### Example Usage

```typescript
import { useDashboard } from '@/hooks/useDashboard';

function Dashboard() {
  const { stats, loading, error } = useDashboard();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {stats?.overview.totalUsers}</p>
      <p>Total Drivers: {stats?.overview.totalDrivers}</p>
    </div>
  );
}
```

## Default Admin Login

After running the database initialization script, you can log in with:

- **Email**: admin@sendme.com (or whatever you set in ADMIN_EMAIL)
- **Password**: admin123 (or whatever you set in ADMIN_PASSWORD)

## API Testing

You can test the API endpoints using tools like Postman or curl:

### Login Example
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sendme.com","password":"admin123"}'
```

### Get Dashboard Stats (requires authentication)
```bash
curl -X GET http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Key Features

### Backend Features
- JWT-based authentication
- Role-based authorization (admin, driver, client)
- Comprehensive API endpoints for all dashboard features
- Input validation and error handling
- MongoDB integration with Mongoose
- TypeScript support throughout

### Frontend Integration
- API client with TypeScript support
- React hooks for data fetching
- Authentication context
- Type-safe API responses

## Development Workflow

1. **API Development**:
   - Make changes to API routes in `app/api/`
   - Test endpoints using Postman or curl
   - Use `npm run dev` for hot reloading

2. **Frontend Development**:
   - Update components to use the API hooks
   - Test authentication flow
   - Use `npm run dev` for hot reloading

## Production Deployment

### Environment Variables
Set the following environment variables in your production environment:

- `MONGODB_URI` - Your production MongoDB connection string
- `JWT_SECRET` - A secure JWT secret key
- `ADMIN_EMAIL` - Admin email for initial setup
- `ADMIN_PASSWORD` - Admin password for initial setup

### Deployment Platforms
- **Vercel**: Deploy directly from GitHub with automatic builds
- **Netlify**: Deploy with build commands
- **Railway**: Deploy with MongoDB Atlas integration

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env.local file
   - Verify network connectivity

2. **JWT Token Issues**:
   - Check JWT_SECRET is set in .env.local
   - Ensure token is being sent in Authorization header
   - Verify token hasn't expired

3. **API Route Not Found**:
   - Check the file structure in app/api/
   - Ensure route files are named correctly (route.ts)
   - Verify the HTTP method matches your request

4. **TypeScript Errors**:
   - Run `npm run build` to check for type errors
   - Ensure all imports are correct
   - Check that models are properly exported

## File Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── logout/route.ts
│   │   ├── dashboard/
│   │   │   ├── stats/route.ts
│   │   │   └── notifications/route.ts
│   │   ├── drivers/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── status/route.ts
│   │   ├── admin/
│   │   │   └── applications/
│   │   │       ├── route.ts
│   │   │       └── [id]/review/route.ts
│   │   └── parcels/
│   │       └── route.ts
│   └── ...
├── lib/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Driver.ts
│   │   ├── Parcel.ts
│   │   ├── Application.ts
│   │   └── Payment.ts
│   ├── auth.ts
│   ├── mongodb.ts
│   └── api.ts
├── hooks/
│   └── useDashboard.ts
├── contexts/
│   └── AuthContext.tsx
└── scripts/
    └── init-db.ts
```

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check MongoDB connection and database initialization

The Next.js API implementation is production-ready with proper security, validation, and error handling.