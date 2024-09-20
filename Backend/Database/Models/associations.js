// associations.js
const { User, Task, Tag, TaskTag, Section, Media, TaskMedia, VersionManagement,DailyReports } = require('./index');

// User to Task (Assigned and Created By)
User.hasMany(Task, { foreignKey: 'taskCreatedByID', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'taskCreatedByID' });
User.hasMany(Task, { foreignKey: 'taskAssignedToID', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'taskAssignedToID' });

// Section to Task
Section.hasMany(Task, { foreignKey: 'sectionID', onDelete: 'SET NULL', onUpdate: 'SET NULL' });
Task.belongsTo(Section, { foreignKey: 'sectionID' });

// Tag to Task
Tag.belongsToMany(Task, { through: TaskTag, foreignKey: 'tagID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Task.belongsToMany(Tag, { through: TaskTag, foreignKey: 'taskID', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

//Version Management to User
User.hasMany(VersionManagement, {foreignKey: 'userID', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
VersionManagement.belongsTo(User, {foreignKey : 'userID'});

// User to DailyReports
User.hasMany(DailyReports, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DailyReports.belongsTo(User, { foreignKey: 'userId' });

//Task to Media
Task.hasMany(Media, {foreignKey: 'taskId'});
Media.belongsTo(Task, {foreignKey: 'taskId'});