const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a Sequelize instance (similar to pool)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mariadb',
  logging: false, // Optional: disable SQL query logging
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


module.exports = sequelize;
