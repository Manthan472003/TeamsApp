const Build = require('../../Database/Models/build');
const TasksChecked = require('../../Database/Models/tasksChecked');
const Section = require('../../Database/Models/section');
const User = require('../../Database/Models/user');
const Task = require('../../Database/Models/task');
const { Op } = require('sequelize');


const createEntry = async (req, res) => {
    const { appId, deployedOn, versionName, mediaLink } = req.body;
    if (!appId) {
        return res.status(400).json({ message: 'Application ID is required.' });
    }
    if (!deployedOn) {
        return res.status(400).json({ message: 'deployedOn is required.' });
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

        // If checkedIds is not null or an empty string, parse it
        if (buildEntry.checkedIds) {
            try {
                // Check if the value is a valid JSON string
                currentCheckedIds = JSON.parse(buildEntry.checkedIds);
            } catch (error) {
                console.error('Error parsing checkedIds:', error);
                return res.status(500).json({ message: 'Error parsing checked IDs.' });
            }
        }

        // Ensure currentCheckedIds is an array
        if (!Array.isArray(currentCheckedIds)) {
            currentCheckedIds = [];
        }

        // Add the new checked ID
        currentCheckedIds.push(newEntry.id);

        // Store the array back as a JSON string
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

        // If checkedIds is not null or an empty string, parse it
        if (buildEntry.checkedIds) {
            try {
                // Check if the value is a valid JSON string
                currentCheckedIds = JSON.parse(buildEntry.checkedIds);
            } catch (error) {
                console.error('Error parsing checkedIds:', error);
                return res.status(500).json({ message: 'Error parsing checked IDs.' });
            }
        }

        // Ensure currentCheckedIds is an array
        if (!Array.isArray(currentCheckedIds)) {
            currentCheckedIds = [];
        }

        // Add the new checked ID
        currentCheckedIds.push(newEntry.id);

        // Store the array back as a JSON string
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









// const createEntry = async (req, res) => {
//   try {
//     const { taskId, checkedByUserId, buildId } = req.body; // Expecting these values in the request body

//     // Step 1: Create a new entry in tasks_checked_table
//     const taskCheckedEntry = await TasksChecked.create({
//       taskId,
//       checkedByUserId,
//     });

//     // Step 2: Find the corresponding build entry to update
//     const buildEntry = await Build.findByPk(buildId);
//     if (!buildEntry) {
//       return res.status(404).json({ message: 'Build not found' });
//     }

//     // Step 3: Update the taskIds field in the build_table
//     const currentTaskIds = buildEntry.taskIds ? JSON.parse(buildEntry.taskIds) : [];
//     currentTaskIds.push(taskCheckedEntry.id); // Add the new checked ID

//     await buildEntry.update({ taskIds: JSON.stringify(currentTaskIds) });

//     return res.status(201).json({
//       message: 'Task checked entry created successfully',
//       taskCheckedEntry,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'An error occurred', error });
//   }
// };

module.exports = {
    createEntry,
    markTaskWorking,
    markTaskNotWorking,
    getAllBuildEntries,
    getBuildEntry

};
