const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers');

// Import validation middleware
const {
  ValidateUserCreation,
  ValidateUserIdParam,
  ValidateUserEmailParam,
  ValidateUserNameParam,
  ValidateUserUpdate,
} = require('../validators/userDTO');

// Route to create a new user
router.post('/', ValidateUserCreation, (req, res) =>
  UserController.createUser(req, res)
);

// Route to get all users
router.get('/', (req, res) => UserController.getAllUsers(req, res));

// Route to get user by email
router.get('/email/:user_email', ValidateUserEmailParam, (req, res) =>
  UserController.getUserByEmail(req, res)
);

// Route to get user by ID
router.get('/id/:user_id', ValidateUserIdParam, (req, res) =>
  UserController.getUserById(req, res)
);

// Route to get user by name
router.get('/user_name/:user_name', ValidateUserNameParam, (req, res) =>
  UserController.getUserByName(req, res)
);

// Route to update user by ID
router.put('/:user_id', [ValidateUserIdParam, ValidateUserUpdate], (req, res) =>
  UserController.updateUser(req, res)
);

// Route to delete user by ID
router.delete('/:user_id', ValidateUserIdParam, (req, res) =>
  UserController.deleteUser(req, res)
);

module.exports = router;
