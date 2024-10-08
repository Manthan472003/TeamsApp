const DailyReports = require('../../Database/Models/dailyReports');
const User = require('../../Database/Models/user');
const Task = require('../../Database/Models/task');

// Create a new DailyReports entry
const createReport = async (req, res) => {
  const { userId, taskName, taskId, status } = req.body;

  try {
    //Checking if user exists
    if (userId) {
      const user = await User.findOne({
        where: { id: userId }
      });
      if (!user) {
        return res.status(404).json({ message: 'User does not exist.' });
      }
    }

    //Checking if task exists
    if (taskId) {
      const task = await Task.findOne({
        where: { id: taskId }
      });
      if (!task) {
        return res.status(404).json({ message: 'Task does not exist.' });
      }
    }

    //Create new entry
    const newReport = await DailyReports.create({
      userId,
      taskName,
      taskId,
      status
    });
    res.status(201).json({ message: 'New Report Entry Created Successfully.', newReport });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Error creating task.' });
  }
};

// Get all DailyReports entries
const getAllReports = async (req, res) => {
  try {
    const dailyReports = await DailyReports.findAll();
    res.status(200).json(dailyReports);
  } catch (error) {
    console.error('Error retrieving DailyReports entries:', error);
    return res.status(500).json({ message: 'Error retrieving DailyReports Entries.' });
  }
};

// Get a DailyReports entry by ID
const getReportByID = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'ID parameter is required.' });
  }
  try {
    const dailyReport = await DailyReports.findOne({
      where: { id }
    });
    if (!dailyReport) {
      return res.status(404).json({ message: 'Entry Not Found' });
    }
    return res.status(200).json(dailyReport);
  } catch (error) {
    console.error('Error retrieving entry:', error);
    return res.status(500).json({ message: 'Error retrieving Entry.' });
  }
};

// Delete a DailyReports entry by ID
const deleteReportByID = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID parameter is required.' });
  }

  try {
    const dailyReport = await DailyReports.findOne({
      where: { id }
    });
    if (!dailyReport) {
      return res.status(404).json({ message: 'Entry Not Found' });
    }

    await dailyReport.destroy();
    return res.status(200).json("Entry deleted Successfully");
  } catch (error) {
    console.error('Error retrieving entry:', error);
    return res.status(500).json({ message: 'Error retrieving Entry.' });
  }
};

//Get DailyReports entries by UserID
const getReportsByUserID = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: 'UserId is required.' });
  }
  try {
    if (userId) {
      const user = await User.findOne({
        where: { id: userId }
      });
      if (!user) {
        return res.status(404).json({ message: 'User does not exist.' });
      }
    }

    const entries = await DailyReports.findAll({ where: { userId } });
    return res.status(200).json(entries);
  } catch (error) {
    console.error('Error retrieving Entries by UserID:', error);
    return res.status(500).json({ message: 'Error retrieving Entries by UserId.' });

  }


}

module.exports = {
  createReport,
  getAllReports,
  getReportByID,
  deleteReportByID,
  getReportsByUserID
}
