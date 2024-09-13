const express = require('express');
const router = express.Router();
const versionManagementController = require('../Controllers/versionManagementController')

//Create a new VersionManagement Entry
router.post('/', versionManagementController.createEntry);

//Create all VersionManagement Entries
router.get('/', versionManagementController.getAllEntries);

//Create VersionManagement Entry by ID
router.get('/:id', versionManagementController.getEntryByID);

//Create VersionManagement Entry by ID
router.delete('/:id', versionManagementController.deleteEntryByID);

//Create VersionManagement Entry by ID
router.get('/user/:userId', versionManagementController.getAllEntriesByUserID);

module.exports = router;