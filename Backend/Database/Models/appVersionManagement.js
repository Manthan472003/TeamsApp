const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const AppVersionManagement = sequelize.define('AppVersionManagement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    applicationName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    liveVersion: {
        type: DataTypes.STRING(45)
    },
    testVersion: {
        type: DataTypes.STRING(45)
    },
    status: {
        type: DataTypes.ENUM('Not Started','Working On', 'Submitted', 'In Review'),
        defaultValue: 'Not Started'
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
    tableName : 'app_version_management_table',
    timestamps : false
});

module.exports = AppVersionManagement;