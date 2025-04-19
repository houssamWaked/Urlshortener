// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
// Import the Sequelize instance for database connection
const sequelize = require('../config/sequelize');

// Define the 'Url' model for the 'urls' table in the database
const Url = sequelize.define(
  'Url', // Model name (usually singular, and will be automatically pluralized for table names)
  {
    // Define the fields/columns of the 'urls' table

    id: {
      type: DataTypes.INTEGER, // Integer type for ID
      primaryKey: true, // Set this column as the primary key
      autoIncrement: true, // Auto-increment the value for new records
    },

    long_url: {
      type: DataTypes.TEXT, // Text type to store the long URL
      allowNull: false, // Ensure this field cannot be null
    },

    short_code: {
      type: DataTypes.STRING(10), // String of max 10 characters for the short code
      allowNull: true, // This field can be null (for URLs that haven't been shortened yet)
      unique: true, // Enforce uniqueness on the short code
    },

    created_at: {
      type: DataTypes.DATE, // Date type for creation timestamp
      defaultValue: DataTypes.NOW, // Default to the current time when created
    },

    updated_at: {
      type: DataTypes.DATE, // Date type for the last update timestamp
      defaultValue: DataTypes.NOW, // Default to the current time when updated
    },

    expiration_date: {
      type: DataTypes.DATE, // Date type for when the shortened URL will expire
      allowNull: true, // This field can be null (no expiration date)
    },

    is_active: {
      type: DataTypes.BOOLEAN, // Boolean to indicate whether the shortened URL is active
      defaultValue: true, // Default to true (active)
    },

    click_count: {
      type: DataTypes.INTEGER, // Integer type to track the number of clicks
      defaultValue: 0, // Default to 0 clicks when first created
    },

    user_id: {
      type: DataTypes.INTEGER, // Integer type to reference the user who created the URL
      allowNull: true, // This field can be null (optional)
      references: {
        model: 'users', // Reference the 'users' table for the relationship
        key: 'id', // Reference the 'id' field in the 'users' table
      },
      onDelete: 'SET NULL', // If the user is deleted, set the user_id to null
      onUpdate: 'CASCADE', // If the user id is updated, cascade the update to this table
    },
  },
  {
    tableName: 'urls', // Explicitly define the table name for the model (this is optional as Sequelize pluralizes the model name)
    timestamps: false, // Disable Sequelize’s automatic handling of timestamps (we manually define them above)
  }
);

// Export the 'Url' model for use in other parts of the application
module.exports = Url;
