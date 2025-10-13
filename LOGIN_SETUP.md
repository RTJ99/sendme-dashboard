# Login and Dashboard Setup Guide

This guide will help you test the login functionality and connect the dashboard to the backend.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in your project root:
```env
MONGODB_URI=mongodb://localhost:27017/bike-admin-dashboard
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@sendme.com
ADMIN_PASSWORD=admin123
ADMIN_PHONE=+1234567890
```

### 3. Initialize Database
```bash
npm run init-db
```

### 4. Start Development Server
```bash
npm run dev
```

## 🔐 Login Testing

### Default Admin Credentials
- **Email**: admin@sendme.com
- **Password**: admin123

### Login Flow
1. Navigate to `http://localhost:3000/login`
2. Enter the admin credentials
3. Click "Sign in"
4. You'll be redirected to the dashboard

### Create New Admin (via Postman)
You can also create a new admin user using the API:

**POST** `http://localhost:3000/api/auth/register-admin`
```json
{
  "fullName": "Your Name",
  "email": "your-email@example.com",
  "phoneNumber": "+1234567890",
  "password": "your-password"
}
```

## 📊 Dashboard Features

### Real Data Integration
The dashboard now connects to the backend and displays:

- **Key Metrics**: Active drivers, pending applications, total parcels, revenue
- **Charts**: Monthly revenue and trip data
- **Driver Performance**: Top performing drivers
- **Recent Activity**: Latest applications and parcels
- **User Profile**: Shows logged-in user information

### Data Sources
- **Dashboard Stats**: `/api/dashboard/stats`
- **Notifications**: `/api/dashboard/notifications`
- **Driver Data**: `/api/drivers`
- **Applications**: `/api/admin/applications`
- **Parcels**: `/api/parcels`

## 🔒 Authentication Features

### Protected Routes
- Dashboard requires admin role
- Automatic redirect to login if not authenticated
- Token-based authentication with JWT

### User Management
- User profile display in header
- Logout functionality
- Role-based access control

## 🧪 Testing Scenarios

### 1. Login with Valid Credentials
- Should redirect to dashboard
- Should show user information in header
- Should display real data from API

### 2. Login with Invalid Credentials
- Should show error message
- Should stay on login page

### 3. Access Dashboard Without Login
- Should redirect to login page
- Should not show dashboard content

### 4. Logout Functionality
- Should clear user session
- Should redirect to login page

## 🐛 Troubleshooting

### Common Issues

1. **"Access denied" error**
   - Check if user has admin role
   - Verify JWT token is valid
   - Check browser console for errors

2. **Dashboard shows "..." for data**
   - Check if API endpoints are working
   - Verify MongoDB connection
   - Check network tab for failed requests

3. **Login redirects but shows error**
   - Check if JWT_SECRET is set in .env.local
   - Verify database initialization
   - Check server logs

4. **API calls failing**
   - Ensure development server is running
   - Check if MongoDB is running
   - Verify environment variables

### Debug Steps

1. **Check Browser Console**
   - Look for JavaScript errors
   - Check network requests
   - Verify API responses

2. **Check Server Logs**
   - Look for API route errors
   - Check database connection
   - Verify authentication

3. **Test API Endpoints**
   - Use Postman to test individual endpoints
   - Verify authentication headers
   - Check response formats

## 📱 User Experience

### Login Page
- Clean, professional design
- Form validation
- Loading states
- Error handling
- Password visibility toggle

### Dashboard
- Real-time data display
- Loading indicators
- Error handling with retry
- Responsive design
- User profile integration

### Navigation
- Protected routes
- Automatic redirects
- Role-based access
- Session management

## 🔄 Data Flow

1. **User logs in** → API validates credentials → Returns JWT token
2. **Token stored** → Used for authenticated requests
3. **Dashboard loads** → Fetches real data from API
4. **Data displayed** → Updates UI with live information
5. **User logs out** → Clears session → Redirects to login

## 🚀 Next Steps

After testing the login and dashboard:

1. **Add more API endpoints** for other dashboard features
2. **Implement real-time updates** using WebSockets
3. **Add data filtering and search** functionality
4. **Create user management** pages
5. **Add analytics and reporting** features

The platform is now ready for development and testing with a fully functional authentication system and backend integration!
