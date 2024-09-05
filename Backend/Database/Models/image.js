const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ImageLink: {
        type: DataTypes.TEXT,
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
    tableName: 'imagetable',
    timestamps: false
});

module.exports = Image;
