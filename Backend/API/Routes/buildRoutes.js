const express = require('express');
const router = express.Router();
const buildController = require('../Controllers/buildController');

//Create App Version Management Entry
router.post('/', buildController.createEntry);

//Mark Task Working
router.post('/markWorking', buildController.markTaskWorking);

//Mark Task Not Working
router.post('/markNotWorking', buildController.markTaskNotWorking);

//Get all build entries
router.get('/', buildController.getAllBuildEntries);

//Get Build Entry by ID
router.get('/:id', buildController.getBuildEntry);

//Check if Task is working or not
router.post('/task/isWorking', buildController.isTaskWorking);

//Update Link For Android to build
router.post('/addLink/android/:buildId', buildController.updateLinkForAndroid);

module.exports = router;