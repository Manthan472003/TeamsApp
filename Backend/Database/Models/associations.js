// associations.js
const { User, Task, Tag, Section, Media, Comment, VersionManagement, DailyReports, TasksChecked, Build } = require('./index');

// User to Task (Assigned and Created By)
User.hasMany(Task, { foreignKey: 'taskCreatedByID', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'taskCreatedByID' });
User.hasMany(Task, { foreignKey: 'taskAssignedToID', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'taskAssignedToID' });

// Section to Task
Section.hasMany(Task, { foreignKey: 'sectionID', onDelete: 'SET NULL', onUpdate: 'SET NULL' });
Task.belongsTo(Section, { foreignKey: 'sectionID' });

//Version Management to User
User.hasMany(VersionManagement, { foreignKey: 'userID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
VersionManagement.belongsTo(User, { foreignKey: 'userID' });

// User to DailyReports
User.hasMany(DailyReports, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DailyReports.belongsTo(User, { foreignKey: 'userId' });

// User to DailyReports
Task.hasMany(DailyReports, { foreignKey: 'taskId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DailyReports.belongsTo(Task, { foreignKey: 'taskId' });

// Task to Comment
Task.hasMany(Comment, { foreignKey: 'taskId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId' });

// User to Comment
User.hasMany(Comment, { foreignKey: 'createdByUserId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'createdByUserId' });

// Build To Section
Build.belongsTo(Section, {foreignKey: 'appId',
    as: 'section', // Optional alias
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', 
});

//Tasks and Users to TasksChecked
TasksChecked.belongsTo(Task, {
    foreignKey: 'taskId',
    as: 'task',
    onDelete: 'CASCADE', // If a task is deleted, also delete related tasks_checked entries
    onUpdate: 'CASCADE', // If a task ID is updated, update related tasks_checked entries
  });
  
  TasksChecked.belongsTo(User, {
    foreignKey: 'checkedByUserId',
    as: 'checkedByUser',
    onDelete: 'CASCADE', // If a user is deleted, also delete related tasks_checked entries
    onUpdate: 'CASCADE', // If a user ID is updated, update related tasks_checked entries
  });

  module.exports = {User, Task, Tag, Section, Media, Comment, VersionManagement, DailyReports, TasksChecked, Build};