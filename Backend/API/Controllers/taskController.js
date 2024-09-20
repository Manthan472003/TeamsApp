const Task = require('../../Database/Models/task');
const Section = require('../../Database/Models/section');
const User = require('../../Database/Models/user');
const Tag = require('../../Database/Models/tag');
const { Op } = require('sequelize');



// Create a new task (with user, section, and tag existence checks)
const createTask = async (req, res) => {
    const { taskName, description, dueDate, subTask, taskAssignedToID, taskCreatedByID, status, sectionID, tagIDs } = req.body;

    // Validate required fields
    if (!taskName || !sectionID) {
        return res.status(400).json({ message: 'Task name and section ID are required.' });
    }

    try {
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

        // Validate tagIDs if provided
        if (tagIDs && Array.isArray(tagIDs)) {
            const tags = await Tag.findAll({
                where: {
                    id: tagIDs
                }
            });

            const tagIdsInDb = tags.map(tag => tag.id);
            const invalidTagIds = tagIDs.filter(tagId => !tagIdsInDb.includes(tagId));

            if (invalidTagIds.length > 0) {
                return res.status(404).json({ message: `Tags with IDs ${invalidTagIds.join(', ')} do not exist.` });
            }
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
            sectionID,
            tagIDs, // Handle this as JSON array
        });

        return res.status(201).json({ message: 'Task created successfully.', newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Error creating task.' });
    }
};


// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        return res.status(500).json({ message: 'Error retrieving tasks.' });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const task = await Task.findOne({
            where: { id }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        return res.status(200).json(task);
    } catch (error) {
        console.error('Error retrieving task:', error);
        return res.status(500).json({ message: 'Error retrieving task.' });
    }
};

// Update task by ID (with user and section existence check)
const updateTaskById = async (req, res) => {
    const { id } = req.params;
    const { taskName, description, dueDate, subTask, taskAssignedToID, taskCreatedByID, status, sectionID, tagIDs } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required for update.' });
    }
    // if (!taskName || !sectionID) {
    //     return res.status(400).json({ message: 'Task name and section ID are required for update.' });
    // }

    try {
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

        // Validate tagIDs if provided
        if (tagIDs && Array.isArray(tagIDs)) {
            const tags = await Tag.findAll({
                where: {
                    id: tagIDs
                }
            });

            const tagIdsInDb = tags.map(tag => tag.id);
            const invalidTagIds = tagIDs.filter(tagId => !tagIdsInDb.includes(tagId));

            if (invalidTagIds.length > 0) {
                return res.status(404).json({ message: `Tags with IDs ${invalidTagIds.join(', ')} do not exist.` });
            }
        }

        // Update the task
        await task.update({
            taskName,
            description,
            dueDate,
            subTask,
            taskAssignedToID,
            taskCreatedByID,
            status,
            sectionID,
            tagIDs, // Handle this as JSON array
        });

        return res.status(200).json({ message: 'Task updated successfully.', task });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Error updating task.' });
    }
};


// Delete task by ID
const deleteTaskById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const task = await Task.findOne({
            where: { id }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        await task.destroy();
        return res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Error deleting task.' });
    }
};

// Get tasks by sectionID
const getTasksBySectionID = async (req, res) => {
    const { sectionID } = req.params;

    try {
        if (sectionID === 'null') {
            // Fetch tasks without a section
            const tasks = await Task.findAll({ where: { sectionID: null } });
            return res.status(200).json(tasks);
        } else {
            const section = await Section.findOne({ where: { id: sectionID } });
            if (!section) {
                return res.status(404).json({ message: 'Section does not exist.' });
            }

            const tasks = await Task.findAll({ where: { sectionID } });
            return res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error retrieving tasks by sectionID:', error);
        return res.status(500).json({ message: 'Error retrieving tasks by sectionID.' });
    }
};

// New controller to get tasks with null sectionID
const getTasksWithNullSection = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { sectionID: null } });
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks with null sectionID:', error);
        return res.status(500).json({ message: 'Error retrieving tasks with null sectionID.' });
    }
};

// Get tasks with 'completed' status
const getCompletedTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { status: 'Completed' } });
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error retrieving completed tasks:', error);
        return res.status(500).json({ message: 'Error retrieving completed tasks.' });
    }
};

// Get Tasks Assigned to a user by UserID
const getAssignedTasksToUserByUserId = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: 'UserId is required.' });
    }
    try {
        if (userId) {
            const user = await User.findOne({
                where: { id: userId }
            });
            if (!user) {
                return res.status(404).json({ message: 'User does not exist.' });
            }
        }

        const tasks = await Task.findAll({
            where: { taskAssignedToID: userId }
        });
        return res.status(200).json(tasks);


    } catch (error) {
        console.error('Error retrieving Tasks by UserID:', error);
        return res.status(500).json({ message: 'Error retrieving Tasks by UserId.' });

    }


}

const getTasksByTaskName = async (req, res) => {
    const { taskName } = req.query;
    console.log('Searching for tasks with name:', taskName); // Log the search term

    if (!taskName) {
        return res.status(400).json({ message: "Task name is required." });
    }

    try {
        const tasks = await Task.findAll({
            where: {
                taskName: {
                    [Op.like]: `%${taskName}%` // Use `Op.like` for MySQL
                }
            }
        });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found." });
        }

        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error retrieving Tasks by TaskName:', error.message);
        return res.status(500).json({ message: 'Error retrieving Tasks by TaskName.' });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    getTasksBySectionID,
    getTasksWithNullSection,
    getCompletedTasks,
    getAssignedTasksToUserByUserId,
    getTasksByTaskName
};