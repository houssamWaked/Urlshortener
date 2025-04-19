const User = require('../models/usersModel');

class UserRepository {
  static handleError(e, method) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Database Error in ${method}:`, e);
    }
    throw new Error(e.message);
  }

  static async createUser(userData) {
    try {
      const emailExists = await this.userExistsByEmail(userData.user_email);
      if (emailExists) {
        throw new Error(
          `User with email ${userData.user_email} already exists`
        );
      }

      const nameExists = await this.getUserByName(userData.user_name);
      if (nameExists && !nameExists.message) {
        throw new Error(`User with name ${userData.user_name} already exists`);
      }

      if (!userData.user_name) throw new Error('User name is required');
      if (!userData.user_email || !userData.user_password) {
        throw new Error('Email and password are required');
      }

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
      this.handleError(e, 'createUser');
    }
  }

  static async getAllUsers() {
    try {
      const users = await User.findAll();

      if (users.length === 0) {
        return { message: 'No users found' };
      }

      return users;
    } catch (e) {
      this.handleError(e, 'getAllUsers');
    }
  }

  static async getUserByEmail(user_email) {
    try {
      const user = await User.findOne({ where: { user_email } });

      if (!user) return { message: 'No user found with this email' };

      return user;
    } catch (e) {
      this.handleError(e, 'getUserByEmail');
    }
  }

  static async getUserById(user_id) {
    try {
      const user = await User.findByPk(user_id);

      if (!user) return { message: 'No user found with this ID' };

      return user;
    } catch (e) {
      this.handleError(e, 'getUserById');
    }
  }

  static async updateUser(user_id, userData) {
    try {
      const user = await UserRepository.userExistsByID(user_id);
      if (!user) throw new Error(`User with ID ${user_id} not found`);

      const updateFields = {};

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

      if (userData.user_name) {
        updateFields.user_name = userData.user_name;
      }

      if (userData.user_password) {
        updateFields.user_password = userData.user_password;
      }

      if (Object.keys(updateFields).length === 0) {
        throw new Error('No fields provided for update');
      }

      await user.update(updateFields);

      return {
        affectedRows: 1,
        message: `User with ID ${user_id} updated successfully`,
      };
    } catch (e) {
      this.handleError(e, 'updateUser');
    }
  }

  static async deleteUser(user_id) {
    try {
      const user = await User.findByPk(user_id);
      if (!user) throw new Error(`User with ID ${user_id} not found`);

      await user.destroy();

      return {
        affectedRows: 1,
        message: `User with ID ${user_id} deleted successfully`,
      };
    } catch (e) {
      this.handleError(e, 'deleteUser');
    }
  }

  static async getUserByName(user_name) {
    try {
      const user = await User.findOne({ where: { user_name } });

      if (!user) return { message: 'No user found with this name' };

      return user;
    } catch (e) {
      this.handleError(e, 'getUserByName');
    }
  }

  static async userExistsByID(user_id) {
    try {
      const user = await User.findByPk(user_id);
      return !!user;
    } catch (e) {
      this.handleError(e, 'userExistsByID');
    }
  }

  static async userExistsByEmail(user_email, excludeUserId = null) {
    try {
      const where = excludeUserId
        ? {
            user_email,
            user_id: { [require('sequelize').Op.ne]: excludeUserId },
          }
        : { user_email };

      const user = await User.findOne({ where });
      return !!user;
    } catch (e) {
      this.handleError(e, 'userExistsByEmail');
    }
  }
}

module.exports = UserRepository;
