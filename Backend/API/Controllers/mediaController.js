const Media = require('../../Database/Models/media');
const multer = require('multer');
const s3 = require('../../Database/Config/s3Config');
const awsConfig = require('../../Database/Config/awsConfig.json');
const sharp = require('sharp'); // For image compression
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path); // Set ffmpeg path

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fieldSize: 5 * 1024 * 1024 } 
});


// Helper function to compress video
const compressVideo = (mediaFile) => {
    return new Promise((resolve, reject) => {
        const tempDir = path.join(__dirname, '../../temp');
        const inputPath = path.join(tempDir, `input_${Date.now()}_${mediaFile.originalname}`);
        const outputPath = path.join(tempDir, `output_${Date.now()}_${mediaFile.originalname}`);

        // Ensure the temp directory exists
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Write the input buffer to a temporary file
        fs.writeFile(inputPath, mediaFile.buffer, (err) => {
            if (err) return reject(err);

            ffmpeg(inputPath)
                .output(outputPath)
                .videoCodec('libx264')
                .size('640x?') // Compress to 640px width, keeping aspect ratio
                .on('end', () => {
                    const compressedBuffer = fs.readFileSync(outputPath); // Read the compressed file
                    fs.unlinkSync(inputPath); // Clean up the input file
                    fs.unlinkSync(outputPath); // Clean up the output file
                    resolve(compressedBuffer);
                })
                .on('error', (err) => {
                    fs.unlinkSync(inputPath); // Clean up the input file on error
                    reject(err);
                })
                .run();
        });
    });
};


// Create a new Media
const createMedia = async (req, res) => {
    try {
        const mediaFiles = req.files; // Uploaded files

        // Check if mediaFiles are provided
        if (!mediaFiles || mediaFiles.length === 0) {
            return res.status(400).json({ message: 'At least one media file is required.' });
        }

        const newMediaEntries = [];

        // If files are provided, upload each to S3
        for (const mediaFile of mediaFiles) {
            let buffer;

            // Check if the file is an image or a video
            if (mediaFile.mimetype.startsWith('image/')) {
                // Compress image
                buffer = await sharp(mediaFile.buffer)
                    .resize(1024) // Resize image to a width of 1024px, keeping aspect ratio
                    .toBuffer();
            } else if (mediaFile.mimetype.startsWith('video/')) {
                // Compress video
                buffer = await compressVideo(mediaFile);
            } else {
                return res.status(400).json({ message: 'Unsupported media type.' });
            }

            const params = {
                Bucket: awsConfig.aws.bucketName, // Use bucket name from config
                Key: `media/${Date.now()}_${mediaFile.originalname}`, // Unique file name
                Body: buffer, // Use the compressed buffer
                ContentType: mediaFile.mimetype, // Set content type
                ContentDisposition: 'inline', // Display in browser
            };

            // Upload to S3
            const data = await s3.upload(params).promise();
            const uploadedMediaLink = data.Location; // Get the file URL from the response

            // Create a new Media entry in the database
            const newMedia = await Media.create({ mediaLink: uploadedMediaLink });
            newMediaEntries.push(newMedia);
        }

        return res.status(201).json({ message: 'Media created successfully.', newMediaEntries });
    } catch (error) {
        if (error instanceof multer.MulterError) {
            // Handle Multer-specific errors
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size exceeds 5 MB limit.' });
            }
        }
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