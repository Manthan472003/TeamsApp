const { DailyReports } = require('../../Database/Models/dailyReports');

// Create a new DailyReports entry
exports.createReports = async (req, res) => {
  try {
    const dailyReport = await DailyReports.create(req.body);
    res.status(201).json(dailyReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all DailyReports entries
exports.getAllReports = async (req, res) => {
  try {
    const dailyReports = await DailyReports.findAll();
    res.status(200).json(dailyReports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a DailyReports entry by ID
exports.getReportsByID = async (req, res) => {
  try {
    const dailyReport = await DailyReports.findByPk(req.params.id);
    if (dailyReport) {
      res.status(200).json(dailyReport);
    } else {
      res.status(404).json({ message: 'DailyReport not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a DailyReports entry by ID
exports.updateReportsByID = async (req, res) => {
  try {
    const dailyReport = await DailyReports.findByPk(req.params.id);
    if (dailyReport) {
      await dailyReport.update(req.body);
      res.status(200).json(dailyReport);
    } else {
      res.status(404).json({ message: 'DailyReport not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a DailyReports entry by ID
exports.deleteReportsByID = async (req, res) => {
  try {
    const dailyReport = await DailyReports.findByPk(req.params.id);
    if (dailyReport) {
      await dailyReport.destroy();
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: 'DailyReport not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
