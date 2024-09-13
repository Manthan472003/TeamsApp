const Sequelize = require('sequelize');
const sequelize = require('../Config/config');

const User = require('./user');
const Task = require('./task');
const Tag = require('./tag');
const TaskTag = require('./taskTag');
const Section = require('./section');
const Image = require('./image');
const TaskImage = require('./taskImage');
const VersionManagement = require('./versionManagement');

// Declaring db object consisting of every data for every table
const db = {};
db.User = User;
db.Task = Task;
db.Tag = Tag;
db.TaskTag = TaskTag;
db.Section = Section;
db.Image = Image;
db.TaskImage = TaskImage;
db.VersionManagement = VersionManagement;

// Load associations
require('./associations');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
