const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const TaskImage = sequelize.define('TaskImage', {
    taskID: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    imageID: {
        type: DataTypes.INTEGER,
        primaryKey: true
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
    tableName: 'taskimagetable',
    timestamps: false
});

module.exports = TaskImage;