const { body, param, validationResult } = require('express-validator');

// Validation for creating a URL
const ValidateUrlCreation = [
  body('long_url')
    .notEmpty()
    .withMessage('Original URL is required')
    .isURL()
    .withMessage('Invalid URL format'),

  body('short_code')
    .notEmpty()
    .withMessage('Short code is required')
    .isAlphanumeric()
    .withMessage('Short code must be alphanumeric'),

  (req, res, next) => {
    // Check validation errors and handle
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return 400 status with error details
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for random URL creation (fix property name to `long_url`)
const ValidateRandomUrlCreation = [
  body('long_url') // Changed `Long_url` to `long_url` for consistency
    .notEmpty()
    .withMessage('Original URL is required')
    .isURL()
    .withMessage('Invalid URL format'),

  (req, res, next) => {
    // Check validation errors and handle
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return 400 status with error details
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for checking short code parameter
const ValidateshortCodeParam = [
  param('short_code')
    .notEmpty()
    .withMessage('Short code is required')
    .isAlphanumeric()
    .withMessage('Short code must be alphanumeric'),

  (req, res, next) => {
    // Check validation errors and handle
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return 400 status with error details
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Exporting the validators
module.exports = {
  ValidateUrlCreation,
  ValidateRandomUrlCreation,
  ValidateshortCodeParam,
};
