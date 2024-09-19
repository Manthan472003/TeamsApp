const Section = require('../../Database/Models/section');
const  {Op} = require('sequelize');

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

        // Find the section to update
        const section = await Section.findOne({ where: { id } });
        if (!section) {
            return res.status(404).json({ message: 'Section not found.' });
        }

        // Check if the new section name already exists and is not the same as the current one
        const existingSection = await Section.findOne({
            where: {
                sectionName,
                id: { [Op.ne]: id } // Exclude current section ID
            }
        });

        if (existingSection) {
            return res.status(409).json({ message: 'Section already exists.' });
        }

        // Update the section
        section.sectionName = sectionName;
        await section.save();

        return res.status(200).json({ message: 'Section updated successfully.', section });
    } catch (error) {
        console.error('Error updating section:', error);
        return res.status(500).json({ message: 'Error updating section.', error });
    }
};

const getSectionsBySectionName = async (req, res) => {
    const { sectionName } = req.query;
    console.log('Searching for Sections with name:', sectionName); // Log the search term

    if (!sectionName) {
        return res.status(400).json({ message: "Section name is required." });
    }

    try {
        const sections = await Section.findAll({
            where: {
                sectionName: {
                    [Op.like]: `%${sectionName}%` // Use `Op.like` for MySQL
                }
            }
        });

        if (sections.length === 0) {
            return res.status(404).json({ message: "No sections found." });
        }

        return res.status(200).json(sections);
    } catch (error) {
        console.error('Error retrieving Tags by sectionName:', error.message);
        return res.status(500).json({ message: 'Error retrieving Tags by sectionName.' });
    }
};

module.exports = {
    createSection,
    getAllSections,
    getSectionById,
    deleteSectionById,
    updateSectionById,
    getSectionsBySectionName
};
