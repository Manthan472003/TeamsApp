const Task = require('../../Database/Models/task');
const Section = require('../../Database/Models/section');
const User = require('../../Database/Models/user');
const Tag = require('../../Database/Models/tag');
const { Op } = require('sequelize');
const Notification = require('../../Database/Models/notifications');
const { DataTypes } = require('sequelize');




// Create a new task (with user, section, and tag existence checks)
const createTask = async (req, res) => {
    const { taskName, description, dueDate, subTask, taskAssignedToID, taskCreatedByID, status, sectionID, platformType, tagIDs } = req.body;

    // Validate required fields
    if (!taskName || !sectionID) {
        return res.status(400).json({ message: 'Task name and section ID are required.' });
    }

    try {
        // Convert IDs to appropriate types (e.g., integers)
        const assignedUserId = taskAssignedToID ? parseInt(taskAssignedToID, 10) : null;
        const createdByUserId = taskCreatedByID ? parseInt(taskCreatedByID, 10) : null;
        const sectionId = parseInt(sectionID, 10);
        const tagsIds = tagIDs && Array.isArray(tagIDs) ? tagIDs.map(id => parseInt(id, 10)) : [];

        // Check if the assigned user exists (if provided)
        if (assignedUserId) {
            const assignedUser = await User.findOne({ where: { id: assignedUserId } });
            if (!assignedUser) {
                return res.status(404).json({ message: 'Assigned user does not exist.' });
            }
        }

        // Check if the task creator exists (if provided)
        if (createdByUserId) {
            const createdByUser = await User.findOne({ where: { id: createdByUserId } });
            if (!createdByUser) {
                return res.status(404).json({ message: 'Task creator does not exist.' });
            }
        }

        // Check if the section exists
        const section = await Section.findOne({ where: { id: sectionId } });
        if (!section) {
            return res.status(404).json({ message: 'Section does not exist.' });
        }

        // Validate tagIDs if provided
        if (tagsIds.length > 0) {
            const tags = await Tag.findAll({ where: { id: tagsIds } });
            const tagIdsInDb = tags.map(tag => tag.id);
            const invalidTagIds = tagsIds.filter(tagId => !tagIdsInDb.includes(tagId));

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
            taskAssignedToID: assignedUserId,
            taskCreatedByID: createdByUserId,
            status,
            sectionID: sectionId,
            platformType,
            tagIDs: tagsIds // Handle this as JSON array
        });

        // Create a notification for the task
        const notificationText = `New task created:\n${taskName}`; // Updated format
        const userIds = [];
        if (assignedUserId) userIds.push(assignedUserId);
        if (createdByUserId) userIds.push(createdByUserId);

        let notificationId;
        if (userIds.length > 0) {
            const notification = await Notification.create({ notificationText, userIds });
            notificationId = notification.id;
        }

        // Update the task with the newly created notification ID
        await newTask.update({ notificationIDs: [notificationId] }); // Store the notification ID

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
    const {
        taskName,
        description,
        dueDate,
        subTask,
        taskAssignedToID,
        taskCreatedByID,
        status,
        sectionID,
        platformType,
        tagIDs
    } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        // Find the existing task
        const task = await Task.findOne({ where: { id } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        // Prepare an object for the fields to update
        const updateFields = {};
        if (taskName !== undefined) updateFields.taskName = taskName;
        if (description !== undefined) updateFields.description = description;
        if (dueDate !== undefined) updateFields.dueDate = dueDate;
        if (subTask !== undefined) updateFields.subTask = subTask;
        if (status !== undefined) updateFields.status = status;
        if (platformType !== undefined) updateFields.platformType = platformType;
        if (sectionID !== undefined) updateFields.sectionID = sectionID;
        if (tagIDs !== undefined) updateFields.tagIDs = tagIDs;

        // Determine assigned user IDs
        const finalAssignedToID = taskAssignedToID !== undefined ? taskAssignedToID : task.taskAssignedToID;
        const finalCreatedByID = taskCreatedByID !== undefined ? taskCreatedByID : task.taskCreatedByID;

        // Validate user existence
        if (finalAssignedToID) {
            const assignedUser = await User.findOne({ where: { id: finalAssignedToID } });
            if (!assignedUser) {
                return res.status(404).json({ message: 'Assigned user does not exist.' });
            }
        }
        if (finalCreatedByID) {
            const createdByUser = await User.findOne({ where: { id: finalCreatedByID } });
            if (!createdByUser) {
                return res.status(404).json({ message: 'Task creator does not exist.' });
            }
        }

        // Determine if the assigned user has changed
        const assignedUserChanged = finalAssignedToID !== task.taskAssignedToID;

        // Create a notification for the task update if any field is updated
        let notificationIds = [];
        const isUpdated = Object.keys(updateFields).length > 0 || assignedUserChanged;

        if (isUpdated) {
            const notificationText = `Task updated: ${task.taskName}`;
            const userIds = new Set();

            // Add new and old assigned user IDs if changed
            if (assignedUserChanged) {
                userIds.add(finalAssignedToID); // New user
                userIds.add(task.taskAssignedToID); // Old user
            } else {
                userIds.add(finalAssignedToID); // Only the current assigned user
            }

            // Check existing notifications
            const existingNotifications = await Notification.findAll({
                where: {
                    notificationText,
                    userIds: {
                        [Op.like]: `%${Array.from(userIds).join('%')}%` // Check if any of these users are already notified
                    }
                }
            });

            const existingUserIds = new Set(existingNotifications.map(n => n.userIds[0])); // Assuming userIds is an array

            // Create notifications for new users
            for (const userId of userIds) {
                const intUserId = parseInt(userId, 10);
                if (!isNaN(intUserId) && !existingUserIds.has(intUserId)) {
                    const notification = await Notification.create({ notificationText, userIds: [intUserId] });
                    notificationIds.push(notification.id);
                }
            }
        }

        // Update the task with the collected fields, including notificationIDs
        await task.update({
            ...updateFields,
            taskAssignedToID: finalAssignedToID,
            taskCreatedByID: finalCreatedByID,
            notificationIDs: task.notificationIDs ? [...new Set([...task.notificationIDs, ...notificationIds])] : notificationIds
        });

        // Fetch the updated task from the database
        const updatedTask = await Task.findOne({ where: { id } });

        return res.status(200).json({ message: 'Task updated successfully.', task: updatedTask });

    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Error updating task.' });
    }
};

//Delete task by task ID
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

        // Perform a soft delete
        task.isDelete = true;
        task.deletedAt = new Date(); // Set the current time
        await task.save();

        return res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Error deleting task.' });
    }
};

//Get all soft deleted Task
const getDeletedTasks = async (req, res) => {
    try {
        const deletedTasks = await Task.findAll({
            where: { isDelete: true }
        });
        return res.status(200).json(deletedTasks);
    } catch (error) {
        console.error('Error fetching deleted tasks:', error);
        return res.status(500).json({ message: 'Error fetching deleted tasks.' });
    }
};

//restore taskas By ID
const restoreTaskById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const task = await Task.findOne({
            where: { id, isDelete: true }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found in bin.' });
        }

        // Restore the task
        task.isDelete = false;
        task.deletedAt = null;
        await task.save();

        return res.status(200).json({ message: 'Task restored successfully.' });
    } catch (error) {
        console.error('Error restoring task:', error);
        return res.status(500).json({ message: 'Error restoring task.' });
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
    getTasksByTaskName,
    getDeletedTasks,
    restoreTaskById
};