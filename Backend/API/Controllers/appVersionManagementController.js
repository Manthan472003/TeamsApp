const AppVersionManagement = require('../../Database/Models/appVersionManagement');

const createEntry = async (req, res) => {
    const { applicationName, liveVersion, testVersion, status } = req.body;

    try {
        const newEntry = await AppVersionManagement.create({
            applicationName,
            liveVersion,
            testVersion,
            status
        });
        return res.status(201).json({ message: 'App Version Entry Created Successfully.', newEntry })
    } catch (error) {
        console.error('Error creating entry:', error);
        return res.status(500).json({ message: 'Error creating App Version Entry.' });
    }
};

const getAllEntries = async (req, res) => {
    try {
        const entries = await AppVersionManagement.findAll();
        return res.status(201).json(entries);
    } catch (error) {
        console.error('Error retrieving entries:', error);
        return res.status(500).json({ message: 'Error retrieving Entries.' });
    }
};

//Get Version Entry By ID
const getEntryByID = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }
    try {
        const entry = await AppVersionManagement.findOne({
            where: { id }
        });
        if (!entry) {
            return res.status(404).json({ message: 'Entry Not Found' });
        }
        return res.status(200).json(entry);
    } catch (error) {
        console.error('Error retrieving entry:', error);
        return res.status(500).json({ message: 'Error retrieving Entry.' });
    }
};

//Update Entry By ID
const updateEntryByID = async (req, res) => {
    const { id } = req.params;
    const { applicationName, liveVersion, testVersion, status } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required for update.' });
    }

    try {
        // Find the entry to update
        const entry = await AppVersionManagement.findOne({
            where: { id }
        });
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found.' });
        }

        // Update the entry
        await entry.update({
            applicationName,
            liveVersion,
            testVersion,
            status
        });
        return res.status(200).json({ message: 'Entry updated successfully.', entry });
    } catch (error) {
        console.error('Error updating entry:', error);
        return res.status(500).json({ message: 'Error updating entry.' });
    }
}

//Delete Entry By ID
const deleteEntryByID = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const entry = await AppVersionManagement.findOne({
            where: { id }
        });
        if (!entry) {
            return res.status(404).json({ message: 'Entry Not Found' });
        }

        await entry.destroy();
        return res.status(200).json("Entry deleted Successfully");
    } catch (error) {
        console.error('Error retrieving entry:', error);
        return res.status(500).json({ message: 'Error retrieving Entry.' });
    }
}

module.exports = {
    createEntry,
    getAllEntries,
    getEntryByID,
    updateEntryByID,
    deleteEntryByID
}