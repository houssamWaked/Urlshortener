const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers');


const {
  ValidateUserCreation,
  ValidateUserIdParam,
  ValidateUserEmailParam,
  ValidateUserNameParam,
  ValidateUserUpdate
} = require('../validators/userDTO');

// Create a user
router.post('/', ValidateUserCreation, (req, res) => UserController.createUser(req, res));

// Get all users
router.get('/', (req, res) => UserController.getAllUsers(req, res));

// Get user by email
router.get('/email/:user_email', ValidateUserEmailParam, (req, res) => UserController.getUserByEmail(req, res));

// Get user by ID
router.get('/id/:user_id', ValidateUserIdParam, (req, res) => UserController.getUserById(req, res));

// Get user by name
router.get('/user_name/:user_name', ValidateUserNameParam, (req, res) => UserController.getUserByName(req, res));

// Update user
router.put('/:user_id', [ValidateUserIdParam,ValidateUserUpdate], (req, res) => UserController.updateUser(req, res));

// Delete user
router.delete('/:user_id', ValidateUserIdParam, (req, res) => UserController.deleteUser(req, res));

module.exports = router;
