const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const TaskTag = sequelize.define('TaskTag', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    TaskID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TagID: {
        type: DataTypes.INTEGER,
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
    tableName: 'tasktagtable',
    timestamps: false
});

module.exports = TaskTag;
