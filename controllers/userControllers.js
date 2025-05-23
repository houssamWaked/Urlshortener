const UserServices = require('../services/userServices');

class UserController {
  // Error handling function
  static handleError(res, error) {
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || 'An error occurred' });
  }

  // Create a new user
  static async createUser(req, res) {
    try {
      const userData = req.body;
      const user = await UserServices.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      UserController.handleError(res, error);
    }
  }

  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await UserServices.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      UserController.handleError(res, error);
    }
  }

  // Get a user by email
  static async getUserByEmail(req, res) {
    try {
      const { user_email } = req.params;
      const user = await UserServices.getUserByEmail(user_email);
      res.status(200).json(user);
    } catch (error) {
      UserController.handleError(res, error);
    }
  }

  // Get a user by ID
  static async getUserById(req, res) {
    try {
      const { user_id } = req.params;
      const user = await UserServices.getUserById(user_id);
      res.status(200).json(user);
    } catch (error) {
      UserController.handleError(res, error);
    }
  }

  // Update user details
  static async updateUser(req, res) {
    try {
      const { user_id } = req.params;
      const userData = req.body;
      const updatedUser = await UserServices.updateUser(user_id, userData);
      res.status(200).json(updatedUser);
    } catch (error) {
      UserController.handleError(res, error);
    }
  }

  // Delete a user
  static async deleteUser(req, res) {
    try {
      const { user_id } = req.params;
      const result = await UserServices.deleteUser(user_id);
      res.status(200).json(result);
    } catch (error) {
      UserController.handleError(res, error);
    }
  }

  // Get a user by name
  static async getUserByName(req, res) {
    try {
      const { user_name } = req.params;
      const user = await UserServices.getUserByName(user_name);
      res.status(200).json(user);
    } catch (error) {
      UserController.handleError(res, error);
    }
  }
}

module.exports = UserController;
