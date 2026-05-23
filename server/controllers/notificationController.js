const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const pushService = require('../services/pushService');

/**
 * Subscribe to push notifications
 */
const subscribe = asyncHandler(async (req, res) => {
  const { subscription } = req.body;

  if (!subscription) {
    return apiResponse.error(res, 'Subscription object is required', 400);
  }

  await User.findByIdAndUpdate(req.user._id, {
    pushSubscription: subscription
  });

  // Send a welcome notification
  await pushService.sendNotification(subscription, {
    title: 'Notifications Enabled!',
    body: 'You will now receive clinical reminders and health alerts.',
    icon: '/favicon.svg',
    data: { url: '/patient/reminders' }
  });

  return apiResponse.success(res, null, 'Subscribed successfully');
});

/**
 * Unsubscribe from push notifications
 */
const unsubscribe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    pushSubscription: null
  });

  return apiResponse.success(res, null, 'Unsubscribed successfully');
});

/**
 * Get VAPID Public Key
 */
const getPublicKey = asyncHandler(async (req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey || publicKey === 'your_public_key') {
    return apiResponse.error(res, 'VAPID keys not configured', 500);
  }
  return apiResponse.success(res, { publicKey }, 'Public key fetched');
});

module.exports = {
  subscribe,
  unsubscribe,
  getPublicKey
};
