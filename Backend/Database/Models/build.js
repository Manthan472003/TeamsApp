const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Build = sequelize.define('Build', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    appId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deployedOn: {
        type: DataTypes.ENUM('Stage', 'Production'),
        defaultValue: 'Production'
    },
    versionName: {
        type: DataTypes.STRING(45)
    },
    link: {
        type: DataTypes.TEXT,
    },
    tasksForBuild: {
        type: DataTypes.JSON,
        allowNull: true
    },
    checkedIds: {
        type: DataTypes.JSON
    },

}, {
    tableName: 'build_table',
    timestamps: true, // Enables automatic createdAt and updatedAt fields
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

module.exports = Build;