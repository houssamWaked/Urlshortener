const { body, param, validationResult } = require('express-validator');

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
