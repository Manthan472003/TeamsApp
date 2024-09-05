const express = require('express');
const router = express.Router();
const taskController = require('../Controllers/taskController');

// Route for creating a new task (Signup)
router.post('/', taskController.createTask);

// Route for getting all tasks
router.get('/', taskController.getAllTasks);

// Route for getting a task by ID
router.get('/:id', taskController.getTaskById);

// Route for updating a task by ID
router.put('/:id', taskController.updateTaskById);

// Route for deleting a task by ID
router.delete('/:id', taskController.deleteTaskById);

module.exports = router;
