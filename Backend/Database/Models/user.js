const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userName: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    // Collation is generally set in the database schema
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    // Collation is generally set in the database schema
  },
  userType: {
    type: DataTypes.ENUM('Admin', 'Developer', 'FieldWorker', 'Doctor'),
    defaultValue: 'FieldWorker'
  },
  token: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  }
}, {
  tableName: 'user_table',
  timestamps: false // Explicitly set to false to manage timestamps manually
});

module.exports = User;
