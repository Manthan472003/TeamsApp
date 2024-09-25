const express = require('express');
const router = express.Router();
const commentController = require('../Controllers/commentController'); 

// Create a new comment
router.post('/', commentController.createComment);

// Get all comments
router.get('/', commentController.getAllComments);

// Get a comment by ID
router.get('/:id', commentController.getCommentById);

// Get comments by task ID
router.get('/task/:taskId', commentController.getCommentsByTaskId); // Route for getting comments by taskId

// Update a comment by ID
router.put('/:id', commentController.updateComment);

// Delete a comment by ID
router.delete('/:id', commentController.deleteComment);

module.exports = router;