const TaskTag = require('../../Database/Models/taskTag');
const Task = require('../../Database/Models/task');
const Tag = require('../../Database/Models/tag');

// Create a new entry
const createTaskTag = async (req, res) => {
    try {
        const { TaskID, TagID } = req.body;
        // Check if both TaskID and TagID are provided
        if (!TaskID || !TagID) {
            return res.status(400).json({ message: 'Both TaskID and TagID are required' });
        }

        // Check if the task exists
        const existingTask = await Task.findByPk(TaskID);
        if (!existingTask) {
            return res.status(400).json({ message: 'Task not available' });
        }

        // Check if the tag exists
        const existingTag = await Tag.findByPk(TagID);
        if (!existingTag) {
            return res.status(400).json({ message: 'Tag not available' });
        }

        // Check if the TaskTag entry already exists
        const existingTaskTag = await TaskTag.findOne({
            where: { TaskID, TagID }
        });
        if (existingTaskTag) {
            return res.status(400).json({ message: 'TaskTag entry already exists' });
        }

        // Create new TaskTag entry
        const newTaskTag = await TaskTag.create({ TaskID, TagID });

        res.status(201).json({ message: 'TaskTag created successfully', taskTag: newTaskTag });
    } catch (error) {
        console.error('Error creating TaskTag:', error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};

// Get all Entries
const getAllTaskTags = async (req, res) => {
    try {
        const tasktags = await TaskTag.findAll();
        res.status(200).json(tasktags);
    } catch (error) {
        console.error('Error retrieving TaskTags:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get a TaskTag entry by IDs
const getTaskTagById = async (req, res) => {
    try {
        const { TaskID, TagID } = req.params;
        // Check if both TaskID and TagID are provided
        if (!TaskID || !TagID) {
            return res.status(400).json({ message: 'Both TaskID and TagID are required' });
        }
        const taskTag = await TaskTag.findOne({ where: { TaskID, TagID } });
        if (!taskTag) {
            res.status(404).json({ message: 'TaskTag Entry not found' });
        } else {
            res.status(200).json(taskTag);
        }
    } catch (error) {
        console.error('Error retrieving TaskTag:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete an entry by ID
const deleteTaskTagById = async (req, res) => {
    try {
        const { TaskID, TagID } = req.params;
        // Check if both TaskID and TagID are provided
        if (!TaskID || !TagID) {
            return res.status(400).json({ message: 'Both TaskID and TagID are required' });
        }
        // Find the TaskTag entry to ensure it exists
        const taskTag = await TaskTag.findOne({
            where: { TaskID, TagID }
        });
        if (!taskTag) {
            return res.status(404).json({ message: 'TaskTag entry not found' });
        }

        // Delete the TaskTag entry
        await TaskTag.destroy({
            where: { TaskID, TagID }
        });

        res.status(200).json({ message: 'TaskTag entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting TaskTag entry:', error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};


//Update an entry by ID
const updateTaskTagById = async (req, res) => {
    try {
        const { TaskID, TagID } = req.params;
        const { newTaskID, newTagID } = req.body;

        // Ensure newTaskID and newTagID are provided
        if (!newTaskID || !newTagID) {
            return res.status(400).json({ message: 'Both newTaskID and newTagID are required' });
        }

        const taskTag = await TaskTag.findOne({ where: { TaskID, TagID } });


        if (!taskTag) {
            return res.status(404).json({ message: 'TaskTag Entry not found' });
        }

        // Check if newTaskID exists in Task table, if provided
        if (newTaskID) {
            const existingTask = await Task.findByPk(newTaskID);
            if (!existingTask) {
                return res.status(400).json({ message: 'New TaskID not found in Task table' });
            }
        }

        // Check if newTagID exists in Tag table, if provided
        if (newTagID) {
            const existingTag = await Tag.findByPk(newTagID);
            if (!existingTag) {
                return res.status(400).json({ message: 'New TagID not found in Tag table' });
            }
        }

        // Update the entry with new values
        taskTag.TaskID = newTaskID;
        taskTag.TagID = newTagID;
        await taskTag.save();

        res.status(200).json({ message: 'TaskTag entry updated successfully', taskTag });
    } catch (error) {
        console.error('Error updating TaskTag:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTaskTag,
    getAllTaskTags,
    getTaskTagById,
    deleteTaskTagById,
    updateTaskTagById
};