const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PasswordHistory = sequelize.define(
  'PasswordHistory',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    appName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'password_history',
    timestamps: true,
  }
);

module.exports = PasswordHistory;
