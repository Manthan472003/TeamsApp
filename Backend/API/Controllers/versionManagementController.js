const VersionManagement = require('../../Database/Models/versionManagement');
const User = require('../../Database/Models/user');


//Creating a new version entry (with user being Checked)
const createEntry = async (req, res) => {
    const { userId, technologyUsed, currentVersion, latestVersion } = req.body;

    try {
        //Checking if user exists
        if (userId) {
            const user = await User.findOne({
                where: { id: userId }
            });
            if (!user) {
                return res.status(404).json({ message: 'User does not exist.' });
            }
        }

        //Create new entry
        const newEntry = await VersionManagement.create({
            userId,
            technologyUsed,
            currentVersion,
            latestVersion
        });

        return res.status(201).json({ message: 'Version Entry Created Successfully.', newEntry })
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Error creating task.' });
    }
};

//Get all version entries
const getAllEntries = async (req, res) => {
    try {
        const entries = await VersionManagement.findAll();
        return res.status(200).json(entries);
    } catch (error) {
        console.error('Error retrieving entries:', error);
        return res.status(500).json({ message: 'Error retrieving Entries.' });
    }
}

//Get Version Entry By ID
const getEntryByID = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }
    try {
        const entry = await VersionManagement.findOne({
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
}

//Delete Entry By ID
const deleteEntryByID = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }
    
    try {
        const entry = await VersionManagement.findOne({
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
    deleteEntryByID
}