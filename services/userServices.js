const UserRepository = require('../repositories/userRepositories');
const bcrypt = require('bcrypt');

class UserServices {
  // Method to create a user, with password hashing before storing
  static async createUser(userData) {
    // Hashing the password before passing to the repository for creation
    userData.user_password = await bcrypt.hash(userData.user_password, 10);
    return UserRepository.createUser(userData);
  }

  // Method to get all users
  static getAllUsers() {
    return UserRepository.getAllUsers();
  }

  // Method to get a user by their email
  static getUserByEmail(user_email) {
    return UserRepository.getUserByEmail(user_email);
  }

  // Method to get a user by their ID
  static getUserById(user_id) {
    return UserRepository.getUserById(user_id);
  }

  // Method to update a user (with password hashing for new passwords)
  static async updateUser(user_id, userData) {
    if (userData.user_password) {
      // If the password is provided, hash it before updating
      userData.user_password = await bcrypt.hash(
        userData.user_password.toString(),
        10
      );
    }
    return UserRepository.updateUser(user_id, userData);
  }

  // Method to delete a user by their ID
  static deleteUser(user_id) {
    return UserRepository.deleteUser(user_id);
  }

  // Method to get a user by their name
  static getUserByName(user_name) {
    return UserRepository.getUserByName(user_name);
  }
}

module.exports = UserServices;
