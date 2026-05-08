const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Verify JWT Token and Single Session
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Get token from headers or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return apiResponse.error(res, 'Not authorized to access this route', 401);
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.sub).select('+currentSessionToken');

    if (!user) {
      return apiResponse.error(res, 'User no longer exists', 401);
    }

    // 4. Check if account is active/banned
    if (!user.isActive || user.isBanned) {
      return apiResponse.error(res, 'Account is inactive or banned', 403);
    }

    // 5. Single session enforcement
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (user.currentSessionToken !== tokenHash) {
      return apiResponse.error(res, 'Session expired or logged in from another device', 401);
    }

    // 6. Grant access
    req.user = user;
    next();
  } catch (error) {
    return apiResponse.error(res, 'Not authorized to access this route', 401);
  }
});

module.exports = { protect };
