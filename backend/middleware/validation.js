const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'driver', 'client'])
    .withMessage('Invalid role specified'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Driver validation rules
const validateDriverRegistration = [
  body('vehicleType')
    .notEmpty()
    .withMessage('Vehicle type is required'),
  body('vehicleModel')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Vehicle model is required'),
  body('vehicleColor')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Vehicle color is required'),
  body('licensePlate')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('License plate is required'),
  body('licenseNumber')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('License number is required'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters'),
  handleValidationErrors
];

// Parcel validation rules
const validateParcelCreation = [
  body('description')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('pickupLocation.name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Pickup location name is required'),
  body('pickupLocation.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  body('pickupLocation.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  body('dropoffLocation.name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Dropoff location name is required'),
  body('dropoffLocation.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  body('dropoffLocation.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  body('paymentMethod')
    .isIn(['cash', 'ecocash'])
    .withMessage('Payment method must be either cash or ecocash'),
  body('ecocashNumber')
    .if(body('paymentMethod').equals('ecocash'))
    .isMobilePhone()
    .withMessage('Valid EcoCash number is required for EcoCash payments'),
  handleValidationErrors
];

// Application validation rules
const validateApplicationCreation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('vehicleType')
    .isIn(['bike', 'motorcycle', 'car', 'van'])
    .withMessage('Invalid vehicle type'),
  body('vehicleModel')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Vehicle model is required'),
  body('vehicleYear')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid vehicle year'),
  body('vehicleColor')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Vehicle color is required'),
  body('licensePlate')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('License plate is required'),
  body('licenseNumber')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('License number is required'),
  body('licenseExpiry')
    .isISO8601()
    .withMessage('Please provide a valid license expiry date'),
  handleValidationErrors
];

// ID parameter validation
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  handleValidationErrors
];

// Status validation
const validateStatus = [
  body('status')
    .isIn(['pending', 'approved', 'suspended', 'rejected', 'on_hold'])
    .withMessage('Invalid status value'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateDriverRegistration,
  validateParcelCreation,
  validateApplicationCreation,
  validateObjectId,
  validatePagination,
  validateSearch,
  validateStatus
};
