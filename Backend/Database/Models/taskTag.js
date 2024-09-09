const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const TaskTag = sequelize.define('TaskTag', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    taskID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tagID: {
        type: DataTypes.INTEGER,
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
    tableName: 'tasktagtable',
    timestamps: false
});

module.exports = TaskTag;
