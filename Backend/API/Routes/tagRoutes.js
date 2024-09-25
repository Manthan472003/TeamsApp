const express = require('express');
const router = express.Router();
const tagController = require('../Controllers/tagController');

// Route for creating a new tag
router.post('/', tagController.createTag);

// Route for getting all tags
router.get('/', tagController.getAllTags);

// Route for getting a tag by ID
router.get('/:id', tagController.getTagById);

// Route for updating a tag by ID
router.put('/:id', tagController.updateTagById);

// Route for deleting a tag by ID
router.delete('/:id', tagController.deleteTagById);

// Get Tags by TagName (Search)
router.get('/search/tag', tagController.getTagsByTagName);

// Route for removing Tag From Task
router.delete('/:tagID/tasks/:taskID/', tagController.removeTagFromTask);

module.exports = router;
