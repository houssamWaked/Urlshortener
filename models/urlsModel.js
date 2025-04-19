const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // your sequelize instance file

const Url = sequelize.define(
  'Url',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    long_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    short_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    click_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'urls',
    timestamps: false,
  }
);

module.exports = Url;
