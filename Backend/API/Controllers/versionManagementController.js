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
        console.error('Error creating entry:', error);
        return res.status(500).json({ message: 'Error creating entry.' });
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

//Get All Entries By UserID
const getAllEntriesByUserID = async (req, res) => {
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

        const entries = await VersionManagement.findAll({ where: { userId } });
        return res.status(200).json(entries);
    } catch (error) {
        console.error('Error retrieving Entries by UserID:', error);
        return res.status(500).json({ message: 'Error retrieving Entries by UserId.' });

    }


}

//Update Entry By ID
const updateEntryByID = async (req, res) => {
    const { id } = req.params;
    const { userId, technologyUsed, currentVersion, latestVersion } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required for update.' });
    }

    try {
        // Find the entry to update
        const entry = await VersionManagement.findOne({
            where: { id }
        });
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found.' });
        }

        // Check if the assigned user exists (if provided)
        if (userId) {
            const user = await User.findOne({
                where: { id: userId }
            });
            if (!user) {
                return res.status(404).json({ message: 'User does not exist.' });
            }
        }

        // Update the entry
        await entry.update({
            userId,
            technologyUsed,
            currentVersion,
            latestVersion
        });

        return res.status(200).json({ message: 'Entry updated successfully.', entry });


    } catch (error) {
        console.error('Error updating entry:', error);
        return res.status(500).json({ message: 'Error updating entry.' });
    }
}


module.exports = {
    createEntry,
    getAllEntries,
    getEntryByID,
    deleteEntryByID,
    updateEntryByID,
    getAllEntriesByUserID    
}