// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
// Import the Sequelize instance for database connection
const sequelize = require('../config/sequelize');

// Define the 'User' model for the 'users' table in the database
const User = sequelize.define(
  'User', // Model name (usually singular, and will be automatically pluralized for table names)
  {
    // Define the fields/columns of the 'users' table

    user_id: {
      type: DataTypes.INTEGER, // Integer type for user ID
      primaryKey: true, // Set this column as the primary key
      autoIncrement: true, // Auto-increment the value for new records
    },

    user_name: {
      type: DataTypes.STRING, // String type for user name
      allowNull: false, // Ensure this field cannot be null
    },

    user_email: {
      type: DataTypes.STRING, // String type for user email
      allowNull: false, // Ensure this field cannot be null
      unique: true, // Enforce uniqueness on the email address
    },

    user_password: {
      type: DataTypes.STRING, // String type for user password
      allowNull: false, // Ensure this field cannot be null
    },

    created_at: {
      type: DataTypes.DATE, // Date type for creation timestamp
      defaultValue: DataTypes.NOW, // Default to the current time when created
    },
  },
  {
    tableName: 'users', // Explicitly define the table name for the model (this is optional as Sequelize pluralizes the model name)
    timestamps: false, // Disable Sequelize’s automatic handling of timestamps (we manually define the created_at field)
  }
);

// Export the 'User' model for use in other parts of the application
module.exports = User;
