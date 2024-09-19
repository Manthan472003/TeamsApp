const express = require('express');
const router = express.Router();
const sectionController = require('../Controllers/sectionController');

// Route for creating a new section
router.post('/', sectionController.createSection);

// Route for getting all sections
router.get('/', sectionController.getAllSections);

// Route for getting a section by ID
router.get('/:id', sectionController.getSectionById);

//Route for updating sectionName by ID
router.put('/:id', sectionController.updateSectionById);

// Route for deleting a section by ID
router.delete('/:id', sectionController.deleteSectionById);

// Get Sections by TagName (Search)
router.get('/search/section', sectionController.getSectionsBySectionName);

module.exports = router;