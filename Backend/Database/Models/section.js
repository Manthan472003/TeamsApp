const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config'); // Adjust path to your Sequelize instance

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sectionName: {
    type: DataTypes.STRING(45),
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
  tableName: 'section_table',
  timestamps: false
});

module.exports = Section;
