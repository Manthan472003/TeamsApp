const Comment = require('../../Database/Models/comment');
const Task = require('../../Database/Models/task');
const User = require('../../Database/Models/user');

// Get all comments
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching comments', error });
    }
};

// Get comment by ID
exports.getCommentById = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching comment', error });
    }
};

// Get comments by taskId
exports.getCommentsByTaskId = async (req, res) => {
    const { taskId } = req.params;
    if (taskId) {
        const commentTaskId = await Task.findOne({
            where: { id: taskId }
        });
        if (!commentTaskId) {
            return res.status(404).json({ message: 'Task does not exist.' });
        }
    }

    try {
        const comments = await Comment.findAll({ where: { taskId } });
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching comments by taskId', error });
    }
};

// Create a comment
exports.createComment = async (req, res) => {
    const { commentText, taskId, createdByUserId } = req.body;
    if (taskId) {
        const commentTaskId = await Task.findOne({
            where: { id: taskId }
        });
        if (!commentTaskId) {
            return res.status(404).json({ message: 'Task does not exist.' });
        }
    }

    if (createdByUserId) {
        const commentUserId = await User.findOne({
            where: { id: createdByUserId }
        });
        if (!commentUserId) {
            return res.status(404).json({ message: 'User does not exist.' });
        }
    }

    try {
        const newComment = await Comment.create({
            commentText,
            taskId,
            createdByUserId,
        });
        return res.status(201).json(newComment);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating comment', error });
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { commentText, taskId, createdByUserId } = req.body;

    if (id) {
        const commentId = await Comment.findOne({
            where: { id }
        });
        if (!commentId) {
            return res.status(404).json({ message: 'CoomentId does not exist.' });
        }
    }

    if (taskId) {
        const commentTaskId = await Task.findOne({
            where: { id: taskId }
        });
        if (!commentTaskId) {
            return res.status(404).json({ message: 'Task does not exist.' });
        }
    }

    if (createdByUserId) {
        const commentUserId = await User.findOne({
            where: { id: createdByUserId }
        });
        if (!commentUserId) {
            return res.status(404).json({ message: 'User does not exist.' });
        }
    }

    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        comment.commentText = commentText || comment.commentText;
        comment.taskId = taskId || comment.taskId;
        comment.createdByUserId = createdByUserId || comment.createdByUserId;
        await comment.save();
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating comment', error });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    const { id } = req.params;

    if (id) {
        const commentId = await Comment.findOne({
            where: { id }
        });
        if (!commentId) {
            return res.status(404).json({ message: 'CoomentId does not exist.' });
        }
    }

    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        await comment.destroy();
        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting comment', error });
    }
};