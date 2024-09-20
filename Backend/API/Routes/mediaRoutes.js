const express = require('express');
const router = express.Router();
const mediaController = require('../Controllers/mediaController');

// Route for creating a new media file
router.post('/', mediaController.upload.single('mediaFile'), mediaController.createMedia);

// Route for getting all media
router.get('/', mediaController.getAllMedias);

// Route for getting a media by ID
router.get('/:id', mediaController.getMediaById);

// Route for deleting a media by ID
router.delete('/:id', mediaController.deleteMediaById);

module.exports = router;
