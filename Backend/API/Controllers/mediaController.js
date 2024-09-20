const Media = require('../../Database/Models/media');
const multer = require('multer');
const s3 = require('../../Database/Config/s3Config');
const awsConfig = require('../../Database/Config/awsConfig.json');


const storage = multer.memoryStorage(); // or diskStorage() depending on your use case
const upload = multer({ storage });

// Create a new Media
const createMedia = async (req, res) => {
    try {
        const { mediaLink } = req.body; // Optional link from request
        const mediaFile = req.file; // Uploaded file

        // Check if either mediaLink or mediaFile is provided
        if (!mediaLink && !mediaFile) {
            return res.status(400).json({ message: 'Media link or file is required.' });
        }

        let uploadedMediaLink;

        // If a file is provided, upload to S3
        if (mediaFile) {
            const params = {
                Bucket: awsConfig.aws.bucketName, // Use bucket name from config
                Key: `media/${Date.now()}_${mediaFile.originalname}`, // Unique file name
                Body: mediaFile.buffer, // File buffer
                ContentType: mediaFile.mimetype, // Set content type
            };

            // Upload to S3
            const data = await s3.upload(params).promise();
            uploadedMediaLink = data.Location; // Get the file URL from the response
        }

        // Create the new Media entry in the database
        const newMedia = await Media.create({ mediaLink: uploadedMediaLink || mediaLink });
        return res.status(201).json({ message: 'Media created successfully.', newMedia });
    } catch (error) {
        console.error('Error uploading to S3:', error); // Log error for debugging
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
    upload,
    createMedia,
    getAllMedias,
    getMediaById,
    deleteMediaById
};