const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');
const User = require('./user'); 

const DailyReports = sequelize.define('DailyReports', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  taskName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Completed', 'In Progress', 'On Hold', 'Research'),
    defaultValue: 'In Progress'
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
  tableName: 'daily_reports_table',
  timestamps: false 
});

module.exports = DailyReports;