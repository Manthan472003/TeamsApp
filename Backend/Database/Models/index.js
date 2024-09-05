const Sequelize = require('sequelize');
const sequelize = require('../Config/config');

const User = require('./user');
const Task = require('./task');
const Tag = require('./tag');
const TaskTag = require('./taskTag');
const Section = require('./section');
const Image = require('./image');
const TaskImage = require('./taskImage');
const UserAssign = require('./userAssign');

// Declaring db object consisting of every data for every table
const db = {};
db.User = User;
db.Task = Task;
db.Tag = Tag;
db.TaskTag = TaskTag;
db.Section = Section;
db.Image = Image;
db.TaskImage = TaskImage;
db.UserAssign = UserAssign;

// Associations

// User to Task (Assigned and Created By)
db.User.hasMany(db.Task, { foreignKey: 'TaskCreatedByID', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
db.Task.belongsTo(db.User, { foreignKey: 'TaskCreatedByID' });

// User to UserAssign
db.User.hasMany(db.UserAssign, { foreignKey: 'userID', onDelete: 'NO ACTION', onUpdate: 'CASCADE' });
db.UserAssign.belongsTo(db.User, { foreignKey: 'userID' });

// Task to UserAssign
db.Task.hasMany(db.UserAssign, { foreignKey: 'taskID', onDelete: 'NO ACTION', onUpdate: 'CASCADE' });
db.UserAssign.belongsTo(db.Task, { foreignKey: 'taskID' });


// Section to Task
db.Section.hasMany(db.Task, { foreignKey: 'SectionID', onDelete: 'SET NULL', onUpdate: 'SET NULL' });
db.Task.belongsTo(db.Section, { foreignKey: 'SectionID' });

// Tag to Task
db.Tag.belongsToMany(db.Task, { through: db.TaskTag, foreignKey: 'TagID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.Task.belongsToMany(db.Tag, { through: db.TaskTag, foreignKey: 'TaskID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Image to Task
db.Image.belongsToMany(db.Task, { through: db.TaskImage, foreignKey: 'ImageID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.Task.belongsToMany(db.Image, { through: db.TaskImage, foreignKey: 'TaskID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
