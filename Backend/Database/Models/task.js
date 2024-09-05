const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    TaskName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT
    },
    DueDate: {
        type: DataTypes.DATE,
    },
    SubTask: {
        type: DataTypes.TEXT
    },
    TaskAssignedToID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    TaskCreatedByID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Status: {
        type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed', 'On Hold'),
        defaultValue: 'Not Started'
    },
    SectionID: {
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
    tableName: 'taskstable',
    timestamps: false
});

module.exports = Task;
