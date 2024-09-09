const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tagName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    allowNull: true
  }
}, {
  tableName: 'tagstable',
  timestamps: false
});

module.exports = Tag;
