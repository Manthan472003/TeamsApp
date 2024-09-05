const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config'); // Adjust path to your Sequelize instance

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  SectionName: {
    type: DataTypes.STRING(45),
    allowNull: false
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
  tableName: 'sectiontable',
  timestamps: false
});

module.exports = Section;
