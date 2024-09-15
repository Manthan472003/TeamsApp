const express = require('express');
const router = express.Router();
const versionManagementController = require('../Controllers/versionManagementController')

//Create a new VersionManagement Entry
router.post('/', versionManagementController.createEntry);

//Create all VersionManagement Entries
router.get('/', versionManagementController.getAllEntries);

//Get VersionManagement Entry by ID
router.get('/:id', versionManagementController.getEntryByID);

//Delete VersionManagement Entry by ID
router.delete('/:id', versionManagementController.deleteEntryByID);

//Get VersionManagement Entries by UserID
router.get('/user/:userId', versionManagementController.getAllEntriesByUserID);

//Update VM Entry by ID
router.put('/:id', versionManagementController.updateEntryByID);

module.exports = router;