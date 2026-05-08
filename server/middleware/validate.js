const { validationResult } = require('express-validator');
const apiResponse = require('../utils/apiResponse');

/**
 * Middleware to handle validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return apiResponse.error(res, 'Validation Failed', 422, extractedErrors);
};

module.exports = validate;
