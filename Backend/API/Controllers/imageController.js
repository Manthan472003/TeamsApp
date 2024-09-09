const Image = require('../../Database/Models/image');

// Create a new image
const createImage = async (req, res) => {
    try {
        const { imageLink } = req.body;
        if (!imageLink) {
            return res.status(400).json({ message: 'Image link is required.' });
        }
        const newImage = await Image.create({ imageLink });
        return res.status(201).json({ message: 'Image created successfully.', newImage });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating image.', error });
    }
};

// Get all images
const getAllImages = async (req, res) => {
    try {
        const images = await Image.findAll();
        return res.status(200).json(images);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving images.', error });
    }
};

// Get image by ID
const getImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findByPk(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found.' });
        }
        return res.status(200).json(image);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving image.', error });
    }
};

// Delete image by ID
const deleteImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findByPk(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found.' });
        }
        await image.destroy();
        return res.status(200).json({ message: 'Image deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting image.', error });
    }
};

module.exports = {
    createImage,
    getAllImages,
    getImageById,
    deleteImageById
};