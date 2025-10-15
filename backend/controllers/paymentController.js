const Subscription = require('../models/Subscription');
const { createOrder, verifyPayment } = require('../utils/paymentGateway');

exports.createSubscription = async (req, res, next) => {
  try {
    const { plan, duration = 30 } = req.body;

    const planPrices = {
      basic: 299,
      premium: 999
    };

    const amount = planPrices[plan] || 0;

    const order = await createOrder(amount, 'INR', `subscription_${req.user.id}`);

    res.status(200).json({
      success: true,
      order: order.order
    });
  } catch (error) {
    next(error);
  }
};

exports.verifySubscriptionPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, plan, duration = 30 } = req.body;

    const verification = await verifyPayment(orderId, paymentId, signature);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    let subscription = await Subscription.findOne({ user: req.user.id });

    if (subscription) {
      subscription.plan = plan;
      subscription.status = 'active';
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      subscription.paymentHistory.push({
        transactionId: paymentId,
        amount: req.body.amount,
        status: 'success',
        paymentDate: Date.now()
      });
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        user: req.user.id,
        plan,
        status: 'active',
        startDate,
        endDate,
        paymentHistory: [{
          transactionId: paymentId,
          amount: req.body.amount,
          status: 'success',
          paymentDate: Date.now()
        }]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription activated successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user.id },
      { status: 'cancelled', cancelledAt: Date.now(), cancelReason: req.body.reason },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};
