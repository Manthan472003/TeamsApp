const Tag = require('../../Database/Models/tag');
const { Op } = require('sequelize');


// Create a new tag (with existence check)
const createTag = async (req, res) => {
    try {
        const { tagName } = req.body;
        if (!tagName) {
            return res.status(400).json({ message: 'Tag name is required.' });
        }

        // Check if the tag already exists
        const existingTag = await Tag.findOne({
            where: { tagName }
        });
        if (existingTag) {
            return res.status(409).json({ message: 'Tag already exists.' });
        }

        // Create the new tag
        const newTag = await Tag.create({ tagName });
        return res.status(201).json({ message: 'Tag created successfully.', newTag });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating tag.', error });
    }
};

// Get all tags
const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        return res.status(200).json(tags);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving tags.', error });
    }
};

// Get tag by ID (using findOne)
const getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findOne({
            where: { id }
        });
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found.' });
        }
        return res.status(200).json(tag);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving tag.', error });
    }
};

// Update tag by ID
const updateTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tagName } = req.body;

        if (!tagName) {
            return res.status(400).json({ message: 'Tag name is required for update.' });
        }

        // Check if the tag exists
        const tag = await Tag.findOne({
            where: { id }
        });

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found.' });
        }

        // Check if the new tag name already exists
        const existingTag = await Tag.findOne({
            where: { tagName }
        });
        if (existingTag && existingTag.id !== id) {
            return res.status(409).json({ message: 'Tag name already exists.' });
        }

        // Update the tag
        tag.tagName = tagName;
        await tag.save();

        return res.status(200).json({ message: 'Tag updated successfully.', tag });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating tag.', error });
    }
};

// Delete tag by ID
const deleteTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findOne({
            where: { id }
        });
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found.' });
        }
        await tag.destroy();
        return res.status(200).json({ message: 'Tag deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting tag.', error });
    }
};

const getTagsByTagName = async (req, res) => {
    const { tagName } = req.query;
    console.log('Searching for Tags with name:', tagName); // Log the search term

    if (!tagName) {
        return res.status(400).json({ message: "Tag name is required." });
    }

    try {
        const tags = await Tag.findAll({
            where: {
                tagName: {
                    [Op.like]: `%${tagName}%` // Use `Op.like` for MySQL
                }
            }
        });

        if (tags.length === 0) {
            return res.status(404).json({ message: "No tags found." });
        }

        return res.status(200).json(tags);
    } catch (error) {
        console.error('Error retrieving Tags by TagName:', error.message);
        return res.status(500).json({ message: 'Error retrieving Tags by TagName.' });
    }
};

module.exports = {
    createTag,
    getAllTags,
    getTagById,
    updateTagById,
    deleteTagById,
    getTagsByTagName
};