const express = require('express');
const router = express.Router();
const mediaController = require('../Controllers/mediaController')
// Route for creating a new image (Signup)
router.post('/', mediaController.createMedia);

// Route for getting all images
router.get('/', mediaController.getAllMedias);

// Route for getting a image by ID
router.get('/:id', mediaController.getMediaById);

// Route for deleting a image by ID
router.delete('/:id', mediaController.deleteMediaById);

module.exports = router;
