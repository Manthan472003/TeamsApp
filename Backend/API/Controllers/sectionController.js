const Section = require('../../Database/Models/section');


const createSection = async (req, res) => {
    try {
        const { SectionName } = req.body;

        console.log('Received SectionName:', SectionName); // Add this line for debugging

        // Check if the Section exists
        const existingSection = await Section.findOne({ where: { SectionName } });
        if (existingSection) {
            return res.status(409).json({ message: 'Section already available' });
        }else {
            const newSection = await Section.create({ SectionName });
            res.status(201).json({ message: 'Section created successfully', section: newSection });
        }

        // Create new Section

    } catch (error) {
        console.error('Backend Error creating section:', error); // Add this line for debugging
        res.status(500).json({ error: error.message });
    }
};


// Get all Sections
const getAllSections = async (req, res) => {
    try {
        const sections = await Section.findAll();
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a Section by ID
const getSectionById = async (req, res) => {
    try {
        const section = await Section.findByPk(req.params.id);
        if (section) {
            res.status(200).json(section);
        } else {
            res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Section by ID
const deleteSectionById = async (req, res) => {
    try {
        const section = await Section.findByPk(req.params.id);

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        await Section.destroy({
            where: { ID: req.params.id }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting Section:', error);
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createSection,
    getAllSections,
    getSectionById,
    deleteSectionById
};