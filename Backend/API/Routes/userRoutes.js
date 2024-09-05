const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// Route for creating a new user (Signup)
router.post('/', userController.createUser);

// Route for getting all users
router.get('/', userController.getAllUsers);

// Route for getting a user by ID
router.get('/:id', userController.getUserById);

// Route for updating a user by ID
router.put('/:id', userController.updateUserById);

// Route for deleting a user by ID
router.delete('/:id', userController.deleteUserById);

module.exports = router;
