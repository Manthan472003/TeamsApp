const express = require('express');
const router = express.Router();
const mediaController = require('../Controllers/mediaController');

// Route for creating a new media file
router.post('/:type/:taskOrBuildId/media', (req, res, next) => {
    next();
  }, mediaController.upload.array('mediaFiles', 10), mediaController.createMedia);
  
// Route for getting all media
router.get('/', mediaController.getAllMedias);

// Route for getting media by ID
router.get('/:id', mediaController.getMediaById);

// Route for getting media by Task ID
router.get('/:type/:taskOrBuildId/media', mediaController.getMediaByTaskOrBuildId);

// Route for deleting media by ID
router.delete('/:id', mediaController.deleteMediaById);

module.exports = router;
