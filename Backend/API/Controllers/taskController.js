const Task = require('../../Database/Models/task');
const Section = require('../../Database/Models/section');
const User = require('../../Database/Models/user');

// Create a new task (with user and section existence check)
const createTask = async (req, res) => {
    try {
        const { taskName, description, dueDate, subTask, taskAssignedToID, taskCreatedByID, status, sectionID } = req.body;

        // Validate required fields
        if (!taskName || !sectionID) {
            return res.status(400).json({ message: 'Task name and section ID are required.' });
        }

        // Check if the assigned user exists (if provided)
        if (taskAssignedToID) {
            const assignedUser = await User.findOne({
                where: { id: taskAssignedToID }
            });
            if (!assignedUser) {
                return res.status(404).json({ message: 'Assigned user does not exist.' });
            }
        }

        // Check if the task creator exists (if provided)
        if (taskCreatedByID) {
            const createdByUser = await User.findOne({
                where: { id: taskCreatedByID }
            });
            if (!createdByUser) {
                return res.status(404).json({ message: 'Task creator does not exist.' });
            }
        }

        // Check if the section exists
        const section = await Section.findOne({
            where: { id: sectionID }
        });
        if (!section) {
            return res.status(404).json({ message: 'Section does not exist.' });
        }

        // Create the task
        const newTask = await Task.create({
            taskName,
            description,
            dueDate,
            subTask,
            taskAssignedToID,
            taskCreatedByID,
            status,
            sectionID
        });

        return res.status(201).json({ message: 'Task created successfully.', newTask });
    } catch (error) {
        console.error('Error creating task:', error); // Log error for debugging
        return res.status(500).json({ message: 'Error creating task.' });
    }
};

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error); // Log error for debugging
        return res.status(500).json({ message: 'Error retrieving tasks.' });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({ message: 'ID parameter is required.' });
        }

        const task = await Task.findOne({
            where: { id }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        return res.status(200).json(task);
    } catch (error) {
        console.error('Error retrieving task:', error); // Log error for debugging
        return res.status(500).json({ message: 'Error retrieving task.' });
    }
};

// Update task by ID (with user and section existence check)
const updateTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const { taskName, description, dueDate, subTask, taskAssignedToID, taskCreatedByID, status, sectionID } = req.body;

        // Validate required fields
        if (!id) {
            return res.status(400).json({ message: 'ID parameter is required for update.' });
        }
        if (!taskName || !sectionID) {
            return res.status(400).json({ message: 'Task name and section ID are required for update.' });
        }

        // Find the task to update
        const task = await Task.findOne({
            where: { id }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        // Check if the assigned user exists (if provided)
        if (taskAssignedToID) {
            const assignedUser = await User.findOne({
                where: { id: taskAssignedToID }
            });
            if (!assignedUser) {
                return res.status(404).json({ message: 'Assigned user does not exist.' });
            }
        }

        // Check if the task creator exists (if provided)
        if (taskCreatedByID) {
            const createdByUser = await User.findOne({
                where: { id: taskCreatedByID }
            });
            if (!createdByUser) {
                return res.status(404).json({ message: 'Task creator does not exist.' });
            }
        }

        // Check if the section exists
        const section = await Section.findOne({
            where: { id: sectionID }
        });
        if (!section) {
            return res.status(404).json({ message: 'Section does not exist.' });
        }

        // Update the task
        task.taskName = taskName;
        task.description = description;
        task.dueDate = dueDate;
        task.subTask = subTask;
        task.taskAssignedToID = taskAssignedToID;
        task.taskCreatedByID = taskCreatedByID;
        task.status = status;
        task.sectionID = sectionID;

        await task.save();

        return res.status(200).json({ message: 'Task updated successfully.', task });
    } catch (error) {
        console.error('Error updating task:', error); // Log error for debugging
        return res.status(500).json({ message: 'Error updating task.' });
    }
};

// Delete task by ID
const deleteTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({ message: 'ID parameter is required.' });
        }

        const task = await Task.findOne({
            where: { id }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        await task.destroy();
        return res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error('Error deleting task:', error); // Log error for debugging
        return res.status(500).json({ message: 'Error deleting task.' });
    }
};

// Get tasks by sectionID
const getTasksBySectionID = async (req, res) => {
    try {
        const { sectionID } = req.params;

        // Check if section exists
        const section = await Section.findOne({
            where: { id: sectionID }
        });
        if (!section) {
            return res.status(404).json({ message: 'Section does not exist.' });
        }

        const tasks = await Task.findAll({
            where: { sectionID }
        });

        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error); // Log error for debugging
        return res.status(500).json({ message: 'Error retrieving tasks by sectionID.' });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    getTasksBySectionID
};
