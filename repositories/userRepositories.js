// Import the necessary User model
const User = require('../models/usersModel');

// Define the 'UserRepository' class for user-related database operations
class UserRepository {
  // Centralized error handling method
  static handleError(e, method) {
    if (process.env.NODE_ENV === 'development') {
      // Log errors in development mode for easier debugging
      console.error(`Database Error in ${method}:`, e);
    }
    // Rethrow the error with a custom message
    throw new Error(e.message);
  }

  // Method to create a new user in the database
  static async createUser(userData) {
    try {
      // Check if a user with the given email already exists
      const emailExists = await this.userExistsByEmail(userData.user_email);
      if (emailExists) {
        throw new Error(
          `User with email ${userData.user_email} already exists`
        );
      }

      // Check if a user with the given name already exists
      const nameExists = await this.getUserByName(userData.user_name);
      if (nameExists && !nameExists.message) {
        throw new Error(`User with name ${userData.user_name} already exists`);
      }

      // Validate the user input fields
      if (!userData.user_name) throw new Error('User name is required');
      if (!userData.user_email || !userData.user_password) {
        throw new Error('Email and password are required');
      }

      // Create a new user record in the database
      const user = await User.create({
        user_name: userData.user_name,
        user_email: userData.user_email,
        user_password: userData.user_password,
      });

      return {
        user_id: user.user_id,
        message: `User ${userData.user_name} created successfully`,
      };
    } catch (e) {
      // Handle any errors that occur during user creation
      this.handleError(e, 'createUser');
    }
  }

  // Method to get all users from the database
  static async getAllUsers() {
    try {
      const users = await User.findAll();

      if (users.length === 0) {
        return { message: 'No users found' };
      }

      return users;
    } catch (e) {
      // Handle errors while retrieving all users
      this.handleError(e, 'getAllUsers');
    }
  }

  // Method to find a user by their email
  static async getUserByEmail(user_email) {
    try {
      const user = await User.findOne({ where: { user_email } });

      if (!user) return { message: 'No user found with this email' };

      return user;
    } catch (e) {
      // Handle errors while retrieving a user by email
      this.handleError(e, 'getUserByEmail');
    }
  }

  // Method to find a user by their ID
  static async getUserById(user_id) {
    try {
      const user = await User.findByPk(user_id);

      if (!user) return { message: 'No user found with this ID' };

      return user;
    } catch (e) {
      // Handle errors while retrieving a user by ID
      this.handleError(e, 'getUserById');
    }
  }

  // Method to update a user's information
  static async updateUser(user_id, userData) {
    try {
      // Ensure the user exists before updating
      const user = await UserRepository.userExistsByID(user_id);
      if (!user) throw new Error(`User with ID ${user_id} not found`);

      const updateFields = {};

      // If the user provides a new email, check if it already exists
      if (userData.user_email) {
        const emailExists = await this.userExistsByEmail(
          userData.user_email,
          user_id
        );
        if (emailExists)
          throw new Error(
            `User with email ${userData.user_email} already exists`
          );

        updateFields.user_email = userData.user_email;
      }

      // If the user provides a new name, update it
      if (userData.user_name) {
        updateFields.user_name = userData.user_name;
      }

      // If the user provides a new password, update it
      if (userData.user_password) {
        updateFields.user_password = userData.user_password;
      }

      // If no fields were provided for the update, throw an error
      if (Object.keys(updateFields).length === 0) {
        throw new Error('No fields provided for update');
      }

      // Update the user with the new data
      await user.update(updateFields);

      return {
        affectedRows: 1,
        message: `User with ID ${user_id} updated successfully`,
      };
    } catch (e) {
      // Handle errors while updating user information
      this.handleError(e, 'updateUser');
    }
  }

  // Method to delete a user by their ID
  static async deleteUser(user_id) {
    try {
      // Ensure the user exists before deleting
      const user = await User.findByPk(user_id);
      if (!user) throw new Error(`User with ID ${user_id} not found`);

      // Delete the user from the database
      await user.destroy();

      return {
        affectedRows: 1,
        message: `User with ID ${user_id} deleted successfully`,
      };
    } catch (e) {
      // Handle errors while deleting the user
      this.handleError(e, 'deleteUser');
    }
  }

  // Method to find a user by their username
  static async getUserByName(user_name) {
    try {
      const user = await User.findOne({ where: { user_name } });

      if (!user) return { message: 'No user found with this name' };

      return user;
    } catch (e) {
      // Handle errors while retrieving a user by name
      this.handleError(e, 'getUserByName');
    }
  }

  // Helper method to check if a user exists by their ID
  static async userExistsByID(user_id) {
    try {
      const user = await User.findByPk(user_id);
      return !!user; // Return true if the user exists, false otherwise
    } catch (e) {
      // Handle errors while checking if a user exists by ID
      this.handleError(e, 'userExistsByID');
    }
  }

  // Helper method to check if a user exists by their email
  static async userExistsByEmail(user_email, excludeUserId = null) {
    try {
      const where = excludeUserId
        ? {
            user_email,
            user_id: { [require('sequelize').Op.ne]: excludeUserId }, // Exclude user with the provided ID
          }
        : { user_email };

      const user = await User.findOne({ where });
      return !!user; // Return true if the user exists, false otherwise
    } catch (e) {
      // Handle errors while checking if a user exists by email
      this.handleError(e, 'userExistsByEmail');
    }
  }
}

// Export the 'UserRepository' class for use in other parts of the application
module.exports = UserRepository;
