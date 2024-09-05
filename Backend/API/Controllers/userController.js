const User = require('../../Database/Models/user');

// Create a new user
const createUser = async (req, res) => {
    try {
        const { UserName, Email, Password } = req.body;
        // Check if the email already exists
        const existingUser = await User.findOne({ where: { Email } });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use. Please login.' });
        }
        // Create new user
        const newUser = await User.create({ UserName, Email, Password });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a user by ID
const updateUserById = async (req, res) => {
    const { UserName, Email, Password } = req.body;
    const userId = req.params.id;

    try {
        // Find the user to be updated
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the email already exists for another user, if Email is provided
        if (Email) {
            const existingUser = await User.findOne({
                where: {
                    Email
                }
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists in the database, try with a different email' });
            }
        }

        // Update only the fields that are provided
        await User.update({ UserName, Email, Password }, {
            where: { id: userId },
            fields: ['UserName', 'Email', 'Password'] // Specify fields to be updated
        });

        // Fetch the updated user
        const updatedUser = await User.findByPk(userId);

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: error.message }); // Provide detailed error message
    }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }else{
            await User.destroy({
                where: { ID: req.params.id }
            });
    
            return res.status(204).json({message: "User Got Deleted Successfully!!"});
        }


    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
};
