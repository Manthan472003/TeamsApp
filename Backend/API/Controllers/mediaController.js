const Media = require('../../Database/Models/media');
const Task = require('../../Database/Models/task');
const Build = require('../../Database/Models/build');
const multer = require('multer');
const s3 = require('../../Database/Config/s3Config');
const awsConfig = require('../../Database/Config/awsConfig.json');
const sharp = require('sharp');
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

const getMediaByTaskOrBuildId = async (req, res) => {
    const { type, taskOrBuildId } = req.params;
    if (!type) {
        return res.status(400).json({ message: 'Type is required.' });
    }
    if (!taskOrBuildId) {
        return res.status(400).json({ message: 'Id is required.' });
    }
    try {
        if (type === 'Task') {
            const task = await Task.findOne({
                where: { id: taskOrBuildId }
            });
            if (!task) {
                return res.status(404).json({ message: 'Task does not exist.' });
            }
        }
        if (type === 'Build') {
            const build = await Build.findOne({
                where: { id: taskOrBuildId }
            });
            if (!build) {
                return res.status(404).json({ message: 'Build does not exist.' });
            }
        }

        const medias = await Media.findAll({
            where: { taskOrBuildId: taskOrBuildId }
        });
        return res.status(200).json(medias);
    } catch (error) {
        console.error('Error retrieving Tasks by TaskOrBuildId:', error);
        return res.status(500).json({ message: 'Error retrieving Tasks by TaskOrBuildId.' });

    }
};

const createMedia = async (req, res) => {
    try {
        const mediaFiles = req.files; // Uploaded files
        const { type, taskOrBuildId } = req.params;

        // Check if mediaFiles are provided
        if (!mediaFiles || mediaFiles.length === 0) {
            return res.status(400).json({ message: 'At least one media file is required.' });
        }

        // Validate task or build existence
        if (type === 'Task') {
            const task = await Task.findOne({ where: { id: taskOrBuildId } });
            if (!task) {
                return res.status(404).json({ message: 'Task does not exist.' });
            }
        } else if (type === 'Build') {
            const build = await Build.findOne({ where: { id: taskOrBuildId } });
            if (!build) {
                return res.status(404).json({ message: 'Build does not exist.' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid media type specified.' });
        }

        const newMediaEntries = [];

        // Upload each file to S3
        for (const mediaFile of mediaFiles) {
            let buffer;
            let mediaType;

            // Determine media type and process the file accordingly
            if (mediaFile.mimetype.startsWith('image/')) {
                // Compress image
                buffer = await sharp(mediaFile.buffer)
                    .resize(1024) // Resize image to a width of 1024px, keeping aspect ratio
                    .toBuffer();
                mediaType = 'Image';
            } else if (mediaFile.mimetype.startsWith('video/')) {
                // Compress video
                buffer = await compressVideo(mediaFile);
                mediaType = 'Video';
            } else {
                return res.status(400).json({ message: 'Unsupported media type.' });
            }

            const params = {
                Bucket: awsConfig.aws.bucketName,
                Key: `media/${Date.now()}_${mediaFile.originalname}`,
                Body: buffer,
                ContentType: mediaFile.mimetype,
                ContentDisposition: 'inline',
            };

            // Upload to S3
            const data = await s3.upload(params).promise();
            const uploadedMediaLink = data.Location;

            // Create a new Media entry in the database
            const newMedia = await Media.create({
                mediaLink: uploadedMediaLink,
                type,
                taskOrBuildId,
                mediaType,
            });
            newMediaEntries.push(newMedia);
        }

        return res.status(201).json({ message: 'Media created successfully.', newMediaEntries });
    } catch (error) {
        if (error instanceof multer.MulterError) {
            // Handle Multer-specific errors
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size exceeds limit.' });
            }
        }
        console.error('Error uploading to S3:', error);
        return res.status(500).json({ message: 'Error creating media.', error: error.message });
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
    getMediaByTaskOrBuildId,
    upload,
    createMedia,
    getAllMedias,
    getMediaById,
    deleteMediaById
};