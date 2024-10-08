const express = require('express');
const cors = require('cors');
const sequelize  = require('../Database/Config/config');
const userRoutes = require('./Routes/userRoutes');
const taskRoutes = require('./Routes/taskRoutes');
const sectionRoutes = require('./Routes/sectionRoutes');
const tagRoutes = require('./Routes/tagRoutes');
const mediaRoutes = require('./Routes/mediaRoutes');
const dailyReportsRoutes = require('./Routes/dailyReportsRoutes')
const versionManagementRoutes = require('./Routes/versionManagementRoutes');
const notificationRoutes = require('./Routes/notificationRoutes');
const commentRoutes = require('./Routes/commentRoutes');
const sendMailRoute = require('./Routes/sendMailRoute');
const appVersionManagementRoutes = require('./Routes/appVersionManagementRoutes');

require('./Controllers/deletePermanentlyController'); 


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/sections', sectionRoutes);
app.use('/tags', tagRoutes);
app.use('/media', mediaRoutes);
app.use('/dailyReports', dailyReportsRoutes);
app.use('/versionManagement', versionManagementRoutes);
app.use('/notifications', notificationRoutes);
app.use('/comment', commentRoutes);
app.use('/sendMail', sendMailRoute);
app.use('/appVersionManagement', appVersionManagementRoutes)

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});