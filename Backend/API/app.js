const express = require('express');
const cors = require('cors');
const sequelize  = require('../Database/Config/config');
const userRoutes = require('./Routes/userRoutes');
const taskRoutes = require('./Routes/taskRoutes');
const sectionRoutes = require('./Routes/sectionRoutes');
const tagRoutes = require('./Routes/tagRoutes');
const imageRoutes = require('./Routes/imageRoutes');
const taskTagRoutes = require('./Routes/taskTagRoutes');



const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/sections', sectionRoutes);
app.use('/tags', tagRoutes);
app.use('/images', imageRoutes);
app.use('/taskTags', taskTagRoutes);


sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
