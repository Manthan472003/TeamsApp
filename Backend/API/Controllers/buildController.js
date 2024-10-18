const Build = require('../../Database/Models/build');
const TasksChecked = require('../../Database/Models/tasksChecked');
const Section = require('../../Database/Models/section');
const User = require('../../Database/Models/user');
const Task = require('../../Database/Models/task');


//Create Build Entry
const createEntry = async (req, res) => {
    const { appId, deployedOn, versionName, mediaLink } = req.body;
    if (!appId) {
        return res.status(400).json({ message: 'Application ID is required.' });
    }
    if (!versionName) {
        return res.status(400).json({ message: 'versionName is required.' });
    }

    try {
        // appId = parseInt(appId, 10);

        // Validate users and section existence
        if (appId) {
            const application = await Section.findOne({ where: { id: appId } });
            if (!application) {
                return res.status(404).json({ message: 'Application does not exist.' });
            }
        }

        // Create the task
        const newBuild = await Build.create({
            appId, deployedOn, versionName, mediaLink
        });
        return res.status(201).json({ message: 'Build created successfully.', newBuild });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Error creating task.', error: error.message });
    }
};

// Mark Task is Working
const markTaskWorking = async (req, res) => {
    const { buildId, taskId, userId } = req.body;

    // Validate input
    if (!taskId) {
        return res.status(400).json({ message: 'Task ID is required.' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Check if the task exists
        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ message: 'Task does not exist.' });
        }

        // Check if the user exists
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        // Check if an entry already exists for this taskId
        const existingEntry = await TasksChecked.findOne({ where: { taskId, checkedByUserId: userId } });
        
        if (existingEntry) {
            if (existingEntry.isWorking) {
                return res.status(400).json({ message: 'Task is already marked as working.' });
            } else {
                // Update the existing entry to set isWorking to true
                existingEntry.isWorking = true;
                await existingEntry.save();
                return res.status(200).json({ message: 'Task status updated to working.', existingEntry });
            }
        }

        // Create a new entry in TasksChecked
        const newEntry = await TasksChecked.create({
            taskId,
            checkedByUserId: userId,
            isWorking: true
        });

        // Find the corresponding build entry to update
        const buildEntry = await Build.findByPk(buildId);
        if (!buildEntry) {
            return res.status(404).json({ message: 'Build does not exist.' });
        }

        // Initialize checkedIds as an array
        let currentCheckedIds = [];
        if (buildEntry.checkedIds) {
            try {
                currentCheckedIds = JSON.parse(buildEntry.checkedIds);
            } catch (error) {
                console.error('Error parsing checkedIds:', error);
                return res.status(500).json({ message: 'Error parsing checked IDs.' });
            }
        }
        if (!Array.isArray(currentCheckedIds)) {
            currentCheckedIds = [];
        }

        currentCheckedIds.push(newEntry.id);
        await buildEntry.update({ checkedIds: JSON.stringify(currentCheckedIds) });

        return res.status(201).json({
            message: 'Task marked as working successfully.',
            newEntry
        });
    } catch (error) {
        console.error('Error marking task as working:', error);
        return res.status(500).json({ message: 'Error marking task as working.', error: error.message });
    }
};

// Mark Task is Not Working
const markTaskNotWorking = async (req, res) => {
    const { buildId, taskId, userId } = req.body;

    // Validate input
    if (!taskId) {
        return res.status(400).json({ message: 'Task ID is required.' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Check if the task exists
        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ message: 'Task does not exist.' });
        }

        // Check if the user exists
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        // Check if an entry already exists for this taskId
        const existingEntry = await TasksChecked.findOne({ where: { taskId, checkedByUserId: userId } });

        if (existingEntry) {
            if (!existingEntry.isWorking) {
                return res.status(400).json({ message: 'Task is already marked as not working.' });
            } else {
                // Update the existing entry to set isWorking to false
                existingEntry.isWorking = false;
                await existingEntry.save();
                return res.status(200).json({ message: 'Task status updated to not working.', existingEntry });
            }
        }

        // Create a new entry in TasksChecked
        const newEntry = await TasksChecked.create({
            taskId,
            checkedByUserId: userId,
            isWorking: false
        });

        // Find the corresponding build entry to update
        const buildEntry = await Build.findByPk(buildId);
        if (!buildEntry) {
            return res.status(404).json({ message: 'Build does not exist.' });
        }

        // Initialize checkedIds as an array
        let currentCheckedIds = [];
        if (buildEntry.checkedIds) {
            try {
                currentCheckedIds = JSON.parse(buildEntry.checkedIds);
            } catch (error) {
                console.error('Error parsing checkedIds:', error);
                return res.status(500).json({ message: 'Error parsing checked IDs.' });
            }
        }
        if (!Array.isArray(currentCheckedIds)) {
            currentCheckedIds = [];
        }

        currentCheckedIds.push(newEntry.id);
        await buildEntry.update({ checkedIds: JSON.stringify(currentCheckedIds) });

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