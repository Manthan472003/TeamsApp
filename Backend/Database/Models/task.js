const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    taskName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    dueDate: {
        type: DataTypes.DATE,
    },
    subTask: {
        type: DataTypes.TEXT
    },
    taskAssignedToID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    taskCreatedByID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed', 'On Hold'),
        defaultValue: 'Not Started'
    },
    sectionID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    platformType: {
        type: DataTypes.ENUM('iOS', 'Android', 'Linux', 'WindowsOS', 'MacOS', 'Web', 'Platform-Independent'),
        defaultValue: 'Platform-Independent'
    },
    tagIDs: {
        type: DataTypes.JSON,
        allowNull: true
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
    tableName: 'tasks_table',
    timestamps: false
});

module.exports = Task;
