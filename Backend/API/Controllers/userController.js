const User = require('../../Database/Models/user');

// Create a new user (with email existence check)
const createUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'User name, email, and password are required.' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // Create a new user
        const newUser = await User.create({ userName, email, password });
        return res.status(201).json({ message: 'User created successfully.', newUser });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user.', error });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving users.', error });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving user.', error });
    }
};

// Update user by ID (with email existence check)
const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'User name, email, and password are required for update.' });
        }

        // Check if the user exists
        const user = await User.findOne({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the new email already exists (and ensure it's not the same user's current email)
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser && existingUser.id !== id) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // Update the user
        user.userName = userName;
        user.email = email;
        user.password = password;
        await user.save();

        return res.status(200).json({ message: 'User updated successfully.', user });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user.', error });
    }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await user.destroy();
        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user.', error });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user by email and password
        const user = await User.findOne({
            where: { email, password }
        });

        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        // Login successful
        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error });
    }
};


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    loginUser
};