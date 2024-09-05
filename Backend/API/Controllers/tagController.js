const Tag = require('../../Database/Models/tag');

// Create a new Tag 
const createTag = async (req, res) => {
    try {
        const { TagName } = req.body;

        // Check if the Tag exist
        const existingTag = await Tag.findOne({ where: { TagName } });
        if (existingTag) {
            return res.status(400).json({ message: 'Tag already available' });
        }
        // Create new tag
        const newTag = await Tag.create({ TagName });
        res.status(201).json({ message: 'Tag created successfully', task: newTag });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all tags
const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a tag by ID
const getTagById = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (tag) {
            res.status(200).json(tag);
        } else {
            res.status(404).json({ message: 'Tag not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Tag Name by ID
const updateTagById = async (req, res) => {
    const { TagName } = req.body; // Ensure `TagName` is being destructured correctly

    try {
        // Find the tag by primary key
        const tag = await Tag.findByPk(req.params.id);

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        // Check if the tag name already exists (excluding the current tag)
        const existingTag = await Tag.findOne({ 
            where: { TagName} 
        });

        if (existingTag) {
            return res.status(400).json({ message: 'Tag already exists in the database, try with a different name' });
        }

        // Update tag details
        await Tag.update({ TagName }, {
            where: { id: req.params.id }
        });

        const updatedTag = await Tag.findByPk(req.params.id);

        res.status(200).json(updatedTag);
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete a tag by ID
const deleteTagById = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        await Tag.destroy({
            where: { ID: req.params.id }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting Tag:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTag,
    getAllTags,
    getTagById,
    updateTagById,
    deleteTagById
};