const express = require('express')
const router = express.Router();
const appVersionManagementController = require('../Controllers/appVersionManagementController');

//Create App Version Management Entry
router.post('/', appVersionManagementController.createEntry);

//Get All App Version Management Entries
router.get('/', appVersionManagementController.getAllEntries);

//Get App Version Management Entry By ID
router.get('/:id', appVersionManagementController.getEntryByID);

//Update App Version Management Entry By ID
router.put('/:id',appVersionManagementController.updateEntryByID);

//Delete App Version Management Entry By ID
router.delete('/:id', appVersionManagementController.deleteEntryByID);

module.exports = router;