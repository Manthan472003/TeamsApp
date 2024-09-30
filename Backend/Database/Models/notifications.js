const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Notification = sequelize.define('Notification',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    notificationText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userIds: {
        type: DataTypes.JSON
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
    tableName: 'notifications_table',
    timestamps:  false,

});

module.exports = Notification;