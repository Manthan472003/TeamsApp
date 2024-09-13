const express = require('express');
const router = express.Router();
const dailyReportsController = require('../Controllers/dailyReportsController');

// Create a new DailyReports entry
router.post('/', dailyReportsController.createReport);

// Get all DailyReports entries
router.get('/', dailyReportsController.getAllReports);

// Get a DailyReports entry by ID
router.get('/:id', dailyReportsController.getReportByID);

// Delete a DailyReports entry by ID
router.delete('/:id', dailyReportsController.deleteReportByID);

//Create DailyReports Entry by ID
router.get('/user/:userId', dailyReportsController.getReportsByUserID);

module.exports = router;