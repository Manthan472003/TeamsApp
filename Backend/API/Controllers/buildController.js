const Build = require('../../Database/Models/build');
const TasksChecked = require('../../Database/Models/tasksChecked');
const Section = require('../../Database/Models/section');
const User = require('../../Database/Models/user');
const Task = require('../../Database/Models/task');


//Create Build Entry
const createEntry = async (req, res) => {
    const { appId, deployedOn, versionName, mediaLink, tasksForBuild } = req.body;
    if (!appId) {
        return res.status(400).json({ message: 'Application ID is required.' });
    }
    if (!versionName) {
        return res.status(400).json({ message: 'Version name is required.' });
    }

    try {
        // Validate application existence
        const application = await Section.findByPk(appId);
        if (!application) {
            return res.status(404).json({ message: 'Application does not exist.' });
        }

        // Create the build entry
        const newBuild = await Build.create({
            appId,
            deployedOn,
            versionName,
            mediaLink,
            tasksForBuild,
        });
        return res.status(201).json({ message: 'Build created successfully.', newBuild });
    } catch (error) {
        console.error('Error creating build entry:', error);
        return res.status(500).json({ message: 'Error creating build entry.', error: error.message });
    }
};

// Mark Task as Working
const markTaskWorking = async (req, res) => {
    const { buildId, taskName, userId } = req.body;

    // Validate input
    if (!taskName) {
        return res.status(400).json({ message: 'Task Name is required.' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const task = await Task.findOne({ where: { taskName } });
        if (!task) {
            return res.status(404).json({ message: 'Task does not exist.' });
        }

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        const existingEntry = await TasksChecked.findOne({ where: { taskId: task.id, checkedByUserId: userId } });
        let newEntry;

        if (existingEntry) {
            if (existingEntry.isWorking) {
                return res.status(400).json({ message: 'Task is already marked as working.' });
            } else {
                existingEntry.isWorking = true;
                await existingEntry.save();
                return res.status(200).json({ message: 'Task status updated to working.', existingEntry });
            }
        } else {
            newEntry = await TasksChecked.create({
                taskId: task.id,
                checkedByUserId: userId,
                isWorking: true
            });
        }

        const buildEntry = await Build.findByPk(buildId);
        if (!buildEntry) {
            return res.status(404).json({ message: 'Build does not exist.' });
        }

        // Initialize currentCheckedIds as an array
        let currentCheckedIds = buildEntry.checkedIds || [];
        if (currentCheckedIds) {
            if (typeof currentCheckedIds === 'string') {
                currentCheckedIds = JSON.parse(currentCheckedIds);
            }
        } else {
            currentCheckedIds = [];  // Ensure it's an empty array if null
        }

        if (!Array.isArray(currentCheckedIds)) {
            currentCheckedIds = [];
        }

        if (newEntry) {
            currentCheckedIds.push(newEntry.id);
        }

        await buildEntry.update({ checkedIds: currentCheckedIds });

        return res.status(201).json({
            message: 'Task marked as working successfully.',
            newEntry: newEntry || existingEntry
        });
    } catch (error) {
        console.error('Error marking task as working:', error);
        return res.status(500).json({ message: 'Error marking task as working.', error: error.message });
    }
};

// Mark Task as Not Working
const markTaskNotWorking = async (req, res) => {
    const { buildId, taskName, userId } = req.body;

    // Validate input
    if (!taskName) {
        return res.status(400).json({ message: 'Task Name is required.' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const task = await Task.findOne({ where: { taskName } });
        if (!task) {
            return res.status(404).json({ message: 'Task does not exist.' });
        }

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        const existingEntry = await TasksChecked.findOne({ where: { taskId: task.id, checkedByUserId: userId } });

        if (existingEntry) {
            if (!existingEntry.isWorking) {
                return res.status(400).json({ message: 'Task is already marked as not working.' });
            } else {
                existingEntry.isWorking = false;
                await existingEntry.save();
                return res.status(200).json({ message: 'Task status updated to not working.', existingEntry });
            }
        }

        const newEntry = await TasksChecked.create({
            taskId: task.id,
            checkedByUserId: userId,
            isWorking: false
        });

        const buildEntry = await Build.findByPk(buildId);
        if (!buildEntry) {
            return res.status(404).json({ message: 'Build does not exist.' });
        }

        let currentCheckedIds = buildEntry.checkedIds || [];
        if (currentCheckedIds) {
            if (typeof currentCheckedIds === 'string') {
                currentCheckedIds = JSON.parse(currentCheckedIds);
            }
        } else {
            currentCheckedIds = [];
        }

        if (!Array.isArray(currentCheckedIds)) {
            currentCheckedIds = [];
        }

        currentCheckedIds.push(newEntry.id);

        await buildEntry.update({ checkedIds: currentCheckedIds });

        return res.status(201).json({
            message: 'Task marked as not working successfully.',
            newEntry
        });
    } catch (error) {
        console.error('Error marking task as not working:', error);
        return res.status(500).json({ message: 'Error marking task as not working.', error: error.message });
    }
};

//Get All Build Entries
const getAllBuildEntries = async (req, res) => {
    try {
        const buildEntries = await Build.findAll();
        return res.status(200).json(buildEntries);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving build Entries.', error });
    }
};

//Get an Build Entry
const getBuildEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const buildEntry = await Build.findOne({
            where: { id }
        });
        if (!buildEntry) {
            return res.status(404).json({ message: 'Entry not found.' });
        }
        return res.status(200).json(buildEntry);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving entry.', error });
    }
}

module.exports = {
    createEntry,
    markTaskWorking,
    markTaskNotWorking,
    getAllBuildEntries,
    getBuildEntry
};