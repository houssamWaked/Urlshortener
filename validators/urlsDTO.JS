const { body, param, validationResult } = require('express-validator');

// Validation for creating a URL with both long_url and short_code
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for creating a random URL (no short_code required)
const ValidateRandomUrlCreation = [
  body('long_url')
    .notEmpty()
    .withMessage('Original URL is required')
    .isURL()
    .withMessage('Invalid URL format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for short_code parameter in URL
const ValidateshortCodeParam = [
  param('short_code')
    .notEmpty()
    .withMessage('Short code is required')
    .isAlphanumeric()
    .withMessage('Short code must be alphanumeric'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  ValidateUrlCreation,
  ValidateRandomUrlCreation,
  ValidateshortCodeParam,
};
