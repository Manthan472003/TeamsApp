const Image = require('../../Database/Models/image');

// Create a new Image 
const createImage = async (req, res) => {
    try {
        const { ImageLink } = req.body;
        // Create new Image
        const newImage = await Image.create({ ImageLink });
        res.status(201).json({ message: 'Image created successfully', task: newImage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Images
const getAllImages = async (req, res) => {
    try {
        const images = await Image.findAll();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a Image by ID
const getImageById = async (req, res) => {
    try {
        const image = await Image.findByPk(req.params.id);
        if (image) {
            res.status(200).json(Image);
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Image by ID
const deleteImageById = async (req, res) => {
    try {
        const image = await Image.findByPk(req.params.id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        await Image.destroy({
            where: { ID: req.params.id }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting Image:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createImage,
    getAllImages,
    getImageById,
    deleteImageById
};