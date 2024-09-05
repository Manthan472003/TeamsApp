const express = require('express');
const router = express.Router();
const taskTag = require('../Controllers/taskTagController');

// Route for creating a new TaskTag Entry
router.post('/', taskTag.createTaskTag);

// Route for getting all TaskTag Entries
router.get('/', taskTag.getAllTaskTags);

// Route for getting a TaskTag by ID
router.get('/:TaskID/:TagID', taskTag.getTaskTagById);

// Route for updating a TaskTag by ID
router.put('/:TaskID/:TagID', taskTag.updateTaskTagById);

// Route for deleting a TaskTag by ID
router.delete('/:TaskID/:TagID', taskTag.deleteTaskTagById);

module.exports = router;
