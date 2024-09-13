const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const VersionManagement = sequelize.define('VersionManagement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER
    },
    technologyUsed: {
        type: DataTypes.STRING(255)
    },
    currentVersion: {
        type: DataTypes.STRING(45)
    },
    latestVersion: {
        type: DataTypes.STRING(45)
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
},{
    tableName : 'version_management_table',
    timestamps : false
});

module.exports = VersionManagement;