const Build = require('../../Database/Models/build');
const TasksChecked = require('../../Database/Models/tasksChecked');
const Section = require('../../Database/Models/section');
const User = require('../../Database/Models/user');
const Task = require('../../Database/Models/task');


//Create Build Entry
const createEntry = async (req, res) => {
    const { appId, deployedOn, versionName, link, tasksForBuild } = req.body;
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
            link,
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
    if (!buildId) {
        return res.status(400).json({ message: 'Build ID is required.' });
    }
    if (!taskName) {
        return res.status(400).json({ message: 'Task Name is required.' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const build = await Build.findOne({ where: { id: buildId } });
        if (!build) {
            return res.status(404).json({ message: 'Build does not exist.' });
        }

        // const task = await Task.findOne({ where: { taskName } });
        // if (!task) {
        //     return res.status(404).json({ message: 'Task does not exist.' });
        // }

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        const existingEntry = await TasksChecked.findOne({ where: { buildId, taskName } });
        let newEntry;

        if (existingEntry) {
            if (existingEntry.isWorking) {
                return res.status(400).json({ message: 'Task is already marked as working.' });
            } else {
                existingEntry.isWorking = true;
                existingEntry.checkedByUserId = userId;
                // Ensure buildId is stored correctly
                existingEntry.buildId = buildId;
                await existingEntry.save();
                return res.status(200).json({ message: 'Task status updated to working.', existingEntry });
            }
        } else {
            newEntry = await TasksChecked.create({
                taskName,
                checkedByUserId: userId,
                buildId, // Store buildId
                isWorking: true
            });
        }

        // Update checkedIds in the build entry
        const buildEntry = await Build.findByPk(buildId);
        let currentCheckedIds = buildEntry.checkedIds || [];
        if (typeof currentCheckedIds === 'string') {
            currentCheckedIds = JSON.parse(currentCheckedIds);
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
    if (!buildId) {
        return res.status(400).json({ message: 'Build ID is required.' });
    }
    if (!taskName) {
        return res.status(400).json({ message: 'Task Name is required.' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // const task = await Task.findOne({ where: { taskName } });
        // if (!task) {
        //     return res.status(404).json({ message: 'Task does not exist.' });
        // }

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        const existingEntry = await TasksChecked.findOne({ where: { buildId, taskName } });

        if (existingEntry) {
            if (!existingEntry.isWorking) {
                return res.status(400).json({ message: 'Task is already marked as not working.' });
            } else {
                existingEntry.isWorking = false;
                existingEntry.checkedByUserId = userId;
                // Ensure buildId is stored correctly
                existingEntry.buildId = buildId;
                await existingEntry.save();
                return res.status(200).json({ message: 'Task status updated to not working.', existingEntry });
            }
        }

        const newEntry = await TasksChecked.create({
            taskName,
            checkedByUserId: userId,
            buildId, // Store buildId
            isWorking: false
        });

        const buildEntry = await Build.findByPk(buildId);
        let currentCheckedIds = buildEntry.checkedIds || [];
        if (typeof currentCheckedIds === 'string') {
            currentCheckedIds = JSON.parse(currentCheckedIds);
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

// isTaskWorking
const isTaskWorking = async (req, res) => {
    const { buildId, taskName } = req.body;

    // Validate input
    if (!buildId) {
        return res.status(400).json({ message: 'Build ID is required.' });
    }
    if (!taskName) {
        return res.status(400).json({ message: 'Task Name is required.' });
    }

    try {

        // Find the TasksChecked entry for the specific build and task
        const taskCheckedEntry = await TasksChecked.findOne({
            where: { taskName, buildId }
        });

        if (taskCheckedEntry) {
            return res.status(200).json({
                isWorking: taskCheckedEntry.isWorking
            });
        } else {
            return res.status(404).json({ isWorking: 'Task is not marked in this build.' });
        }
    } catch (error) {
        console.error('Error checking task status:', error);
        return res.status(500).json({ message: 'Error checking task status.', error: error.message });
    }
};

// Add Build Link for Android
const updateLinkForAndroid = async (req, res) => {
    const { buildId } = req.params;
    const { link } = req.body;

    // Validate input
    if (!buildId) {
        return res.status(400).json({ message: 'Build ID is required.' });
    }
    if (!link) {
        return res.status(400).json({ message: 'Link is required.' });
    }

    try {
        const build = await Build.findOne({ where: { id: buildId } });
        if (!build) {
            return res.status(404).json({ message: 'Build not found.' });
        }

        build.link = link;

        await build.save();
        return res.status(200).json({ message: 'Link added to build successfully', build });

    } catch (error) {
        return res.status(500).json({ message: 'Error updating build.', error });
    }
}

//Get details for the checked tasks=>
const getCheckedTaskDetails = async (req, res) => {
    const { buildId } = req.params;
    const {taskName} = req.body;

    // Validate input
    if (!buildId) {
        return res.status(400).json({ message: 'Build ID is required.' });
    }
    if (!taskName) {
        return res.status(400).json({ message: 'Task Name is required.' });
    }
    try {
        // Find the TasksChecked entry for the specific build and task
        const taskCheckedEntry = await TasksChecked.findOne({
            where: { taskName, buildId }
        });
        if(!taskCheckedEntry){
            return res.status(404).json({ message: 'Entry Not Found'});
        }
        return res.status(200).json(taskCheckedEntry);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving entry.', error });
    }
}



module.exports = {
    createEntry,
    markTaskWorking,
    markTaskNotWorking,
    getAllBuildEntries,
    getBuildEntry,
    isTaskWorking,
    updateLinkForAndroid,
    getCheckedTaskDetails
};