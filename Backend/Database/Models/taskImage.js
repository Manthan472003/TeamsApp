const { DataTypes } = require('sequelize');
const sequelize = require('../Config/config');

const TaskImage = sequelize.define('TaskImage', {
    TaskID: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ImageID: {
        type: DataTypes.INTEGER,
        primaryKey: true
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
    tableName: 'taskimagetable',
    timestamps: false
});

module.exports = TaskImage;