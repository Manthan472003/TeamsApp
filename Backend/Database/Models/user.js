const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UserName: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    // Collation is generally set in the database schema
  },
  Password: {
    type: DataTypes.STRING(45),
    allowNull: false,
    // Collation is generally set in the database schema
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    allowNull: true
  }
}, {
  tableName: 'usertable',
  timestamps: false // Explicitly set to false to manage timestamps manually
});

module.exports = User;
