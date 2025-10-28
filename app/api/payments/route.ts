import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb-serverless';
import Payment from '@/lib/models/Payment';
import User from '@/lib/models/User';
import { getUserFromRequest, isAdmin, createSuccessResponse, createErrorResponse } from '@/lib/auth';
import { withDatabaseConnection } from '@/lib/api-wrapper';

async function getPaymentsHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';

    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }

    // Get total count
    const total = await Payment.countDocuments(query);

    // Get payments with driver information
    const payments = await Payment.find(query)
      .populate('driver', 'fullName email phoneNumber')
      .populate('processedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter by search term if provided
    let filteredPayments = payments;
    if (search) {
      filteredPayments = payments.filter(payment => {
        const driver = payment.driver as any;
        return driver.fullName.toLowerCase().includes(search.toLowerCase()) ||
               driver.email.toLowerCase().includes(search.toLowerCase()) ||
               driver.phoneNumber.includes(search) ||
               payment.transactionId?.toLowerCase().includes(search.toLowerCase());
      });
    }

    return createSuccessResponse({
      payments: filteredPayments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPayments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get payments error:', error);
    return createErrorResponse('Server error while fetching payments', 500);
  }
}

async function createPaymentHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const paymentData = await request.json();
    const { driver, amount, paymentMethod, type, description, periodStart, periodEnd } = paymentData;

    // Validation
    if (!driver || !amount || !paymentMethod || !type || !description || !periodStart || !periodEnd) {
      return createErrorResponse('All required fields must be provided', 400);
    }

    // Check if driver exists
    const existingDriver = await User.findById(driver);
    if (!existingDriver) {
      return createErrorResponse('Driver not found', 404);
    }

    // Create new payment
    const newPayment = new Payment({
      driver,
      amount,
      paymentMethod,
      type,
      description,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      status: 'pending',
      grossEarnings: amount,
      netAmount: amount
    });

    await newPayment.save();
    await newPayment.getPaymentWithDriver();

    return createSuccessResponse({
      payment: newPayment
    }, 'Payment created successfully');

  } catch (error) {
    console.error('Create payment error:', error);
    return createErrorResponse('Server error while creating payment', 500);
  }
}

async function updatePaymentHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');
    
    if (!paymentId) {
      return createErrorResponse('Payment ID is required', 400);
    }

    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.driver;

    // Check if payment exists
    const existingPayment = await Payment.findById(paymentId);
    if (!existingPayment) {
      return createErrorResponse('Payment not found', 404);
    }

    // Update payment
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      updateData,
      { new: true, runValidators: true }
    ).populate('driver', 'fullName email phoneNumber')
     .populate('processedBy', 'fullName email');

    return createSuccessResponse({
      payment: updatedPayment
    }, 'Payment updated successfully');

  } catch (error) {
    console.error('Update payment error:', error);
    return createErrorResponse('Server error while updating payment', 500);
  }
}

async function deletePaymentHandler(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !isAdmin(user)) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');
    
    if (!paymentId) {
      return createErrorResponse('Payment ID is required', 400);
    }

    // Check if payment exists
    const existingPayment = await Payment.findById(paymentId);
    if (!existingPayment) {
      return createErrorResponse('Payment not found', 404);
    }

    // Delete payment
    await Payment.findByIdAndDelete(paymentId);

    return createSuccessResponse({}, 'Payment deleted successfully');

  } catch (error) {
    console.error('Delete payment error:', error);
    return createErrorResponse('Server error while deleting payment', 500);
  }
}

// Export handlers with database connection wrapper
export const GET = withDatabaseConnection(getPaymentsHandler);
export const POST = withDatabaseConnection(createPaymentHandler);
export const PUT = withDatabaseConnection(updatePaymentHandler);
export const DELETE = withDatabaseConnection(deletePaymentHandler);

