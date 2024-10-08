// associations.js
const { User, Task, Tag, Section, Media, Comment, VersionManagement,DailyReports } = require('./index');

// User to Task (Assigned and Created By)
User.hasMany(Task, { foreignKey: 'taskCreatedByID', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'taskCreatedByID' });
User.hasMany(Task, { foreignKey: 'taskAssignedToID', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'taskAssignedToID' });

// Section to Task
Section.hasMany(Task, { foreignKey: 'sectionID', onDelete: 'SET NULL', onUpdate: 'SET NULL' });
Task.belongsTo(Section, { foreignKey: 'sectionID' });

//Version Management to User
User.hasMany(VersionManagement, {foreignKey: 'userID', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
VersionManagement.belongsTo(User, {foreignKey : 'userID'});

// User to DailyReports
User.hasMany(DailyReports, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DailyReports.belongsTo(User, { foreignKey: 'userId' });

// User to DailyReports
Task.hasMany(DailyReports, { foreignKey: 'taskId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DailyReports.belongsTo(Task, { foreignKey: 'taskId' });

//Task to Media
Task.hasMany(Media, {foreignKey: 'taskId'});
Media.belongsTo(Task, {foreignKey: 'taskId'});

// Task to Comment
Task.hasMany(Comment, { foreignKey: 'taskId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId' });

// User to Comment
User.hasMany(Comment, { foreignKey: 'createdByUserId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'createdByUserId' });