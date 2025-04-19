const { body, param, validationResult } = require('express-validator');

// Validation for creating a new user
const ValidateUserCreation = [
  body('user_name')
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 3 })
    .withMessage('User name must be at least 3 characters'),

  body('user_email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),

  body('user_password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for user ID parameter
const ValidateUserIdParam = [
  param('user_id')
    .isInt({ gt: 0 })
    .withMessage('User ID must be a positive integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for user email parameter
const ValidateUserEmailParam = [
  param('user_email').isEmail().withMessage('Invalid email format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for user name parameter
const ValidateUserNameParam = [
  param('user_name').notEmpty().withMessage('User name is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for updating user data
const ValidateUserUpdate = [
  param('user_id')
    .isInt({ gt: 0 })
    .withMessage('User ID must be a positive integer'),

  body('user_name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('User name must be at least 3 characters'),

  body('user_email').optional().isEmail().withMessage('Invalid email'),

  body('user_password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for deleting a user
const ValidateDeleteUser = ValidateUserIdParam;

module.exports = {
  ValidateUserCreation,
  ValidateUserIdParam,
  ValidateUserEmailParam,
  ValidateUserNameParam,
  ValidateUserUpdate,
  ValidateDeleteUser,
};
