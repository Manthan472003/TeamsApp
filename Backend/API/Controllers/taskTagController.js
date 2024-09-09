const TaskTag = require('../../Database/Models/taskTag');
const Task = require('../../Database/Models/task');
const Tag = require('../../Database/Models/tag');

// Create a new TaskTag entry
const createTaskTag = async (req, res) => {
    try {
        const { taskID, tagID } = req.body;

        // Check if both taskID and tagID are provided
        if (!taskID || !tagID) {
            return res.status(400).json({ message: 'Both taskID and tagID are required' });
        }

        // Check if the task exists
        const existingTask = await Task.findByPk(taskID);
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the tag exists
        const existingTag = await Tag.findByPk(tagID);
        if (!existingTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        // Check if the TaskTag entry already exists
        const existingTaskTag = await TaskTag.findOne({
            where: { taskID, tagID }
        });
        if (existingTaskTag) {
            return res.status(400).json({ message: 'TaskTag entry already exists' });
        }

        // Create new TaskTag entry
        const newTaskTag = await TaskTag.create({ taskID, tagID });

        res.status(201).json({ message: 'TaskTag created successfully', taskTag: newTaskTag });
    } catch (error) {
        console.error('Error creating TaskTag:', error);
        res.status(500).json({ message: 'Error creating TaskTag', error: error.message });
    }
};

// Get all TaskTags
const getAllTaskTags = async (req, res) => {
    try {
        const taskTags = await TaskTag.findAll();
        res.status(200).json(taskTags);
    } catch (error) {
        console.error('Error retrieving TaskTags:', error);
        res.status(500).json({ message: 'Error retrieving TaskTags', error: error.message });
    }
};

// Get a TaskTag entry by taskID and tagID
const getTaskTagById = async (req, res) => {
    try {
        const { taskID, tagID } = req.params;

        // Check if both taskID and tagID are provided
        if (!taskID || !tagID) {
            return res.status(400).json({ message: 'Both taskID and tagID are required' });
        }

        const taskTag = await TaskTag.findOne({ where: { taskID, tagID } });
        if (!taskTag) {
            return res.status(404).json({ message: 'TaskTag entry not found' });
        }
        res.status(200).json(taskTag);
    } catch (error) {
        console.error('Error retrieving TaskTag:', error);
        res.status(500).json({ message: 'Error retrieving TaskTag', error: error.message });
    }
};

// Delete a TaskTag entry by taskID and tagID
const deleteTaskTagById = async (req, res) => {
    try {
        const { taskID, tagID } = req.params;

        // Check if both taskID and tagID are provided
        if (!taskID || !tagID) {
            return res.status(400).json({ message: 'Both taskID and tagID are required' });
        }

        // Find the TaskTag entry to ensure it exists
        const taskTag = await TaskTag.findOne({ where: { taskID, tagID } });
        if (!taskTag) {
            return res.status(404).json({ message: 'TaskTag entry not found' });
        }

        // Delete the TaskTag entry
        await TaskTag.destroy({ where: { taskID, tagID } });

        res.status(200).json({ message: 'TaskTag entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting TaskTag entry:', error);
        res.status(500).json({ message: 'Error deleting TaskTag entry', error: error.message });
    }
};

// Update a TaskTag entry by taskID and tagID
const updateTaskTagById = async (req, res) => {
    try {
        const { taskID, tagID } = req.params;
        const { newTaskID, newTagID } = req.body;

        // Ensure newTaskID and newTagID are provided
        if (!newTaskID || !newTagID) {
            return res.status(400).json({ message: 'Both newTaskID and newTagID are required' });
        }

        // Find the existing TaskTag entry
        const taskTag = await TaskTag.findOne({ where: { taskID, tagID } });
        if (!taskTag) {
            return res.status(404).json({ message: 'TaskTag entry not found' });
        }

        // Check if newTaskID exists in Task table
        const existingTask = await Task.findByPk(newTaskID);
        if (!existingTask) {
            return res.status(404).json({ message: 'New TaskID not found' });
        }

        // Check if newTagID exists in Tag table
        const existingTag = await Tag.findByPk(newTagID);
        if (!existingTag) {
            return res.status(404).json({ message: 'New TagID not found' });
        }

        // Update the entry with new values
        taskTag.taskID = newTaskID;
        taskTag.tagID = newTagID;
        await taskTag.save();

        res.status(200).json({ message: 'TaskTag entry updated successfully', taskTag });
    } catch (error) {
        console.error('Error updating TaskTag:', error);
        res.status(500).json({ message: 'Error updating TaskTag', error: error.message });
    }
};

module.exports = {
    createTaskTag,
    getAllTaskTags,
    getTaskTagById,
    deleteTaskTagById,
    updateTaskTagById
};
