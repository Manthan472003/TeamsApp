const express = require('express');
const router = express.Router();
const dailyReportsController = require('../Controllers/dailyReportsController');

// Create a new DailyReports entry
router.post('/', dailyReportsController.createEntry);

// Get all DailyReports entries
router.get('/', dailyReportsController.getAllEntries);

// Get a DailyReports entry by ID
router.get('/:id', dailyReportsController.getEntryByID);

// Update a DailyReports entry by ID
router.put('/:id', dailyReportsController.updateEntryByID);

// Delete a DailyReports entry by ID
router.delete('/:id', dailyReportsController.deleteEntryByID);

module.exports = router;