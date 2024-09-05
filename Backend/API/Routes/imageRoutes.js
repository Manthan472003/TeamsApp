const express = require('express');
const router = express.Router();
const imageController = require('../Controllers/imageController');

// Route for creating a new image (Signup)
router.post('/', imageController.createImage);

// Route for getting all images
router.get('/', imageController.getAllImages);

// Route for getting a image by ID
router.get('/:id', imageController.getImageById);

// Route for deleting a image by ID
router.delete('/:id', imageController.deleteImageById);

module.exports = router;
