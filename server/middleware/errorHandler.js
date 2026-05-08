const apiResponse = require('../utils/apiResponse');
const logger = require('../config/logger');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for developer
  logger.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return apiResponse.error(res, message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return apiResponse.error(res, message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    return apiResponse.error(res, 'Validation Error', 400, message);
  }

  // Default error
  return apiResponse.error(
    res,
    error.message || 'Server Error',
    error.statusCode || 500
  );
};

module.exports = errorHandler;
