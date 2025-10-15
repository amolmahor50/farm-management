const createOrder = async (amount, currency = 'INR', receipt) => {
  try {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      order: {
        id: orderId,
        amount: amount * 100,
        currency,
        receipt,
        status: 'created'
      }
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create payment order');
  }
};

const verifyPayment = async (orderId, paymentId, signature) => {
  try {
    return {
      success: true,
      message: 'Payment verified successfully'
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Payment verification failed');
  }
};

const createRefund = async (paymentId, amount) => {
  try {
    const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      refund: {
        id: refundId,
        paymentId,
        amount,
        status: 'processed'
      }
    };
  } catch (error) {
    console.error('Error creating refund:', error);
    throw new Error('Failed to create refund');
  }
};

const fetchPaymentDetails = async (paymentId) => {
  try {
    return {
      success: true,
      payment: {
        id: paymentId,
        status: 'captured',
        method: 'upi'
      }
    };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  createRefund,
  fetchPaymentDetails
};
