const Section = require('../../Database/Models/section');

// Create a new section
const createSection = async (req, res) => {
    try {
        console.log('Received Body:', req.body); // Log received data
        const { sectionName } = req.body;
        if (!sectionName) {
            return res.status(400).json({ message: 'Section name is required.' });
        }

        // Check if the section already exists
        const existingSection = await Section.findOne({ where: { sectionName } });
        if (existingSection) {
            return res.status(409).json({ message: 'Section already exists.' });
        }

        // Create the new section
        const newSection = await Section.create({ sectionName });
        return res.status(201).json({ message: 'Section created successfully.', newSection });
    } catch (error) {
        console.error('Error creating section:', error.message);
        return res.status(500).json({ message: 'Error creating section.', error: error.message });
    }
};

// Get all sections
const getAllSections = async (req, res) => {
    try {
        const sections = await Section.findAll();
        return res.status(200).json(sections);
    } catch (error) {
        console.error('Error retrieving sections:', error.message);
        return res.status(500).json({ message: 'Error retrieving sections.', error: error.message });
    }
};

// Get section by ID
const getSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure ID is valid
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'Invalid section ID.' });
        }

        const section = await Section.findOne({ where: { id } });
        if (!section) {
            return res.status(404).json({ message: 'Section not found.' });
        }
        return res.status(200).json(section);
    } catch (error) {
        console.error('Error retrieving section:', error.message);
        return res.status(500).json({ message: 'Error retrieving section.', error: error.message });
    }
};

// Delete section by ID
const deleteSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure ID is valid
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'Invalid section ID.' });
        }

        const section = await Section.findOne({ where: { id } });
        if (!section) {
            return res.status(404).json({ message: 'Section not found.' });
        }
        await section.destroy();
        return res.status(200).json({ message: 'Section deleted successfully.' });
    } catch (error) {
        console.error('Error deleting section:', error.message);
        return res.status(500).json({ message: 'Error deleting section.', error: error.message });
    }
};

// Update section by ID
const updateSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const { sectionName } = req.body;

        if (!sectionName) {
            return res.status(400).json({ message: 'Section name is required for update.' });
        }

        // Check if the tag exists
        const section = await Section.findOne({
            where: { id }
        });

        if (!section) {
            return res.status(404).json({ message: 'Section not found.' });
        }

        // Check if the new tag name already exists
        const existingSection = await Section.findOne({
            where: { sectionName }
        });
        if (existingSection && existingSection.id !== id) {
            return res.status(409).json({ message: 'Section already exists.' });
        }

        // Update the tag
        section.sectionName = sectionName;
        await section.save();

        return res.status(200).json({ message: 'Section updated successfully.', section });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating section.', error });
    }
};

module.exports = {
    createSection,
    getAllSections,
    getSectionById,
    deleteSectionById,
    updateSectionById
};
