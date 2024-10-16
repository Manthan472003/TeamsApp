const Sequelize = require('sequelize');
const sequelize = require('../Config/config');

const User = require('./user');
const Task = require('./task');
const Tag = require('./tag');
const Section = require('./section');
const Media = require('./media');
const VersionManagement = require('./versionManagement');
const AppVersionManagement = require('./appVersionManagement');
const Build = require('./build');
const Notifications = require('./notifications');
const Comment = require('./comment');
const TasksChecked = require('./tasksChecked');
const DailyReports = require('./dailyReports');

// Declaring db object consisting of every data for every table
const db = {};
db.User = User;
db.Task = Task;
db.Tag = Tag;
db.Section = Section;
db.Media = Media;
db.VersionManagement = VersionManagement;
db.AppVersionManagement =AppVersionManagement;
db.Build = Build;
db.Notifications = Notifications;
db.Comment = Comment;
db.TasksChecked = TasksChecked;
db.DailyReports = DailyReports;

// Load associations
require('./associations');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
