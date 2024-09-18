const Media = require('../../Database/Models/media');
const Task = require('../../Database/Models/task');

// Create a new Media
const createMedia = async (req, res) => {
    try {
        const { mediaLink } = req.body;
        if (!mediaLink) {
            return res.status(400).json({ message: 'Media link is required.' });
        }
        // Check if the Media already exists
        const existingMedia = await Media.findOne({
            where: { mediaLink }
        });
        if (existingMedia) {
            return res.status(409).json({ message: 'Media already exists.' });
        }
        // Create the new Media
        const newMedia = await Media.create({ mediaLink });
        return res.status(201).json({ message: 'Media created successfully.', newMedia });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating Media.', error });
    }
};

// Get all medias
const getAllMedias = async (req, res) => {
    try {
        const medias = await Media.findAll();
        return res.status(200).json(medias);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving medias.', error });
    }
};

// Get media by ID
const getMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findOne({
            where: { id }
        });
        if (!media) {
            return res.status(404).json({ message: 'Media not found.' });
        }
        return res.status(200).json(media);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving media.', error });
    }
};

// Delete media by ID
const deleteMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findOne({
            where: { id }
        });
        if (!media) {
            return res.status(404).json({ message: 'media not found.' });
        }
        await media.destroy();
        return res.status(200).json({ message: 'media deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting media.', error });
    }
};


module.exports = {
    createMedia,
    getAllMedias,
    getMediaById,
    deleteMediaById
};