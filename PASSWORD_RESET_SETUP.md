# Password Reset Functionality

This document explains the password reset functionality that has been added to the bike admin dashboard.

## Features Added

### 1. Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Page**: `/forgot-password`
- **Functionality**: 
  - User enters their email address
  - System generates a secure reset token (valid for 10 minutes)
  - In development mode, the reset URL is returned in the response
  - In production, you would send an email with the reset link

### 2. Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Page**: `/reset-password?token=<reset_token>`
- **Functionality**:
  - User clicks the reset link from their email
  - System verifies the token is valid and not expired
  - User enters a new password
  - Password is updated and user is redirected to login

### 3. Token Verification
- **Endpoint**: `GET /api/auth/reset-password?token=<reset_token>`
- **Functionality**: Verifies if a reset token is valid before showing the reset form

## Database Changes

The User model has been updated to include:
- `resetPasswordToken`: Stores the reset token
- `resetPasswordExpires`: Stores the expiration time for the token

## Environment Variables

Add the following to your `.env.local` file:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Usage Flow

1. **User forgets password**:
   - Goes to `/forgot-password`
   - Enters email address
   - Receives confirmation message

2. **User receives reset link**:
   - In development: Reset URL is shown in the response
   - In production: Email would be sent with reset link

3. **User resets password**:
   - Clicks reset link
   - System verifies token
   - User enters new password
   - Password is updated
   - User is redirected to login

## Security Features

- Reset tokens expire after 10 minutes
- Tokens are cryptographically secure (32 random bytes)
- Tokens are single-use (cleared after password reset)
- No information leakage about whether email exists
- Password validation (minimum 6 characters)

## Development vs Production

### Development Mode
- Reset URLs are returned in API responses for testing
- No actual emails are sent

### Production Mode
- You need to implement email sending functionality
- Update the `sendPasswordResetEmail` function in the forgot password API
- Use services like SendGrid, AWS SES, or similar

## Testing

1. Start the development server
2. Go to `/forgot-password`
3. Enter a valid email address
4. Copy the reset URL from the response
5. Open the reset URL in a new tab
6. Enter a new password
7. Verify you can login with the new password

## API Endpoints

### POST /api/auth/forgot-password
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/reset-password
```json
{
  "token": "reset_token_here",
  "password": "new_password"
}
```

### GET /api/auth/reset-password?token=reset_token_here
Returns user email if token is valid.

## Integration with Existing Auth

The password reset functionality integrates seamlessly with the existing authentication system:
- Uses the same User model
- Follows the same error handling patterns
- Maintains the same UI/UX consistency
- Works with the existing AuthContext
