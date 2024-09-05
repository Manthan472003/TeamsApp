const Task = require('../../Database/Models/task');
const Section = require('../../Database/Models/section');
const User = require('../../Database/Models/user');
const Tag = require('../../Database/Models/tag');
const TaskTag = require('../../Database/Models/taskTag')

// Create a new Task
const createTask = async (req, res) => {
    const { TaskName, Description, DueDate, SubTask, TaskAssignedToID, TaskCreatedByID, Status, SectionID, Tags = [] } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Check if the Section exists
        const section = await Section.findByPk(SectionID);
        if (!section) {
            return res.status(400).json({ message: 'SectionID does not exist.' });
        }

        // Validate TaskAssignedToID if provided
        if (TaskAssignedToID) {
            const taskAssignedTo = await User.findByPk(TaskAssignedToID);
            if (!taskAssignedTo) {
                return res.status(400).json({ message: 'TaskAssignedToID does not exist.' });
            }
        }

        // Check if the TaskCreatedByID exists
        const taskCreatedBy = await User.findByPk(TaskCreatedByID);
        if (!taskCreatedBy) {
            return res.status(400).json({ message: 'TaskCreatedByID does not exist.' });
        }

        // Validate if all provided tags exist
        if (Tags.length > 0) {
            const existingTags = await Tag.findAll({
                where: { id: Tags },
                attributes: ['id']
            });

            const existingTagIds = existingTags.map(tag => tag.id);
            const invalidTagIds = Tags.filter(tagId => !existingTagIds.includes(tagId));

            if (invalidTagIds.length > 0) {
                return res.status(400).json({ message: `Invalid tag IDs: ${invalidTagIds.join(', ')}` });
            }
        }

        // Create the new task within the transaction
        const newTask = await Task.create({ TaskName, Description, DueDate, SubTask, TaskAssignedToID, TaskCreatedByID, Status, SectionID }, { transaction });

        // Check existing TaskTag associations
        if (Tags.length > 0) {
            const existingAssociations = await TaskTag.findAll({
                where: {
                    TaskID: newTask.id,
                    TagID: Tags
                },
                attributes: ['TagID']
            });

            const existingTagIds = existingAssociations.map(assoc => assoc.TagID);
            const newTagIds = Tags.filter(tagId => !existingTagIds.includes(tagId));

            if (newTagIds.length > 0) {
                const taskTags = newTagIds.map(tagId => ({
                    TaskID: newTask.id,
                    TagID: tagId
                }));

                await TaskTag.bulkCreate(taskTags, { transaction });
            }
        }

        await transaction.commit();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating task:', error);
        res.status(500).json({ error: error.message });
    }
};


const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [{
                model: Tag,
                through: { attributes: [] } // Exclude the join table attributes from the result
            }]
        });

        // Transform tasks to include only tag IDs
        const tasksWithTagIds = tasks.map(task => ({
            ...task.toJSON(),
            Tags: task.Tags.map(tag => tag.id) // Extract tag IDs
        }));

        res.status(200).json(tasksWithTagIds);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: error.message });
    }
};



// Get a task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, {
            include: [{
                model: Tag,
                through: { attributes: [] } // Exclude the join table attributes from the result
            }]
        });

        if (task) {
            // Transform the task to include only tag IDs
            const taskWithTagIds = {
                ...task.toJSON(),
                Tags: task.Tags.map(tag => tag.id) // Extract tag IDs
            };

            res.status(200).json(taskWithTagIds);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: error.message });
    }
};


// Update a task by ID
const updateTaskById = async (req, res) => {
    const { TaskName, Description, DueDate, SubTask, TaskAssignedToID, TaskCreatedByID, Status, SectionID, Tags = [] } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Fetch the existing task
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Validate SectionID if provided
        if (SectionID) {
            const section = await Section.findByPk(SectionID);
            if (!section) {
                return res.status(400).json({ message: 'SectionID does not exist.' });
            }
        }

        // Validate TaskAssignedToID if provided
        if (TaskAssignedToID) {
            const taskAssignedTo = await User.findByPk(TaskAssignedToID);
            if (!taskAssignedTo) {
                return res.status(400).json({ message: 'TaskAssignedToID does not exist.' });
            }
        }

        // Validate TaskCreatedByID if provided
        if (TaskCreatedByID) {
            const taskCreatedBy = await User.findByPk(TaskCreatedByID);
            if (!taskCreatedBy) {
                return res.status(400).json({ message: 'TaskCreatedByID does not exist.' });
            }
        }

        // Update task details
        await task.update({
            TaskName,
            Description,
            DueDate,
            SubTask,
            TaskAssignedToID,
            TaskCreatedByID,
            Status,
            SectionID
        }, { transaction });

        // Validate if all provided tags exist
        if (Tags.length > 0) {
            const existingTags = await Tag.findAll({
                where: { id: Tags },
                attributes: ['id']
            });

            const existingTagIds = existingTags.map(tag => tag.id);
            const invalidTagIds = Tags.filter(tagId => !existingTagIds.includes(tagId));

            if (invalidTagIds.length > 0) {
                await transaction.rollback();
                return res.status(400).json({ message: `Invalid tag IDs: ${invalidTagIds.join(', ')}` });
            }
        }

        // Remove old tag associations
        await TaskTag.destroy({ where: { TaskID: task.id }, transaction });

        // Check existing TaskTag associations
        if (Tags.length > 0) {
            const existingAssociations = await TaskTag.findAll({
                where: {
                    TaskID: task.id,
                    TagID: Tags
                },
                attributes: ['TagID']
            });

            const existingTagIds = existingAssociations.map(assoc => assoc.TagID);
            const newTagIds = Tags.filter(tagId => !existingTagIds.includes(tagId));

            if (newTagIds.length > 0) {
                const taskTags = newTagIds.map(tagId => ({
                    TaskID: task.id,
                    TagID: tagId
                }));

                await TaskTag.bulkCreate(taskTags, { transaction });
            }
        }

        await transaction.commit();

        // Fetch the updated task to include the associated tags
        const updatedTask = await Task.findByPk(req.params.id, {
            include: [{ model: Tag, through: { attributes: [] } }] // Include tags to return with updated task
        });

        // Transform the task to include only tag IDs
        const taskWithTagIds = {
            ...updatedTask.toJSON(),
            Tags: updatedTask.Tags.map(tag => tag.id) // Extract tag IDs
        };

        res.status(200).json(taskWithTagIds);
    } catch (error) {
        await transaction.rollback();
        console.error('Error updating task:', error);
        res.status(500).json({ error: error.message });
    }
};



// Delete a task by ID
const deleteTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Remove associated tag entries
        await TaskTag.destroy({
            where: { TaskID: req.params.id }
        });

        // Remove the task itself
        await Task.destroy({
            where: { id: req.params.id }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById
};
