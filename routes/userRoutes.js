const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers');

const {
  ValidateUserCreation,
  ValidateUserIdParam,
  ValidateUserEmailParam,
  ValidateUserNameParam,
  ValidateUserUpdate,
} = require('../validators/userDTO');

router.post('/', ValidateUserCreation, (req, res) =>
  UserController.createUser(req, res)
);

router.get('/', (req, res) => UserController.getAllUsers(req, res));

router.get('/email/:user_email', ValidateUserEmailParam, (req, res) =>
  UserController.getUserByEmail(req, res)
);

router.get('/id/:user_id', ValidateUserIdParam, (req, res) =>
  UserController.getUserById(req, res)
);

router.get('/user_name/:user_name', ValidateUserNameParam, (req, res) =>
  UserController.getUserByName(req, res)
);

router.put('/:user_id', [ValidateUserIdParam, ValidateUserUpdate], (req, res) =>
  UserController.updateUser(req, res)
);

router.delete('/:user_id', ValidateUserIdParam, (req, res) =>
  UserController.deleteUser(req, res)
);

module.exports = router;
